import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useCreateWorkspace,
  useDeleteWorkspace,
  useWorkspaces,
} from "../hooks/useWorkspaces";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { getWorkspaceId } from "../types/workspace";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const workspacesQuery = useWorkspaces();
  const createWorkspaceMutation = useCreateWorkspace();
  const deleteWorkspaceMutation = useDeleteWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

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
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-300">SourceMind AI</p>

            <h1 className="mt-2 text-3xl font-bold">
              Welcome back, {user?.name}
            </h1>

            <p className="mt-2 text-slate-400">
              Build knowledge bases and chat with your documents.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 px-5 py-2.5 font-medium transition hover:bg-slate-900"
          >
            Logout
          </button>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[360px_1fr]">
          <div>
            <form
              onSubmit={handleCreateWorkspace}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="text-xl font-semibold">Create workspace</h2>

              <p className="mt-2 text-sm text-slate-400">
                Organize related documents inside a separate knowledge base.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="workspace-name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Name
                </label>

                <input
                  id="workspace-name"
                  type="text"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Research documents"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="workspace-description"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id="workspace-description"
                  rows={4}
                  maxLength={300}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Documents and notes for my research."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
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
                className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createWorkspaceMutation.isPending
                  ? "Creating..."
                  : "Create workspace"}
              </button>
            </form>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Your workspaces</h2>

                <p className="mt-1 text-slate-400">
                  Select a workspace to manage its documents.
                </p>
              </div>
            </div>

            {actionError && (
              <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {actionError}
              </p>
            )}

            {workspacesQuery.isPending && (
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
                Loading workspaces...
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
                  className="mt-4 rounded-lg border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-200"
                >
                  Try again
                </button>
              </div>
            )}

            {workspacesQuery.isSuccess && workspacesQuery.data.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
                <h3 className="text-lg font-semibold">No workspaces yet</h3>

                <p className="mt-2 text-slate-400">
                  Create your first workspace using the form.
                </p>
              </div>
            )}

            {workspacesQuery.isSuccess && workspacesQuery.data.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {workspacesQuery.data.map((workspace) => {
                  const workspaceId = getWorkspaceId(workspace);

                  return (
                    <article
                      key={workspaceId}
                      className="flex min-h-52 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                    >
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                          Workspace
                        </p>

                        <h3 className="mt-3 text-xl font-semibold">
                          {workspace.name}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                          {workspace.description || "No description provided."}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-3">
                        <Link
                          to={`/workspaces/${workspaceId}`}
                          className="flex-1 rounded-xl bg-cyan-400 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                        >
                          Open
                        </Link>

                        <button
                          type="button"
                          disabled={deleteWorkspaceMutation.isPending}
                          onClick={() =>
                            handleDeleteWorkspace(workspaceId, workspace.name)
                          }
                          className="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
                        >
                          Delete
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
