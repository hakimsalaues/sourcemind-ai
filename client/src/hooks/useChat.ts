import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import type { AskQuestionInput } from "../types/chat";

export const chatKeys = {
  conversations: (workspaceId: string) =>
    ["chat", "conversations", workspaceId] as const,

  messages: (conversationId: string) =>
    ["chat", "messages", conversationId] as const,
};

export const useChatConversations = (workspaceId?: string) => {
  return useQuery({
    queryKey: chatKeys.conversations(workspaceId || ""),
    queryFn: () => chatService.getConversations(workspaceId!),
    enabled: Boolean(workspaceId),
  });
};

export const useChatMessages = (conversationId?: string | null) => {
  return useQuery({
    queryKey: chatKeys.messages(conversationId || ""),
    queryFn: () => chatService.getMessages(conversationId!),
    enabled: Boolean(conversationId),
  });
};

export const useAskQuestion = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AskQuestionInput) =>
      chatService.askQuestion(workspaceId, input),

    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: chatKeys.conversations(workspaceId),
        }),

        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(result.conversationId),
        }),
      ]);
    },
  });
};
