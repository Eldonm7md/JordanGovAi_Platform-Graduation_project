from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from app.services import groq_service

router = APIRouter(tags=["audio"])


class TranscriptionResponse(BaseModel):
    text: str
    language: Optional[str] = None


@router.post("/audio/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form(default=None),
):
    """Transcribe voice input using Groq STT."""
    try:
        text = await groq_service.transcribe_audio(file, language=language)
        return TranscriptionResponse(text=text, language=language)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Speech-to-text failed: {exc}",
        ) from exc
