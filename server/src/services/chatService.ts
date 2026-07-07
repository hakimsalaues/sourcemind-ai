import { Types } from "mongoose";
import { Workspace } from "../models/Workspace";
import { Conversation } from "../models/Conversation";
import { Message, MessageSource } from "../models/Message";
import { AppError } from "../utils/AppError";
import { embeddingService } from "./embeddingService";
import { vectorService } from "./vectorService";
import { aiService } from "./aiService";

type AskQuestionInput = {
  workspaceId: string;
  userId: string;
  question: string;
  conversationId?: string;
};

const validateObjectId = (id: string, entity = "Resource") => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(`${entity} not found`, 404);
  }
};

const createTitleFromQuestion = (question: string) => {
  return question.length > 50 ? `${question.slice(0, 50)}...` : question;
};

export const chatService = {
  async askQuestion({
    workspaceId,
    userId,
    question,
    conversationId,
  }: AskQuestionInput) {
    if (!question) {
      throw new AppError("Question is required", 400);
    }

    validateObjectId(workspaceId, "Workspace");

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    let conversation;

    if (conversationId) {
      validateObjectId(conversationId, "Conversation");

      conversation = await Conversation.findOne({
        _id: conversationId,
        workspaceId,
        userId,
      });

      if (!conversation) {
        throw new AppError("Conversation not found", 404);
      }
    } else {
      conversation = await Conversation.create({
        workspaceId,
        userId,
        title: createTitleFromQuestion(question),
      });
    }

    await Message.create({
      conversationId: conversation._id,
      userId,
      role: "user",
      content: question,
      sources: [],
    });

    const questionEmbedding =
      await embeddingService.generateEmbedding(question);

    const chunks = await vectorService.searchSimilarChunks({
      embedding: questionEmbedding,
      userId,
      workspaceId,
      topK: 5,
    });

    const answer = await aiService.generateAnswer(question, chunks);

    const sources: MessageSource[] = chunks.map((chunk) => ({
      documentId: chunk.documentId,
      documentName: chunk.documentName,
      chunkIndex: chunk.chunkIndex,
      textPreview:
        chunk.text.length > 180 ? `${chunk.text.slice(0, 180)}...` : chunk.text,
      score: chunk.score,
    }));

    await Message.create({
      conversationId: conversation._id,
      userId,
      role: "assistant",
      content: answer,
      sources,
    });

    return {
      conversationId: conversation._id.toString(),
      answer,
      sources,
    };
  },

  async getWorkspaceConversations(workspaceId: string, userId: string) {
    validateObjectId(workspaceId, "Workspace");

    const conversations = await Conversation.find({
      workspaceId,
      userId,
    }).sort({ createdAt: -1 });

    return conversations;
  },

  async getConversationMessages(conversationId: string, userId: string) {
    validateObjectId(conversationId, "Conversation");

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    const messages = await Message.find({
      conversationId,
      userId,
    }).sort({ createdAt: 1 });

    return messages;
  },
};
