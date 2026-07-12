import { api } from "./api";
import type { DocumentRecord } from "../types/document";

type DocumentsPayload =
  | DocumentRecord[]
  | {
      documents: DocumentRecord[];
    };

type DocumentPayload =
  | DocumentRecord
  | {
      document: DocumentRecord;
    };

type DocumentsResponse = {
  success: boolean;
  data: DocumentsPayload;
  message: string;
};

type DocumentResponse = {
  success: boolean;
  data: DocumentPayload;
  message: string;
};

const extractDocument = (payload: DocumentPayload): DocumentRecord => {
  if ("document" in payload) {
    return payload.document;
  }

  return payload;
};

export const documentService = {
  async getByWorkspace(workspaceId: string): Promise<DocumentRecord[]> {
    const response = await api.get<DocumentsResponse>(
      `/documents/workspace/${workspaceId}`,
    );

    const payload = response.data.data;

    if (Array.isArray(payload)) {
      return payload;
    }

    return payload.documents;
  },

  async upload(workspaceId: string, file: File): Promise<DocumentRecord> {
    const formData = new FormData();

    formData.append("workspaceId", workspaceId);
    formData.append("file", file);

    const response = await api.post<DocumentResponse>(
      "/documents/upload",
      formData,
    );

    return extractDocument(response.data.data);
  },

  async remove(documentId: string): Promise<void> {
    await api.delete(`/documents/${documentId}`);
  },
};
