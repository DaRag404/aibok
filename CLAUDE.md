# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Installera Node-beroenden
npm install

# Installera Python-beroenden (skapar virtualenv i backend/.venv)
cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt

# Starta allt (Tauri + Vite + Python backend via concurrently)
npm run dev

# Starta enbart frontend (React/Vite på port 5173)
npm run dev:frontend

# Starta enbart backend (FastAPI på port 8000)
npm run dev:backend

# Bygg desktop-app
npm run build
```

Krav för `npm run dev`:
- Ollama igång: `ollama serve`
- Modell nedladdad: `ollama pull mistral:7b`
- Rust/Cargo installerat (för Tauri)

## Architecture

**aibok** är en Tauri desktop-app för tolkning av leverantörsfakturor mot BAS-kontoplan med hjälp av en lokal LLM (Ollama).

```
aibok/
├── backend/            # Python FastAPI (port 8000)
│   ├── main.py         # /analyze och /health endpoints
│   ├── pdf_parser.py   # pdfminer-extraktion + pytesseract OCR-fallback
│   ├── ollama_client.py # Async httpx mot Ollama REST API
│   └── bas_accounts.py # BAS-konton och prompt-data
├── src/                # React frontend
│   ├── App.jsx         # Rotlayout: sidebar | fakturainformation | kontering
│   ├── api.js          # fetch-wrapper mot backend
│   └── components/
│       ├── DropZone.jsx           # PDF drag-och-släpp
│       ├── InvoiceForm.jsx        # Leverantör, datum, belopp, moms
│       ├── AccountingEntries.jsx  # Redigerbara debet/kredit-rader
│       └── Summary.jsx            # Diff-summering + Bokför-knapp
├── src-tauri/          # Tauri v2 Rust-shell
│   ├── tauri.conf.json # Kör Python+Vite via beforeDevCommand
│   └── src/
│       ├── main.rs
│       └── lib.rs
├── package.json        # Node-scripts + Tauri CLI
├── vite.config.js
└── tailwind.config.js
```

### Dataflöde

1. Användaren drar in en PDF → `DropZone` → `api.js:uploadInvoice()`
2. `POST /analyze` (FastAPI) → `pdf_parser.py` extraherar text (OCR-fallback om ingen text)
3. Texten skickas till Ollama (`mistral:7b`) med BAS-kontoplan-prompt
4. LLM returnerar JSON med fakturafält + konteringsrader
5. React fyller `InvoiceForm` och `AccountingEntries` automatiskt
6. Användaren kan justera; `Summary` validerar debet = kredit
7. "Bokför"-knappen aktiveras när differens = 0

### Ollama-modell

Modellen konfigureras i [backend/ollama_client.py](backend/ollama_client.py) som konstanten `MODEL = "mistral:7b"`.
Spec nämner "ministral-3:8b" – rätt Ollama-tagg är `mistral:7b` eller `mistral:latest`.

### Tauri dev-setup

`tauri.conf.json:beforeDevCommand` kör Python-backendet och Vite parallellt via `concurrently`.
Tauri öppnar ett fönster mot `http://localhost:5173` (Vite dev server).
CORS i FastAPI tillåter `localhost:5173`, `localhost:1420` och `tauri://localhost`.
