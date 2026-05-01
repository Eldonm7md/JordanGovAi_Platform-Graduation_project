
## Plan Comparison Summary

Three independent plans were generated and consolidated. Key differences and my recommendations:

| Decision | Plan A (Claude) | Plan B (GPT-5) | Plan C (Gemini) | **Chosen** |
|----------|----------------|----------------|-----------------|-----------|
| Embedding model | `multilingual-e5-base` | `bge-m3` | Either | **`multilingual-e5-base`** — lighter, graduation-appropriate, proven Arabic support |
| Cerebras client | Raw `httpx` | OpenAI-compat SDK | OpenAI-compat SDK | **OpenAI-compatible** — cleaner, less code, 2/3 consensus |
| Admin logic | Inline in routes | Dedicated `admin_service.py` | Not specified | **Dedicated service file** — cleaner separation |
| TTS | `edge-tts` optional | Provider abstraction | Placeholder only | **Placeholder + optional `edge-tts`** |
| DB migrations | `create_all()` | Alembic optional | `create_all()` | **`create_all()`** — simpler for graduation |
| Auth storage | localStorage | Not specified | Not specified | **localStorage** — documented limitation |

---

## Architecture Overview

```mermaid
graph TD
    subgraph Frontend["Frontend (Next.js + React + TS + Tailwind)"]
        LP[Landing Page]
        CP[Chat Page]
        SP[Services Page]
        RP[Reviews Page]
        AD[Admin Dashboard]
        AB[About Page]
    end

    subgraph Backend["Backend (FastAPI + Python)"]
        API[API Routes]
        CS[Cerebras Service]
        RS[RAG Service]
        DS[Document Service]
        SS[STT Service]
        CVS[Conversation Service]
    end

    subgraph Storage
        PG[(PostgreSQL)]
        CH[(ChromaDB)]
        FS[File Storage]
    end

    subgraph External
        CER[Cerebras API]
        GRQ[Groq Whisper]
    end

    Frontend -->|REST API| Backend
    CS --> CER
    SS --> GRQ
    RS --> CH
    DS --> CH
    DS --> FS
    CVS --> PG
    API --> PG
```

---

## Phase 1: Backend Structure + Cerebras Chat + Landing + Chat Page

### 1.1 Project Scaffold

**Files to create:**

| File | Purpose |
|------|---------|
| `.gitignore` | node_modules, __pycache__, .env, vector_store/, uploads/, .next/ |
| `README.md` | Project overview, setup instructions |
| `backend/requirements.txt` | All Python dependencies |
| `backend/.env.example` | Environment template |
| `backend/app/__init__.py` | Package marker |
| `backend/app/main.py` | FastAPI app with CORS, routers, root/health |
| `backend/app/core/__init__.py` | — |
| `backend/app/core/config.py` | Pydantic Settings from `.env` |
| `backend/app/core/security.py` | Stub (expanded Phase 3) |
| `backend/app/core/prompts.py` | Bilingual system prompts + answer template |
| `backend/app/api/__init__.py` | — |
| `backend/app/api/routes_chat.py` | `POST /chat` |
| `backend/app/models/__init__.py` | — |
| `backend/app/models/schemas.py` | Pydantic schemas for chat |
| `backend/app/services/__init__.py` | — |
| `backend/app/services/cerebras_service.py` | OpenAI-compat Cerebras client |
| `backend/app/db/__init__.py` | — |
| `backend/app/data/.gitkeep` | Uploaded docs placeholder |
| `backend/app/vector_store/.gitkeep` | ChromaDB persistence placeholder |

**`backend/requirements.txt`:**
```
fastapi==0.115.*
uvicorn[standard]==0.34.*
pydantic-settings>=2.0
openai>=1.0
python-multipart
bcrypt
python-jose[cryptography]
sqlalchemy>=2.0
psycopg2-binary
langchain>=0.2
langchain-community
chromadb>=0.5
sentence-transformers
groq
docling
python-dotenv
```

