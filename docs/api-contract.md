# SourceMind AI — API Contract

## 1. API Overview

The backend exposes a REST API used by the React frontend.

Base URL for local development:

http://localhost:5000/api

All protected routes require a JWT token sent in the Authorization header:

Authorization: Bearer <token>

## 2. Response Format

Successful responses should follow this structure:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

Error responses should follow this structure:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error if available"
}
```

## 3. Authentication Routes

### Register User

Endpoint:

POST /api/auth/register

Description:

Creates a new user account.

Request body:

```json
{
  "name": "Hakim Salaues",
  "email": "hakim@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "userId",
      "name": "Hakim Salaues",
      "email": "hakim@example.com"
    },
    "token": "jwtToken"
  },
  "message": "User registered successfully"
}
```

---

### Login User

Endpoint:

POST /api/auth/login

Description:

Authenticates a user and returns a JWT token.

Request body:

```json
{
  "email": "hakim@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "userId",
      "name": "Hakim Salaues",
      "email": "hakim@example.com"
    },
    "token": "jwtToken"
  },
  "message": "User logged in successfully"
}
```

---

### Get Current User

Endpoint:

GET /api/auth/me

Protected:

Yes

Description:

Returns the authenticated user.

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "userId",
      "name": "Hakim Salaues",
      "email": "hakim@example.com"
    }
  },
  "message": "User retrieved successfully"
}
```

## 4. Workspace Routes

### Create Workspace

Endpoint:

POST /api/workspaces

Protected:

Yes

Description:

Creates a new workspace for the authenticated user.

Request body:

```json
{
  "name": "Resume Research",
  "description": "Documents related to job applications and resume optimization"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "workspace": {
      "id": "workspaceId",
      "name": "Resume Research",
      "description": "Documents related to job applications and resume optimization",
      "ownerId": "userId",
      "createdAt": "2026-07-03T00:00:00.000Z"
    }
  },
  "message": "Workspace created successfully"
}
```

---

### Get User Workspaces

Endpoint:

GET /api/workspaces

Protected:

Yes

Description:

Returns all workspaces owned by the authenticated user.

Response:

```json
{
  "success": true,
  "data": {
    "workspaces": [
      {
        "id": "workspaceId",
        "name": "Resume Research",
        "description": "Documents related to job applications",
        "documentCount": 2,
        "createdAt": "2026-07-03T00:00:00.000Z"
      }
    ]
  },
  "message": "Workspaces retrieved successfully"
}
```

---

### Get Single Workspace

Endpoint:

GET /api/workspaces/:workspaceId

Protected:

Yes

Description:

Returns one workspace if it belongs to the authenticated user.

Response:

```json
{
  "success": true,
  "data": {
    "workspace": {
      "id": "workspaceId",
      "name": "Resume Research",
      "description": "Documents related to job applications",
      "ownerId": "userId",
      "createdAt": "2026-07-03T00:00:00.000Z"
    }
  },
  "message": "Workspace retrieved successfully"
}
```

---

### Delete Workspace

Endpoint:

DELETE /api/workspaces/:workspaceId

Protected:

Yes

Description:

Deletes a workspace owned by the authenticated user.

Response:

```json
{
  "success": true,
  "data": null,
  "message": "Workspace deleted successfully"
}
```

## 5. Document Routes

### Upload Document

Endpoint:

POST /api/documents/upload

Protected:

Yes

Content-Type:

multipart/form-data

Description:

Uploads a PDF document to a workspace and starts processing.

Form data:

```text
file: PDF file
workspaceId: workspaceId
```

Response:

```json
{
  "success": true,
  "data": {
    "document": {
      "id": "documentId",
      "workspaceId": "workspaceId",
      "originalName": "resume-guide.pdf",
      "mimeType": "application/pdf",
      "size": 250000,
      "status": "processing",
      "chunkCount": 0,
      "createdAt": "2026-07-03T00:00:00.000Z"
    }
  },
  "message": "Document uploaded and processing started"
}
```

---

### Get Workspace Documents

Endpoint:

GET /api/documents/workspace/:workspaceId

Protected:

Yes

Description:

Returns all documents inside a workspace.

