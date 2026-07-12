import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  useDeleteDocument,
  useDocuments,
  useUploadDocument,
} from "../hooks/useDocuments";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { getDocumentId, type DocumentStatus } from "../types/document";

type DocumentsPanelProps = {
  workspaceId: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formatFileSize = (bytes: number) => {
  if (!bytes) {
    return "Unknown size";
  }

  const megabytes = bytes / (1024 * 1024);

  if (megabytes >= 1) {
    return `${megabytes.toFixed(2)} MB`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
};

const getStatusLabel = (status: DocumentStatus) => {
  const labels: Record<DocumentStatus, string> = {
    pending: "Pending",
    processing: "Processing",
    completed: "Ready",
    failed: "Failed",
  };

  return labels[status];
};

const getStatusClasses = (status: DocumentStatus) => {
  const classes: Record<DocumentStatus, string> = {
    pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    processing: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    failed: "border-red-500/30 bg-red-500/10 text-red-300",
  };

  return classes[status];
};

export const DocumentsPanel = ({ workspaceId }: DocumentsPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentsQuery = useDocuments(workspaceId);

  const uploadMutation = useUploadDocument(workspaceId);

  const deleteMutation = useDeleteDocument(workspaceId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [validationError, setValidationError] = useState("");

  const [uploadError, setUploadError] = useState("");

  const [deleteError, setDeleteError] = useState("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    setValidationError("");
    setUploadError("");
    setDeleteError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setSelectedFile(null);
      setValidationError("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setValidationError("The PDF must be smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setValidationError("Select a PDF before uploading.");
      return;
    }

    setValidationError("");
    setUploadError("");
    setDeleteError("");

    try {
      await uploadMutation.mutateAsync(selectedFile);

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setUploadError(
        getApiErrorMessage(error, "Unable to upload and process the document."),
      );
    }
  };

  const handleDeleteDocument = async (
    documentId: string,
    documentName: string,
  ) => {
    const confirmed = window.confirm(
      `Delete "${documentName}"? The PDF and its searchable AI data will be permanently removed.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteError("");
    setUploadError("");
    setValidationError("");

    try {
      await deleteMutation.mutateAsync(documentId);
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(error, "Unable to delete the document."),
      );
    }
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
          Knowledge base
        </p>

        <h2 className="mt-2 text-2xl font-semibold">Documents</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Upload PDFs to make their content available to SourceMind.
        </p>
      </div>

      <form
        onSubmit={handleUpload}
        className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-5"
      >
        <label
          htmlFor="document-file"
          className="block text-sm font-medium text-slate-300"
        >
          Select PDF
        </label>

        <input
          ref={fileInputRef}
          id="document-file"
          type="file"
          accept=".pdf,application/pdf"
          disabled={uploadMutation.isPending}
          onChange={handleFileChange}
          className="mt-3 block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"
        />

        {selectedFile && (
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">
              {selectedFile.name}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        )}

        {validationError && (
          <p className="mt-4 text-sm text-red-300">{validationError}</p>
        )}

        {uploadError && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {uploadError}
          </p>
        )}

        <button
          type="submit"
          disabled={!selectedFile || uploadMutation.isPending}
          className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploadMutation.isPending
            ? "Processing document..."
            : "Upload document"}
        </button>

        <p className="mt-3 text-center text-xs text-slate-500">
          PDF only · Maximum size 10 MB
        </p>
      </form>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Uploaded documents</h3>

          {documentsQuery.isSuccess && (
            <span className="text-sm text-slate-500">
              {documentsQuery.data.length}
            </span>
          )}
        </div>

        {deleteError && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {deleteError}
          </p>
        )}

        {documentsQuery.isPending && (
          <p className="mt-5 text-sm text-slate-400">Loading documents...</p>
        )}

        {documentsQuery.isError && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">
              {getApiErrorMessage(
                documentsQuery.error,
                "Unable to load documents.",
              )}
            </p>

            <button
              type="button"
              onClick={() => documentsQuery.refetch()}
              className="mt-3 text-sm font-semibold text-red-200 underline"
            >
              Try again
            </button>
          </div>
        )}

        {documentsQuery.isSuccess && documentsQuery.data.length === 0 && (
          <div className="mt-5 rounded-xl border border-dashed border-slate-700 px-5 py-8 text-center">
            <p className="font-medium">No documents uploaded</p>

            <p className="mt-2 text-sm text-slate-400">
              Upload your first PDF to begin.
            </p>
          </div>
        )}

        {documentsQuery.isSuccess && documentsQuery.data.length > 0 && (
          <div className="mt-5 space-y-3">
            {documentsQuery.data.map((document) => {
              const documentId = getDocumentId(document);

              const isDeleting =
                deleteMutation.isPending &&
                deleteMutation.variables === documentId;

              return (
                <div
                  key={documentId}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {document.originalName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatFileSize(document.size)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        document.status,
                      )}`}
                    >
                      {getStatusLabel(document.status)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      {document.status === "completed" && (
                        <p className="text-sm text-slate-400">
                          {document.chunkCount || 0} searchable{" "}
                          {document.chunkCount === 1 ? "chunk" : "chunks"}
                        </p>
                      )}

                      {document.status === "failed" &&
                        document.errorMessage && (
                          <p className="text-sm text-red-300">
                            {document.errorMessage}
                          </p>
                        )}
                    </div>

                    <button
                      type="button"
                      disabled={deleteMutation.isPending}
                      onClick={() =>
                        handleDeleteDocument(documentId, document.originalName)
                      }
                      className="shrink-0 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};
