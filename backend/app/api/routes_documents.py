from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.services import document_service

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    entity: Optional[str] = Form(""),
):
    """Upload a document for processing."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    allowed_extensions = {".txt", ".pdf", ".docx", ".doc"}
    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""

    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {ext}. Allowed: {allowed_extensions}"
        )

    content = await file.read()
    file_path = document_service.save_uploaded_file(file.filename, content)

    return {
        "status": "uploaded",
        "filename": file.filename,
        "file_path": file_path,
        "size": len(content),
    }


@router.post("/process")
async def process_document(
    filename: str,
    entity: Optional[str] = "",
):
    """Process an uploaded document and add to vector store."""
    import os
    from app.core.config import settings

    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {filename}")

    try:
        result = document_service.process_and_index_document(file_path, entity=entity)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@router.post("/reindex")
async def reindex_documents(entity: Optional[str] = ""):
    """Reindex all documents in the upload directory."""
    try:
        result = document_service.reindex_all_documents(entity=entity)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reindex error: {str(e)}")


@router.get("/")
async def list_documents():
    """List all uploaded documents."""
    documents = document_service.list_documents()
    return {"documents": documents, "total": len(documents)}
