import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { documentService } from "../services/documentService";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

const getUserId = (req: AuthRequest) => {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401);
  }

  return req.user.id;
};

const getParamAsString = (
  value: string | string[] | undefined,
  name: string,
) => {
  if (!value || Array.isArray(value)) {
    throw new AppError(`${name} is required`, 400);
  }

  return value;
};

export const uploadDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getUserId(req);

    const workspaceId = req.body.workspaceId;

    if (!workspaceId) {
      throw new AppError("Workspace ID is required", 400);
    }

    const document = await documentService.uploadDocument({
      workspaceId,
      userId,
      file: req.file as Express.Multer.File,
    });

    sendSuccess(res, { document }, "Document uploaded successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceDocuments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const workspaceId = getParamAsString(
      req.params.workspaceId,
      "Workspace ID",
    );

    const documents = await documentService.getWorkspaceDocuments(
      workspaceId,
      userId,
    );

    sendSuccess(res, { documents }, "Documents retrieved successfully");
  } catch (error) {
    next(error);
  }
};
