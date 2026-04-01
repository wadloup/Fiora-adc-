import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquareMore,
  SendHorizontal,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { cn } from "../utils/cn";

const MAX_NAME_LENGTH = 24;
const MAX_MESSAGE_LENGTH = 280;

type SubmitState = "idle" | "sending" | "sent" | "error";

export default function MessageDock() {
  const [open, setOpen] = useState(true);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Leave a note, bug report, or whatever."
  );

  const trimmedMessage = message.trim();
  const remainingCharacters = useMemo(
    () => MAX_MESSAGE_LENGTH - message.length,
    [message.length]
  );
  const canSubmit = trimmedMessage.length >= 3 && submitState !== "sending";

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
          message: trimmedMessage,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            retryAfterSeconds?: number;
            reason?: string;
          }
        | null;

      if (!response.ok || !payload?.ok) {
        if (response.status === 429 && payload?.retryAfterSeconds) {
          setSubmitState("error");
          setStatusMessage(
            `Wait ${payload.retryAfterSeconds}s before sending another one.`
          );
          return;
        }

        setSubmitState("error");
        setStatusMessage("Message failed. Try again in a bit.");
        return;
      }

      setMessage("");
      setSubmitState("sent");
      setStatusMessage("Message sent. Thanks.");
    } catch {
      setSubmitState("error");
      setStatusMessage("Message failed. Try again in a bit.");
    }
  };

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
            className="w-[280px] rounded-3xl border border-red-500/30 bg-[rgba(8,8,10,0.94)] p-4 shadow-[0_0_28px_rgba(255,0,60,0.2)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-red-300">
                  Message box
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  Leave a note
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/12 bg-white/5 p-2 text-white/70 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
                aria-label="Collapse message box"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                value={nickname}
                onChange={(event) =>
                  setNickname(event.target.value.slice(0, MAX_NAME_LENGTH))
                }
                placeholder="Name (optional)"
                className="w-full rounded-2xl border border-white/12 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-red-500/35 focus:bg-red-500/5"
              />

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value.slice(0, MAX_MESSAGE_LENGTH))
                }
                placeholder="Leave a message..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/12 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-red-500/35 focus:bg-red-500/5"
              />

              <div className="flex items-center justify-between gap-3">
                <p
                  className={cn(
                    "text-[11px] leading-relaxed",
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
                  "inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition",
                  canSubmit
                    ? "border-red-500/35 bg-red-500/12 text-red-200 hover:bg-red-500/18"
                    : "cursor-not-allowed border-white/10 bg-white/[0.04] text-white/35"
                )}
              >
                <SendHorizontal className="h-4 w-4" />
                Send
              </button>
            </form>
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
            className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-[rgba(8,8,10,0.94)] px-4 py-3 text-left text-white shadow-[0_0_28px_rgba(255,0,60,0.18)] transition hover:scale-[1.02] hover:bg-red-950/40"
            aria-label="Open message box"
          >
            <span className="rounded-xl border border-red-400/35 bg-red-500/15 p-2 text-red-300">
              <MessageSquareMore className="h-4 w-4" />
            </span>
            <span className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-300">
                Message
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.08em]">
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