**`.env.example`:**
```
CEREBRAS_API_KEY=
CEREBRAS_MODEL=csk-6m5xdfwvxderytk8pmytt2pcffe8kweeh2jx44w5x5nh9435
GROQ_API_KEY=
DATABASE_URL=postgresql://postgres:password@localhost:5432/jordangov
CHROMA_DIR=./app/vector_store
UPLOAD_DIR=./app/data
JWT_SECRET=your-secret-key-change-this
JWT_ALGORITHM=HS256
EMBEDDING_MODEL=intfloat/multilingual-e5-base
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**`backend/app/core/config.py`** — Pydantic `BaseSettings` with all env vars, `env_file=".env"`.

**`backend/app/core/prompts.py`** — System prompt enforcing:
- Answer in user's language (Arabic→Arabic, English→English)
- Structured format: Summary, Requirements, Documents, Steps, Fees, Processing time, Source
- Anti-hallucination: "If info is not in provided context, state that official verification is required"

**`backend/app/services/cerebras_service.py`:**
```python
from openai import AsyncOpenAI
from app.core.config import settings

client = AsyncOpenAI(
    api_key=settings.CEREBRAS_API_KEY,
    base_url="https://api.cerebras.ai/v1"
)

async def chat(messages: list[dict], model: str = None) -> str:
    response = await client.chat.completions.create(
        model=model or settings.CEREBRAS_MODEL,
        messages=messages,
    )
    return response.choices[0].message.content
```

**`backend/app/api/routes_chat.py`:**
- `POST /chat` accepts `{message: str, language: str}`, returns `{response: str, language: str}`

### 1.2 Frontend Setup

**Initialize with:**
```powershell
npx create-next-app@latest frontend --typescript --tailwind --app --src=no
```

**Files to create/modify:**

| File | Purpose |
|------|---------|
| `frontend/tailwind.config.ts` | Custom theme: `jordan-green: #006633`, `jordan-red: #CE1126`, `ai-blue: #0891b2`, `ai-teal: #14b8a6` |
| `frontend/app/layout.tsx` | Root layout with `dir`/`lang` dynamic, fonts (IBM Plex Sans Arabic + Inter), Navbar, Footer |
| `frontend/app/globals.css` | Tailwind directives, RTL utilities, Arabic typography |
| `frontend/app/page.tsx` | Landing page |
| `frontend/app/chat/page.tsx` | Chat interface |
| `frontend/components/Navbar.tsx` | Logo, nav links, language toggle (AR/EN) |
| `frontend/components/Footer.tsx` | Jordanian branding footer |
| `frontend/components/ChatMessage.tsx` | Message bubble (user right, assistant left in LTR; flipped RTL) |
| `frontend/components/ChatInput.tsx` | Text input + send button (voice button placeholder) |
| `frontend/lib/api.ts` | Typed fetch wrapper using `NEXT_PUBLIC_API_URL` |
| `frontend/lib/types.ts` | TypeScript interfaces |
| `frontend/lib/i18n.ts` | Bilingual string map + `useLanguage()` context hook |
| `frontend/lib/constants.ts` | Service categories, static data |

**Landing page sections:**
1. Hero — bilingual headline, AI gradient background, CTA → chat
2. Features — 3-4 cards (Bilingual, Voice, Official Sources, 24/7)
3. Services preview — 7 government entity cards (link to Services page)
4. How it works — 3-step visual flow

**Chat page:**
- Left sidebar (conversation list, placeholder for now)
- Main area: message thread + ChatInput
- Messages auto-scroll, loading dots animation
- RTL/LTR alignment automatic based on language context

### Phase 1 Verification
- [ ] `python -m uvicorn app.main:app --reload` starts on port 8000
- [ ] `GET /` and `GET /health` return proper JSON
- [ ] `POST /chat` with Arabic message → structured Arabic response from Cerebras
- [ ] `npm run dev` → landing page renders in AR and EN
- [ ] Language toggle switches RTL↔LTR correctly
- [ ] Chat page sends message and displays AI response

---

## Phase 2: RAG with ChromaDB + Docling

### 2.1 Document Processing Pipeline

**New/modified files:**

| File | Purpose |
|------|---------|
| `backend/app/services/docling_service.py` | Parse PDF/DOCX → text, chunk with overlap (500 chars, 100 overlap) |
| `backend/app/services/document_service.py` | Upload save, process orchestration, reindex all |
| `backend/app/services/rag_service.py` | Embedding + ChromaDB + retrieval + grounded chat |
| `backend/app/api/routes_documents.py` | Upload/process/reindex/list endpoints |
| `backend/app/api/routes_rag.py` | `POST /rag/chat` |
| `backend/app/models/schemas.py` | Add document and RAG schemas |
| `backend/app/data/samples/` | 3-5 sample Arabic government docs |

