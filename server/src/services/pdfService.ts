import fs from "fs/promises";
import pdfParse from "pdf-parse";
import { AppError } from "../utils/AppError";

export const pdfService = {
  async extractText(filePath: string) {
    const fileBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(fileBuffer);

    const text = pdfData.text.trim();

    if (!text) {
      throw new AppError("No readable text found in PDF", 400);
    }

    return text;
  },
};
