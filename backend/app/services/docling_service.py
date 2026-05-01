"""
Document processing service using Docling for PDF/DOCX parsing.
Handles text extraction and chunking for RAG pipeline.
"""

import os
from typing import List, Dict, Optional


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> List[str]:
    """
    Split text into overlapping chunks.
    Uses sentence-aware splitting for Arabic and English.
    """
    if not text or not text.strip():
        return []

    # Split by sentences (Arabic and English)
    separators = [".", "。", "؟", "!", "\n\n", "\n"]
    sentences = []
    current = ""

    for char in text:
        current += char
        if char in ".؟!。" or (char == "\n" and current.endswith("\n\n")):
            sentences.append(current.strip())
            current = ""

    if current.strip():
        sentences.append(current.strip())

    # Build chunks from sentences
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            # Keep overlap
            words = current_chunk.split()
            overlap_text = " ".join(words[-overlap // 5:]) if len(words) > overlap // 5 else ""
            current_chunk = overlap_text + " " + sentence
        else:
            current_chunk += " " + sentence if current_chunk else sentence

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks


def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from a file. Supports TXT, PDF, DOCX via Docling.
    Falls back to plain text reading if Docling is not available.
    """
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    # Try using Docling for PDF/DOCX
    try:
        from docling.document_converter import DocumentConverter

        converter = DocumentConverter()
        result = converter.convert(file_path)
        return result.document.export_to_markdown()
    except ImportError:
        # Fallback: basic PDF reading
        if ext == ".pdf":
            try:
                import fitz  # PyMuPDF

                doc = fitz.open(file_path)
                text = ""
                for page in doc:
                    text += page.get_text() + "\n"
                doc.close()
                return text
            except ImportError:
                pass

        raise ValueError(
            f"Cannot process {ext} files. Install docling: pip install docling"
        )


def process_document(
    file_path: str,
    entity: str = "",
    chunk_size: int = 500,
    overlap: int = 100,
) -> List[Dict]:
    """
    Process a document: extract text and split into chunks with metadata.

    Returns list of {text, metadata} dicts ready for embedding.
    """
    text = extract_text_from_file(file_path)
    chunks = chunk_text(text, chunk_size, overlap)

    filename = os.path.basename(file_path)

    results = []
    for i, chunk in enumerate(chunks):
        results.append({
            "text": chunk,
            "metadata": {
                "source": filename,
                "chunk_index": i,
                "entity": entity,
                "file_path": file_path,
            },
        })

    return results