**RAG flow:**

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as FastAPI
    participant RAG as RAG Service
    participant DB as ChromaDB
    participant LLM as Cerebras

    U->>FE: Ask question
    FE->>API: POST /rag/chat {message, language}
    API->>RAG: rag_chat(message, language)
    RAG->>DB: similarity_search(query, k=5)
    DB-->>RAG: relevant chunks + metadata
    RAG->>LLM: system_prompt + context + question
    LLM-->>RAG: structured answer
    RAG-->>API: {response, sources[], language}
    API-->>FE: JSON response
    FE-->>U: Display answer + source cards
```

**`rag_service.py` key logic:**
- Load `intfloat/multilingual-e5-base` via `sentence-transformers`
- Prefix queries with `"query: "`, documents with `"passage: "`
- ChromaDB persistent client at `CHROMA_DIR`
- `retrieve(query, k=5)` → if best score < 0.3, mark as "no official source found"
- Build prompt: system prompt + retrieved context + user question
- Call Cerebras → return `{response, sources, language}`

**`docling_service.py`:**
- Use Docling to parse PDF/DOCX into structured text
- Split into chunks (500 chars, 100 overlap) with Arabic-aware sentence boundaries
- Return `[{text, metadata: {source, page, entity}}]`

**Sample data** in `backend/app/data/samples/`:
- `passport_renewal_ar.txt` — Jordanian passport renewal info (Arabic)
- `drivers_license_ar.txt` — Driver's license procedures
- `civil_status_ar.txt` — Civil status registration

**Frontend update:**
- Chat page now calls `/rag/chat` instead of `/chat`
- Display source citation cards below assistant messages (filename, page, confidence)

### Phase 2 Verification
- [ ] Upload PDF → process → chunks stored in ChromaDB
- [ ] `POST /rag/chat` returns answer with `sources[]` array
- [ ] Arabic questions → Arabic answers; English → English
- [ ] Missing info → "official verification required" (no invented data)
- [ ] Source cards render in chat UI
- [ ] `GET /documents` lists uploaded documents with status

---

## Phase 3: Conversation Memory + PostgreSQL + Auth

### 3.1 Database Schema

**New/modified files:**

| File | Purpose |
|------|---------|
| `backend/app/db/database.py` | SQLAlchemy engine + Base |
| `backend/app/db/session.py` | `SessionLocal`, `get_db()` dependency |
| `backend/app/db/seed.py` | Seed government entities + services + admin user |
| `backend/app/models/database_models.py` | All 7 ORM models |
| `backend/app/core/security.py` | JWT + bcrypt (full implementation) |
| `backend/app/api/routes_auth.py` | Register + Login |
| `backend/app/api/routes_conversations.py` | Conversation CRUD |
| `backend/app/services/conversation_service.py` | Memory logic |

**Database models:**

```mermaid
erDiagram
    User {
        uuid id PK
        string email UK
        string hashed_password
        string full_name
        string role
        datetime created_at
    }
    Conversation {
        uuid id PK
        uuid user_id FK
        string title
        string language
        datetime created_at
        datetime updated_at
    }
    Message {
        uuid id PK
        uuid conversation_id FK
        string role
        text content
        string input_type
        string language
        json sources
        datetime created_at
    }
    GovernmentEntity {
        int id PK
        string name_ar
        string name_en
        string description_ar
        string description_en
        string icon
    }
    Service {
        int id PK
        int entity_id FK
        string name_ar
        string name_en
        string description_ar
        string description_en
        string category
    }
    SourceDocument {
        uuid id PK
        string filename
        string entity
        datetime upload_date
        int chunk_count
        string status
        string file_path
        string language
    }
    Feedback {
        uuid id PK
        uuid user_id FK
        uuid conversation_id FK
        int rating
        text comment
        string service_category
        datetime created_at
    }

    User ||--o{ Conversation : has
    Conversation ||--o{ Message : contains
    User ||--o{ Feedback : gives
    GovernmentEntity ||--o{ Service : offers
```

**Conversation memory:**
- `conversation_service.py` → `get_history(conv_id, limit=20)` returns list of `{role, content}` for Cerebras context window
- On each `/rag/chat` call: load last 20 messages → prepend as conversation context → call LLM
- Auto-generate conversation title from first user message (truncate to 50 chars)
- Store per message: `role`, `content`, `input_type` (text/voice), `language` (ar/en), `sources` (JSON)

**Auth flow:**
- `POST /auth/register` → bcrypt hash password, create User, return JWT
- `POST /auth/login` → verify credentials, return JWT
- JWT payload: `{user_id, email, role, exp}`
- `get_current_user()` FastAPI dependency extracts user from `Authorization: Bearer <token>`

**Frontend auth:**
- Login/Register modal (simple form)
- JWT stored in localStorage (documented limitation for graduation scope)
- `ConversationSidebar.tsx` — fetches user's conversations, "New Chat" button, click to load

**Startup:**
- `main.py` calls `Base.metadata.create_all(engine)` on startup
- Optional `seed.py` script to populate 7 government entities + sample services + admin account

### Phase 3 Verification
- [ ] Register → Login → JWT returned
- [ ] Create conversation → send messages → persisted in PostgreSQL
- [ ] Reload page → history restored
- [ ] Follow-up questions use conversation context (assistant remembers)
- [ ] `role`, `input_type`, `language` stored correctly per message
- [ ] Multiple conversations per user, switchable via sidebar

---

## Phase 4: Reviews + Admin Dashboard

### 4.1 Reviews System

**New/modified files:**

| File | Purpose |
|------|---------|
| `backend/app/services/feedback_service.py` | CRUD + analytics |
| `backend/app/api/routes_feedback.py` | `POST /feedback`, `GET /feedback` |
| `backend/app/services/admin_service.py` | Dashboard aggregations |
| `backend/app/api/routes_admin.py` | All admin endpoints (protected) |
| `frontend/app/reviews/page.tsx` | Reviews page |
| `frontend/app/admin/page.tsx` | Admin dashboard |
| `frontend/components/ReviewForm.tsx` | Star rating + comment |
| `frontend/components/ReviewCard.tsx` | Review display card |
| `frontend/components/AdminStats.tsx` | Stat card grid |
| `frontend/components/DocumentUpload.tsx` | Admin upload widget |

**Reviews page:**
- Average rating display (stars + number)
- Review list (most recent first)
- ReviewForm: clickable 1-5 stars, service category dropdown (7 categories), comment textarea
- `POST /feedback` → `{rating, comment, service_category, conversation_id?}`

**Admin dashboard layout:**
```
┌──────────────────────────────────────────────────────┐
│  Stat Cards Row                                       │
│  [Questions] [Conversations] [Reviews] [Avg Rating]  │
├──────────────────────────────────────────────────────┤
│  System Status                                        │
│  ● RAG: Active  ● Cerebras: Active  ● STT: Active   │
│  Indexed Documents: 42                                │
├────────────────────────┬─────────────────────────────┤
│  Recent Questions      │  Most Asked Services        │
│  (table)               │  (bar chart / list)         │
├────────────────────────┴─────────────────────────────┤
│  Feedback Table (rating, comment, category, date)    │
├──────────────────────────────────────────────────────┤
│  [Upload Document]  [Re-index Knowledge Base]        │
└──────────────────────────────────────────────────────┘
```

**`admin_service.py` metrics:**
- `total_questions` — count of Message where role=user
- `total_conversations` — count of Conversation
- `total_reviews` — count of Feedback
- `avg_rating` — average of Feedback.rating
- `indexed_documents` — count of SourceDocument where status=indexed
- `recent_questions` — last 20 user messages
- `most_asked_services` — top service_category from Feedback + Message analysis
- `rag_status` — ping ChromaDB collection
- `cerebras_status` — test API call
- `stt_status` — check GROQ_API_KEY presence

**Admin protection:** Check `user.role == "admin"` in dependency.

### Phase 4 Verification
- [ ] Submit review → appears in reviews list and admin dashboard
- [ ] Average rating updates correctly
- [ ] Admin dashboard shows real metrics from database
- [ ] Status indicators reflect actual service state (green/red)
- [ ] Admin can upload documents and trigger re-index
- [ ] Non-admin cannot access `/admin/*` endpoints (403)

---

## Phase 5: Voice (STT/TTS) + Services Page + About + Polish

### 5.1 Voice Implementation

**New/modified files:**

| File | Purpose |
|------|---------|
| `backend/app/services/stt_service.py` | Groq Whisper STT |
| `backend/app/services/tts_service.py` | TTS placeholder (+ optional edge-tts) |
| `backend/app/api/routes_voice.py` | `POST /voice/stt`, `POST /voice/tts` |
| `frontend/components/VoiceRecorder.tsx` | MediaRecorder + mic UI |
| `frontend/components/ChatInput.tsx` | Updated with mic button |
| `frontend/app/services/page.tsx` | Services directory |
| `frontend/app/about/page.tsx` | System architecture page |

**STT service:**
```python
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

async def transcribe(filename: str, audio_bytes: bytes) -> dict:
    transcription = client.audio.transcriptions.create(
        file=(filename, audio_bytes),
        model="whisper-large-v3",
        temperature=0,
        response_format="verbose_json",
    )
    return {"text": transcription.text, "language": transcription.language}
```

**TTS service:** Placeholder returning `{"status": "tts_not_enabled", "message": "..."}`. Optionally wrap `edge-tts` for basic Arabic/English synthesis if time allows.

**Frontend voice flow:**
1. User clicks mic button → `navigator.mediaDevices.getUserMedia({audio: true})`
2. `MediaRecorder` records WebM/Opus audio
3. Pulsing red indicator while recording
4. On stop → POST audio blob to `/voice/stt`
5. Transcript fills chat input (user can review/edit before sending)
6. Message stored with `input_type: "voice"`

### 5.2 Services Page

Grid of 7 government entity cards:
1. Civil Status and Passports (الأحوال المدنية والجوازات)
2. Traffic and Licensing (السير والترخيص)
3. Ministry of Labor (وزارة العمل)
4. Social Security Corporation (مؤسسة الضمان الاجتماعي)
5. Ministry of Interior (وزارة الداخلية)
6. Telecommunications Regulatory Commission (هيئة تنظيم الاتصالات)
7. Greater Amman Municipality (أمانة عمان الكبرى)

Each card: icon, bilingual name, description, "Ask about this" button → navigates to chat with pre-filled context.

### 5.3 About Page

- System architecture diagram (CSS/SVG-based, matching the Mermaid diagram above)
- Tech stack list with icons
- How RAG works (simple visual)
- Team/university information section
- Project goals

### 5.4 Final Polish

- Loading skeletons on all data-fetching pages
- Error boundaries with bilingual error messages
- Mobile responsive pass (375px breakpoint)
- `<head>` meta tags, OpenGraph for sharing
- Arabic typography tuning (line-height: 1.8, appropriate font sizes)
- Subtle hover/active states on all interactive elements
- Smooth scroll, fade-in animations (CSS transitions, not heavy libraries)

### Phase 5 Verification
- [ ] Browser mic permission prompt → recording starts with visual indicator
- [ ] Arabic audio → correct Arabic transcript
- [ ] English audio → correct English transcript
- [ ] Voice message stored with `input_type: "voice"` in database
- [ ] Services page shows all 7 categories with bilingual names
- [ ] "Ask about this" navigates to chat with context
- [ ] About page shows architecture diagram
- [ ] TTS endpoint responds (real or placeholder)
- [ ] All pages responsive at 375px mobile viewport
- [ ] All pages work correctly in Arabic (RTL) and English (LTR)

---

## Step → Targets → Verification Traceability

| Phase | Key Targets | Verification Method |
|-------|-------------|-------------------|
| 1 | Backend boots, Cerebras responds, Landing + Chat render bilingual | Manual: curl endpoints + browser check |
| 2 | Documents indexed, RAG answers with sources, no hallucination | Manual: upload doc → ask question → verify source |
| 3 | Auth works, messages persist, history loads, context used | Manual: register → chat → reload → verify persistence |
| 4 | Reviews submit, admin sees metrics, upload works | Manual: submit review → check admin → upload doc |
| 5 | Voice records → transcribes → sends, all pages complete | Manual: mic test → full user journey walkthrough |

---

## Key Technical Decisions

1. **Embedding model:** `intfloat/multilingual-e5-base` — 278M params, 768 dimensions, strong Arabic+English support, runs locally via sentence-transformers. Requires `"query: "` / `"passage: "` prefixes.

2. **Cerebras client:** OpenAI-compatible SDK (`from openai import AsyncOpenAI` with `base_url="https://api.cerebras.ai/v1"`) — cleaner and standardized.

3. **Database init:** `Base.metadata.create_all()` on startup — simple, no migration tool needed for graduation.

4. **Auth:** JWT in localStorage — acceptable for graduation; document as known limitation.

5. **Windows notes:**
   - Run backend: `python -m uvicorn app.main:app --reload`
   - Use `$env:VAR` for PowerShell env vars
   - ChromaDB uses relative path `./app/vector_store`
   - Install PostgreSQL as Windows service or via Docker Desktop before Phase 3

6. **No Docker required** — direct local development. Optional `docker-compose.yml` for PostgreSQL only if desired.
