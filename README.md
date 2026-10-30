# SourceMind AI

SourceMind AI is a full-stack AI knowledge workspace that allows users to upload PDF documents, organize them into private workspaces, and ask questions using Retrieval-Augmented Generation (RAG).

The application retrieves semantically relevant document chunks and generates answers grounded in the uploaded content, including the sources used for every response.

## Project Status

SourceMind AI is a functional full-stack MVP designed to demonstrate end-to-end development and Retrieval-Augmented Generation (RAG) integration.

The application includes user authentication, private workspaces, PDF processing, semantic search, AI-powered document conversations, source citations, and persistent conversation history.

**Live Demo:** https://sourcemind-ai.vercel.app

The project demonstrates practical experience in frontend and backend development, API integration, vector databases, authentication, and AI-powered application architecture.

SourceMind AI continues to evolve, with planned improvements in automated testing, document storage, and processing scalability.

## Main Features

- Secure user registration and login
- JWT-based authentication
- Private user-owned workspaces
- PDF upload with file type and size validation
- PDF text extraction and cleaning
- Overlapping text chunk generation
- Gemini embedding generation
- Pinecone vector storage and semantic retrieval
- Retrieval-Augmented Generation chat
- Document source citations
- Source relevance scores
- Persistent conversation history
- Safe document deletion from:
  - MongoDB
  - Local file storage
  - Pinecone vector storage
- Responsive dashboard and workspace interface
- Protected frontend routes
- Loading, error, empty, and processing states

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JSON Web Tokens
- bcrypt
- Multer
- pdf-parse

### AI and Retrieval

- Google Gemini API
- Gemini embeddings
- Pinecone vector database
- Retrieval-Augmented Generation

### Development Tools

- Git
- GitHub
- VS Code
- MongoDB Compass
- Postman
- cURL

## How It Works

1. The user creates an authenticated account.
2. The user creates a private workspace.
3. A PDF document is uploaded to the workspace.
4. The backend extracts and cleans the document text.
5. The text is divided into overlapping chunks.
6. Gemini generates an embedding for each chunk.
7. The vectors and document metadata are stored in Pinecone.
8. The user asks a question.
9. The question is converted into an embedding.
10. Pinecone retrieves the most relevant document chunks.
11. Gemini generates an answer using the retrieved context.
12. SourceMind returns the answer together with the consulted sources.

## RAG Flow

```text
PDF upload
    ↓
Text extraction
    ↓
Text cleaning
    ↓
Text chunking
    ↓
Gemini embeddings
    ↓
Pinecone vector storage
    ↓
User question
    ↓
Question embedding
    ↓
Semantic vector search
    ↓
Relevant document context
    ↓
Gemini grounded response
    ↓
Answer with sources
```

## Project Structure

```text
sourcemind-ai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── api-contract.md
│   ├── database-models.md
│   ├── dev-log.md
│   ├── product-blueprint.md
│   └── rag-flow.md
│
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Workspaces

```text
POST   /api/workspaces
GET    /api/workspaces
GET    /api/workspaces/:workspaceId
DELETE /api/workspaces/:workspaceId
```

### Documents

```text
POST   /api/documents/upload
GET    /api/documents/workspace/:workspaceId
DELETE /api/documents/:documentId
```

### Chat

```text
POST /api/chat/ask
GET  /api/chat/conversations/:workspaceId
GET  /api/chat/messages/:conversationId
```

## Local Installation

### Requirements

Before running the project, you need:

- Node.js
- npm
- MongoDB Atlas account
- Google Gemini API key
- Pinecone account
- Pinecone index configured with the correct embedding dimension

### Clone the Repository

```bash
git clone https://github.com/hakimsalaues/sourcemind-ai.git
cd sourcemind-ai
```

### Backend Setup

Enter the backend directory:

```bash
cd server
```

Install the dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env
```

Add your private credentials to:

```text
server/.env
```

Run the backend development server:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

### Frontend Setup

Open another terminal and enter the frontend directory:

```bash
cd client
```

Install the dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env
```

Run the frontend development server:

```bash
npm run dev
```

The application will run at:

```text
http://localhost:5173
```

## Environment Variables

### Backend

Create a `server/.env` file using `server/.env.example` as the reference.

```env
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_EMBEDDING_MODEL=gemini-embedding-2
GEMINI_CHAT_MODEL=gemini-2.5-flash
EMBEDDING_DIMENSION=768

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=sourcemind-ai
PINECONE_NAMESPACE=documents
```

### Frontend

Create a `client/.env` file using `client/.env.example` as the reference.

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit real API keys, passwords, JWT secrets, or database connection strings.

## Available Scripts

### Backend

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the compiled production server:

```bash
npm start
```

### Frontend

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build locally:

```bash
npm run preview
```

## Security

- User passwords are hashed before being stored.
- Protected API routes require a valid JSON Web Token.
- Workspaces are filtered by authenticated user ownership.
- Documents are filtered by authenticated user ownership.
- Pinecone searches are filtered by user and workspace metadata.
- Environment credentials are excluded from version control.
- Uploaded PDF files are excluded from version control.
- Deleting a document also removes its local file and Pinecone vectors.
- Users cannot access workspaces or documents belonging to another account.

## Document Deletion

When a document is deleted, SourceMind removes:

1. The document record from MongoDB.
2. The physical PDF file from local storage.
3. All Pinecone vectors associated with that document.

Historical chat messages remain available as conversation records, but new questions can no longer retrieve information from the deleted document.

## Current Limitations

- PDF documents are supported; scanned documents requiring OCR are not yet processed.
- Document processing is synchronous and may take longer for large files.
- Uploaded files currently rely on local storage; persistent cloud storage is planned.
- Automated testing coverage is planned for future development.
- Workspace sharing and advanced conversation management are not yet supported.

## Future Improvements

- Background document processing
- OCR support for scanned PDFs
- Automated backend tests
- Automated frontend tests
- Conversation deletion
- Conversation renaming
- Workspace editing
- Drag-and-drop document upload
- Streaming AI responses
- Additional document formats
- Cloud file storage
- Collaborative workspaces
- Usage analytics

## Technical Documentation

Additional technical documentation is available inside the `docs` directory:

- `product-blueprint.md` — product concept and planned features
- `architecture.md` — application architecture
- `database-models.md` — MongoDB data models
- `api-contract.md` — backend API contract
- `rag-flow.md` — Retrieval-Augmented Generation flow
- `dev-log.md` — development progress and technical decisions

## Author

Built by **Hakim Salaues**.

- GitHub: https://github.com/hakimsalaues
- LinkedIn: https://www.linkedin.com/in/hakim-salaues-b68910332/
