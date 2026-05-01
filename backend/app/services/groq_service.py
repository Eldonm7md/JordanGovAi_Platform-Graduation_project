from typing import Optional

from fastapi import UploadFile
from groq import AsyncGroq

from app.core.config import settings


def get_client() -> AsyncGroq:
    """Create Groq client for speech-to-text."""
    if not settings.GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured. Add it to backend/.env.")

    return AsyncGroq(api_key=settings.GROQ_API_KEY)


async def transcribe_audio(file: UploadFile, language: Optional[str] = None) -> str:
    """Transcribe an uploaded audio file with Groq Whisper."""
    audio_bytes = await file.read()
    if not audio_bytes:
        raise ValueError("Audio file is empty.")

    filename = file.filename or "audio.webm"
    transcription = await get_client().audio.transcriptions.create(
        file=(filename, audio_bytes, file.content_type or "audio/webm"),
        model=settings.GROQ_STT_MODEL,
        response_format="json",
        language=language if language in {"ar", "en"} else None,
        temperature=0,
    )

    return transcription.text
