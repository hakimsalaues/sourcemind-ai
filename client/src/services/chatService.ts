import { api } from "./api";
import type {
  AskQuestionInput,
  AskQuestionResult,
  ChatConversation,
  ChatMessage,
} from "../types/chat";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

type ConversationsPayload =
  | ChatConversation[]
  | {
      conversations: ChatConversation[];
    };

type MessagesPayload =
  | ChatMessage[]
  | {
      messages: ChatMessage[];
    };

type AskQuestionPayload =
  | AskQuestionResult
  | {
      result: AskQuestionResult;
    };

const extractConversations = (
  payload: ConversationsPayload,
): ChatConversation[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.conversations;
};

const extractMessages = (payload: MessagesPayload): ChatMessage[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.messages;
};

const extractAskResult = (payload: AskQuestionPayload): AskQuestionResult => {
  if ("result" in payload) {
    return payload.result;
  }

  return payload;
};

export const chatService = {
  async getConversations(workspaceId: string): Promise<ChatConversation[]> {
    const response = await api.get<ApiResponse<ConversationsPayload>>(
      `/chat/conversations/${workspaceId}`,
    );

    return extractConversations(response.data.data);
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const response = await api.get<ApiResponse<MessagesPayload>>(
      `/chat/messages/${conversationId}`,
    );

    return extractMessages(response.data.data);
  },

  async askQuestion(
    workspaceId: string,
    input: AskQuestionInput,
  ): Promise<AskQuestionResult> {
    const response = await api.post<ApiResponse<AskQuestionPayload>>(
      "/chat/ask",
      {
        workspaceId,
        question: input.question,
        conversationId: input.conversationId,
      },
    );

    return extractAskResult(response.data.data);
  },
};
