from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_chat import router as chat_router
from app.api.routes_rag import router as rag_router
from app.api.routes_documents import router as documents_router
from app.api.routes_audio import router as audio_router
from app.core.config import settings
from app.models.schemas import HealthResponse
from app.services import cerebras_service

app = FastAPI(
    title="JordanGov AI Assistant",
    description="Bilingual Jordanian Government AI Assistant API",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat_router)
app.include_router(rag_router)
app.include_router(documents_router)
app.include_router(audio_router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "JordanGov AI Assistant",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "chat": "/chat",
            "stt": "/audio/transcribe",
            "docs": "/docs",
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    Probes upstream AI service (cached) and returns per-service state.

    `status`:
      - "ok"      backend + AI both reachable
      - "partial" backend up, AI unreachable (or key missing)
      - "down"    only used internally if backend fails to start
    """
    ai_ok = False
    if settings.CEREBRAS_API_KEY:
        try:
            ai_ok = await cerebras_service.ping()
        except Exception:
            ai_ok = False

    stt_ok = bool(settings.GROQ_API_KEY)

    overall = "ok" if ai_ok else "partial"

    return HealthResponse(
        status=overall,
        service="JordanGov AI Assistant",
        version="1.0.0",
        services={
            "backend": "ok",
            "ai": "ok" if ai_ok else "down",
            "stt": "ok" if stt_ok else "down",
        },
    )
