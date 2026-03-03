import json
import uuid
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, UploadFile, HTTPException, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database import init_db, AsyncSessionLocal, Invoice, AccountingLine
from pdf_parser import extract_text_from_pdf
from ollama_client import analyze_invoice_text, check_ollama_available

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="aibok API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:1420", "tauri://localhost"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic schemas ---

class LineOut(BaseModel):
    account: str
    vat_code: str
    net_amount: float

    class Config:
        from_attributes = True


class InvoiceOut(BaseModel):
    id: int
    supplier: str
    invoice_date: Optional[str]
    due_date: Optional[str]
    invoice_number: Optional[str]
    total_amount: float
    vat_amount: float
    currency: str
    message: str
    is_credit: bool
    skip_payment: bool
    booked_at: datetime
    pdf_filename: Optional[str]
    lines: List[LineOut]

    class Config:
        from_attributes = True


# --- Endpoints ---

@app.get("/health")
async def health():
    ollama_ok = await check_ollama_available()
    return {
        "status": "ok",
        "ollama": "tillgänglig" if ollama_ok else "ej tillgänglig – kör 'ollama serve'",
    }


@app.post("/analyze")
async def analyze_invoice(file: UploadFile):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Enbart PDF-filer stöds.")

    pdf_bytes = await file.read()
    if len(pdf_bytes) == 0:
        raise HTTPException(status_code=400, detail="Filen är tom.")

    try:
        text = extract_text_from_pdf(pdf_bytes)
    except RuntimeError as e:
        raise HTTPException(status_code=422, detail=str(e))

    if not text:
        raise HTTPException(
            status_code=422,
            detail="Kunde inte extrahera text ur PDF:en.",
        )

    if not await check_ollama_available():
        raise HTTPException(
            status_code=503,
            detail="Ollama är inte igång. Kör 'ollama serve' i en terminal.",
        )

    try:
        result = await analyze_invoice_text(text)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM-fel: {e}")

    return result


@app.post("/book", response_model=dict)
async def book_invoice(
    invoice_data: str = Form(...),
    pdf: Optional[UploadFile] = File(None),
):
    try:
        data = json.loads(invoice_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Ogiltig JSON i invoice_data.")

    lines_raw = data.pop("lines", [])

    # Server-side balance validation
    vat_rates = {"MP1": 0.25, "MP2": 0.12, "MP3": 0.06, "MF": 0.0}
    net = sum(float(l.get("net_amount", 0)) for l in lines_raw)
    vat = sum(float(l.get("net_amount", 0)) * vat_rates.get(l.get("vat_code", ""), 0.0) for l in lines_raw)
    calc_total = round(net + vat, 2)
    total_amount = float(data.get("total_amount", 0))
    if abs(total_amount - calc_total) > 0.05:
        raise HTTPException(
            status_code=422,
            detail=f"Debet och kredit balanserar inte (diff {total_amount - calc_total:.2f}).",
        )

    # Save PDF
    pdf_filename = None
    if pdf and pdf.filename:
        pdf_bytes = await pdf.read()
        if pdf_bytes:
            pdf_filename = f"{uuid.uuid4()}.pdf"
            (UPLOAD_DIR / pdf_filename).write_bytes(pdf_bytes)

    async with AsyncSessionLocal() as session:
        invoice = Invoice(
            supplier=data.get("supplier", ""),
            invoice_date=data.get("invoice_date"),
            due_date=data.get("due_date"),
            invoice_number=data.get("invoice_number"),
            total_amount=total_amount,
            vat_amount=float(data.get("vat_amount", 0)),
            currency=data.get("currency", "SEK"),
            message=data.get("message", ""),
            is_credit=bool(data.get("is_credit", False)),
            skip_payment=bool(data.get("skip_payment", False)),
            pdf_filename=pdf_filename,
        )
        session.add(invoice)
        await session.flush()

        for l in lines_raw:
            session.add(AccountingLine(
                invoice_id=invoice.id,
                account=l.get("account", ""),
                vat_code=l.get("vat_code", ""),
                net_amount=float(l.get("net_amount", 0)),
            ))

        await session.commit()
        return {"id": invoice.id}


@app.get("/invoices", response_model=List[InvoiceOut])
async def list_invoices():
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Invoice)
            .options(selectinload(Invoice.lines))
            .order_by(Invoice.booked_at.desc())
        )
        return result.scalars().all()


@app.get("/invoices/{invoice_id}/pdf")
async def get_invoice_pdf(invoice_id: int):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Invoice).where(Invoice.id == invoice_id))
        invoice = result.scalar_one_or_none()

    if not invoice or not invoice.pdf_filename:
        raise HTTPException(status_code=404, detail="PDF saknas för denna faktura.")

    path = UPLOAD_DIR / invoice.pdf_filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="PDF-filen hittades inte på disk.")

    return FileResponse(path, media_type="application/pdf", filename=f"faktura_{invoice_id}.pdf")
