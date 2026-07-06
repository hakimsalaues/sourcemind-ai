# SourceMind AI — Database Models

## 1. Database Overview

SourceMind AI uses MongoDB as the main application database.

MongoDB stores application data such as users, workspaces, documents, conversations, and messages.

Vector embeddings are not stored in MongoDB. They are stored in Pinecone.

MongoDB stores metadata and relational references between entities.

## 2. Main Collections

The MVP will use five main collections:

1. Users
2. Workspaces
3. Documents
4. Conversations
5. Messages

## 3. User Model

The User model stores registered users.

| Field        | Type   | Required | Description           |
| ------------ | ------ | -------- | --------------------- |
| name         | String | Yes      | User full name        |
| email        | String | Yes      | Unique email address  |
| passwordHash | String | Yes      | Hashed user password  |
| createdAt    | Date   | Yes      | Account creation date |
| updatedAt    | Date   | Yes      | Last update date      |

### Notes

- Passwords must never be stored as plain text.
- The email field must be unique.
- Authentication will use JWT.

## 4. Workspace Model

The Workspace model represents a private knowledge space created by a user.

A workspace can contain multiple documents and conversations.

| Field       | Type     | Required | Description                                  |
| ----------- | -------- | -------- | -------------------------------------------- |
| name        | String   | Yes      | Workspace name                               |
| description | String   | No       | Optional workspace description               |
| ownerId     | ObjectId | Yes      | Reference to the user who owns the workspace |
| createdAt   | Date     | Yes      | Workspace creation date                      |
| updatedAt   | Date     | Yes      | Last update date                             |

### Example

A user could create workspaces like:

- Resume Research
- Company Documents
- Study Materials
- Technical Documentation

## 5. Document Model

The Document model stores metadata about uploaded files.

The actual document chunks are stored as vectors in Pinecone.

| Field        | Type     | Required | Description                       |
| ------------ | -------- | -------- | --------------------------------- |
| workspaceId  | ObjectId | Yes      | Reference to the workspace        |
| userId       | ObjectId | Yes      | Reference to the document owner   |
| originalName | String   | Yes      | Original uploaded file name       |
| mimeType     | String   | Yes      | File type                         |
| size         | Number   | Yes      | File size in bytes                |
| status       | String   | Yes      | Processing status                 |
| chunkCount   | Number   | No       | Number of chunks generated        |
| errorMessage | String   | No       | Error message if processing fails |
| createdAt    | Date     | Yes      | Upload date                       |
| updatedAt    | Date     | Yes      | Last update date                  |

### Document Status Values

| Status     | Meaning                                              |
| ---------- | ---------------------------------------------------- |
| pending    | File was uploaded but processing has not started     |
| processing | Text extraction and embedding generation are running |
| completed  | Document was processed successfully                  |
| failed     | Document processing failed                           |

### Notes

The Document model does not store the full vector data.

Instead, Pinecone stores vectors with metadata such as:

- userId
- workspaceId
- documentId
- documentName
- chunkIndex
- chunkText

## 6. Conversation Model

The Conversation model groups chat messages inside a workspace.

| Field       | Type     | Required | Description            |
| ----------- | -------- | -------- | ---------------------- |
| workspaceId | ObjectId | Yes      | Reference to workspace |
| userId      | ObjectId | Yes      | Reference to user      |
| title       | String   | Yes      | Conversation title     |
| createdAt   | Date     | Yes      | Creation date          |
| updatedAt   | Date     | Yes      | Last update date       |

### Notes

A conversation belongs to one workspace and one user.

The title can be automatically generated from the first user question.

## 7. Message Model

The Message model stores user and assistant messages.

| Field          | Type     | Required | Description                     |
| -------------- | -------- | -------- | ------------------------------- |
| conversationId | ObjectId | Yes      | Reference to conversation       |
| userId         | ObjectId | Yes      | Reference to user               |
| role           | String   | Yes      | Message role: user or assistant |
| content        | String   | Yes      | Message content                 |
| sources        | Array    | No       | Sources used for AI answers     |
| createdAt      | Date     | Yes      | Message creation date           |

## 8. Source Object Structure

Assistant messages can include sources.

Each source represents a document chunk retrieved from Pinecone.

| Field        | Type   | Description                          |
| ------------ | ------ | ------------------------------------ |
| documentId   | String | Related document ID                  |
| documentName | String | Original document name               |
| chunkIndex   | Number | Chunk position inside the document   |
| textPreview  | String | Short preview of the retrieved chunk |
| score        | Number | Similarity score from vector search  |

## 9. Relationships

The data relationships are:

User → Workspaces  
One user can have many workspaces.

Workspace → Documents  
One workspace can have many documents.

Workspace → Conversations  
One workspace can have many conversations.

Conversation → Messages  
One conversation can have many messages.

Document → Pinecone Vectors  
One document can generate many vectors.

## 10. Ownership and Access Control

Every protected resource must be connected to a user.

This means:

- A user can only access their own workspaces.
- A user can only upload documents to their own workspaces.
- A user can only ask questions inside their own workspaces.
- A user can only view their own conversations and messages.

This prevents users from accessing other users' private data.

## 11. Why MongoDB?

MongoDB is a good fit for this project because:

- It works well with JavaScript and TypeScript.
- It is flexible for evolving data structures.
- It integrates well with Mongoose.
- It is suitable for user-generated content.
- MongoDB Atlas provides a free cloud database for deployment.

## 12. Why Not Store Embeddings in MongoDB?

Embeddings are high-dimensional vectors.

MongoDB can store arrays, but vector search is better handled by a specialized vector database.

Pinecone is used because it is designed for:

- Vector storage
- Semantic search
- Similarity scoring
- Metadata filtering
- RAG applications

## 13. MVP Data Design Summary

The MVP database design focuses on:

- Clean ownership rules
- Simple relationships
- Clear document processing status
- Chat history persistence
- Separation between application data and vector data

This structure keeps the system understandable, secure, and scalable.