Response:

```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "documentId",
        "workspaceId": "workspaceId",
        "originalName": "resume-guide.pdf",
        "status": "completed",
        "chunkCount": 18,
        "createdAt": "2026-07-03T00:00:00.000Z"
      }
    ]
  },
  "message": "Documents retrieved successfully"
}
```

---

### Get Single Document

Endpoint:

GET /api/documents/:documentId

Protected:

Yes

Description:

Returns one document if it belongs to the authenticated user.

Response:

```json
{
  "success": true,
  "data": {
    "document": {
      "id": "documentId",
      "workspaceId": "workspaceId",
      "originalName": "resume-guide.pdf",
      "status": "completed",
      "chunkCount": 18,
      "createdAt": "2026-07-03T00:00:00.000Z"
    }
  },
  "message": "Document retrieved successfully"
}
```

---

### Delete Document

Endpoint:

DELETE /api/documents/:documentId

Protected:

Yes

Description:

Deletes document metadata from MongoDB and related vectors from Pinecone.

Response:

```json
{
  "success": true,
  "data": null,
  "message": "Document deleted successfully"
}
```

## 6. Chat Routes

### Ask Question

Endpoint:

POST /api/chat/ask

Protected:

Yes

Description:

Receives a user question, performs semantic search, generates an AI answer, and saves the conversation messages.

Request body:

```json
{
  "workspaceId": "workspaceId",
  "conversationId": "conversationId optional",
  "question": "What are the main recommendations in this document?"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "conversationId": "conversationId",
    "answer": "The document recommends improving resume structure, adding measurable impact, and aligning keywords with job descriptions.",
    "sources": [
      {
        "documentId": "documentId",
        "documentName": "resume-guide.pdf",
        "chunkIndex": 3,
        "textPreview": "A strong resume should include measurable achievements...",
        "score": 0.89
      }
    ]
  },
  "message": "Answer generated successfully"
}
```

---

### Get Workspace Conversations

Endpoint:

GET /api/chat/conversations/:workspaceId

Protected:

Yes

Description:

Returns all conversations inside a workspace.

Response:

```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conversationId",
        "workspaceId": "workspaceId",
        "title": "Resume improvement questions",
        "createdAt": "2026-07-03T00:00:00.000Z"
      }
    ]
  },
  "message": "Conversations retrieved successfully"
}
```

---

### Get Conversation Messages

Endpoint:

GET /api/chat/messages/:conversationId

Protected:

Yes

Description:

Returns all messages inside a conversation.

Response:

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "messageId",
        "role": "user",
        "content": "What are the main recommendations?",
        "createdAt": "2026-07-03T00:00:00.000Z"
      },
      {
        "id": "messageId",
        "role": "assistant",
        "content": "The document recommends improving resume structure...",
        "sources": [
          {
            "documentId": "documentId",
            "documentName": "resume-guide.pdf",
            "chunkIndex": 3,
            "textPreview": "A strong resume should include measurable achievements...",
            "score": 0.89
          }
        ],
        "createdAt": "2026-07-03T00:00:00.000Z"
      }
    ]
  },
  "message": "Messages retrieved successfully"
}
```

## 7. Health Check Route

### API Health Check

Endpoint:

GET /health

Protected:

No

Description:

Checks whether the backend server is running.

Response:

```json
{
  "status": "ok",
  "message": "SourceMind AI API is running"
}
```

## 8. HTTP Status Codes

The API should use these status codes:

| Status Code | Meaning                         |
| ----------- | ------------------------------- |
| 200         | Request successful              |
| 201         | Resource created                |
| 400         | Bad request or validation error |
| 401         | Unauthorized                    |
| 403         | Forbidden                       |
| 404         | Resource not found              |
| 500         | Internal server error           |

## 9. Frontend Integration Notes

The frontend will use Axios to communicate with the backend.

The JWT token will be sent in the Authorization header for protected routes.

The frontend should handle these states:

- loading
- success
- error
- empty data
- unauthorized session

## 10. API Contract Summary

This API contract defines the communication between the frontend and backend.

It keeps development organized because the frontend can be built knowing exactly what data each backend endpoint expects and returns.
