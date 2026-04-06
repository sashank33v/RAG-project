# Second Brain App

Second Brain App is a full-stack knowledge workspace built around four core actions:

1. Store notes in the knowledge system.
2. Upload PDF documents.
3. Browse saved knowledge in a premium dashboard-style UI.
4. Ask AI questions grounded in uploaded document content.

The project is split into:

- `frontend/`: a Next.js app with Clerk authentication and a multi-page dashboard UI.
- `backend/`: a FastAPI API backed by PostgreSQL via SQLAlchemy, with Groq used for question answering over uploaded PDF content.

This README is written from the current codebase, so it documents what is actually implemented now, not an idealized future version.

## What The Project Does

At a high level, the app behaves like a personal knowledge hub:

- Users authenticate through Clerk.
- The backend supports creating text notes.
- Authenticated users can upload PDF files.
- The backend extracts text from uploaded PDFs and stores that extracted text in the database.
- Users can ask questions in the AI page.
- The backend retrieves relevant text chunks from uploaded documents and sends that context to Groq for an answer.

The product direction is clearly a "second brain" or "memory OS" style application, where notes, documents, retrieval, and AI interaction live in one interface.

## Current Feature Set

### Implemented

- Clerk-based authentication in the frontend
- Protected frontend routes using Clerk middleware
- Note listing
- Note creation API
- PDF upload with validation
- PDF text extraction using `pypdf`
- Document listing
- Retrieval-augmented AI question answering over uploaded PDF text
- Multi-page dashboard UI for:
  - Dashboard
  - Notes
  - Uploads
  - Memory
  - AI Chat

### Partially Implemented / Prototype State

- The `Memory` page currently uses mock data on the frontend.
- The active routed frontend does not currently expose a live note-creation form, even though the backend supports note creation and older prototype files include quick-capture UI.
- The AI system retrieves only from uploaded documents, not from notes.
- There is no true vector database in the active request path.
- There is no per-user data isolation in the database queries yet.
- Several extra frontend files appear to be older prototype versions and are not the routed pages currently used by the app.
- `backend/rag.py` contains an alternative Chroma/OpenAI-based approach, but it is not wired into the live FastAPI routes.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Clerk for auth
- Axios for API calls
- Framer Motion for animation
- Lucide React for icons
- `clsx` for conditional styling

### Backend

- FastAPI
- Uvicorn
- SQLAlchemy
- PostgreSQL driver via `psycopg2-binary`
- `python-dotenv`
- `pypdf`
- `PyJWT`
- Groq Python SDK
- `httpx`
- `python-multipart`
- `cryptography`

### AI / Retrieval

- Groq chat completion model:
  - `llama-3.1-8b-instant`
- Retrieval strategy in live flow:
  - regex/token overlap scoring over text chunks
- Inactive alternative prototype:
  - ChromaDB + OpenAI embeddings in `backend/rag.py`

## Repository Structure

```text
second-brain-app/
├── backend/
│   ├── main.py              # FastAPI app and all active API routes
│   ├── database.py          # SQLAlchemy engine/session setup
│   ├── models.py            # NoteDB and DocumentDB models
│   ├── auth.py              # Unused older auth helper
│   ├── rag.py               # Unused prototype RAG implementation
│   ├── requirements.txt
│   ├── Procfile
│   ├── runtime.txt
│   └── uploads/             # Existing local files in repo/backend workspace
├── frontend/
│   ├── src/app/             # App Router pages
│   ├── src/components/      # Shared UI components
│   ├── middleware.ts        # Clerk protection for frontend routes
│   ├── package.json
│   └── README.md            # Default Next.js README, not the main project doc
├── middleware.ts            # Duplicate middleware file at repo root
└── README.md                # This file
```

## Architecture Overview

```text
User
  -> Next.js frontend
  -> Clerk auth session/token
  -> FastAPI backend
  -> PostgreSQL database
  -> Groq API for answer generation
```

### Main System Responsibilities

#### Frontend

- Renders authenticated pages
- Fetches Clerk token via `useAuth()`
- Sends bearer token to backend
- Displays notes, files, and AI responses
- Provides the workspace UI shell through shared `Sidebar` and `Topbar`

#### Backend

- Validates Clerk JWTs using JWKS
- Creates and reads note records
- Validates and processes PDF uploads
- Extracts text from PDFs
- Stores extracted document text
- Retrieves relevant chunks for AI prompts
- Calls Groq and returns grounded answers

#### Database

- Stores notes
- Stores uploaded document metadata and extracted text

## Frontend Application Flow

The routed frontend pages currently used are:

- `/` -> Dashboard
- `/notes` -> Notes page
- `/uploads` -> Upload manager
- `/memory` -> Search/memory UI with mock content
- `/ai` -> AI chat over uploaded documents
- `/sign-in` -> Clerk sign-in
- `/sign-up` -> Clerk sign-up

