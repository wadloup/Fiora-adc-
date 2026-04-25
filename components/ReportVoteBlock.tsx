import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import NeonCard from "./ui/NeonCard";

type VoteChoice = "up" | "down" | "poop";

type VoteCounts = Record<VoteChoice, number>;

const INITIAL_COUNTS: VoteCounts = {
  up: 0,
  down: 0,
  poop: 0,
};

const VOTE_STORAGE_KEY = "report_vote_choice";
const VOTE_BROWSER_TOKEN_STORAGE_KEY = "report_vote_browser_token";

function createVoteBrowserToken() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(4);
    window.crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(16).padStart(8, "0")).join(
      ""
    );
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function getVoteBrowserToken() {
  const savedToken = localStorage.getItem(VOTE_BROWSER_TOKEN_STORAGE_KEY);

  if (savedToken) {
    return savedToken;
  }

  const token = createVoteBrowserToken();
  localStorage.setItem(VOTE_BROWSER_TOKEN_STORAGE_KEY, token);

  return token;
}

const voteCards: Array<{
  key: VoteChoice;
  tone: string;
  message: string;
  detail: string;
  accent: string;
  icon: typeof ArrowBigUp;
}> = [
  {
    key: "up",
    tone: "UP",
    message: "LITTLE SAINT JAMES",
    detail: "Perfect. I already planned our trip there.",
    accent: "border-green-400/40 bg-green-500/15 text-green-200",
    icon: ArrowBigUp,
  },
  {
    key: "down",
    tone: "DOWN",
    message: "JUNE 6, 2026",
    detail: "Our wedding is set. Get pretty.",
    accent: "border-red-400/40 bg-red-500/15 text-red-200",
    icon: ArrowBigDown,
  },
  {
    key: "poop",
    tone: "POOP",
    message: "YOU LOVE THAT SMELL",
    detail: "Your gameplay advertises it.",
    accent: "border-yellow-400/40 bg-yellow-500/15 text-yellow-200",
    icon: ArrowBigUp,
  },
];

