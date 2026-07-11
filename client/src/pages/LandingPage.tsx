import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300">
          AI-powered knowledge workspace
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Turn your documents into reliable AI answers.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Upload PDFs, ask questions, and get source-grounded answers powered by
          RAG, Gemini, Pinecone, and MongoDB.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            to="/register"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-900"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
};
