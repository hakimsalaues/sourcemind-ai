import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { SimilarChunk } from "./vectorService";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

const buildPrompt = (question: string, chunks: SimilarChunk[]) => {
  const context = chunks
    .map((chunk, index) => {
      return `[Source ${index + 1}]
Document: ${chunk.documentName}
Chunk: ${chunk.chunkIndex}
Content:
${chunk.text}`;
    })
    .join("\n\n");

  return `
You are SourceMind AI, an assistant that answers questions using only the provided document context.

Rules:
- Use only the provided context.
- If the answer is not in the context, say: "I could not find enough information in the uploaded documents to answer this question."
- Do not invent facts.
- Be clear and concise.
- Answer in the same language as the user's question.

Context:
${context}

User question:
${question}
`;
};

export const aiService = {
  async generateAnswer(question: string, chunks: SimilarChunk[]) {
    if (!env.geminiApiKey) {
      throw new AppError("GEMINI_API_KEY is not configured", 500);
    }

    if (chunks.length === 0) {
      return "I could not find enough information in the uploaded documents to answer this question.";
    }

    const prompt = buildPrompt(question, chunks);

    const response = await ai.models.generateContent({
      model: env.geminiChatModel,
      contents: prompt,
    });

    const answer = response.text;

    if (!answer) {
      throw new AppError("Failed to generate AI answer", 500);
    }

    return answer;
  },
};
