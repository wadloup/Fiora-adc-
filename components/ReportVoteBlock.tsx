import { useEffect, useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import NeonCard from "./ui/NeonCard";
import { supabase } from "../supabase";

type VoteChoice = "up" | "down" | "poop";

type VoteCounts = Record<VoteChoice, number>;

const INITIAL_COUNTS: VoteCounts = {
  up: 0,
  down: 0,
  poop: 0,
};

const VOTE_STORAGE_KEY = "report_vote_choice";

const voteCards: Array<{
  key: VoteChoice;
  tone: string;
  label: string;
  accent: string;
  icon: typeof ArrowBigUp;
}> = [
  {
    key: "up",
    tone: "UP",
    label: "Up",
    accent: "border-green-400/40 bg-green-500/15 text-green-200",
    icon: ArrowBigUp,
  },
  {
    key: "down",
    tone: "DOWN",
    label: "Down",
    accent: "border-red-400/40 bg-red-500/15 text-red-200",
    icon: ArrowBigDown,
  },
  {
    key: "poop",
    tone: "POOP",
    label: "Poop",
    accent: "border-yellow-400/40 bg-yellow-500/15 text-yellow-200",
    icon: ArrowBigUp,
  },
];

export default function ReportVoteBlock({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [counts, setCounts] = useState<VoteCounts>(INITIAL_COUNTS);
  const [selected, setSelected] = useState<VoteChoice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedVote = localStorage.getItem(VOTE_STORAGE_KEY);
    if (savedVote === "up" || savedVote === "down" || savedVote === "poop") {
      setSelected(savedVote);
    }

    const loadVotes = async () => {
      const { data, error } = await supabase
        .from("report_votes")
        .select("option_key, count");

      if (error || !data) {
        console.error(error);
        return;
      }

      const nextCounts: VoteCounts = { ...INITIAL_COUNTS };

      for (const row of data) {
        if (row.option_key === "up") nextCounts.up = row.count;
        if (row.option_key === "down") nextCounts.down = row.count;
        if (row.option_key === "poop") nextCounts.poop = row.count;
      }

      setCounts(nextCounts);
    };

    void loadVotes();
  }, []);

  const handleVote = async (choice: VoteChoice) => {
    if (loading || selected) {
      return;
    }

    setLoading(true);

    const currentValue = counts[choice];
    const { error } = await supabase
      .from("report_votes")
      .update({ count: currentValue + 1 })
      .eq("option_key", choice);

    if (!error) {
      setCounts((previous) => ({
        ...previous,
        [choice]: currentValue + 1,
      }));
      setSelected(choice);
      localStorage.setItem(VOTE_STORAGE_KEY, choice);
    } else {
      console.error(error);
    }

    setLoading(false);
  };

  const total = counts.up + counts.down + counts.poop;

  return (
    <NeonCard className={compact ? "p-4 md:p-[1.125rem]" : "p-4 md:p-5"}>
      <div className={compact ? "space-y-3" : "space-y-3.5"}>
        <div>
          <p
            className={
              compact
                ? "text-[15px] uppercase tracking-[0.2em] text-red-300"
                : "text-[20px] uppercase tracking-[0.24em] text-red-300"
            }
          >
            VOTE HERE
          </p>
          <h2
            className={
              compact
                ? "mt-1 max-w-[15ch] text-[17px] font-black leading-tight text-white md:text-[19px]"
                : "mt-1 text-[18px] font-black text-white md:text-[24px]"
            }
          >
            ARE YOU GOING TO REPORT ME? :3
          </h2>
          <p
            className={
              compact ? "mt-1 text-[10px] text-white/65" : "mt-1 text-[12px] text-white/65"
            }
          >
            Pick one only.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {voteCards.map((voteCard) => {
            const Icon = voteCard.icon;
            const isPoop = voteCard.key === "poop";

            return (
              <button
                key={voteCard.key}
                onClick={() => void handleVote(voteCard.key)}
                disabled={!!selected || loading}
                className={`rounded-xl border font-semibold transition ${
                  compact ? "min-h-[88px] px-2 py-2 text-[11px]" : "px-3 py-3 text-[13px]"
                } ${
                  selected === voteCard.key
                    ? voteCard.accent
                    : "border-white/15 bg-white/5 text-white hover:bg-white/10"
                } ${
                  selected === voteCard.key
                    ? "shadow-[0_0_18px_rgba(255,0,60,0.18)]"
                    : ""
                } ${selected || loading ? "cursor-not-allowed opacity-80" : ""}`}
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
                    💩
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
                <div className={compact ? "mt-1 text-[12px]" : "mt-1 text-[15px]"}>
                  {counts[voteCard.key]}
                </div>
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

          {selected ? (
            <p
              className={
                compact
                  ? "rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[10px] text-red-300"
                  : "rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-[11px] text-red-300"
              }
            >
              Your vote has been recorded.
            </p>
          ) : null}
        </div>
      </div>
    </NeonCard>
  );
}
