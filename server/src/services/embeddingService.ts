import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

export const embeddingService = {
  async generateEmbedding(text: string): Promise<number[]> {
    if (!env.geminiApiKey) {
      throw new AppError("GEMINI_API_KEY is not configured", 500);
    }

    const response = await ai.models.embedContent({
      model: env.geminiEmbeddingModel,
      contents: text,
      config: {
        outputDimensionality: env.embeddingDimension,
      },
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding || embedding.length === 0) {
      throw new AppError("Failed to generate embedding", 500);
    }

    return embedding;
  },

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      embeddings.push(embedding);
    }

    return embeddings;
  },
};
