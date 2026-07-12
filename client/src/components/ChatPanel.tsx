import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  useAskQuestion,
  useChatConversations,
  useChatMessages,
} from "../hooks/useChat";
import {
  getConversationId,
  getMessageId,
  type ChatSource,
} from "../types/chat";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

type ChatPanelProps = {
  workspaceId: string;
};

const formatMessageTime = (date?: string) => {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const SourceCard = ({ source }: { source: ChatSource }) => {
  const relevance =
    typeof source.score === "number" ? Math.round(source.score * 100) : null;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate text-xs font-semibold text-cyan-300">
          {source.documentName}
        </p>

        {relevance !== null && (
          <span className="shrink-0 text-xs text-slate-500">
            {relevance}% match
          </span>
        )}
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {source.textPreview}
      </p>

      <p className="mt-2 text-xs text-slate-600">
        Chunk {source.chunkIndex + 1}
      </p>
    </div>
  );
};

export const ChatPanel = ({ workspaceId }: ChatPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isNewConversation, setIsNewConversation] = useState(false);
  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");

  const conversationsQuery = useChatConversations(workspaceId);

  const firstConversationId = conversationsQuery.data?.[0]
    ? getConversationId(conversationsQuery.data[0])
    : null;

  const activeConversationId = isNewConversation
    ? null
    : selectedConversationId || firstConversationId;

  const messagesQuery = useChatMessages(activeConversationId);

  const askQuestionMutation = useAskQuestion(workspaceId);

  const messages = messagesQuery.data || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, askQuestionMutation.isPending]);

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setIsNewConversation(true);
    setQuestionError("");
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsNewConversation(false);
    setQuestionError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setQuestionError("Write a question first.");
      return;
    }

    setQuestionError("");
    setQuestion("");

    try {
      const result = await askQuestionMutation.mutateAsync({
        question: trimmedQuestion,
        conversationId: activeConversationId || undefined,
      });

      setSelectedConversationId(result.conversationId);
      setIsNewConversation(false);
    } catch (error) {
      setQuestion(trimmedQuestion);
      setQuestionError(
        getApiErrorMessage(error, "SourceMind could not answer the question."),
      );
    }
  };

  const pendingQuestion = askQuestionMutation.isPending
    ? askQuestionMutation.variables?.question
    : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
          AI assistant
        </p>

        <h2 className="mt-2 text-2xl font-semibold">Ask SourceMind</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Ask questions and receive answers grounded in your uploaded documents.
        </p>
      </div>

      <div className="flex min-h-[650px] flex-col lg:flex-row">
        <aside className="border-b border-slate-800 bg-slate-950/40 p-4 lg:w-60 lg:border-b-0 lg:border-r">
          <button
            type="button"
            onClick={handleNewConversation}
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            + New conversation
          </button>

          <div className="mt-5">
            <p className="px-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              History
            </p>

            {conversationsQuery.isPending && (
              <p className="mt-4 px-2 text-sm text-slate-500">
                Loading history...
              </p>
            )}

            {conversationsQuery.isError && (
              <p className="mt-4 px-2 text-sm text-red-300">
                Unable to load history.
              </p>
            )}

            {conversationsQuery.isSuccess &&
              conversationsQuery.data.length === 0 && (
                <p className="mt-4 px-2 text-sm leading-6 text-slate-500">
                  Your conversations will appear here.
                </p>
              )}

            {conversationsQuery.isSuccess &&
              conversationsQuery.data.length > 0 && (
                <div className="mt-3 space-y-2">
                  {conversationsQuery.data.map((conversation, index) => {
                    const conversationId = getConversationId(conversation);

                    const isActive =
                      conversationId === activeConversationId &&
                      !isNewConversation;

                    return (
                      <button
                        key={conversationId}
                        type="button"
                        onClick={() => handleSelectConversation(conversationId)}
                        className={`w-full rounded-xl px-3 py-3 text-left text-sm transition ${
                          isActive
                            ? "bg-slate-800 text-white"
                            : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                        }`}
                      >
                        <span className="block truncate font-medium">
                          {conversation.title || `Conversation ${index + 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-[490px] overflow-y-auto p-5">
            {!activeConversationId && !askQuestionMutation.isPending && (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-sm text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-xl">
                    ✦
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    Ask your documents
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Ask a specific question about the PDFs uploaded to this
                    workspace.
                  </p>
                </div>
              </div>
            )}

            {messagesQuery.isPending && activeConversationId && (
              <p className="text-sm text-slate-400">Loading messages...</p>
            )}

            {messagesQuery.isError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-300">
                  {getApiErrorMessage(
                    messagesQuery.error,
                    "Unable to load this conversation.",
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => messagesQuery.refetch()}
                  className="mt-3 text-sm font-semibold text-red-200 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {messagesQuery.isSuccess &&
              messages.length === 0 &&
              activeConversationId &&
              !askQuestionMutation.isPending && (
                <p className="text-sm text-slate-500">
                  This conversation does not have messages yet.
                </p>
              )}

            <div className="space-y-5">
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={getMessageId(message)}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                        isUser
                          ? "bg-cyan-400 text-slate-950"
                          : "border border-slate-700 bg-slate-800 text-slate-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {message.content}
                      </p>

                      {message.createdAt && (
                        <p
                          className={`mt-2 text-right text-xs ${
                            isUser ? "text-slate-700" : "text-slate-500"
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </p>
                      )}

                      {!isUser &&
                        message.sources &&
                        message.sources.length > 0 && (
                          <div className="mt-4 border-t border-slate-700 pt-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                              Sources
                            </p>

                            <div className="space-y-2">
                              {message.sources.map((source, index) => (
                                <SourceCard
                                  key={`${source.documentId}-${source.chunkIndex}-${index}`}
                                  source={source}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}

              {pendingQuestion && (
                <>
                  <div className="flex justify-end">
                    <div className="max-w-[90%] rounded-2xl bg-cyan-400 px-4 py-3 text-slate-950">
                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {pendingQuestion}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3">
                      <p className="text-sm text-slate-300">
                        Searching your documents...
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-800 p-4"
          >
            {questionError && (
              <p className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {questionError}
              </p>
            )}

            <div className="flex items-end gap-3">
              <textarea
                rows={2}
                maxLength={1000}
                value={question}
                disabled={askQuestionMutation.isPending}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask a question about your documents..."
                className="min-h-14 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={askQuestionMutation.isPending || !question.trim()}
                className="h-14 rounded-xl bg-cyan-400 px-5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {askQuestionMutation.isPending ? "Thinking..." : "Send"}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Answers are generated only from the retrieved document context.
            </p>
          </form>
        </div>
      </div>
    </article>
  );
};
