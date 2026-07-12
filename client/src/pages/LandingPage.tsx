import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileText,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: FileText,
    title: "Upload your PDFs",
    description: "Build focused knowledge bases using your own documents.",
  },
  {
    icon: Search,
    title: "Semantic retrieval",
    description:
      "Find relevant information based on meaning, not only keywords.",
  },
  {
    icon: MessageSquare,
    title: "Grounded AI answers",
    description: "Receive answers with the exact document sources used.",
  },
];

export const LandingPage = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <nav className="relative z-10 border-b border-slate-800/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
              <BrainCircuit size={21} />
            </span>

            <span className="font-bold">SourceMind AI</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-medium text-cyan-300">
            <Sparkles size={15} />
            AI-powered knowledge workspace
          </div>

          <h1 className="mt-7 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Turn your documents into{" "}
            <span className="text-cyan-300">reliable answers.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
            Upload PDF documents, ask natural-language questions, and receive
            answers grounded in the most relevant sources.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Create free account
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-white transition hover:border-slate-600 hover:bg-slate-900"
            >
              Open your workspace
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Source citations
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Conversation history
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Private workspaces
            </span>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/70 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-8">
            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center gap-3">
                  <Database size={19} className="text-cyan-300" />

                  <p className="font-semibold">Product research</p>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    "Technical manual.pdf",
                    "Product requirements.pdf",
                    "Research notes.pdf",
                  ].map((document) => (
                    <div
                      key={document}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-3"
                    >
                      <FileText size={16} className="shrink-0 text-cyan-300" />

                      <span className="truncate text-sm text-slate-300">
                        {document}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
                <div className="ml-auto max-w-md rounded-2xl bg-cyan-400 px-4 py-3 text-sm text-slate-950">
                  What are the product&apos;s main installation requirements?
                </div>

                <div className="mt-5 max-w-xl rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4">
                  <p className="text-sm leading-6 text-slate-200">
                    The product requires a compatible PCIe slot, an adequate
                    power supply, and the latest supported drivers.
                  </p>

                  <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                      Source
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Technical manual.pdf · Installation requirements
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-slate-800/70 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              How it works
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              From PDF to answer in three steps
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                      <Icon size={21} />
                    </div>

                    <span className="text-sm font-semibold text-slate-700">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
              <ShieldCheck size={23} className="shrink-0 text-emerald-300" />

              <div>
                <h3 className="font-semibold">Isolated user data</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Workspaces and documents are protected by authenticated user
                  ownership.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
              <BrainCircuit size={23} className="shrink-0 text-cyan-300" />

              <div>
                <h3 className="font-semibold">RAG architecture</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Answers combine semantic retrieval, vector search, and
                  generative AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>SourceMind AI</p>

          <p>AI-assisted knowledge management with source-grounded answers.</p>
        </div>
      </footer>
    </main>
  );
};
