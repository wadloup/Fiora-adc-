import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquareMore,
  SendHorizontal,
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

const MAX_NAME_LENGTH = 24;
const MAX_CONTACT_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 280;
const CHAT_THREAD_TOKEN_STORAGE_KEY = "fiora-chat-thread-token";
const CHAT_NICKNAME_STORAGE_KEY = "fiora-chat-nickname";
const CHAT_CONTACT_STORAGE_KEY = "fiora-chat-contact";
const CHAT_POLL_INTERVAL_MS = 9_000;

type SubmitState = "idle" | "sending" | "sent" | "error";

type ChatMessage = {
  id: number;
  created_at: string;
  author: "visitor" | "admin";
  content: string;
};

type ChatThread = {
  id: number;
  thread_token: string;
  nickname: string | null;
  contact: string | null;
};

type ChatPayload = {
  ok?: boolean;
  thread?: ChatThread;
  messages?: ChatMessage[];
  retryAfterSeconds?: number;
  reason?: string;
};

function formatMessageTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function MessageDock() {
  const [open, setOpen] = useState(true);
  const [nickname, setNickname] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [threadToken, setThreadToken] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Same browser = same conversation."
  );
  const [conversationReady, setConversationReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const trimmedMessage = message.trim();
  const remainingCharacters = useMemo(
    () => MAX_MESSAGE_LENGTH - message.length,
    [message.length]
  );
  const canSubmit = trimmedMessage.length >= 2 && submitState !== "sending";

  const syncConversationFromPayload = useCallback((payload: ChatPayload) => {
    if (!payload.thread || !Array.isArray(payload.messages)) {
      return false;
    }

    setThreadToken(payload.thread.thread_token);
    setMessages(payload.messages);
    setConversationReady(true);

    if (payload.thread.nickname) {
      setNickname(payload.thread.nickname);
      window.localStorage.setItem(
        CHAT_NICKNAME_STORAGE_KEY,
        payload.thread.nickname
      );
    }

    if (payload.thread.contact) {
      setContact(payload.thread.contact);
      window.localStorage.setItem(
        CHAT_CONTACT_STORAGE_KEY,
        payload.thread.contact
      );
    }

    window.localStorage.setItem(
      CHAT_THREAD_TOKEN_STORAGE_KEY,
      payload.thread.thread_token
    );

    const lastMessage = payload.messages[payload.messages.length - 1];

    if (!lastMessage) {
      setStatusMessage("Conversation ready.");
      return true;
    }

    setStatusMessage(
      lastMessage.author === "admin"
        ? "New reply available."
        : "Message sent."
    );

    return true;
  }, []);

  const loadConversation = useCallback(
    async (threadTokenOverride?: string) => {
      const token = (threadTokenOverride ?? threadToken).trim();

      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          `/api/messages?threadToken=${encodeURIComponent(token)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const payload = (await response.json().catch(() => null)) as
          | ChatPayload
          | null;

        if (!response.ok || !payload?.ok) {
          if (response.status === 404) {
            window.localStorage.removeItem(CHAT_THREAD_TOKEN_STORAGE_KEY);
            setThreadToken("");
            setMessages([]);
            setConversationReady(false);
            setStatusMessage("Conversation reset. Send a new message.");
          }

          return;
        }

        syncConversationFromPayload(payload);
      } catch {
        setStatusMessage("Chat unavailable right now.");
      }
    },
    [syncConversationFromPayload, threadToken]
  );

  useEffect(() => {
    const savedThreadToken =
      window.localStorage.getItem(CHAT_THREAD_TOKEN_STORAGE_KEY) || "";
    const savedNickname =
      window.localStorage.getItem(CHAT_NICKNAME_STORAGE_KEY) || "";
    const savedContact =
      window.localStorage.getItem(CHAT_CONTACT_STORAGE_KEY) || "";

    if (savedNickname) {
      setNickname(savedNickname);
    }

    if (savedContact) {
      setContact(savedContact);
    }

    if (savedThreadToken) {
      setThreadToken(savedThreadToken);
      void loadConversation(savedThreadToken);
    }
  }, [loadConversation]);

  useEffect(() => {
    if (!threadToken) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadConversation();
    }, CHAT_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadConversation, threadToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  useEffect(() => {
    window.localStorage.setItem(CHAT_NICKNAME_STORAGE_KEY, nickname);
  }, [nickname]);

  useEffect(() => {
    window.localStorage.setItem(CHAT_CONTACT_STORAGE_KEY, contact);
  }, [contact]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setSubmitState("sending");
    setStatusMessage("Sending...");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          contact,
          message: trimmedMessage,
          threadToken: threadToken || undefined,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | ChatPayload
        | null;

      if (!response.ok || !payload?.ok) {
        if (response.status === 429 && payload?.retryAfterSeconds) {
          setSubmitState("error");
          setStatusMessage(
            `Wait ${payload.retryAfterSeconds}s before sending again.`
          );
          return;
        }

        if (payload?.reason === "chat_schema_missing") {
          setSubmitState("error");
          setStatusMessage("Chat setup is missing in Supabase.");
          return;
        }

        setSubmitState("error");
        setStatusMessage("Message failed. Try again in a bit.");
        return;
      }

      setMessage("");
      setSubmitState("sent");
      syncConversationFromPayload(payload);
    } catch {
      setSubmitState("error");
      setStatusMessage("Message failed. Try again in a bit.");
    }
  };

  const hasAdminReply = messages.some((entry) => entry.author === "admin");

  return (
    <div className="fixed left-4 top-[10.35rem] z-[59] hidden lg:block xl:left-6">
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div
            key="message-open"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.18 }}
            className="relative w-[300px] overflow-hidden rounded-3xl border border-red-400/65 bg-[linear-gradient(180deg,rgba(28,10,16,0.99)_0%,rgba(12,8,12,0.99)_55%,rgba(8,8,10,0.99)_100%)] p-4 shadow-[0_0_44px_rgba(255,0,60,0.32)] min-[1900px]:w-[326px]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(255,70,110,0.24),rgba(255,70,110,0)_72%)]" />
            <div className="pointer-events-none absolute left-0 top-6 bottom-6 w-[2px] rounded-full bg-gradient-to-b from-red-200/0 via-red-300/90 to-red-200/0 shadow-[0_0_20px_rgba(255,90,120,0.55)]" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="inline-flex items-center rounded-full border border-red-400/30 bg-red-500/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-100 shadow-[0_0_14px_rgba(255,0,60,0.12)]">
                  Chat
                </p>
                <p className="mt-2 text-lg font-black leading-none text-white">
                  Leave a note
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-white/70">
                  Same browser = same conversation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/24 bg-white/10 p-2.5 text-white/85 transition hover:border-red-500/45 hover:bg-red-500/14 hover:text-red-100"
                aria-label="Collapse chat"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <input
                value={nickname}
                onChange={(event) =>
                  setNickname(event.target.value.slice(0, MAX_NAME_LENGTH))
                }
                placeholder="Name (optional)"
                className="w-full rounded-2xl border border-white/28 bg-white/[0.1] px-3 py-3 text-sm text-white placeholder:text-white/65 outline-none transition focus:border-red-400/55 focus:bg-red-500/[0.1] focus:shadow-[0_0_0_1px_rgba(255,80,110,0.15)]"
              />

              <input
                value={contact}
                onChange={(event) =>
                  setContact(event.target.value.slice(0, MAX_CONTACT_LENGTH))
                }
                placeholder="Discord / Insta / Email (optional)"
                className="w-full rounded-2xl border border-white/28 bg-white/[0.1] px-3 py-3 text-sm text-white placeholder:text-white/65 outline-none transition focus:border-red-400/55 focus:bg-red-500/[0.1] focus:shadow-[0_0_0_1px_rgba(255,80,110,0.15)]"
              />

              <div className="rounded-2xl border border-white/16 bg-black/22 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                    Conversation
                  </p>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-[0.18em]",
                      hasAdminReply ? "text-emerald-200" : "text-white/40"
                    )}
                  >
                    {hasAdminReply ? "Reply received" : "Waiting"}
                  </span>
                </div>

                <div className="hide-scrollbar max-h-[220px] min-h-[180px] space-y-2 overflow-y-auto pr-1">
                  {messages.length ? (
                    messages.map((entry) => (
                      <div
                        key={entry.id}
                        className={cn(
                          "flex",
                          entry.author === "visitor"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[86%] rounded-2xl px-3 py-2.5 text-sm shadow-[0_10px_20px_rgba(0,0,0,0.16)]",
                            entry.author === "visitor"
                              ? "rounded-br-md border border-red-300/28 bg-[linear-gradient(180deg,rgba(255,55,85,0.26),rgba(120,0,16,0.24))] text-white"
                              : "rounded-bl-md border border-white/12 bg-white/[0.08] text-white/92"
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words leading-relaxed">
                            {entry.content}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/45">
                            {entry.author === "visitor" ? "You" : "Admin"} ·{" "}
                            {formatMessageTime(entry.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-[180px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/45">
                      {conversationReady
                        ? "No messages yet in this conversation."
                        : "Start the conversation here."}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value.slice(0, MAX_MESSAGE_LENGTH))
                  }
                  placeholder="Write your message..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/28 bg-white/[0.1] px-3 py-3 text-sm text-white placeholder:text-white/65 outline-none transition focus:border-red-400/55 focus:bg-red-500/[0.1] focus:shadow-[0_0_0_1px_rgba(255,80,110,0.15)]"
                />

                <div className="flex items-center justify-between gap-3">
                  <p
                    className={cn(
                      "text-xs leading-relaxed",
                      submitState === "error"
                        ? "text-red-200"
                        : submitState === "sent"
                          ? "text-emerald-200"
                          : "text-white/55"
                    )}
                  >
                    {statusMessage}
                  </p>

                  <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-white/40">
                    {remainingCharacters}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] transition",
                    canSubmit
                      ? "border-red-300/60 bg-[linear-gradient(180deg,rgba(255,55,85,0.34),rgba(120,0,16,0.35))] text-white shadow-[0_0_24px_rgba(255,0,60,0.24)] hover:bg-[linear-gradient(180deg,rgba(255,70,95,0.42),rgba(140,0,18,0.4))]"
                      : "cursor-not-allowed border-red-500/25 bg-red-500/[0.1] text-white/50"
                  )}
                >
                  <SendHorizontal className="h-4 w-4" />
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="message-closed"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.16 }}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-400/45 bg-[linear-gradient(180deg,rgba(20,10,14,0.98)_0%,rgba(10,8,12,0.98)_100%)] px-4 py-3.5 text-left text-white shadow-[0_0_34px_rgba(255,0,60,0.24)] transition hover:scale-[1.02] hover:bg-red-950/40"
            aria-label="Open chat"
          >
            <motion.span
              animate={{
                boxShadow: [
                  "0 0 0 rgba(255,0,60,0)",
                  "0 0 18px rgba(255,0,60,0.28)",
                  "0 0 0 rgba(255,0,60,0)",
                ],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-xl border border-red-400/45 bg-red-500/18 p-2 text-red-200"
            >
              <MessageSquareMore className="h-4 w-4" />
            </motion.span>
            <span className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
                Chat
              </span>
              <span className="text-[13px] font-black uppercase tracking-[0.08em]">
                Open box
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-white/60" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
