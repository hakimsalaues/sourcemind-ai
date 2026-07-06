# SourceMind AI — System Architecture

## 1. Architecture Overview

SourceMind AI follows a full-stack client-server architecture.

The frontend is responsible for the user interface, while the backend handles business logic, authentication, document processing, AI integration, database operations, and vector search.

The system is divided into five main layers:

1. Frontend
2. Backend API
3. MongoDB Database
4. Vector Database
5. AI Provider

## 2. High-Level Architecture

```text
User
 ↓
React Frontend
 ↓
Express Backend API
 ↓
 ├── MongoDB Atlas
 ├── Pinecone Vector Database
 └── Gemini API


3. Main Responsibilities
Frontend

The frontend is responsible for:

Displaying the user interface
Handling navigation
Sending API requests
Managing authentication state
Uploading documents
Displaying workspace data
Displaying chat messages
Showing AI answers and sources

The frontend does not process documents or call the AI provider directly.

Backend

The backend is responsible for:

User registration and login
JWT authentication
Workspace management
Document upload handling
PDF text extraction
Text chunking
Embedding generation
Vector storage
Semantic search
AI response generation
Chat history storage
API validation and error handling

The backend acts as the main control layer of the application.

MongoDB

MongoDB stores normal application data, including:

Users
Workspaces
Documents
Conversations
Messages

MongoDB does not store vector embeddings.

Pinecone

Pinecone stores vector embeddings generated from document chunks.

Each vector includes metadata such as:

User ID
Workspace ID
Document ID
Document name
Chunk text
Chunk index

Pinecone is used for semantic search.

Gemini API

Gemini is used for:

Generating embeddings
Generating AI answers based on retrieved document context

The application uses Gemini through a backend service layer, not directly from the frontend.

4. Data Flow: User Authentication
User submits login/register form
 ↓
Frontend sends request to backend
 ↓
Backend validates input
 ↓
Backend checks or creates user in MongoDB
 ↓
Backend generates JWT token
 ↓
Frontend stores token
 ↓
Token is sent with protected API requests
5. Data Flow: Document Upload
User uploads PDF
 ↓
Frontend sends file to backend
 ↓
Backend validates file type
 ↓
Backend stores temporary file
 ↓
Backend extracts text from PDF
 ↓
Backend splits text into chunks
 ↓
Backend generates embeddings with Gemini
 ↓
Backend stores vectors in Pinecone
 ↓
Backend stores document metadata in MongoDB
 ↓
Frontend shows document status as completed
6. Data Flow: Asking a Question
User asks a question
 ↓
Frontend sends question and workspace ID to backend
 ↓
Backend generates embedding for the question
 ↓
Backend searches similar chunks in Pinecone
 ↓
Backend receives relevant document chunks
 ↓
Backend builds a prompt using retrieved context
 ↓
Gemini generates a source-grounded answer
 ↓
Backend saves user message and AI answer in MongoDB
 ↓
Frontend displays answer and sources
7. Backend Layered Structure

The backend will be organized into layers:

routes
 ↓
controllers
 ↓
services
 ↓
models / external providers
Routes

Routes define the API endpoints.

Example:

POST /api/auth/login
POST /api/documents/upload
POST /api/chat/ask
Controllers

Controllers receive requests and responses.

They should be small and should not contain complex business logic.

Services

Services contain the main business logic.

Examples:

authService
workspaceService
documentService
ragService
embeddingService
vectorService
chatService
Models

Models define MongoDB schemas using Mongoose.

Examples:

User
Workspace
Document
Conversation
Message
8. AI Provider Architecture

The AI layer will use a provider-based architecture.

This means the application will not depend directly on Gemini everywhere in the code.

Instead, the backend will use an abstraction such as:

aiProvider.generateEmbedding(text)
aiProvider.generateAnswer(prompt)

The first implementation will use Gemini.

In the future, the provider can be replaced with:

OpenAI
Claude
Ollama
Local models

This makes the system easier to maintain and extend.

9. Security Decisions

The system will follow these security rules:

Passwords are hashed before being stored.
JWT tokens are required for protected routes.
Users can only access their own workspaces.
Users can only query their own documents.
API keys are stored in environment variables.
AI provider keys are never exposed to the frontend.
Uploaded files are validated before processing.

10. Environment Variables

The backend will use environment variables for sensitive configuration.

Expected variables:

PORT=5000
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX_NAME=
CLIENT_URL=http://localhost:5173

These values will be stored in .env, which must not be committed to GitHub.

11. Deployment Architecture

The project will be deployed using:

Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas
Vectors  → Pinecone
AI       → Gemini API

Deployment flow:

GitHub repository
 ↓
Vercel deploys frontend
 ↓
Render deploys backend
 ↓
Backend connects to MongoDB Atlas, Pinecone, and Gemini
12. Local Development Architecture

During local development:

Frontend runs on http://localhost:5173
Backend runs on http://localhost:5000
MongoDB runs on MongoDB Atlas
Pinecone runs in the cloud
Gemini runs through API calls

The frontend communicates with the backend using Axios.

The backend communicates with external services using secure API keys.

13. Why This Architecture Is Professional

This architecture demonstrates:

Separation of concerns
Scalable backend structure
Secure API key handling
Full-stack development
AI provider abstraction
RAG implementation
Vector search integration
Real-world deployment planning
Maintainable project organization
14. Architecture Summary

SourceMind AI is designed as a modern full-stack AI application.

The frontend provides a clean user experience.

The backend manages all business logic and security.

MongoDB stores application data.

Pinecone stores semantic vectors.

Gemini provides embeddings and AI-generated answers.

Together, these components create a source-grounded AI knowledge workspace.
```
