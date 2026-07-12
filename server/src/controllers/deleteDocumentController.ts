import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware";
import { deleteDocumentById } from "../services/documentDeletionService";
import { AppError } from "../utils/AppError";

const getParamAsString = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export const deleteDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized.", 401);
    }

    const documentId = getParamAsString(req.params.documentId);

    const deletedDocument = await deleteDocumentById(documentId, userId);

    return res.status(200).json({
      success: true,
      data: deletedDocument,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
