# JordanGov AI Assistant

Bilingual (Arabic/English) AI assistant for Jordanian government services.

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **Backend**: FastAPI + Python
- **AI**: Cerebras Inference API
- **RAG**: LangChain + ChromaDB + Docling
- **Voice**: Groq Whisper STT
- **Database**: PostgreSQL + SQLAlchemy

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python -m uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Project Structure

```
backend/
  app/
    main.py              # FastAPI entry point
    core/                # Config, security, prompts
    api/                 # Route handlers
    models/              # Pydantic schemas, DB models
    services/            # Business logic
    db/                  # Database connection
    data/                # Uploaded documents
    vector_store/        # ChromaDB persistence

frontend/
  app/                   # Next.js pages (App Router)
  components/            # React components
  lib/                   # Utilities, API client, i18n
```

## Environment Variables

See `backend/.env.example` for all required environment variables.
