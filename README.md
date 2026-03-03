# aibok

Lokal AI-driven desktop-app för tolkning och bokföring av svenska leverantörsfakturor mot BAS-kontoplan 2025.

All AI-bearbetning sker lokalt – ingen fakturadata lämnar din dator.

---

## Vad gör den?

1. Dra in en leverantörsfaktura (PDF) i appen
2. En lokal LLM (via Ollama) extraherar leverantör, datum, belopp och föreslår kontering
3. Du granskar och justerar konteringsraderna tills debet = kredit
4. Klicka **Bokför** – fakturan sparas i en lokal SQLite-databas
5. Se alla bokförda fakturor under **Leverantörer** i sidomenyn

---

## Krav

| Verktyg | Version |
|---------|---------|
| Node.js | ≥ 18 |
| Python | ≥ 3.9 |
| Rust / Cargo | senaste stable |
| [Ollama](https://ollama.com) | senaste |

---

## Installation

### 1. Klona repot

```bash
git clone git@github.com:DaRag404/aibok.git
cd aibok
```

### 2. Node-beroenden

```bash
npm install
```

### 3. Python-beroenden

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 4. Ladda ner AI-modellen

```bash
ollama pull llama3.2
```

---

## Starta

### Allt på en gång (Tauri desktop-app)

Kräver att Ollama körs i bakgrunden:

```bash
ollama serve          # separat terminal
npm run dev           # startar Tauri + Vite + FastAPI
```

### Bara frontend + backend (utan Tauri)

Bra för snabb utveckling i webbläsaren på `http://localhost:5173`:

```bash
ollama serve                          # terminal 1
npm run dev:backend                   # terminal 2
npm run dev:frontend                  # terminal 3
```

---

## Arkitektur

```
aibok/
├── backend/                  # Python FastAPI (port 8000)
│   ├── main.py               # Endpoints: /analyze, /book, /invoices, /health
│   ├── database.py           # SQLAlchemy + SQLite (aibok.db)
│   ├── pdf_parser.py         # pdfminer-extraktion + pytesseract OCR-fallback
│   ├── ollama_client.py      # Async anrop mot Ollama REST API
│   └── bas_accounts.py       # BAS-kontoplan 2025
├── src/                      # React frontend (Vite)
│   ├── App.jsx               # Rotlayout + navigering
│   ├── api.js                # fetch-wrapper mot backend
│   └── components/
│       ├── DropZone.jsx               # PDF drag-och-släpp
│       ├── InvoiceForm.jsx            # Fakturahuvud (leverantör, datum, belopp)
│       ├── AccountingEntries.jsx      # Redigerbara debet/kredit-rader
│       ├── Summary.jsx                # Differens-kontroll + Bokför/Avbryt
│       ├── InvoiceHistory.jsx         # Lista över bokförda fakturor
│       └── PeriodizationModal.jsx     # Periodiseringsdialogruta
└── src-tauri/                # Tauri v2 Rust-skal
```

### Dataflöde

```
PDF → /analyze → Ollama (llama3.2) → konteringsförslag
                                           ↓
                              Användaren justerar + balanserar
                                           ↓
                             /book → SQLite (aibok.db)
```

---

## API

| Metod | Endpoint | Beskrivning |
|-------|----------|-------------|
| GET | `/health` | Kontrollerar att backend + Ollama är igång |
| POST | `/analyze` | Laddar upp PDF, returnerar fakturadata + konteringsförslag |
| POST | `/book` | Sparar en balanserad faktura i databasen |
| GET | `/invoices` | Returnerar alla bokförda fakturor (nyast först) |

---

## Konfiguration

| Inställning | Fil | Standard |
|-------------|-----|---------|
| Ollama-modell | `backend/ollama_client.py` → `MODEL` | `llama3.2:latest` |
| Kontextfönster | `backend/ollama_client.py` → `num_ctx` | `8192` |
| Databas-sökväg | `backend/database.py` → `DATABASE_URL` | `./aibok.db` |
| Backend-port | `npm run dev:backend` | `8000` |
| Frontend-port | `npm run dev:frontend` | `5173` |

---

## OCR-stöd

För skannade fakturor (utan inbäddad text) krävs Tesseract:

```bash
# macOS
brew install tesseract tesseract-lang

# Ubuntu/Debian
sudo apt install tesseract-ocr tesseract-ocr-swe
```
