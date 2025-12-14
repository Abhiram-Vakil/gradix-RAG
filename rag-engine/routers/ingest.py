from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from services.pypdf_service import extract_text_from_pdf
from services.text_processing import clean_text, similarity_based_chunking
from services.chroma_db import upsert_documents
import uuid

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

@router.post("/")
async def ingest_content(
    files: Optional[List[UploadFile]] = File(None),
    text_content: Optional[str] = Form(None)
):
    """
    Ingests content from files (PDF) and/or raw text.
    - Extracts text from PDFs
    - Cleans and chunks text
    - Stores embeddings in ChromaDB
    """
    if not files and not text_content:
        raise HTTPException(status_code=400, detail="No content provided. Upload files or provide text.")

    final_chunks = []
    final_metadatas = []
    final_ids = []

    # 1. Process Raw Text
    if text_content:
        cleaned_text = clean_text(text_content)
        chunks = similarity_based_chunking(cleaned_text)
        
        for i, chunk in enumerate(chunks):
            chunk_id = str(uuid.uuid4())
            final_chunks.append(chunk)
            final_metadatas.append({"source": "manual_input", "chunk_index": i})
            final_ids.append(chunk_id)

    # 2. Process Files
    if files:
        for file in files:
            try:
                content = await file.read()
                
                # Extract Text
                if file.filename.endswith(".pdf"):
                    raw_text = extract_text_from_pdf(content)
                else:
                    # For txt/md files
                    raw_text = content.decode("utf-8")
                
                cleaned_text = clean_text(raw_text)
                chunks = similarity_based_chunking(cleaned_text)

                for i, chunk in enumerate(chunks):
                    chunk_id = str(uuid.uuid4())
                    final_chunks.append(chunk)
                    final_metadatas.append({"source": file.filename, "chunk_index": i})
                    final_ids.append(chunk_id)

            except Exception as e:
                print(f"Error processing file {file.filename}: {e}")
                # Continue with other files/text instead of failing everything
                continue

    if not final_chunks:
         raise HTTPException(status_code=500, detail="No chunks could be generated from the input.")

    # 3. Store in ChromaDB
    try:
        upsert_documents(final_chunks, final_metadatas, final_ids)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "message": "Ingestion successful", 
        "total_chunks": len(final_chunks),
        "sources": [f.filename for f in files] if files else [] + (["manual_input"] if text_content else [])
    }
