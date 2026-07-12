import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
          Error 404
        </p>

        <h1 className="mt-4 text-5xl font-bold">Page not found</h1>

        <p className="mt-4 leading-7 text-slate-400">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Return home
        </Link>
      </div>
    </main>
  );
};
