from pydantic_settings import BaseSettings
from pathlib import Path
from typing import Optional


BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    # Cerebras AI
    CEREBRAS_API_KEY: str = ""
    CEREBRAS_MODEL: str = "llama3.1-8b"

    # Groq (STT)
    GROQ_API_KEY: str = ""
    GROQ_STT_MODEL: str = "whisper-large-v3-turbo"

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/jordangov"

    # ChromaDB
    CHROMA_DIR: str = "./app/vector_store"

    # File uploads
    UPLOAD_DIR: str = "./app/data"

    # JWT Auth
    JWT_SECRET: str = "your-secret-key-change-this"
    JWT_ALGORITHM: str = "HS256"

    # Embedding
    EMBEDDING_MODEL: str = "intfloat/multilingual-e5-base"

    # Frontend URL (for CORS)
    NEXT_PUBLIC_API_URL: str = "http://127.0.0.1:8000"

    class Config:
        env_file = str(BACKEND_DIR / ".env")
        extra = "allow"


settings = Settings()