const flipTransition = {
  duration: 0.68,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function ReportVoteBlock({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [counts, setCounts] = useState<VoteCounts>(INITIAL_COUNTS);
  const [selected, setSelected] = useState<VoteChoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [countsLoaded, setCountsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasStartedBootstrapRef = useRef(false);

  useEffect(() => {
    const savedVote = localStorage.getItem(VOTE_STORAGE_KEY);
    if (savedVote === "up" || savedVote === "down" || savedVote === "poop") {
      setSelected(savedVote);
      getVoteBrowserToken();
    }
  }, []);

  useEffect(() => {
    if (countsLoaded) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;
    let idleId: number | null = null;
    let loadListenerAttached = false;

    const loadVotes = async () => {
      if (cancelled || hasStartedBootstrapRef.current) {
        return;
      }

      hasStartedBootstrapRef.current = true;

      try {
        const response = await fetch("/api/report-vote", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });

        const payload = await response.json();

        if (!response.ok || !payload?.counts) {
          throw new Error("vote_counts_unavailable");
        }

        if (cancelled) {
          return;
        }

        setCounts({
          up: Number(payload.counts.up) || 0,
          down: Number(payload.counts.down) || 0,
          poop: Number(payload.counts.poop) || 0,
        });
        setCountsLoaded(true);
      } catch (error) {
        console.error(error);
        hasStartedBootstrapRef.current = false;
      }
    };

    const scheduleBootstrap = () => {
      if (cancelled || hasStartedBootstrapRef.current) {
        return;
      }

      const runtimeWindow = window as Window & {
        requestIdleCallback?: (
          callback: () => void,
          options?: { timeout: number }
        ) => number;
        cancelIdleCallback?: (id: number) => void;
      };

      if (runtimeWindow.requestIdleCallback) {
        idleId = runtimeWindow.requestIdleCallback(() => {
          void loadVotes();
        }, { timeout: 4000 });
      } else {
        timeoutId = window.setTimeout(() => {
          void loadVotes();
        }, 3200);
      }
    };

    const scheduleAfterLoad = () => {
      if (document.readyState === "complete") {
        scheduleBootstrap();
        return;
      }

      loadListenerAttached = true;
      window.addEventListener("load", scheduleBootstrap, { once: true });
    };

    if ("IntersectionObserver" in window && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            scheduleAfterLoad();
          }
        },
        {
          rootMargin: "200px 0px",
          threshold: 0.01,
        }
      );

      observer.observe(containerRef.current);

      return () => {
        cancelled = true;
        observer.disconnect();

        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
        }

        if (loadListenerAttached) {
          window.removeEventListener("load", scheduleBootstrap);
        }

        const runtimeWindow = window as Window & {
          cancelIdleCallback?: (id: number) => void;
        };

        if (idleId !== null && runtimeWindow.cancelIdleCallback) {
          runtimeWindow.cancelIdleCallback(idleId);
        }
      };
    } else {
      scheduleAfterLoad();
    }

    return () => {
      cancelled = true;

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      if (loadListenerAttached) {
        window.removeEventListener("load", scheduleBootstrap);
      }

      const runtimeWindow = window as Window & {
        cancelIdleCallback?: (id: number) => void;
      };

      if (idleId !== null && runtimeWindow.cancelIdleCallback) {
        runtimeWindow.cancelIdleCallback(idleId);
      }
    };
  }, [countsLoaded]);

  const handleVote = async (choice: VoteChoice) => {
    if (loading || selected) {
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/report-vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          choice,
          voterToken: getVoteBrowserToken(),
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.counts) {
        throw new Error(payload?.reason || "vote_request_failed");
      }

      setCounts({
        up: Number(payload.counts.up) || 0,
        down: Number(payload.counts.down) || 0,
        poop: Number(payload.counts.poop) || 0,
      });

      const selectedChoice =
        payload.selectedChoice === "up" ||
        payload.selectedChoice === "down" ||
        payload.selectedChoice === "poop"
          ? payload.selectedChoice
          : choice;

      setSelected(selectedChoice);
      localStorage.setItem(VOTE_STORAGE_KEY, selectedChoice);
    } catch (error) {
      console.error(error);
      setErrorMessage("Vote unavailable. Try again in a bit.");
    } finally {
      setLoading(false);
    }
  };

  const total = counts.up + counts.down + counts.poop;

  return (
    <NeonCard
      className={compact ? "p-4 md:p-[1.125rem]" : "p-4 md:p-5"}
      ref={containerRef}
    >
      <div className={compact ? "space-y-3" : "space-y-3.5"}>
        <div
          className={
            compact
              ? "flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-6"
              : ""
          }
        >
          <div className={compact ? "min-w-0 flex-1" : ""}>
            <p
              className={
                compact
                  ? "text-[24px] font-black uppercase tracking-[0.22em] text-red-300"
                  : "text-[32px] font-black uppercase tracking-[0.24em] text-red-300"
              }
            >
              VOTE HERE
            </p>
            <h2
              className={
                compact
                  ? "mt-1 text-[17px] font-black leading-tight text-white md:text-[19px]"
                  : "mt-1 text-[18px] font-black text-white md:text-[24px]"
              }
            >
              ARE YOU GOING TO REPORT ME? :3
            </h2>
            <p
              className={
                compact
                  ? "mt-1 text-[10px] text-white/65"
                  : "mt-1 text-[12px] text-white/65"
              }
            >
              Pick one only.
            </p>
          </div>

          {compact ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-white/45 lg:shrink-0">
              One vote per browser
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {voteCards.map((voteCard) => {
            const Icon = voteCard.icon;
            const isPoop = voteCard.key === "poop";
            const isCurrentSelection = selected === voteCard.key;
            const isDisabled = loading || !!selected;

            return (
              <button
                key={voteCard.key}
                type="button"
                onClick={() => void handleVote(voteCard.key)}
                disabled={isDisabled}
                className={`relative overflow-hidden rounded-xl border font-semibold transition ${
                  compact ? "min-h-[88px]" : "min-h-[112px]"
                } ${
                  isCurrentSelection
                    ? voteCard.accent
                    : "border-white/15 bg-white/5 text-white hover:bg-white/10"
                } ${
                  isCurrentSelection
                    ? "shadow-[0_0_18px_rgba(255,0,60,0.18)]"
                    : ""
                } ${isDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                style={{ perspective: "1200px" }}
              >
                <motion.div
                  className="relative h-full w-full"
                  initial={false}
                  animate={{ rotateY: isCurrentSelection ? 180 : 0 }}
                  transition={flipTransition}
                  style={{
                    minHeight: compact ? "88px" : "112px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="absolute inset-0 flex h-full w-full flex-col items-center justify-center px-2 text-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {isPoop ? (
                      <span
                        className={
                          compact
                            ? "mx-auto mb-1 block text-[16px] leading-none"
                            : "mx-auto mb-2 block text-[20px] leading-none"
                        }
                        aria-hidden="true"
                      >
                        {"\uD83D\uDCA9"}
                      </span>
                    ) : (
                      <Icon
                        className={
                          compact
                            ? "mx-auto mb-1 h-4 w-4"
                            : "mx-auto mb-2 h-5 w-5"
                        }
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className={
                        compact
                          ? "text-[12px] font-black tracking-[0.18em]"
                          : "text-[16px] font-black tracking-[0.22em]"
                      }
                    >
                      {voteCard.tone}
                    </div>

                    <div
                      className={compact ? "mt-1 text-[12px]" : "mt-1 text-[15px]"}
                    >
                      {counts[voteCard.key]}
                    </div>
                  </div>

                  <div
                    className={
                      compact
                        ? "absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center"
                        : "absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-1.5 px-3 text-center"
                    }
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div
                      className={
                        compact
                          ? "text-[10px] uppercase tracking-[0.24em] text-white/60"
                          : "text-[11px] uppercase tracking-[0.26em] text-white/60"
                      }
                    >
                      {voteCard.tone}
                    </div>

                    <div
                      className={
                        compact
                          ? "text-[14px] font-black leading-tight tracking-[0.08em]"
                          : "text-[18px] font-black leading-tight tracking-[0.08em]"
                      }
                    >
                      {voteCard.message}
                    </div>

                    <div
                      className={
                        compact
                          ? "text-[12px] leading-tight text-white/82"
                          : "text-[16px] leading-tight text-white/82"
                      }
                    >
                      {voteCard.detail}
                    </div>

                    <div
                      className={
                        compact
                          ? "text-[13px] font-semibold text-white/95"
                          : "text-[16px] font-semibold text-white/95"
                      }
                    >
                      {counts[voteCard.key]} vote{counts[voteCard.key] > 1 ? "s" : ""}
                    </div>
                  </div>
                </motion.div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p
            className={
              compact ? "text-[10px] text-white/55" : "text-[11px] text-white/55"
            }
          >
            Total votes: {total}
          </p>

          <div className="flex flex-wrap justify-end gap-2">
            {selected ? (
              <p
                className={
                  compact
                    ? "rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[10px] text-red-300"
                    : "rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-[11px] text-red-300"
                }
              >
                Your vote is locked in.
              </p>
            ) : null}

            {errorMessage ? (
              <p
                className={
                  compact
                    ? "rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[10px] text-red-300"
                    : "rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-[11px] text-red-300"
                }
              >
                {errorMessage}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </NeonCard>
  );
}
