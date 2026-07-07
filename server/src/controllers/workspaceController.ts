import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { workspaceService } from "../services/workspaceService";
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

export const createWorkspace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getUserId(req);

    const workspace = await workspaceService.createWorkspace({
      name: req.body.name,
      description: req.body.description,
      userId,
    });

    sendSuccess(res, { workspace }, "Workspace created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getWorkspaces = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getUserId(req);

    const workspaces = await workspaceService.getUserWorkspaces(userId);

    sendSuccess(res, { workspaces }, "Workspaces retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getWorkspace = async (
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

    const workspace = await workspaceService.getWorkspaceById(
      workspaceId,
      userId,
    );

    sendSuccess(res, { workspace }, "Workspace retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (
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

    await workspaceService.deleteWorkspace(workspaceId, userId);
    sendSuccess(res, null, "Workspace deleted successfully");
  } catch (error) {
    next(error);
  }
};
