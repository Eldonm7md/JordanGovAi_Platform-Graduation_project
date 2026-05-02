from openai import AsyncOpenAI
from app.core.config import settings
from app.core.prompts import get_system_prompt
from typing import List, Dict, Optional
import time


def get_client() -> AsyncOpenAI:
    """Create Cerebras client using OpenAI-compatible API."""
    if not settings.CEREBRAS_API_KEY:
        raise RuntimeError("CEREBRAS_API_KEY is not configured. Add it to backend/.env.")

    return AsyncOpenAI(
        api_key=settings.CEREBRAS_API_KEY,
        base_url="https://api.cerebras.ai/v1"
    )


async def chat(
    message: str,
    language: str = "ar",
    conversation_history: Optional[List[Dict[str, str]]] = None,
    system_prompt: Optional[str] = None,
    temperature: float = 0.3,
    max_tokens: int = 2048,
) -> str:
    """
    Send a message to Cerebras and get a response.

    Args:
        message: User's message
        language: 'ar' for Arabic, 'en' for English
        conversation_history: Previous messages for context
        system_prompt: Optional override for the system prompt
        temperature: Sampling temperature
        max_tokens: Max tokens to generate

    Returns:
        Assistant's response text
    """
    client = get_client()

    system_prompt = system_prompt or get_system_prompt(language, has_context=False)

    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history if available
    if conversation_history:
        messages.extend(conversation_history)

    messages.append({"role": "user", "content": message})

    response = await client.chat.completions.create(
        model=settings.CEREBRAS_MODEL,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )

    return response.choices[0].message.content


# ─── Health probe ──────────────────────────────────────────────
# Cached for 30s so /health is cheap to poll. The probe lists models
# (the cheapest authenticated call Cerebras exposes).

_PING_CACHE: Dict[str, object] = {"ok": None, "ts": 0.0}
_PING_TTL_SECONDS = 30.0


async def ping() -> bool:
    """Return True if Cerebras is reachable with the current API key."""
    now = time.time()
    cached_ok = _PING_CACHE.get("ok")
    cached_ts = float(_PING_CACHE.get("ts") or 0.0)
    if cached_ok is not None and now - cached_ts < _PING_TTL_SECONDS:
        return bool(cached_ok)

    try:
        client = get_client()
        await client.models.list()
        _PING_CACHE["ok"] = True
    except Exception:
        _PING_CACHE["ok"] = False
    _PING_CACHE["ts"] = now
    return bool(_PING_CACHE["ok"])
