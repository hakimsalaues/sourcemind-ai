import { Types } from "mongoose";
import { Workspace } from "../models/Workspace";
import { AppError } from "../utils/AppError";

type CreateWorkspaceInput = {
  name: string;
  description?: string;
  userId: string;
};

const validateObjectId = (id: string, entity = "Resource") => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(`${entity} not found`, 404);
  }
};

export const workspaceService = {
  async createWorkspace({ name, description, userId }: CreateWorkspaceInput) {
    if (!name) {
      throw new AppError("Workspace name is required", 400);
    }

    const workspace = await Workspace.create({
      name,
      description,
      ownerId: userId,
    });

    return workspace;
  },

  async getUserWorkspaces(userId: string) {
    const workspaces = await Workspace.find({ ownerId: userId }).sort({
      createdAt: -1,
    });

    return workspaces;
  },

  async getWorkspaceById(workspaceId: string, userId: string) {
    validateObjectId(workspaceId, "Workspace");

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    return workspace;
  },

  async deleteWorkspace(workspaceId: string, userId: string) {
    validateObjectId(workspaceId, "Workspace");

    const workspace = await Workspace.findOneAndDelete({
      _id: workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    return null;
  },
};
