import json
import httpx

from bas_accounts import COST_ACCOUNTS_FOR_PROMPT

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.2:latest"

PROMPT_TEMPLATE = """Du är en expert på svenska leverantörsfakturor och bokföring (BAS 2025).

Ditt mål: extrahera strukturerad bokföringsdata från fakturatext.

⚠️ KRITISKT:
- Returnera ENDAST giltig JSON
- Inga kommentarer, ingen förklaring
- Om något saknas: sätt null (inte gissa)

----------------------------------------
KOSTNADSKONTON (BAS 2025):
{accounts}

MOMSKODER:
MP1 = 25%
MP2 = 12%
MP3 = 6%
MF  = momsfritt

----------------------------------------
STEGBASERAD TOLKNING:

1. IDENTIFIERA FAKTURAHUVUD
- supplier (avsändare)
- invoice_number
- invoice_date (YYYY-MM-DD)
- due_date (YYYY-MM-DD)
- currency (default SEK)

2. IGNORERA ALLT SOM INTE ÄR KOSTNAD:
- OCR, bankgiro, betalningsinfo
- adressblock
- "att betala", "summa oss tillhanda"
- rena metadatafält (XmlEDP etc)

3. IDENTIFIERA KOSTNADSSEKTIONER
Vanliga exempel:
- ELNÄT / ELHANDEL
- VATTEN / AVLOPP
- RENHÅLLNING
- TJÄNSTER / ARTIKLAR

Varje sektion kan innehålla flera rader.

4. RADTOLKNING (VIKTIGT)
För varje rad:
- description = tydlig text
- net_amount = EXKL moms
- negativa värden är tillåtna (krediteringar)
- ignorera rader som bara är "Moms"

Om bara brutto finns:
- räkna baklänges (25% om inget annat anges)

5. MOMS
- Om fakturan anger "Moms 25%" → använd MP1
- Om moms saknas → MF
- Om blandat → bedöm per rad

6. KONTOVAL (HEURISTIK)
- El / energi → 5310 eller 5320
- Vatten / avlopp → 5030
- Renhållning → 5060
- Snöröjning / markarbete → 4210 / 5610
- Konsult / tjänst → 6540
- Okänt → 6990

7. SUMMERING (VIKTIGT)
- total_amount = fakturans slutbelopp
- vat_amount = total moms
- kontrollera att:
  sum(lines) ≈ total_amount

8. FALLBACK
Om inga tydliga rader finns:
→ skapa EN rad:
- description = "Övrig kostnad"
- net_amount = total ex moms

----------------------------------------
OUTPUTFORMAT:

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
}}

----------------------------------------
FAKTURA:
{invoice_text}
"""


async def analyze_invoice_text(invoice_text: str) -> dict:
    """Send invoice text to local Ollama and return parsed JSON."""
    prompt = PROMPT_TEMPLATE.format(
        accounts=COST_ACCOUNTS_FOR_PROMPT,
        invoice_text=invoice_text,
    )

    async with httpx.AsyncClient(timeout=300.0) as client:
        response = await client.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "format": "json",
                "stream": False,
                "options": {
                    "num_ctx": 8192,
                },
            },
        )
        response.raise_for_status()

    raw = response.json()
    response_text = raw.get("response", "")

    try:
        return json.loads(response_text)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Ollama returnerade ogiltig JSON: {e}\nSvar: {response_text[:500]}"
        )


async def check_ollama_available() -> bool:
    """Return True if Ollama is reachable."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get("http://localhost:11434/api/tags")
            return r.status_code == 200
    except Exception:
        return False
