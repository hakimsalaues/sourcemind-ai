import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || "5000",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "default_dev_secret",

  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiEmbeddingModel:
    process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-2",
  embeddingDimension: Number(process.env.EMBEDDING_DIMENSION || 768),

  pineconeApiKey: process.env.PINECONE_API_KEY || "",
  pineconeIndexName: process.env.PINECONE_INDEX_NAME || "sourcemind-ai",
  pineconeNamespace: process.env.PINECONE_NAMESPACE || "documents",
};
