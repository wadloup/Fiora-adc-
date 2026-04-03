import { AnimatePresence, motion } from "framer-motion";
import {
  Clock3,
  Lock,
  MapPin,
  MessageSquareText,
  RefreshCw,
  SendHorizontal,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";

const ADMIN_KEY_STORAGE_KEY = "fiora-message-admin-key";
const THREADS_REFRESH_MS = 12_000;
const MAX_ADMIN_REPLY_LENGTH = 280;

type ChatThread = {
  id: number;
  thread_token: string;
  created_at: string;
  updated_at: string;
  nickname: string | null;
  contact: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  status: string | null;
  last_message_preview: string | null;
  last_visitor_message_at: string | null;
  last_admin_message_at: string | null;
};

type ChatMessage = {
  id: number;
  created_at: string;
  author: "visitor" | "admin";
  content: string;
};

type ThreadsPayload = {
  ok?: boolean;
  adminMode?: boolean;
  threads?: ChatThread[];
  reason?: string;
};

type ConversationPayload = {
  ok?: boolean;
  adminMode?: boolean;
  thread?: ChatThread;
  messages?: ChatMessage[];
  reason?: string;
};

type LoadState = "idle" | "loading" | "ready" | "error";

type MessagesAdminPanelProps = {
  onClose: () => void;
};

function formatParisTime(value: string | null) {
  if (!value) {
    return "Unknown time";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Europe/Paris",
  }).format(date);
}

function formatLocation(thread: ChatThread) {
  const parts = [thread.country, thread.region, thread.city].filter(Boolean);
  return parts.length ? parts.join(" / ") : "Unknown location";
}

function threadNeedsReply(thread: ChatThread) {
  if (!thread.last_visitor_message_at) {
    return false;
  }

  if (!thread.last_admin_message_at) {
    return true;
  }

  return (
    new Date(thread.last_visitor_message_at).getTime() >
    new Date(thread.last_admin_message_at).getTime()
  );
}

