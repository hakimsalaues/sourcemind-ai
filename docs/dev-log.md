# SourceMind AI — Development Log

## Day 1 — Project Setup and Backend Foundation

### Project Goal

Build SourceMind AI, a full-stack AI-powered knowledge workspace using RAG.

The app will allow users to upload PDF documents, process them into semantic chunks, store embeddings in a vector database, and ask questions that are answered using source-grounded AI responses.

### Local Project Path

Windows path:

C:\Users\USER\Documents\vsc\sourcemind-ai

Git Bash path:

~/Documents/vsc/sourcemind-ai

### Current Stack Decision

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios

Backend:

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- Multer
- pdf-parse

AI / RAG:

- Gemini API free tier
- Pinecone free tier
- Provider-based AI architecture

DevOps:

- Git
- GitHub
- Docker
- Vercel
- Render

### Documentation Created

The project currently includes:

- docs/product-blueprint.md
- docs/architecture.md
- docs/database-models.md
- docs/api-contract.md
- docs/rag-flow.md
- docs/dev-log.md

### Backend Created

Backend folder:

server/

Backend was initialized with:

- npm init -y
- Express
- TypeScript
- tsx
- dotenv
- cors
- mongoose
- jsonwebtoken
- bcryptjs
- multer
- pdf-parse
- @google/genai
- @pinecone-database/pinecone

### Backend Structure

server/src/

- app.ts
- server.ts
- config/env.ts
- routes/index.ts
- middlewares/notFound.ts
- middlewares/errorHandler.ts
- utils/apiResponse.ts
- controllers/
- models/
- services/
- types/

### Current Backend Scripts

server/package.json:

- dev: tsx src/server.ts
- build: tsc
- start: node dist/server.js

### Working Endpoints

GET /health

Response:

{
"status": "ok",
"message": "SourceMind AI API is running"
}

GET /api

Response:

{
"success": true,
"message": "SourceMind AI API root"
}

Unknown routes return:

{
"success": false,
"message": "Route not found: /route-name"
}

### Problems Solved

1. Git was installed and configured.
2. WSL2 and Docker Desktop were installed successfully.
3. Node.js and npm were installed.
4. TypeScript error with verbatimModuleSyntax was fixed by updating tsconfig.json.
5. ts-node-dev was replaced with tsx because the server was not starting correctly.
6. Backend health check was tested successfully.
7. API base route and 404 middleware were tested successfully.

### Next Step

Connect MongoDB Atlas to the backend.

Tasks:

1. Create MongoDB Atlas free cluster.
2. Get MongoDB connection string.
3. Add MONGO_URI to server/.env.
4. Create database connection file.
5. Connect MongoDB in server.ts.
6. Test backend database connection.

## Auth and Workspace Progress

### Authentication Completed

Implemented:

- User model
- Register endpoint
- Login endpoint
- JWT token generation
- JWT protected route
- GET /api/auth/me

Tested successfully:

- User registration
- User login
- Token-based authentication

### Workspace CRUD Completed

Implemented:

- Workspace model
- Workspace service
- Workspace controller
- Workspace routes
- Protected workspace routes

Tested successfully:

- Create workspace
- Get user workspaces
- Get workspace by ID
- Delete workspace

Build status:

- npm run build completed successfully with no TypeScript errors.

### Next Step

Implement document upload base:

- Document model
- Multer upload middleware
- Document controller
- Document service
- Protected PDF upload endpoint

## Document Upload and PDF Processing Completed

Implemented:

- Document model
- Multer upload middleware
- Protected PDF upload endpoint
- Document metadata storage in MongoDB
- Workspace ownership validation
- PDF text extraction with pdf-parse
- Basic text chunking
- Document processing status updates

Tested successfully:

- Upload PDF
- Store file in uploads/
- Save document metadata
- Extract readable text from PDF
- Generate chunks
- Update document status to completed
- Save chunkCount in MongoDB

Build status:

- npm run build completed successfully with no TypeScript errors.

Important note:

- pdf-parse was downgraded to version 1.1.1 because the newer version caused import/runtime issues with the current backend setup.

Next Step:

Implement the AI/RAG layer:

- Gemini API setup
- Embedding service
- Pinecone setup
- Vector storage for document chunks
- Semantic search

## RAG Backend Completed

Implemented:

- Gemini embedding service
- Pinecone vector service
- Document chunks stored as vectors
- Conversation model
- Message model
- RAG chat service
- Chat controller
- Chat routes
- POST /api/chat/ask
- GET /api/chat/conversations/:workspaceId
- GET /api/chat/messages/:conversationId

Tested successfully:

- Uploaded PDF
- Generated document chunks
- Stored vectors in Pinecone
- Asked a question through the RAG endpoint
- Retrieved source chunks from Pinecone
- Generated an AI answer with Gemini
- Returned answer and sources

Build status:

- npm run build completed successfully with no TypeScript errors.

Next Step:

Build the frontend MVP with React, TypeScript, Vite, Tailwind CSS, React Router, Axios, and TanStack Query.
