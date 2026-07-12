import { ChevronLeft, Folder, LoaderCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspaces";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { DocumentsPanel } from "../components/DocumentsPanel";
import { ChatPanel } from "../components/ChatPanel";

export const WorkspacePage = () => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const workspaceQuery = useWorkspace(workspaceId);

  if (workspaceQuery.isPending) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="text-center">
          <LoaderCircle
            size={30}
            className="mx-auto animate-spin text-cyan-300"
          />

          <p className="mt-4 text-sm text-slate-400">Loading workspace...</p>
        </div>
      </main>
    );
  }

  if (workspaceQuery.isError) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
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
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-600 px-5 py-2.5 font-semibold transition hover:bg-slate-900"
          >
            <ChevronLeft size={17} />
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const workspace = workspaceQuery.data;

  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          <ChevronLeft size={17} />
          Back to dashboard
        </Link>

        <header className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/10">
              <Folder size={23} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                Active workspace
              </p>

              <h1 className="mt-2 break-words text-3xl font-bold tracking-tight sm:text-4xl">
                {workspace.name}
              </h1>

              <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                {workspace.description || "No description provided."}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-6 grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="min-w-0 xl:sticky xl:top-24">
            <DocumentsPanel workspaceId={workspaceId!} />
          </div>

          <div className="min-w-0">
            <ChatPanel workspaceId={workspaceId!} />
          </div>
        </section>
      </div>
    </main>
  );
};