### Shared Layout Behavior

The app uses:

- `ClerkProvider` in `frontend/src/app/layout.tsx`
- Clerk middleware in `frontend/middleware.ts`
- Shared layout components:
  - `frontend/src/components/layout/Sidebar.tsx`
  - `frontend/src/components/layout/Topbar.tsx`

The sidebar provides navigation between main product areas. The topbar renders a static search placeholder, notifications button, and auth controls.

### Dashboard Page

File: `frontend/src/app/page.tsx`

Current behavior:

- Requires authentication.
- Fetches notes from `GET /notes`.
- Displays the five most recent notes in a compact dashboard card.
- Uses the shared sidebar and topbar.

Important detail:

- The routed dashboard page is not the richer prototype in `frontend/src/app/Homepage.tsx`.
- `Homepage.tsx` and `HomeUI.tsx` are extra prototype files and are not the route entry used by `/`.

### Notes Page

File: `frontend/src/app/notes/page.tsx`

Current behavior:

- Requires authentication.
- Fetches all notes from `GET /notes`.
- Shows a left-side note list.
- Shows the selected note in a center panel.
- Renders a right-side "AI Copilot" panel that is currently visual only.

### Uploads Page

File: `frontend/src/app/uploads/page.tsx`

Current behavior:

- Requires authentication.
- Fetches document metadata from `GET /documents`.
- Lets the user choose a file and upload it to `POST /upload`.
- Shows backend validation or success messages.
- Displays uploaded files as a simple document library list.

Important detail:

- The upload UI copy suggests a general file library, but the backend only accepts PDFs.

### Memory Page

File: `frontend/src/app/memory/page.tsx`

Current behavior:

- Requires authentication.
- Uses hardcoded mock results in the page component.
- Filters those mock results client-side based on the search box.

Important detail:

- This page is a UI prototype, not a live retrieval system yet.

### AI Page

File: `frontend/src/app/ai/page.tsx`

Current behavior:

- Requires authentication.
- Fetches uploaded documents from `GET /documents`.
- Shows a chat-like interface.
- Sends the user question to `POST /ask`.
- Displays the backend answer in the conversation.

Important detail:

- The frontend currently displays only `answer`.
- The backend also returns `sources`, but those are not rendered yet.

## Backend Application Flow

The active backend is defined in `backend/main.py`.

### Startup Behavior

When the FastAPI app starts, it:

1. Loads environment variables with `load_dotenv()`.
2. Reads allowed frontend origins for CORS.
3. Configures CORS middleware.
4. Creates database tables through `Base.metadata.create_all(bind=engine)`.
5. Loads and validates:
   - `GROQ_API_KEY`
   - `CLERK_JWKS_URL`
6. Creates:
   - a Clerk JWKS client
   - a Groq client

### Authentication Flow

Auth is implemented in `get_current_user()` inside `backend/main.py`.

The backend:

- Reads a bearer token from the `Authorization` header when present.
- Falls back to the `__session` cookie if no bearer token is present.
- Fetches the JWT signing key from Clerk JWKS.
- Verifies the JWT with RS256.
- Skips audience verification.
- Optionally checks `azp` against allowed origins.
- Returns the Clerk `sub` claim as `user_id`.

Important limitation:

- The backend validates the user identity, but it does not use `user_id` to filter note or document queries.
- In the current implementation, authenticated users would read from the same shared `notes` and `documents` tables.

## Data Model

Defined in `backend/models.py`.

### `NoteDB`

- `id`: integer primary key
- `content`: text, required
- `created_at`: timestamp with timezone, default `now()`

### `DocumentDB`

- `id`: integer primary key
- `filename`: string(255), required
- `content`: text, required
- `created_at`: timestamp with timezone, default `now()`

Important limitation:

- Neither table currently stores a user ID.
- That is the main reason data is not scoped per authenticated user.

## Active API Endpoints

### `GET /`

Purpose:

- Health-style root endpoint

Response:

- `{ "message": "Backend running" }`

### `GET /notes`

Purpose:

- Returns notes ordered by newest ID first

Auth:

- Required

Behavior:

- Queries all notes in descending ID order

### `POST /notes`

Purpose:

- Creates a new note

Auth:

- Required

Request body:

```json
{
  "content": "Your note text"
}
```

Validation:

- Trims whitespace
- Rejects empty content

Response:

- Returns the saved note fields

### `POST /upload`

Purpose:

- Uploads a PDF, extracts text, and stores the extracted content

Auth:

- Required

Validation:

- filename must exist
- content type must be `application/pdf`
- extension must be `.pdf`
- file must not be empty
- file size must be <= 5 MB

