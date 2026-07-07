import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || "5000",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "",
};
