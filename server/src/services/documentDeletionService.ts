import { promises as fs } from "node:fs";
import path from "node:path";
import mongoose, { isValidObjectId } from "mongoose";
import { Pinecone } from "@pinecone-database/pinecone";
import "../models/Document";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

const pinecone = new Pinecone({
  apiKey: env.pineconeApiKey,
});

const pineconeIndex = pinecone.index({
  name: env.pineconeIndexName,
});

const getDocumentModel = () => {
  const documentModel = mongoose.models.Document;

  if (!documentModel) {
    throw new AppError("Document model is not registered.", 500);
  }

  return documentModel;
};

const deleteDocumentVectors = async (
  documentId: string,
  userId: string,
): Promise<void> => {
  const namespace = pineconeIndex.namespace(env.pineconeNamespace);

  await namespace.deleteMany({
    filter: {
      documentId: {
        $eq: documentId,
      },
      userId: {
        $eq: userId,
      },
    },
  });
};

export const deleteDocumentById = async (
  documentId: string,
  userId: string,
) => {
  if (!isValidObjectId(documentId)) {
    throw new AppError("Invalid document ID.", 400);
  }

  const DocumentModel = getDocumentModel();

  const document = await DocumentModel.findOne({
    _id: documentId,
    userId,
  });

  if (!document) {
    throw new AppError("Document not found.", 404);
  }

  const documentObjectId = document._id.toString();

  await deleteDocumentVectors(documentObjectId, userId);

  try {
    const absoluteFilePath = path.resolve(document.filePath);

    await fs.unlink(absoluteFilePath);
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;

    if (fileError.code !== "ENOENT") {
      throw new AppError("The stored PDF could not be deleted.", 500);
    }
  }

  await document.deleteOne();

  return {
    id: documentObjectId,
    originalName: document.originalName,
  };
};
