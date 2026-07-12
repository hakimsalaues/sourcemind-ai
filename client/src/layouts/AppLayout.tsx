import { BrainCircuit, LayoutGrid, LogOut } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AppLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userInitial = user?.name.trim().charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-4 sm:gap-8">
            <Link to="/dashboard" className="flex shrink-0 items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/10">
                <BrainCircuit size={21} />
              </span>

              <div className="hidden sm:block">
                <p className="font-bold tracking-tight">SourceMind AI</p>

                <p className="text-[10px] uppercase tracking-widest text-slate-500">
                  Knowledge workspace
                </p>
              </div>
            </Link>

            <nav>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <LayoutGrid size={17} />
                <span className="hidden sm:inline">Workspaces</span>
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right lg:block">
              <p className="max-w-40 truncate text-sm font-medium text-white">
                {user?.name}
              </p>

              <p className="max-w-48 truncate text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">
              {userInitial}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-900 hover:text-white"
            >
              <LogOut size={16} />

              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
};
