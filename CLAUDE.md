# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Installera Node-beroenden
npm install

# Installera Python-beroenden (skapar virtualenv i backend/.venv)
cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt

# Krav: poppler (för pdf2image)
brew install poppler   # macOS

# Starta allt (Vite frontend + FastAPI backend via concurrently)
npm run dev

# Starta enbart frontend (React/Vite på port 5173)
npm run dev:frontend

# Starta enbart backend (FastAPI på port 8000)
npm run dev:backend

# Bygg frontend för produktion
npm run build
```

Krav för `npm run dev`:
- `.env` i repots rot med `OPENAI_API_KEY=sk-...`
- poppler installerat (för PDF→bild-konvertering)

## Architecture

**aibok** är en webbtjänst för tolkning av leverantörsfakturor mot BAS-kontoplan med hjälp av OpenAI GPT-4o Vision.

```
aibok/
├── backend/              # Python FastAPI (port 8000)
│   ├── main.py           # Endpoints: /analyze, /book, /invoices, /health, /suppliers
│   ├── openai_client.py  # GPT-4o Vision – konverterar PDF till bilder + anropar API
│   ├── database.py       # SQLAlchemy async + SQLite (aibok.db)
│   └── bas_accounts.py   # BAS-kontoplan 2025
├── src/                  # React frontend (Vite)
│   ├── App.jsx           # Rotlayout + navigering + all state
│   ├── api.js            # fetch-wrapper mot backend
│   ├── bas_accounts.js   # BAS-konton + VAT_RATE (spegel av backend)
│   └── components/
│       ├── Sidebar.jsx              # Vänstermeny med sektioner
│       ├── DropZone.jsx             # PDF drag-och-släpp
│       ├── InvoiceForm.jsx          # Fakturahuvud + leverantörsautocomplete
│       ├── AccountingEntries.jsx    # Redigerbara konteringsrader + auto-rader
│       ├── Summary.jsx              # Differens-kontroll + Bokför/Avbryt
│       ├── InvoiceList.jsx          # Lista över bokförda fakturor
│       ├── SupplierList.jsx         # CRUD-lista för leverantörer
│       ├── SupplierModal.jsx        # Formulär för ny/redigera leverantör
│       └── PeriodizationModal.jsx   # Periodiseringsdialogruta
├── .env                  # OPENAI_API_KEY (ej i git)
├── .env.example          # Mall för .env
├── package.json          # Node-scripts
├── vite.config.js
└── tailwind.config.js
```

### Dataflöde

1. Användaren drar in en PDF → `DropZone` → `api.js:uploadInvoice()`
2. `POST /analyze` (FastAPI) → `openai_client.py` konverterar PDF-sidor till PNG (via pdf2image/poppler)
3. PNG-bilderna skickas till GPT-4o Vision med BAS-kontoplan-prompt
4. GPT-4o returnerar JSON med fakturafält + konteringsrader
5. React fyller `InvoiceForm` och `AccountingEntries` automatiskt
6. Användaren justerar; `vat_amount` i formuläret styr 2641/2642/2643-raderna
7. `Summary` validerar: net_lines + vat_amount = total_amount (diff = 0)
8. "Bokför"-knappen aktiveras → `POST /book` → sparas i SQLite

### OpenAI-modell

Konfigureras i `backend/openai_client.py` som `MODEL = "gpt-4o"`.
Skickar max 3 PDF-sidor som base64 PNG vid 200 DPI.

### Balanslogik

Frontend (Summary.jsx): `diff = total_amount - (netTotal + invoiceVat)`
Backend (_parse_and_validate): `calc = net_lines + vat_amount; |total - calc| <= 0.05`
