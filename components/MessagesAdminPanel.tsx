import { AnimatePresence, motion } from "framer-motion";
import {
  Clock3,
  Lock,
  MapPin,
  RefreshCw,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "../utils/cn";

const ADMIN_KEY_STORAGE_KEY = "fiora-message-admin-key";
const AUTO_REFRESH_MS = 30_000;

type AdminMessage = {
  id: number;
  created_at: string;
  nickname: string | null;
  message: string;
  country: string | null;
  region: string | null;
  city: string | null;
  user_agent: string | null;
};

type LoadState = "idle" | "loading" | "ready" | "error";

type MessagesAdminPanelProps = {
  onClose: () => void;
};

function formatParisTime(value: string) {
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

function formatLocation(message: AdminMessage) {
  const parts = [message.country, message.region, message.city].filter(Boolean);
  return parts.length ? parts.join(" / ") : "Unknown location";
}

function formatUserAgent(userAgent: string | null) {
  if (!userAgent) {
    return "Unknown browser";
  }

  if (/iphone|ipad|ios/i.test(userAgent)) {
    return "iPhone / iOS";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  if (/windows/i.test(userAgent)) {
    return "Windows";
  }

  if (/macintosh|mac os/i.test(userAgent)) {
    return "Mac";
  }

  if (/linux/i.test(userAgent)) {
    return "Linux";
  }

  return userAgent;
}

export default function MessagesAdminPanel({
  onClose,
}: MessagesAdminPanelProps) {
  const [adminKey, setAdminKey] = useState("");
  const [draftKey, setDraftKey] = useState("");
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Enter your admin key to read the latest messages."
  );

  const hasKey = adminKey.trim().length > 0;

  const loadMessages = useCallback(
    async (keyOverride?: string) => {
      const keyToUse = (keyOverride ?? adminKey).trim();

      if (!keyToUse) {
        setLoadState("error");
        setStatusMessage("Missing admin key.");
        return;
      }

      setLoadState("loading");
      setStatusMessage("Loading messages...");

      try {
        const response = await fetch("/api/messages", {
          method: "GET",
          headers: {
            "x-admin-key": keyToUse,
          },
          cache: "no-store",
        });

        const payload = (await response.json().catch(() => null)) as
          | {
              ok?: boolean;
              count?: number;
              messages?: AdminMessage[];
              reason?: string;
            }
          | null;

        if (!response.ok || !payload?.ok || !Array.isArray(payload.messages)) {
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

          if (response.status === 400) {
            setStatusMessage("Missing admin key.");
            return;
          }

          setStatusMessage("Messages unavailable right now.");
          return;
        }

        setAdminKey(keyToUse);
        setMessages(payload.messages);
        setLoadState("ready");
        setStatusMessage(
          payload.messages.length
            ? `${payload.messages.length} latest messages loaded.`
            : "No messages yet."
        );
        window.sessionStorage.setItem(ADMIN_KEY_STORAGE_KEY, keyToUse);
      } catch {
        setLoadState("error");
        setStatusMessage("Messages unavailable right now.");
      }
    },
    [adminKey]
  );

  useEffect(() => {
    const savedKey = window.sessionStorage.getItem(ADMIN_KEY_STORAGE_KEY) || "";

    if (!savedKey) {
      return;
    }

    setDraftKey(savedKey);
    void loadMessages(savedKey);
  }, [loadMessages]);

  useEffect(() => {
    if (!hasKey) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadMessages();
    }, AUTO_REFRESH_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasKey, loadMessages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loadMessages(draftKey);
  };

  const handleLock = () => {
    window.sessionStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
    setAdminKey("");
    setDraftKey("");
    setMessages([]);
    setLoadState("idle");
    setStatusMessage("Admin view locked.");
  };

  const latestTimestamp = useMemo(() => {
    if (!messages.length) {
      return null;
    }

    return formatParisTime(messages[0].created_at);
  }, [messages]);

  return (
    <div className="fixed left-4 top-[10.35rem] bottom-5 z-[70] hidden w-[340px] lg:block xl:left-6 xl:w-[380px]">
      <motion.div
        initial={{ opacity: 0, x: -22 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -22 }}
        transition={{ duration: 0.18 }}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-red-500/30 bg-[rgba(8,8,10,0.96)] shadow-[0_0_28px_rgba(255,0,60,0.18)]"
      >
        <div className="border-b border-white/8 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
                <Shield className="h-3.5 w-3.5" />
                Messages admin
              </div>
              <p className="mt-3 text-sm font-bold text-white">
                Latest private inbox
              </p>
              <p className="mt-1 text-xs text-white/55">
                {latestTimestamp
                  ? `Latest message: ${latestTimestamp}`
                  : "Protected view. Nothing public is exposed here."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/12 bg-white/5 p-2 text-white/70 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
              aria-label="Close messages admin"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-b border-white/8 px-4 py-4">
          <form onSubmit={handleSubmit} className="space-y-3">
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

            <p
              className={cn(
                "text-[11px] leading-relaxed",
                loadState === "error"
                  ? "text-red-200"
                  : loadState === "ready"
                    ? "text-emerald-200"
                    : "text-white/55"
              )}
            >
              {statusMessage}
            </p>
          </form>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <AnimatePresence mode="popLayout">
            {messages.length ? (
              <div className="space-y-3">
                {messages.map((message) => (
                  <motion.article
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.16 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-bold text-white">
                          <UserRound className="h-4 w-4 text-red-300" />
                          <span className="truncate">
                            {message.nickname?.trim() || "Anonymous"}
                          </span>
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/50">
                          <Clock3 className="h-3.5 w-3.5 text-red-300/70" />
                          {formatParisTime(message.created_at)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/88">
                      {message.message}
                    </p>

                    <div className="mt-3 space-y-1">
                      <p className="flex items-center gap-1.5 text-[11px] text-white/55">
                        <MapPin className="h-3.5 w-3.5 text-red-300/70" />
                        {formatLocation(message)}
                      </p>
                      <p className="line-clamp-2 text-[11px] text-white/35">
                        {formatUserAgent(message.user_agent)}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/45">
                No admin data loaded yet.
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
