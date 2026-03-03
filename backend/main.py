from contextlib import asynccontextmanager
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database import init_db, AsyncSessionLocal, Invoice, AccountingLine
from pdf_parser import extract_text_from_pdf
from ollama_client import analyze_invoice_text, check_ollama_available


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

class LineIn(BaseModel):
    account: str
    vat_code: str = ""
    net_amount: float = 0.0


class BookRequest(BaseModel):
    supplier: str
    invoice_date: Optional[str] = None
    due_date: Optional[str] = None
    invoice_number: Optional[str] = None
    total_amount: float = 0.0
    vat_amount: float = 0.0
    currency: str = "SEK"
    message: str = ""
    is_credit: bool = False
    skip_payment: bool = False
    lines: List[LineIn]


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
async def book_invoice(req: BookRequest):
    # Server-side balance validation
    vat_rates = {"MP1": 0.25, "MP2": 0.12, "MP3": 0.06, "MF": 0.0}
    net = sum(l.net_amount for l in req.lines)
    vat = sum(l.net_amount * vat_rates.get(l.vat_code, 0.0) for l in req.lines)
    calc_total = round(net + vat, 2)
    if abs(req.total_amount - calc_total) > 0.05:
        raise HTTPException(
            status_code=422,
            detail=f"Debet och kredit balanserar inte (diff {req.total_amount - calc_total:.2f}).",
        )

    async with AsyncSessionLocal() as session:
        invoice = Invoice(
            supplier=req.supplier,
            invoice_date=req.invoice_date,
            due_date=req.due_date,
            invoice_number=req.invoice_number,
            total_amount=req.total_amount,
            vat_amount=req.vat_amount,
            currency=req.currency,
            message=req.message,
            is_credit=req.is_credit,
            skip_payment=req.skip_payment,
        )
        session.add(invoice)
        await session.flush()  # get invoice.id

        for l in req.lines:
            session.add(AccountingLine(
                invoice_id=invoice.id,
                account=l.account,
                vat_code=l.vat_code,
                net_amount=l.net_amount,
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
