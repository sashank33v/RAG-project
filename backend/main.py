from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from groq import Groq
from pypdf import PdfReader
from jwt import PyJWKClient
from database import Base, engine, get_db
from models import NoteDB, DocumentDB
import jwt
import os
import tempfile
import re

load_dotenv()

app = FastAPI()

MAX_FILE_SIZE = 5 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"application/pdf"}

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY is not set")

jwks_url = os.getenv("CLERK_JWKS_URL")
if not jwks_url:
    raise ValueError("CLERK_JWKS_URL is not set")

jwks_client = PyJWKClient(jwks_url)
client = Groq(api_key=groq_api_key)


class AskRequest(BaseModel):
    question: str


class NoteCreate(BaseModel):
    content: str


def get_current_user(
    request: Request,
    authorization: str | None = Header(default=None),
):
    token = None

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()

    if not token:
        token = request.cookies.get("__session")

    if not token:
        raise HTTPException(status_code=401, detail="Missing auth token")

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    azp = payload.get("azp")
    if azp and azp not in allowed_origins:
        raise HTTPException(status_code=401, detail="Invalid authorized party")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    return {"user_id": user_id}


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 120) -> list[str]:
    text = clean_text(text)
    if not text:
        return []

    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + chunk_size, text_len)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        if end == text_len:
            break

        start = end - overlap

    return chunks


def score_chunk(chunk: str, question: str) -> int:
    chunk_lower = chunk.lower()
    words = re.findall(r"\w+", question.lower())
    words = [w for w in words if len(w) > 2]
    return sum(chunk_lower.count(word) for word in words)


def retrieve_relevant_chunks(documents: list[DocumentDB], question: str, top_k: int = 5) -> list[dict]:
    scored_chunks = []

    for doc in documents:
        chunks = chunk_text(doc.content)
        for idx, chunk in enumerate(chunks):
            score = score_chunk(chunk, question)
            if score > 0:
                scored_chunks.append(
                    {
                        "document_id": doc.id,
                        "filename": doc.filename,
                        "chunk_index": idx,
                        "content": chunk,
                        "score": score,
                    }
                )

    scored_chunks.sort(key=lambda x: x["score"], reverse=True)
    return scored_chunks[:top_k]


@app.get("/")
def root():
    return {"message": "Backend running"}


@app.get("/notes")
def get_notes(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    notes = db.query(NoteDB).order_by(NoteDB.id.desc()).all()
    return [
        {
            "id": note.id,
            "content": note.content,
            "created_at": note.created_at,
        }
        for note in notes
    ]


@app.post("/notes")
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    content = note.content.strip()

    if not content:
        raise HTTPException(status_code=400, detail="Note content is required")

    new_note = NoteDB(content=content)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {
        "id": new_note.id,
        "content": new_note.content,
        "created_at": new_note.created_at,
    }


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file extension")

    file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max size is 5MB")

    temp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    try:
        temp.write(file_bytes)
        temp.close()

        reader = PdfReader(temp.name)
        text_parts = []

        for page in reader.pages:
            page_text = page.extract_text() or ""
            if page_text.strip():
                text_parts.append(page_text)

        text = "\n".join(text_parts).strip()
        text = clean_text(text)

        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        existing_doc = (
            db.query(DocumentDB)
            .filter(DocumentDB.filename == file.filename, DocumentDB.content == text)
            .first()
        )

        if existing_doc:
            return {
                "id": existing_doc.id,
                "filename": existing_doc.filename,
                "message": "File already uploaded",
            }

        new_doc = DocumentDB(filename=file.filename, content=text)
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)

        return {
            "id": new_doc.id,
            "filename": new_doc.filename,
            "message": "Uploaded successfully",
        }
    finally:
        try:
            os.unlink(temp.name)
        except Exception:
            pass


@app.get("/documents")
def get_documents(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    docs = db.query(DocumentDB).order_by(DocumentDB.id.desc()).all()
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "created_at": doc.created_at,
        }
        for doc in docs
    ]


@app.post("/ask")
def ask_ai(
    data: AskRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    question = data.question.strip()

    if not question:
        raise HTTPException(status_code=400, detail="Question is required")

    all_docs = db.query(DocumentDB).order_by(DocumentDB.id.desc()).all()
    if not all_docs:
        return {"answer": "No uploaded documents found.", "sources": []}

    relevant_chunks = retrieve_relevant_chunks(all_docs, question, top_k=5)

    if not relevant_chunks:
        return {"answer": "Not found in uploaded documents.", "sources": []}

    context_blocks = []
    sources = []

    for item in relevant_chunks:
        context_blocks.append(
            f"[Source: {item['filename']} | Chunk {item['chunk_index']}]\n{item['content']}"
        )
        sources.append(
            {
                "document_id": item["document_id"],
                "filename": item["filename"],
                "chunk_index": item["chunk_index"],
            }
        )

    context = "\n\n".join(context_blocks)

    prompt = f"""
Answer ONLY from the context below.
If the answer is not present, say exactly: Not found in uploaded documents.
Keep the answer concise and factual.

Context:
{context}

Question:
{question}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Return clean, readable English only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            max_tokens=300,
        )

        answer = (response.choices[0].message.content or "").strip()

        return {
            "answer": answer or "No valid answer found.",
            "sources": sources,
        }
    except Exception as e:
        print("ERROR:", e)
        return {
            "answer": "Something went wrong. Check backend logs.",
            "sources": [],
        }
