import { Link, useParams } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspaces";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export const WorkspacePage = () => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const workspaceQuery = useWorkspace(workspaceId);

  if (workspaceQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading workspace...</p>
      </main>
    );
  }

  if (workspaceQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h1 className="text-xl font-semibold">Unable to load workspace</h1>

          <p className="mt-3 text-red-200">
            {getApiErrorMessage(
              workspaceQuery.error,
              "The workspace could not be loaded.",
            )}
          </p>

          <Link
            to="/dashboard"
            className="mt-6 inline-block rounded-xl border border-slate-600 px-5 py-2.5 font-semibold"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const workspace = workspaceQuery.data;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link to="/dashboard" className="text-sm font-semibold text-cyan-300">
          ← Back to dashboard
        </Link>

        <header className="mt-6 border-b border-slate-800 pb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Workspace
          </p>

          <h1 className="mt-3 text-4xl font-bold">{workspace.name}</h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            {workspace.description || "No description provided."}
          </p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-2xl font-semibold">Documents</h2>

            <p className="mt-3 text-slate-400">
              PDF upload and document management will appear here.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-2xl font-semibold">Ask SourceMind</h2>

            <p className="mt-3 text-slate-400">
              The RAG chat interface will appear here.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
};