Processing flow:

1. Read uploaded bytes into memory.
2. Write them to a temporary file.
3. Use `PdfReader` to extract page text.
4. Clean whitespace.
5. Reject the file if no text can be extracted.
6. Check for an existing document with the same filename and same extracted content.
7. If duplicate, return the existing document info.
8. Otherwise insert a new `DocumentDB` row.
9. Delete the temporary file in `finally`.

Important detail:

- The backend stores extracted text in the database.
- It does not persist the original PDF file as part of the active endpoint logic.

### `GET /documents`

Purpose:

- Returns uploaded document metadata ordered by newest first

Auth:

- Required

Behavior:

- Queries all documents in descending ID order

### `POST /ask`

Purpose:

- Answers a user question using uploaded document content

Auth:

- Required

Request body:

```json
{
  "question": "Ask something about uploaded PDFs"
}
```

Flow:

1. Trim and validate the question.
2. Load all documents from the database.
3. Chunk each document into overlapping windows.
4. Score each chunk by keyword overlap with the question.
5. Keep the top 5 chunks.
6. Build a context prompt containing chunk text and source labels.
7. Call Groq chat completion.
8. Return:
   - `answer`
   - `sources`

Fallback behavior:

- If there are no documents:
  - `"No uploaded documents found."`
- If no chunks match:
  - `"Not found in uploaded documents."`
- If Groq fails:
  - `"Something went wrong. Check backend logs."`

## Retrieval / RAG Logic

The live retrieval implementation is intentionally simple.

### Chunking

Function: `chunk_text()`

- Default chunk size: `800` characters
- Overlap: `120` characters
- Input is whitespace-normalized first

### Relevance Scoring

Function: `score_chunk()`

- Lowercases both chunk and question
- Extracts question words with regex
- Ignores words shorter than 3 characters
- Scores by counting occurrences of question words inside each chunk

### Retrieval

Function: `retrieve_relevant_chunks()`

- Scores every chunk across every stored document
- Sorts descending by score
- Returns the top `5`

### Generation

Groq receives a prompt that instructs the model to:

- answer only from provided context
- say exactly `Not found in uploaded documents.` when the answer is not present
- keep the answer concise and factual

This is a keyword-based RAG pipeline, not an embeddings-based retrieval system.

## User Flow

### New User Flow

1. User lands on a protected route such as `/`.
2. Clerk middleware redirects the user to sign in if not authenticated.
3. User signs up or signs in via Clerk.
4. User returns to the workspace.

### Notes Flow

1. User opens the dashboard or notes page.
2. Frontend gets a Clerk token with `getToken()`.
3. Frontend calls `GET /notes`.
4. Backend validates the token and returns notes.
5. User views note content.

For note creation, the implemented backend expects `POST /notes` with JSON body content. The richer prototype dashboard files suggest inline note capture, but the routed `/` page currently only lists notes and does not expose the active note creation form.

### Upload Flow

1. User opens `/uploads`.
2. Frontend fetches existing document metadata.
3. User selects a PDF.
4. Frontend sends multipart form data to `POST /upload` with bearer token.
5. Backend validates type and size.
6. Backend extracts text from the PDF.
7. Backend stores document metadata plus extracted text.
8. Frontend refreshes the library list.

### AI Question Flow

1. User opens `/ai`.
2. Frontend loads uploaded document list.
3. User asks a question.
4. Frontend posts the question to `POST /ask`.
5. Backend retrieves relevant text chunks from stored documents.
6. Backend sends those chunks to Groq.
7. Backend returns the answer plus source metadata.
8. Frontend appends the answer to the chat thread.

### Memory Search Flow

Current implementation:

1. User opens `/memory`.
2. User types into the search field.
3. The page filters hardcoded mock entries in memory.

This is a design placeholder for a future real search experience.

## Environment Variables

### Backend

The backend explicitly requires:

```env
DATABASE_URL=postgresql://...
GROQ_API_KEY=...
CLERK_JWKS_URL=...
ALLOWED_ORIGINS=http://localhost:3000
```

Notes:

- `DATABASE_URL` is required in `backend/database.py`.
- `GROQ_API_KEY` is required in `backend/main.py`.
- `CLERK_JWKS_URL` is required in `backend/main.py`.
- `ALLOWED_ORIGINS` defaults to `http://localhost:3000` if omitted.

### Frontend

The frontend explicitly references:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The frontend also uses Clerk. The Clerk package integration strongly implies the standard Clerk environment variables are needed in the Next.js app, even though they are not referenced directly in this codebase. In practice that usually means values such as:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

That requirement is an inference from the Clerk setup, not a direct string lookup from this repo.

## Local Development Setup

## Prerequisites

