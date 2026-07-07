import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { chatService } from "../services/chatService";
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

export const askQuestion = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getUserId(req);

    const result = await chatService.askQuestion({
      workspaceId: req.body.workspaceId,
      conversationId: req.body.conversationId,
      question: req.body.question,
      userId,
    });

    sendSuccess(res, result, "Answer generated successfully");
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceConversations = async (
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

    const conversations = await chatService.getWorkspaceConversations(
      workspaceId,
      userId,
    );

    sendSuccess(res, { conversations }, "Conversations retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getConversationMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const conversationId = getParamAsString(
      req.params.conversationId,
      "Conversation ID",
    );

    const messages = await chatService.getConversationMessages(
      conversationId,
      userId,
    );

    sendSuccess(res, { messages }, "Messages retrieved successfully");
  } catch (error) {
    next(error);
  }
};
