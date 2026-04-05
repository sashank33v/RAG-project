from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq
from pypdf import PdfReader
import tempfile

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

documents = []
notes = []

class AskRequest(BaseModel):
    question: str

class Note(BaseModel):
    content: str

# NOTES
@app.get("/notes")
def get_notes():
    return notes

@app.post("/notes")
def create_note(note: Note):
    new_note = {
        "id": str(len(notes) + 1),
        "content": note.content
    }
    notes.append(new_note)
    return new_note

# UPLOAD (FIXED 🔥)
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    temp = tempfile.NamedTemporaryFile(delete=False)
    temp.write(await file.read())
    temp.close()

    reader = PdfReader(temp.name)
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    documents.append({
        "filename": file.filename,
        "content": text
    })

    return {"message": "Uploaded successfully"}

@app.get("/documents")
def get_documents():
    return documents

# AI
@app.post("/ask")
def ask_ai(data: AskRequest):
    try:
        context = ""
        if documents:
            context = documents[-1]["content"][:2000]

        prompt = f"""
Answer ONLY using the context.
If not found say: Not found in document.

Context:
{context}

Question:
{data.question}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Give clean readable answers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=300
        )

        answer = response.choices[0].message.content or ""
        answer = answer.strip()

        if not answer:
            answer = "No valid answer found."

        return {"answer": answer}

    except Exception as e:
        print("ERROR:", e)
        return {"answer": "Something went wrong."}
