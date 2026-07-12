import { api } from "./api";
import type { CreateWorkspaceInput, Workspace } from "../types/workspace";

type WorkspacesPayload =
  | Workspace[]
  | {
      workspaces: Workspace[];
    };

type WorkspacePayload =
  | Workspace
  | {
      workspace: Workspace;
    };

type WorkspacesResponse = {
  success: boolean;
  data: WorkspacesPayload;
  message: string;
};

type WorkspaceResponse = {
  success: boolean;
  data: WorkspacePayload;
  message: string;
};

const extractWorkspace = (payload: WorkspacePayload): Workspace => {
  if ("workspace" in payload) {
    return payload.workspace;
  }

  return payload;
};

export const workspaceService = {
  async getAll(): Promise<Workspace[]> {
    const response = await api.get<WorkspacesResponse>("/workspaces");
    const payload = response.data.data;

    if (Array.isArray(payload)) {
      return payload;
    }

    return payload.workspaces;
  },

  async getById(workspaceId: string): Promise<Workspace> {
    const response = await api.get<WorkspaceResponse>(
      `/workspaces/${workspaceId}`,
    );

    return extractWorkspace(response.data.data);
  },

  async create(input: CreateWorkspaceInput): Promise<Workspace> {
    const response = await api.post<WorkspaceResponse>("/workspaces", input);

    return extractWorkspace(response.data.data);
  },

  async remove(workspaceId: string): Promise<void> {
    await api.delete(`/workspaces/${workspaceId}`);
  },
};
