import {
  ArrowRight,
  Compass,
  Eye,
  HeartHandshake,
  RotateCcw,
  Swords,
} from "lucide-react";
import { cn } from "../utils/cn";

type GuideMode = "support" | "adc" | "browse";

type GuideQuickStartProps = {
  activeMode: GuideMode | null;
  resumePage: string | null;
  onChooseSupport: () => void;
  onChooseAdc: () => void;
  onChooseBrowse: () => void;
  onResume: () => void;
};

const QUICK_START_OPTIONS: Array<{
  id: GuideMode;
  label: string;
  title: string;
  description: string;
  cta: string;
  icon: typeof HeartHandshake;
}> = [
  {
    id: "support",
    label: "Support route",
    title: "I am the support",
    description: "Go straight to timing, peel, wave sync, and engage setup.",
    cta: "Open support",
    icon: HeartHandshake,
  },
  {
    id: "adc",
    label: "ADC route",
    title: "I play Fiora",
    description: "Jump to rune page, early spikes, burst windows, and setup.",
    cta: "Open ADC",
    icon: Swords,
  },
  {
    id: "browse",
    label: "Browse route",
    title: "I want the full lab",
    description: "Read the guide in order without forcing a role-first path.",
    cta: "Explore all",
    icon: Eye,
  },
];

export default function GuideQuickStart({
  activeMode,
  resumePage,
  onChooseSupport,
  onChooseAdc,
  onChooseBrowse,
  onResume,
}: GuideQuickStartProps) {
  const actionMap: Record<GuideMode, () => void> = {
    support: onChooseSupport,
    adc: onChooseAdc,
    browse: onChooseBrowse,
  };

  return (
    <div className="premium-surface scroll-reveal rounded-[1.7rem] border border-red-500/20 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
            Quick start
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-white md:text-[1.55rem]">
              Pick your route
            </h2>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/62">
              fast entry
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/66">
            Support-first, ADC-first, or full browse. We keep the last route so
            coming back feels instant.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {activeMode ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/28 bg-red-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-100">
              <Compass className="h-3.5 w-3.5" />
              {activeMode} route
            </span>
          ) : null}

          {resumePage ? (
            <button
              type="button"
              onClick={onResume}
              className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/82 transition hover:border-red-500/28 hover:bg-red-500/[0.08] hover:text-red-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Resume {resumePage}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-2.5 md:grid-cols-3">
        {QUICK_START_OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = activeMode === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={actionMap[option.id]}
              className={cn(
                "premium-card-3d group rounded-[1.4rem] border p-3.5 text-left transition duration-200",
                active
                  ? "border-red-400/40 bg-[linear-gradient(180deg,rgba(255,60,90,0.13),rgba(20,8,12,0.6))] shadow-[0_0_14px_rgba(255,0,60,0.12)]"
                  : "border-white/10 bg-white/[0.04] hover:border-red-500/25 hover:bg-red-500/[0.05]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-2 text-red-200 transition group-hover:scale-[1.03]">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/66">
                  {option.label}
                </span>
              </div>

              <p className="mt-3 text-[1.05rem] font-black text-white">
                {option.title}
              </p>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-white/70">
                {option.description}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-200">
                <span>{option.cta}</span>
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
