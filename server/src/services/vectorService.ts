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
};
