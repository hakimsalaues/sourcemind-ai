export type DocumentStatus = "pending" | "processing" | "completed" | "failed";

export type DocumentRecord = {
  _id?: string;
  id?: string;
  workspaceId: string;
  userId?: string;
  originalName: string;
  storedName?: string;
  mimeType?: string;
  size: number;
  status: DocumentStatus;
  chunkCount?: number;
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const getDocumentId = (document: DocumentRecord) => {
  return document._id || document.id || "";
};
