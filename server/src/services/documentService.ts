import { Types } from "mongoose";
import { DocumentModel } from "../models/Document";
import { Workspace } from "../models/Workspace";
import { AppError } from "../utils/AppError";

type CreateDocumentInput = {
  workspaceId: string;
  userId: string;
  file: Express.Multer.File;
};

const validateObjectId = (id: string, entity = "Resource") => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(`${entity} not found`, 404);
  }
};

export const documentService = {
  async uploadDocument({ workspaceId, userId, file }: CreateDocumentInput) {
    if (!file) {
      throw new AppError("PDF file is required", 400);
    }

    validateObjectId(workspaceId, "Workspace");

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    const document = await DocumentModel.create({
      workspaceId,
      userId,
      originalName: file.originalname,
      storedName: file.filename,
      filePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
      status: "pending",
      chunkCount: 0,
    });

    return document;
  },

  async getWorkspaceDocuments(workspaceId: string, userId: string) {
    validateObjectId(workspaceId, "Workspace");

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    const documents = await DocumentModel.find({
      workspaceId,
      userId,
    }).sort({ createdAt: -1 });

    return documents;
  },
};
