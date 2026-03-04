# aibok

AI-driven webbtjänst för tolkning och bokföring av svenska leverantörsfakturor mot BAS-kontoplan 2025.

Ladda upp en PDF – GPT-4o Vision extraherar fakturadata och föreslår konteringsrader automatiskt.

---

## Vad gör den?

1. Dra in en leverantörsfaktura (PDF) i appen
2. GPT-4o Vision extraherar leverantör, datum, belopp och föreslår BAS-kontering
3. Du justerar konteringsraderna tills debet = kredit
4. Klicka **Bokför** – fakturan sparas i en lokal SQLite-databas
5. Se och redigera alla bokförda fakturor under **Leverantörsfakturor**

---

## Krav

| Verktyg | Version |
|---------|---------|
| Node.js | ≥ 18 |
| Python | ≥ 3.9 |
| poppler | senaste (via Homebrew) |
| OpenAI API-nyckel | — |

---

## Installation

### 1. Klona repot

```bash
git clone git@github.com:DaRag404/aibok.git
cd aibok
```

### 2. Miljövariabler

```bash
cp .env.example .env
# Öppna .env och fyll i din OpenAI API-nyckel
```

### 3. Node-beroenden

```bash
npm install
```

### 4. Python-beroenden

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 5. poppler (krävs för PDF→bild-konvertering)

```bash
# macOS
brew install poppler

# Ubuntu/Debian
sudo apt install poppler-utils
```

---

## Starta

```bash
npm run dev   # startar Vite (port 5173) + FastAPI (port 8000)
```

Öppna `http://localhost:5173` i webbläsaren.

---

## Arkitektur

```
aibok/
├── backend/              # Python FastAPI (port 8000)
│   ├── main.py           # Endpoints
│   ├── openai_client.py  # GPT-4o Vision + PDF→PNG
│   ├── database.py       # SQLAlchemy + SQLite
│   └── bas_accounts.py   # BAS-kontoplan 2025
├── src/                  # React + Vite + Tailwind
│   ├── App.jsx           # Rotlayout
│   └── components/       # UI-komponenter
└── .env                  # API-nyckel (ej i git)
```

### Dataflöde

```
PDF → /analyze → pdf2image → GPT-4o Vision → konteringsförslag
                                                    ↓
                                     Användaren justerar + balanserar
                                                    ↓
                                      /book → SQLite (aibok.db)
```

---

## API

| Metod | Endpoint | Beskrivning |
|-------|----------|-------------|
| GET | `/health` | Backend-status + API-nyckel konfigurerad |
| POST | `/analyze` | Laddar upp PDF, returnerar fakturadata + konteringsförslag |
| POST | `/book` | Sparar en balanserad faktura i databasen |
| PUT | `/invoices/{id}` | Uppdaterar en befintlig faktura |
| GET | `/invoices` | Returnerar alla bokförda fakturor (nyast först) |
| GET | `/invoices/{id}/pdf` | Hämtar sparad PDF |
| GET | `/suppliers` | Lista alla leverantörer |
| POST | `/suppliers` | Skapa ny leverantör |
| PUT | `/suppliers/{id}` | Uppdatera leverantör |
| DELETE | `/suppliers/{id}` | Ta bort leverantör |

---

## Konfiguration

| Inställning | Fil | Standard |
|-------------|-----|---------|
| OpenAI-modell | `backend/openai_client.py` → `MODEL` | `gpt-4o` |
| Max PDF-sidor | `backend/openai_client.py` → `max_pages` | `3` |
| Databas-sökväg | `backend/database.py` → `DATABASE_URL` | `./aibok.db` |
| Backend-port | `npm run dev:backend` | `8000` |
| Frontend-port | `npm run dev:frontend` | `5173` |