export default function MessagesAdminPanel({
  onClose,
}: MessagesAdminPanelProps) {
  const [adminKey, setAdminKey] = useState("");
  const [draftKey, setDraftKey] = useState("");
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [threadLoadState, setThreadLoadState] = useState<LoadState>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Enter your admin key to open the inbox."
  );
  const [replyDraft, setReplyDraft] = useState("");
  const [replyState, setReplyState] = useState<LoadState>("idle");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const hasKey = adminKey.trim().length > 0;
  const canReply =
    Boolean(selectedThreadId) &&
    replyDraft.trim().length >= 2 &&
    replyState !== "loading";

  const loadThreads = useCallback(
    async (keyOverride?: string) => {
      const keyToUse = (keyOverride ?? adminKey).trim();

      if (!keyToUse) {
        setLoadState("error");
        setStatusMessage("Missing admin key.");
        return;
      }

      setLoadState("loading");
      setStatusMessage("Loading inbox...");

      try {
        const response = await fetch("/api/messages", {
          method: "GET",
          headers: {
            "x-admin-key": keyToUse,
          },
          cache: "no-store",
        });

        const payload = (await response.json().catch(() => null)) as
          | ThreadsPayload
          | null;

        if (!response.ok || !payload?.ok || !Array.isArray(payload.threads)) {
          setLoadState("error");

          if (response.status === 403) {
            setStatusMessage("Invalid admin key.");
            return;
          }

          if (
            response.status === 500 &&
            payload?.reason === "missing_admin_key_env"
          ) {
            setStatusMessage(
              "The server has not picked up MESSAGE_ADMIN_KEY yet. Redeploy Vercel, then try again."
            );
            return;
          }

          if (payload?.reason === "chat_schema_missing") {
            setStatusMessage("Chat schema is missing in Supabase.");
            return;
          }

          setStatusMessage("Inbox unavailable right now.");
          return;
        }

        const threadList = payload.threads;

        setAdminKey(keyToUse);
        setThreads(threadList);
        setLoadState("ready");
        setStatusMessage(
          threadList.length
            ? `${threadList.length} conversations loaded.`
            : "No conversations yet."
        );
        window.sessionStorage.setItem(ADMIN_KEY_STORAGE_KEY, keyToUse);

        if (threadList.length) {
          setSelectedThreadId((current) =>
            current && threadList.some((thread) => thread.id === current)
              ? current
              : threadList[0].id
          );
        } else {
          setSelectedThreadId(null);
          setSelectedThread(null);
          setMessages([]);
        }
      } catch {
        setLoadState("error");
        setStatusMessage("Inbox unavailable right now.");
      }
    },
    [adminKey]
  );

  const loadConversation = useCallback(async () => {
    if (!selectedThreadId || !adminKey.trim()) {
      return;
    }

    setThreadLoadState("loading");

    try {
      const response = await fetch(
        `/api/messages?threadId=${encodeURIComponent(selectedThreadId)}`,
        {
          method: "GET",
          headers: {
            "x-admin-key": adminKey.trim(),
          },
          cache: "no-store",
        }
      );

      const payload = (await response.json().catch(() => null)) as
        | ConversationPayload
        | null;

      if (!response.ok || !payload?.ok || !payload.thread || !payload.messages) {
        setThreadLoadState("error");
        return;
      }

      setSelectedThread(payload.thread);
      setMessages(payload.messages);
      setThreadLoadState("ready");
    } catch {
      setThreadLoadState("error");
    }
  }, [adminKey, selectedThreadId]);

  useEffect(() => {
    const savedKey = window.sessionStorage.getItem(ADMIN_KEY_STORAGE_KEY) || "";

    if (!savedKey) {
      return;
    }

    setDraftKey(savedKey);
    void loadThreads(savedKey);
  }, [loadThreads]);

  useEffect(() => {
    if (!selectedThreadId || !adminKey.trim()) {
      return;
    }

    void loadConversation();
  }, [adminKey, loadConversation, selectedThreadId]);

  useEffect(() => {
    if (!hasKey) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadThreads();
      void loadConversation();
    }, THREADS_REFRESH_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasKey, loadConversation, loadThreads]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loadThreads(draftKey);
  };

  const handleLock = () => {
    window.sessionStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
    setAdminKey("");
    setDraftKey("");
    setThreads([]);
    setSelectedThreadId(null);
    setSelectedThread(null);
    setMessages([]);
    setLoadState("idle");
    setThreadLoadState("idle");
    setReplyDraft("");
    setStatusMessage("Admin view locked.");
  };

  const handleReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canReply || !selectedThreadId) {
      return;
    }

    setReplyState("loading");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({
          action: "admin_reply",
          threadId: selectedThreadId,
          message: replyDraft.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | ConversationPayload
        | null;

      if (!response.ok || !payload?.ok || !payload.thread || !payload.messages) {
        setReplyState("error");
        return;
      }

      setReplyDraft("");
      setSelectedThread(payload.thread);
      setMessages(payload.messages);
      setReplyState("ready");
      setStatusMessage("Reply sent.");
      void loadThreads();
    } catch {
      setReplyState("error");
    }
  };

  const selectedThreadMeta = useMemo(() => {
    if (!selectedThread) {
      return null;
    }

    return {
      location: formatLocation(selectedThread),
      lastSeen: formatParisTime(selectedThread.updated_at),
      needsReply: threadNeedsReply(selectedThread),
    };
  }, [selectedThread]);

  return (
    <div className="fixed inset-x-4 top-[7.25rem] bottom-5 z-[70] hidden lg:block xl:left-6 xl:right-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.18 }}
        className="flex h-full overflow-hidden rounded-3xl border border-red-500/30 bg-[rgba(8,8,10,0.97)] shadow-[0_0_34px_rgba(255,0,60,0.22)]"
      >
        <div className="flex w-[340px] shrink-0 flex-col border-r border-white/8 bg-[linear-gradient(180deg,rgba(24,10,16,0.98)_0%,rgba(10,8,12,0.98)_100%)]">
          <div className="border-b border-white/8 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
                  <Shield className="h-3.5 w-3.5" />
                  Private inbox
                </div>
                <p className="mt-3 text-lg font-black text-white">
                  Conversations
                </p>
                <p className="mt-1 text-xs text-white/55">{statusMessage}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/12 bg-white/5 p-2 text-white/70 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
                aria-label="Close inbox"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="border-b border-white/8 px-5 py-4">
            <form onSubmit={handleUnlock} className="space-y-3">
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-300/70" />
                <input
                  type="password"
                  value={draftKey}
                  onChange={(event) => setDraftKey(event.target.value)}
                  placeholder="Admin key"
                  className="w-full rounded-2xl border border-white/12 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-red-500/35 focus:bg-red-500/5"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!draftKey.trim() || loadState === "loading"}
                  className={cn(
                    "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition",
                    draftKey.trim() && loadState !== "loading"
                      ? "border-red-500/35 bg-red-500/12 text-red-200 hover:bg-red-500/18"
                      : "cursor-not-allowed border-white/10 bg-white/[0.04] text-white/35"
                  )}
                >
                  <RefreshCw
                    className={cn(
                      "h-3.5 w-3.5",
                      loadState === "loading" && "animate-spin"
                    )}
                  />
                  {hasKey ? "Refresh" : "Unlock"}
                </button>

                <button
                  type="button"
                  onClick={handleLock}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:border-red-500/25 hover:bg-red-500/8 hover:text-red-200"
                >
                  Lock
                </button>
              </div>
            </form>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <AnimatePresence mode="popLayout">
              {threads.length ? (
                <div className="space-y-2">
                  {threads.map((thread) => {
                    const active = thread.id === selectedThreadId;
                    const needsReply = threadNeedsReply(thread);

                    return (
                      <motion.button
                        key={thread.id}
                        layout
                        type="button"
                        onClick={() => setSelectedThreadId(thread.id)}
                        className={cn(
                          "w-full rounded-2xl border p-3 text-left transition",
                          active
                            ? "border-red-400/45 bg-red-500/12 shadow-[0_0_18px_rgba(255,0,60,0.14)]"
                            : "border-white/8 bg-white/[0.04] hover:border-red-500/20 hover:bg-red-500/[0.05]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {thread.nickname?.trim() || "Anonymous"}
                            </p>
                            <p className="mt-1 truncate text-[11px] text-white/45">
                              {thread.contact?.trim() || formatLocation(thread)}
                            </p>
                          </div>

                          {needsReply ? (
                            <span className="shrink-0 rounded-full border border-amber-300/25 bg-amber-300/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-100">
                              Reply
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm text-white/72">
                          {thread.last_message_preview || "No preview yet."}
                        </p>

                        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/38">
                          {formatParisTime(thread.updated_at)}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/45">
                  No conversations yet.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {selectedThread ? (
            <>
              <div className="border-b border-white/8 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-lg font-black text-white">
                      <UserRound className="h-5 w-5 text-red-300" />
                      <span className="truncate">
                        {selectedThread.nickname?.trim() || "Anonymous"}
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/55">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-red-300/75" />
                        {selectedThreadMeta?.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5 text-red-300/75" />
                        {selectedThreadMeta?.lastSeen}
                      </span>
                      {selectedThread.contact ? (
                        <span className="truncate text-white/72">
                          Contact: {selectedThread.contact}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {selectedThreadMeta?.needsReply ? (
                    <span className="rounded-full border border-amber-300/25 bg-amber-300/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-100">
                      Waiting for your reply
                    </span>
                  ) : (
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
                      Up to date
                    </span>
                  )}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(10,8,10,0.92)_0%,rgba(8,8,10,0.98)_100%)] px-6 py-5">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.author === "admin"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-3 shadow-[0_12px_22px_rgba(0,0,0,0.16)]",
                          message.author === "admin"
                            ? "rounded-br-md border border-red-300/28 bg-[linear-gradient(180deg,rgba(255,55,85,0.26),rgba(120,0,16,0.24))] text-white"
                            : "rounded-bl-md border border-white/12 bg-white/[0.06] text-white/92"
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/45">
                          {message.author === "admin" ? "Admin" : "Visitor"} ·{" "}
                          {formatParisTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t border-white/8 px-6 py-5">
                <form onSubmit={handleReply} className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                    <MessageSquareText className="h-4 w-4" />
                    Reply as admin
                  </div>

                  <textarea
                    value={replyDraft}
                    onChange={(event) =>
                      setReplyDraft(
                        event.target.value.slice(0, MAX_ADMIN_REPLY_LENGTH)
                      )
                    }
                    placeholder="Write your reply..."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-red-500/35 focus:bg-red-500/[0.05]"
                  />

                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={cn(
                        "text-xs",
                        replyState === "error"
                          ? "text-red-200"
                          : replyState === "ready"
                            ? "text-emerald-200"
                            : "text-white/45"
                      )}
                    >
                      {replyState === "error"
                        ? "Reply failed. Try again."
                        : replyState === "ready"
                          ? "Reply sent."
                          : "Visitor will see this on the same browser thread."}
                    </p>

                    <button
                      type="submit"
                      disabled={!canReply}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition",
                        canReply
                          ? "border-red-300/60 bg-[linear-gradient(180deg,rgba(255,55,85,0.34),rgba(120,0,16,0.35))] text-white shadow-[0_0_24px_rgba(255,0,60,0.24)] hover:bg-[linear-gradient(180deg,rgba(255,70,95,0.42),rgba(140,0,18,0.4))]"
                          : "cursor-not-allowed border-red-500/20 bg-red-500/[0.08] text-white/40"
                      )}
                    >
                      <SendHorizontal className="h-4 w-4" />
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-white/45">
              {threadLoadState === "loading"
                ? "Loading conversation..."
                : "Select a conversation on the left."}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
