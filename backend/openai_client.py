import base64
import io
import json
import os

from dotenv import load_dotenv
from openai import AsyncOpenAI

from bas_accounts import COST_ACCOUNTS_FOR_PROMPT

load_dotenv()

client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
MODEL = "gpt-4o"

SYSTEM_PROMPT = """Du är en expert på svenska leverantörsfakturor och bokföring (BAS 2025).
Analysera fakturabilden och extrahera strukturerad bokföringsdata.

⚠️ KRITISKT:
- Returnera ENDAST giltig JSON
- Inga kommentarer, ingen förklaring, ingen markdown-formatering
- Om något saknas: sätt null (gissa inte)
"""

USER_PROMPT_TEMPLATE = """KOSTNADSKONTON (BAS 2025):
{accounts}

MOMSKODER:
MP1 = 25%, MP2 = 12%, MP3 = 6%, MF = momsfritt

STEG:
1. Identifiera fakturahuvud: supplier, invoice_number, invoice_date (YYYY-MM-DD), due_date (YYYY-MM-DD), currency (default SEK)
2. Ignorera: bankgiro, betalningsinfo, adressblock, metadatafält
3. Identifiera kostnadssektioner och rader; net_amount = EXKL moms (negativa värden ok för krediteringar)
4. Välj BAS-konto per rad (se konton ovan)
5. Sätt rätt momskod per rad
6. total_amount = fakturans slutbelopp inkl. moms; vat_amount = total moms

KONTOHEURISTIK:
- El/energi → 5310, vatten/avlopp → 5030, renhållning → 5060
- Konsult/tjänst → 6510–6550, okänt → 6990
- Om inga tydliga rader: skapa EN rad "Övrig kostnad" med net_amount = total ex moms

OUTPUTFORMAT (returnera exakt detta, inget annat):
{{
  "supplier": string|null,
  "invoice_date": string|null,
  "due_date": string|null,
  "invoice_number": string|null,
  "total_amount": number|null,
  "vat_amount": number|null,
  "currency": "SEK",
  "lines": [
    {{
      "account": string,
      "description": string,
      "vat_code": "MP1|MP2|MP3|MF",
      "net_amount": number
    }}
  ]
}}"""


async def analyze_invoice_pdf(pdf_bytes: bytes) -> dict:
    """Send PDF pages as images to GPT-4o Vision and return parsed invoice JSON."""
    images = _pdf_to_images(pdf_bytes)

    content = [
        {
            "type": "text",
            "text": USER_PROMPT_TEMPLATE.format(accounts=COST_ACCOUNTS_FOR_PROMPT),
        }
    ]
    for img_b64 in images:
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/png;base64,{img_b64}", "detail": "high"},
        })

    response = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": content},
        ],
        response_format={"type": "json_object"},
        temperature=0,
        max_tokens=2000,
    )

    try:
        return json.loads(response.choices[0].message.content)
    except json.JSONDecodeError as e:
        raw = response.choices[0].message.content
        raise ValueError(f"OpenAI returnerade ogiltig JSON: {e}\nSvar: {raw[:500]}")


def _pdf_to_images(pdf_bytes: bytes, max_pages: int = 3) -> list[str]:
    """Convert first N pages of a PDF to base64-encoded PNG images."""
    from pdf2image import convert_from_bytes

    pages = convert_from_bytes(pdf_bytes, dpi=200, first_page=1, last_page=max_pages)
    result = []
    for page in pages:
        buf = io.BytesIO()
        page.save(buf, format="PNG")
        result.append(base64.b64encode(buf.getvalue()).decode())
    return result


def is_configured() -> bool:
    """Return True if the OpenAI API key is set."""
    return bool(os.environ.get("OPENAI_API_KEY"))
