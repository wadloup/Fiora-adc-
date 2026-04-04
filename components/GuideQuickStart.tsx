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
    description:
      "Start with engage timing, peel, wave sync, and the exact moments Fiora can actually go.",
    cta: "Open support start",
    icon: HeartHandshake,
  },
  {
    id: "adc",
    label: "ADC route",
    title: "I am the Fiora player",
    description:
      "Go straight to setup: rune page, early levels, burst windows, and when lane becomes real.",
    cta: "Open ADC setup",
    icon: Swords,
  },
  {
    id: "browse",
    label: "Browse route",
    title: "I just want the whole lab",
    description:
      "Take the full guide in order without forcing a role-specific route first.",
    cta: "Explore everything",
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
    <div className="rounded-3xl border border-red-500/25 bg-[rgba(20,8,12,0.78)] p-5 shadow-[0_0_24px_rgba(255,0,60,0.12)] md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300">
            Quick start
          </p>
          <h2 className="mt-2 text-2xl font-black text-white md:text-[2rem]">
            Pick the route before the site picks one for you
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/72 md:text-[0.98rem]">
            The content is the same. The experience changes: support-first,
            ADC-first, or full browse. We also keep your last route so coming
            back feels instant instead of random.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeMode ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-100">
              <Compass className="h-3.5 w-3.5" />
              Saved route: {activeMode}
            </span>
          ) : null}

          {resumePage ? (
            <button
              type="button"
              onClick={onResume}
              className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/82 transition hover:border-red-500/28 hover:bg-red-500/[0.08] hover:text-red-100"
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
                "group rounded-[1.7rem] border p-4 text-left transition duration-200 md:p-5",
                active
                  ? "border-red-400/45 bg-[linear-gradient(180deg,rgba(255,60,90,0.16),rgba(20,8,12,0.72))] shadow-[0_0_24px_rgba(255,0,60,0.16)]"
                  : "border-white/10 bg-white/[0.04] hover:border-red-500/25 hover:bg-red-500/[0.06]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl border border-red-400/25 bg-red-500/12 p-2.5 text-red-200">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  {option.label}
                </span>
              </div>

              <p className="mt-4 text-lg font-black text-white">
                {option.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/72">
                {option.description}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-red-200">
                <span>{option.cta}</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
