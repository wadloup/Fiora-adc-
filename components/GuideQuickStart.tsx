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
    <div className="rounded-[1.65rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,16,19,0.7),rgba(8,8,10,0.62))] p-5 shadow-[0_22px_54px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/52">
            Quick start
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-white md:text-[1.55rem]">
              Pick your route
            </h2>
            <span className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/58">
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
            <span className="inline-flex items-center gap-2 rounded-full border border-red-200/24 bg-red-500/[0.075] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-100">
              <Compass className="h-3.5 w-3.5" />
              {activeMode} route
            </span>
          ) : null}

          {resumePage ? (
            <button
              type="button"
              onClick={onResume}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.045] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/76 transition hover:border-white/20 hover:bg-white/[0.075] hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Resume {resumePage}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {QUICK_START_OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = activeMode === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={actionMap[option.id]}
              className={cn(
                "premium-hover-card group rounded-[1.35rem] border p-4 text-left transition duration-200",
                active
                  ? "border-red-200/28 bg-[linear-gradient(180deg,rgba(255,60,90,0.105),rgba(18,18,21,0.58))] shadow-[0_16px_38px_rgba(0,0,0,0.22)]"
                  : "border-white/10 bg-white/[0.035] hover:border-white/18 hover:bg-white/[0.055]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-2 text-white/66 transition group-hover:scale-[1.03] group-hover:text-red-100">
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

              <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/68 group-hover:text-red-100">
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
