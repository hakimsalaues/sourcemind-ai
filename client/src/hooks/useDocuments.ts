import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentService } from "../services/documentService";

export const documentKeys = {
  byWorkspace: (workspaceId: string) =>
    ["documents", "workspace", workspaceId] as const,
};

export const useDocuments = (workspaceId?: string) => {
  return useQuery({
    queryKey: documentKeys.byWorkspace(workspaceId || ""),
    queryFn: () => documentService.getByWorkspace(workspaceId!),
    enabled: Boolean(workspaceId),
  });
};

export const useUploadDocument = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => documentService.upload(workspaceId, file),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: documentKeys.byWorkspace(workspaceId),
      });
    },
  });
};

export const useDeleteDocument = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => documentService.remove(documentId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: documentKeys.byWorkspace(workspaceId),
      });
    },
  });
};
