export type Workspace = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateWorkspaceInput = {
  name: string;
  description?: string;
};

export const getWorkspaceId = (workspace: Workspace) => {
  return workspace._id || workspace.id || "";
};
