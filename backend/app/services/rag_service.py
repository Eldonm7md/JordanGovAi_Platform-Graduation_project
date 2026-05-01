"""
RAG Service - Retrieval Augmented Generation using ChromaDB and Cerebras.
Handles embedding, storage, retrieval, and grounded response generation.
"""

import chromadb
from typing import List, Dict, Optional, Tuple
from app.core.config import settings
from app.core.prompts import get_system_prompt
from app.services import cerebras_service


# Lazy-loaded embedding model
_embedding_model = None


def get_embedding_model():
    """Load the embedding model (lazy initialization)."""
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _embedding_model


def get_chroma_client():
    """Get ChromaDB persistent client."""
    return chromadb.PersistentClient(path=settings.CHROMA_DIR)


def get_collection():
    """Get or create the documents collection."""
    client = get_chroma_client()
    return client.get_or_create_collection(
        name="jordangov_documents",
        metadata={"hnsw:space": "cosine"},
    )


def embed_text(text: str, is_query: bool = False) -> List[float]:
    """
    Embed text using the multilingual model.
    Adds appropriate prefix for multilingual-e5-base.
    """
    model = get_embedding_model()
    prefix = "query: " if is_query else "passage: "
    embedding = model.encode(prefix + text, normalize_embeddings=True)
    return embedding.tolist()


def add_chunks(chunks: List[Dict]) -> int:
    """
    Add document chunks to ChromaDB.
    Each chunk should have 'text' and 'metadata' keys.
    Returns number of chunks added.
    """
    if not chunks:
        return 0

    collection = get_collection()

    ids = []
    documents = []
    embeddings = []
    metadatas = []

    for i, chunk in enumerate(chunks):
        chunk_id = f"{chunk['metadata'].get('source', 'doc')}_{i}"
        ids.append(chunk_id)
        documents.append(chunk["text"])
        embeddings.append(embed_text(chunk["text"], is_query=False))
        metadatas.append(chunk["metadata"])

    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(ids)


def retrieve(query: str, k: int = 5) -> List[Dict]:
    """
    Retrieve relevant chunks from ChromaDB.
    Returns list of {text, metadata, score} dicts.
    """
    collection = get_collection()

    if collection.count() == 0:
        return []

    query_embedding = embed_text(query, is_query=True)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    retrieved = []
    for i in range(len(results["documents"][0])):
        score = 1 - results["distances"][0][i]  # Convert distance to similarity
        retrieved.append({
            "text": results["documents"][0][i],
            "metadata": results["metadatas"][0][i],
            "score": score,
        })

    return retrieved


async def rag_chat(
    message: str,
    language: str = "ar",
    conversation_history: Optional[List[Dict[str, str]]] = None,
) -> Dict:
    """
    RAG-enhanced chat: retrieve context, then generate grounded response.
    
    Returns:
        {response, sources, language}
    """
    # Retrieve relevant context
    retrieved_chunks = retrieve(message, k=5)

    # Filter by relevance threshold
    relevant_chunks = [c for c in retrieved_chunks if c["score"] >= 0.3]

    sources = []
    context_text = ""

    if relevant_chunks:
        # Build context from retrieved chunks
        context_parts = []
        for chunk in relevant_chunks:
            context_parts.append(chunk["text"])
            sources.append({
                "filename": chunk["metadata"].get("source", "unknown"),
                "page": chunk["metadata"].get("chunk_index"),
                "chunk": chunk["text"][:100],
            })

        context_text = "\n\n---\n\n".join(context_parts)

    has_context = bool(relevant_chunks)
    system_prompt = get_system_prompt(language, has_context=has_context)

    if context_text:
        system_prompt += f"\n\n--- المعلومات المتاحة / Available Information ---\n\n{context_text}"

    # Generate response
    response = await cerebras_service.chat(
        message=message,
        language=language,
        conversation_history=conversation_history[-10:] if conversation_history else None,
        system_prompt=system_prompt,
    )

    return {
        "response": response,
        "sources": sources,
        "language": language,
    }


def get_index_stats() -> Dict:
    """Get statistics about the vector store."""
    try:
        collection = get_collection()
        return {
            "total_chunks": collection.count(),
            "status": "active",
        }
    except Exception:
        return {
            "total_chunks": 0,
            "status": "inactive",
        }
