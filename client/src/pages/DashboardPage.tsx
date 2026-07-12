import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  FileText,
  Folder,
  MessageSquare,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  useCreateWorkspace,
  useDeleteWorkspace,
  useWorkspaces,
} from "../hooks/useWorkspaces";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { getWorkspaceId } from "../types/workspace";

const formatWorkspaceDate = (date?: string) => {
  if (!date) {
    return "Recently created";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const DashboardPage = () => {
  const workspacesQuery = useWorkspaces();
  const createWorkspaceMutation = useCreateWorkspace();
  const deleteWorkspaceMutation = useDeleteWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");

  const workspaces = workspacesQuery.data || [];

  const handleCreateWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setFormError("Workspace name is required.");
      return;
    }

    setFormError("");
    setActionError("");

    try {
      await createWorkspaceMutation.mutateAsync({
        name: trimmedName,
        description: description.trim() || undefined,
      });

      setName("");
      setDescription("");
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Unable to create the workspace."),
      );
    }
  };

  const handleDeleteWorkspace = async (
    workspaceId: string,
    workspaceName: string,
  ) => {
    const confirmed = window.confirm(
      `Delete "${workspaceName}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setActionError("");

    try {
      await deleteWorkspaceMutation.mutateAsync(workspaceId);
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, "Unable to delete the workspace."),
      );
    }
  };

  return (
    <main className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-slate-800 pb-9">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                <Sparkles size={14} />
                Dashboard
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                Knowledge workspaces
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                Create private knowledge bases, upload PDF documents, and
                receive source-grounded answers.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Folder size={21} />
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {workspacesQuery.isPending ? "—" : workspaces.length}
                </p>

                <p className="text-xs text-slate-500">Total workspaces</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <Folder size={19} />
            </div>

            <h2 className="mt-4 font-semibold">Organized knowledge</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Keep unrelated documents separated inside focused workspaces.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
              <FileText size={19} />
            </div>

            <h2 className="mt-4 font-semibold">PDF processing</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Documents are transformed into searchable semantic chunks.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
              <MessageSquare size={19} />
            </div>

            <h2 className="mt-4 font-semibold">Grounded answers</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Ask questions and inspect the sources used to generate each
              response.
            </p>
          </article>
        </section>

        <section className="mt-8 grid items-start gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
          <form
            onSubmit={handleCreateWorkspace}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10 xl:sticky xl:top-24"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                <Plus size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Create workspace</h2>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Start a separate knowledge base for related documents.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <label
                htmlFor="workspace-name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Workspace name
              </label>

              <input
                id="workspace-name"
                type="text"
                required
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Product research"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="workspace-description"
                  className="text-sm font-medium text-slate-300"
                >
                  Description
                </label>

                <span className="text-xs text-slate-600">
                  {description.length}/300
                </span>
              </div>

              <textarea
                id="workspace-description"
                rows={4}
                maxLength={300}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Documents, manuals, and notes for this project."
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            {formError && (
              <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={createWorkspaceMutation.isPending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />

              {createWorkspaceMutation.isPending
                ? "Creating..."
                : "Create workspace"}
            </button>
          </form>

          <div className="min-w-0">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                  Library
                </p>

                <h2 className="mt-2 text-2xl font-semibold">Your workspaces</h2>

                <p className="mt-2 text-sm text-slate-400">
                  Open a workspace to manage its documents and conversations.
                </p>
              </div>

              {workspacesQuery.isSuccess && (
                <p className="text-sm text-slate-500">
                  {workspaces.length}{" "}
                  {workspaces.length === 1 ? "workspace" : "workspaces"}
                </p>
              )}
            </div>

            {actionError && (
              <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {actionError}
              </p>
            )}

            {workspacesQuery.isPending && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-56 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
                  />
                ))}
              </div>
            )}

            {workspacesQuery.isError && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
                <p className="text-red-300">
                  {getApiErrorMessage(
                    workspacesQuery.error,
                    "Unable to load workspaces.",
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => workspacesQuery.refetch()}
                  className="mt-4 flex items-center gap-2 rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-200"
                >
                  <RefreshCw size={16} />
                  Try again
                </button>
              </div>
            )}

            {workspacesQuery.isSuccess && workspaces.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                  <Folder size={25} />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No workspaces yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  Create your first workspace to upload documents and begin
                  asking questions.
                </p>
              </div>
            )}

            {workspacesQuery.isSuccess && workspaces.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {workspaces.map((workspace) => {
                  const workspaceId = getWorkspaceId(workspace);

                  const isDeleting =
                    deleteWorkspaceMutation.isPending &&
                    deleteWorkspaceMutation.variables === workspaceId;

                  return (
                    <article
                      key={workspaceId}
                      className="group flex min-h-60 flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-950/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-cyan-300 transition group-hover:border-cyan-400/30">
                          <Folder size={21} />
                        </div>

                        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-500">
                          {formatWorkspaceDate(workspace.createdAt)}
                        </span>
                      </div>

                      <div className="mt-5 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                          Workspace
                        </p>

                        <h3 className="mt-2 text-xl font-semibold">
                          {workspace.name}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                          {workspace.description || "No description provided."}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-3 border-t border-slate-800 pt-5">
                        <Link
                          to={`/workspaces/${workspaceId}`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                        >
                          Open workspace
                          <ArrowUpRight size={16} />
                        </Link>

                        <button
                          type="button"
                          aria-label={`Delete ${workspace.name}`}
                          disabled={deleteWorkspaceMutation.isPending}
                          onClick={() =>
                            handleDeleteWorkspace(workspaceId, workspace.name)
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/30 text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <RefreshCw size={17} className="animate-spin" />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