- Node.js for the frontend
- npm
- Python 3.10.x for the backend
- PostgreSQL
- Clerk project credentials
- Groq API key

### 1. Clone and enter the project

```bash
git clone <your-repo-url>
cd second-brain-app
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## Deployment Clues Present In Repo

The repo includes:

- `backend/Procfile`
- `backend/runtime.txt`

That suggests the backend has at least been prepared for a platform that understands Procfiles, such as Heroku-style deployment systems.

Current backend deployment command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Styling And UI Notes

The visual design aims for a dark premium dashboard aesthetic:

- dark panels
- soft gradients
- rounded cards
- icon-based sidebar navigation
- animated cards using Framer Motion

Important implementation note:

- `globals.css` uses `Inter, Arial, Helvetica, sans-serif`.
- That differs from the default Next README mention of Geist.
- The active codebase styling is custom and Tailwind-driven.

## Important Files To Know

### Backend

- `backend/main.py`: all active routes, auth validation, PDF processing, AI prompt flow
- `backend/database.py`: database engine and session lifecycle
- `backend/models.py`: SQLAlchemy models
- `backend/auth.py`: older helper, not used by active routes
- `backend/rag.py`: experimental/inactive RAG path

### Frontend

- `frontend/src/app/layout.tsx`: app root and Clerk provider
- `frontend/middleware.ts`: protected route enforcement
- `frontend/src/app/page.tsx`: routed dashboard page
- `frontend/src/app/notes/page.tsx`: notes page
- `frontend/src/app/uploads/page.tsx`: uploads page
- `frontend/src/app/memory/page.tsx`: memory prototype page
- `frontend/src/app/ai/page.tsx`: AI page
- `frontend/src/components/layout/Sidebar.tsx`: workspace navigation
- `frontend/src/components/layout/Topbar.tsx`: top navigation bar

## Known Gaps, Risks, And Inconsistencies

This section is important for anyone inheriting the project.

### 1. Data is not user-scoped yet

The backend authenticates users but does not store `user_id` on notes or documents and does not filter queries by user.

Impact:

- all authenticated users would share the same notes and documents
- this is the biggest functional and privacy gap in the current implementation

### 2. Prototype files exist beside live route files

Examples:

- `frontend/src/app/Homepage.tsx`
- `frontend/src/app/HomeUI.tsx`
- `frontend/src/app/notes/Homepage.tsx`
- `frontend/src/app/uploads/Homepage.tsx`
- `frontend/src/app/memory/Homepage.tsx`
- `frontend/src/app/ai/AIPage.tsx`

Impact:

- these can confuse new contributors
- some suggest functionality not available in the current routed pages
- some appear incomplete and would not serve as route entries as-is

### 3. The memory page is not connected to backend retrieval

Impact:

- users may assume search is live when it is not
- the page currently demonstrates design intent, not actual data retrieval

### 4. Active RAG is keyword-based, not semantic

Impact:

- relevant answers may be missed when question wording differs from document wording
- retrieval quality will be weaker than embedding-based search

### 5. `backend/rag.py` is stale relative to active backend flow

It uses:

- ChromaDB
- OpenAI embeddings
- `gpt-4o-mini`

But the live backend uses:

- direct SQL document loading
- keyword chunk scoring
- Groq `llama-3.1-8b-instant`

Impact:

- contributors could mistake the inactive prototype for the production path

### 6. Duplicate middleware file at repo root

There is also a `middleware.ts` at the repo root that matches the frontend version.

Impact:

- it may be leftover duplication
- the meaningful Next.js middleware for the app is the one inside `frontend/`

### 7. Dashboard prototypes do not match the active note API contract

Some prototype files attempt note creation differently from the active backend expectation.

Impact:

- those prototypes should not be treated as the source of truth for API usage

## Recommended Next Improvements

If this project is continued, the most valuable next steps are:

1. Add `user_id` to notes and documents and filter every query by user.
2. Connect the `Memory` page to real backend search.
3. Show `sources` in the AI page.
4. Decide whether to keep keyword retrieval or move to embeddings/vector search.
5. Remove or archive obsolete prototype files.
6. Add migrations instead of relying only on `create_all()`.
7. Add tests for auth, uploads, and retrieval behavior.
8. Persist original files or object storage references if file download/viewing is needed later.

## Plain-English Summary

Second Brain App is an authenticated full-stack workspace for capturing notes, uploading PDFs, and asking AI questions over uploaded document content. The frontend is a polished Next.js dashboard with Clerk auth. The backend is a FastAPI service that stores notes and extracted PDF text in a SQL database and uses a simple retrieval pipeline plus Groq to generate answers. The project already demonstrates the core product idea well, but it is still in MVP/prototype territory because search is partly mocked, data is not user-isolated yet, and some unused prototype files still exist in the repo.
