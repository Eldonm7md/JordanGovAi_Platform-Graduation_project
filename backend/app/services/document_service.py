"""
Document management service.
Handles file upload, processing, and indexing orchestration.
"""

import os
import shutil
from typing import List, Dict
from app.core.config import settings
from app.services.docling_service import process_document
from app.services.rag_service import add_chunks, get_chroma_client


def ensure_upload_dir():
    """Ensure upload directory exists."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


def save_uploaded_file(filename: str, content: bytes) -> str:
    """
    Save uploaded file to disk.
    Returns the saved file path.
    """
    ensure_upload_dir()
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(content)

    return file_path


def process_and_index_document(
    file_path: str,
    entity: str = "",
) -> Dict:
    """
    Process a document and add to vector store.
    Returns processing result with chunk count.
    """
    chunks = process_document(file_path, entity=entity)

    if not chunks:
        return {
            "status": "error",
            "message": "No content extracted from document",
            "chunks": 0,
        }

    num_added = add_chunks(chunks)

    return {
        "status": "success",
        "filename": os.path.basename(file_path),
        "chunks": num_added,
        "entity": entity,
    }


def list_documents() -> List[Dict]:
    """List all documents in the upload directory."""
    ensure_upload_dir()

    documents = []
    for filename in os.listdir(settings.UPLOAD_DIR):
        if filename.startswith("."):
            continue
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        if os.path.isfile(file_path):
            documents.append({
                "filename": filename,
                "file_path": file_path,
                "size": os.path.getsize(file_path),
            })

    return documents


def reindex_all_documents(entity: str = "") -> Dict:
    """
    Reindex all documents in the upload directory.
    Clears existing index and reprocesses everything.
    """
    # Clear existing collection
    try:
        client = get_chroma_client()
        client.delete_collection("jordangov_documents")
    except Exception:
        pass

    documents = list_documents()
    total_chunks = 0
    processed = 0
    errors = []

    for doc in documents:
        try:
            result = process_and_index_document(doc["file_path"], entity=entity)
            if result["status"] == "success":
                total_chunks += result["chunks"]
                processed += 1
            else:
                errors.append(f"{doc['filename']}: {result['message']}")
        except Exception as e:
            errors.append(f"{doc['filename']}: {str(e)}")

    return {
        "status": "success",
        "processed": processed,
        "total_chunks": total_chunks,
        "errors": errors,
    }
