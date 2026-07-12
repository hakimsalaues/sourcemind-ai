export type ChatSource = {
  documentId: string;
  documentName: string;
  chunkIndex: number;
  textPreview: string;
  score?: number;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  _id?: string;
  id?: string;
  conversationId: string;
  userId?: string;
  role: ChatRole;
  content: string;
  sources?: ChatSource[];
  createdAt?: string;
  updatedAt?: string;
};

export type ChatConversation = {
  _id?: string;
  id?: string;
  workspaceId: string;
  userId?: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AskQuestionInput = {
  question: string;
  conversationId?: string;
};

export type AskQuestionResult = {
  conversationId: string;
  answer: string;
  sources: ChatSource[];
};

export const getConversationId = (conversation: ChatConversation) => {
  return conversation._id || conversation.id || "";
};

export const getMessageId = (message: ChatMessage) => {
  return message._id || message.id || "";
};
