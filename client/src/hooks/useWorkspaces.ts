import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "../services/workspaceService";
import type { CreateWorkspaceInput } from "../types/workspace";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  detail: (workspaceId: string) => ["workspaces", workspaceId] as const,
};

export const useWorkspaces = () => {
  return useQuery({
    queryKey: workspaceKeys.all,
    queryFn: workspaceService.getAll,
  });
};

export const useWorkspace = (workspaceId?: string) => {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId || ""),
    queryFn: () => workspaceService.getById(workspaceId!),
    enabled: Boolean(workspaceId),
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWorkspaceInput) => workspaceService.create(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workspaceKeys.all,
      });
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => workspaceService.remove(workspaceId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workspaceKeys.all,
      });
    },
  });
};
