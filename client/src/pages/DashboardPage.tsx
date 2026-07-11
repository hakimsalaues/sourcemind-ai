import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <p className="text-sm font-semibold text-cyan-300">SourceMind AI</p>

            <h1 className="mt-2 text-3xl font-bold">
              Welcome back, {user?.name}
            </h1>

            <p className="mt-2 text-slate-400">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 px-5 py-2.5 font-medium transition hover:bg-slate-900"
          >
            Logout
          </button>
        </header>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-semibold">Your workspaces</h2>

          <p className="mt-2 text-slate-400">
            Workspace management will be connected in the next phase.
          </p>
        </section>
      </div>
    </main>
  );
};
