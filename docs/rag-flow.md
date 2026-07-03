# SourceMind AI — RAG Flow

## 1. What is RAG?

RAG stands for Retrieval-Augmented Generation.

It is an AI architecture where the system first retrieves relevant information from a knowledge source and then uses that information as context to generate an answer.

In SourceMind AI, RAG allows users to ask questions about uploaded documents and receive answers based on those documents.

## 2. Why SourceMind AI Uses RAG

A normal AI chatbot can answer from general knowledge, but it may hallucinate or provide unsupported information.

SourceMind AI uses RAG because the answer should be grounded in the user's uploaded documents.

Instead of sending an entire PDF to the AI model, the system:

1. Splits the document into smaller chunks.
2. Converts those chunks into embeddings.
3. Stores the embeddings in Pinecone.
4. Retrieves only the most relevant chunks when the user asks a question.
5. Sends those chunks to Gemini as context.
6. Generates an answer based on the retrieved context.

## 3. Main RAG Components

The RAG system has five main components:

| Component         | Responsibility                            |
| ----------------- | ----------------------------------------- |
| PDF Parser        | Extracts text from uploaded PDF files     |
| Chunking Service  | Splits long text into smaller sections    |
| Embedding Service | Converts text into numerical vectors      |
| Vector Database   | Stores and searches embeddings            |
| AI Provider       | Generates answers using retrieved context |

## 4. Document Processing Flow

This flow happens when a user uploads a document.

```text
User uploads PDF
 ↓
Backend receives file
 ↓
Validate file type and size
 ↓
Create document record in MongoDB
 ↓
Set document status to processing
 ↓
Extract text from PDF
 ↓
Split text into chunks
 ↓
Generate embedding for each chunk
 ↓
Store vectors in Pinecone with metadata
 ↓
Update document status to completed
```

## 5. Question Answering Flow

This flow happens when a user asks a question.

```text
User asks question
 ↓
Backend receives question and workspaceId
 ↓
Generate embedding for the question
 ↓
Search Pinecone for similar chunks
 ↓
Retrieve top relevant chunks
 ↓
Build prompt with context
 ↓
Send prompt to Gemini
 ↓
Generate source-grounded answer
 ↓
Save user question and AI answer in MongoDB
 ↓
Return answer and sources to frontend
```

## 6. Chunking Strategy

Documents are too large to send directly to the AI model.

To solve this, SourceMind AI splits extracted text into chunks.

Initial MVP chunking strategy:

```text
Chunk size: 800–1000 characters
Overlap: 100–150 characters
```

Overlap helps preserve context between chunks.

Example:

```text
Chunk 1:
"The refund policy allows customers to request a refund within 30 days. To start the process..."

Chunk 2:
"...start the process, customers must submit a request through the support portal. Refunds are reviewed..."
```

The repeated section helps avoid losing meaning between chunks.

## 7. Embeddings Explained

An embedding is a numerical representation of text meaning.

For example:

```text
"The refund policy allows refunds within 30 days"
```

becomes a vector like:

```text
[0.023, -0.192, 0.431, ...]
```

The actual vector is much longer.

Texts with similar meanings produce similar vectors.

This allows the system to search by meaning instead of exact keywords.

## 8. Vector Storage in Pinecone

Each document chunk is stored in Pinecone as a vector.

Each vector includes metadata.

Example vector metadata:

```json
{
  "userId": "userId",
  "workspaceId": "workspaceId",
  "documentId": "documentId",
  "documentName": "refund-policy.pdf",
  "chunkIndex": 4,
  "text": "Customers can request refunds within 30 days..."
}
```

This metadata is important because it allows the app to show sources after generating an answer.

## 9. Semantic Search

When a user asks a question, the question is converted into an embedding.

Example question:

```text
"What is the refund policy?"
```

The system searches Pinecone for chunks with similar meaning.

Pinecone returns the most relevant chunks with similarity scores.

Example result:

```json
[
  {
    "documentName": "refund-policy.pdf",
    "chunkIndex": 4,
    "score": 0.91,
    "text": "Customers can request refunds within 30 days..."
  }
]
```

## 10. Prompt Construction

After retrieving relevant chunks, the backend builds a prompt for Gemini.

The prompt includes:

- System instruction
- Retrieved document context
- User question
- Rules for answering

Example prompt structure:

```text
You are SourceMind AI, an assistant that answers questions using only the provided document context.

Rules:
- Use only the provided context.
- If the answer is not in the context, say that the document does not contain enough information.
- Do not invent facts.
- Provide a clear and concise answer.

Context:
[Chunk 1]
...
[Chunk 2]
...

User Question:
What is the refund policy?
```

## 11. Source-Grounded Answer

The final answer must be connected to the retrieved sources.

Example response:

```json
{
  "answer": "The document states that customers can request a refund within 30 days by submitting a request through the support portal.",
  "sources": [
    {
      "documentName": "refund-policy.pdf",
      "chunkIndex": 4,
      "textPreview": "Customers can request refunds within 30 days...",
      "score": 0.91
    }
  ]
}
```

## 12. Handling Missing Information

If the retrieved chunks do not contain enough information, the AI should not guess.

Expected answer:

```text
I could not find enough information in the uploaded documents to answer this question.
```

This is important because the goal of SourceMind AI is reliability, not generic chatbot behavior.

## 13. RAG Error Cases

The system must handle these cases:

| Case                         | Expected Behavior                                            |
| ---------------------------- | ------------------------------------------------------------ |
| PDF has no readable text     | Mark document as failed                                      |
| Gemini API fails             | Return AI provider error                                     |
| Pinecone search fails        | Return vector search error                                   |
| No chunks found              | Tell user no relevant context was found                      |
| User asks unrelated question | Explain that the documents do not contain enough information |
| Document processing fails    | Save errorMessage in MongoDB                                 |

## 14. Why Not Send the Whole PDF to Gemini?

Sending the whole PDF is not ideal because:

- Large documents may exceed token limits.
- It is more expensive.
- It is slower.
- It may reduce answer accuracy.
- It does not scale well with multiple documents.
- It makes source tracking harder.

RAG solves this by sending only the most relevant chunks.

## 15. MVP RAG Scope

The first version will support:

- PDF upload
- Text extraction
- Basic chunking
- Gemini embeddings
- Pinecone vector storage
- Workspace-based semantic search
- AI answers with sources

The first version will not include:

- Advanced OCR
- DOCX parsing
- Multiple embedding providers
- Fine-tuning
- Local LLMs
- Advanced reranking

## 16. Interview Explanation

A strong explanation for interviews:

"I implemented a RAG pipeline where uploaded PDFs are parsed, split into chunks, converted into embeddings, and stored in Pinecone. When a user asks a question, the backend embeds the question, retrieves the most relevant chunks using semantic search, and sends only that context to Gemini to generate a source-grounded answer."

## 17. RAG Flow Summary

SourceMind AI uses RAG to transform static documents into interactive knowledge bases.

The system combines:

- Document processing
- Embeddings
- Vector search
- AI generation
- Source tracking

This allows users to ask questions and receive reliable answers based on their own uploaded documents.
