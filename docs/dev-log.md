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
