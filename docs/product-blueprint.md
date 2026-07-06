# SourceMind AI — Product Blueprint

## 1. Project Overview

SourceMind AI is a full-stack AI knowledge workspace that allows users to upload documents, transform them into searchable knowledge bases, and ask questions that are answered using Retrieval-Augmented Generation (RAG).

The platform is designed to provide source-grounded AI answers, meaning the AI does not respond from general knowledge alone. Instead, it retrieves relevant document fragments and generates answers based on the uploaded content.

## 2. Problem

Many individuals, students, teams, and companies store important information inside PDFs, reports, manuals, policies, and internal documentation.

The main problems are:

- Finding specific information inside long documents is slow.
- Traditional keyword search often misses context.
- Generic AI chatbots can hallucinate or provide answers without reliable sources.
- Users need a fast way to interact with private documents while keeping answers grounded in real content.

## 3. Solution

SourceMind AI solves this by turning uploaded documents into an AI-powered knowledge base.

Users can:

- Create workspaces for different topics or projects.
- Upload PDF documents.
- Process documents into searchable chunks.
- Ask questions in natural language.
- Receive AI-generated answers based only on retrieved document context.
- See the sources used to generate each answer.
- Review previous conversations.

## 4. Target Users

The initial target users are:

- Developers researching documentation.
- Students studying long PDF materials.
- Job seekers analyzing resumes, job descriptions, and career documents.
- Small teams managing internal knowledge.
- Freelancers organizing client documentation.

## 5. Core Value Proposition

SourceMind AI helps users find trustworthy answers from their own documents faster than manual reading or basic keyword search.

Instead of asking:

> "Where is this information in the PDF?"

Users can ask:

> "What does this document say about refund policies?"

And receive an answer with sources.

## 6. MVP Scope

The MVP will include the following features:

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes

### Workspaces

- Create workspace
- View user workspaces
- Open a specific workspace
- Delete workspace

### Documents

- Upload PDF documents
- Store document metadata
- Process document text
- Split text into chunks
- Generate embeddings
- Store vectors in Pinecone
- Show processing status

### Chat

- Ask questions about workspace documents
- Retrieve relevant document chunks
- Generate AI answers using Gemini
- Display sources used
- Save conversation history
- View previous messages

## 7. Out of Scope for MVP

The first version will not include:

- Team collaboration
- Payment system
- Advanced user roles
- DOCX support
- TXT support
- Real-time collaboration
- Analytics dashboard
- Mobile app

These can be included as future improvements.

## 8. Main User Flow

1. User visits landing page.
2. User registers or logs in.
3. User enters dashboard.
4. User creates a workspace.
5. User uploads a PDF document.
6. Backend processes the document.
7. System creates embeddings and stores vectors.
8. User asks a question.
9. System retrieves relevant chunks.
10. Gemini generates a source-grounded answer.
11. User sees the answer and the sources.
12. Conversation is saved for later review.

## 9. Technical Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- Multer
- PDF parser

### AI Layer

- Gemini API for embeddings and answer generation
- Pinecone as vector database
- Provider-based architecture to allow future support for OpenAI, Claude, or Ollama

### DevOps

- Git
- GitHub
- Docker
- GitHub Actions
- Vercel for frontend deployment
- Render for backend deployment

## 10. Why RAG?

RAG stands for Retrieval-Augmented Generation.

Instead of sending an entire document to the AI model, the system retrieves only the most relevant document fragments and sends them as context.

This improves:

- Accuracy
- Cost efficiency
- Speed
- Source traceability
- Answer reliability

## 11. Key Technical Challenge

The main technical challenge is building a reliable document question-answering flow:

PDF upload  
→ text extraction  
→ chunking  
→ embedding generation  
→ vector storage  
→ semantic search  
→ AI response generation  
→ source display

This project demonstrates the ability to design and build a modern AI-powered full-stack application.

## 12. Success Criteria

The MVP is considered successful when a user can:

- Register and log in.
- Create a workspace.
- Upload a PDF.
- Wait for the document to be processed.
- Ask a question about the document.
- Receive an AI-generated answer.
- See which document chunks were used as sources.
- View chat history.

## 13. Portfolio Positioning

This project is designed to be the main portfolio project for a Full Stack Developer / AI Application Developer profile.

It demonstrates:

- Full-stack architecture
- Authentication
- REST API design
- File upload handling
- AI API integration
- Vector search
- RAG implementation
- MongoDB data modeling
- Clean project structure
- Product thinking
- Professional documentation

## 14. Resume Description Draft

Built SourceMind AI, a full-stack RAG-powered knowledge platform that enables users to upload documents, generate semantic embeddings, query private knowledge bases, and receive source-grounded AI responses using React, Node.js, TypeScript, MongoDB, Pinecone, and Gemini API.
