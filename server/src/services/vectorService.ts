import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

type ChunkVectorInput = {
  id: string;
  values: number[];
  metadata: {
    userId: string;
    workspaceId: string;
    documentId: string;
    documentName: string;
    chunkIndex: number;
    text: string;
  };
};

export type SimilarChunk = {
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
  score: number;
};

const pc = new Pinecone({
  apiKey: env.pineconeApiKey,
});

const getIndex = () => {
  if (!env.pineconeApiKey) {
    throw new AppError("PINECONE_API_KEY is not configured", 500);
  }

  return pc.index({ name: env.pineconeIndexName });
};

export const vectorService = {
  async upsertDocumentChunks(vectors: ChunkVectorInput[]) {
    if (vectors.length === 0) {
      return;
    }

    const index = getIndex();

    await index.upsert({
      namespace: env.pineconeNamespace,
      records: vectors,
    });
  },

  async searchSimilarChunks({
    embedding,
    userId,
    workspaceId,
    topK = 5,
  }: {
    embedding: number[];
    userId: string;
    workspaceId: string;
    topK?: number;
  }): Promise<SimilarChunk[]> {
    const index = getIndex();

    const result = await index.query({
      namespace: env.pineconeNamespace,
      vector: embedding,
      topK,
      includeMetadata: true,
      filter: {
        userId: { $eq: userId },
        workspaceId: { $eq: workspaceId },
      },
    });

    return (result.matches || []).map((match) => {
      const metadata = match.metadata as {
        documentId?: string;
        documentName?: string;
        chunkIndex?: number;
        text?: string;
      };

      return {
        documentId: metadata.documentId || "",
        documentName: metadata.documentName || "Unknown document",
        chunkIndex: metadata.chunkIndex || 0,
        text: metadata.text || "",
        score: match.score || 0,
      };
    });
  },
};
