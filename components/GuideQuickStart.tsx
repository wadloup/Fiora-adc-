import {
  ArrowRight,
  BookOpen,
  Brain,
  Compass,
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
  onOpenIQTest: () => void;
  onOpenManga: () => void;
  onResume: () => void;
};

const QUICK_START_OPTIONS: Array<{
  id: "adc" | "support" | "iq" | "manga";
  guideMode?: GuideMode;
  label: string;
  title: string;
  description: string;
  cta: string;
  icon: typeof HeartHandshake;
}> = [
  {
    id: "adc",
    guideMode: "adc",
    label: "Fiora route",
    title: "I play Fiora",
    description: "Runes, build, lane logic, and why this crime can work.",
    cta: "Start the guide",
    icon: Swords,
  },
  {
    id: "support",
    guideMode: "support",
    label: "Support check",
    title: "I am support",
    description: "Timing, peel, engage rules, and who is allowed to breathe.",
    cta: "Open support",
    icon: HeartHandshake,
  },
  {
    id: "iq",
    label: "100% reliable",
    title: "I came for the IQ test",
    description: "Five questions, one number, no appeal process.",
    cta: "Test me",
    icon: Brain,
  },
  {
    id: "manga",
    label: "Manga board",
    title: "I came for manga",
    description: "Open Fiora's manga reader and let the soundtrack take over.",
    cta: "Read manga",
    icon: BookOpen,
  },
];

export default function GuideQuickStart({
  activeMode,
  resumePage,
  onChooseSupport,
  onChooseAdc,
  onOpenIQTest,
  onOpenManga,
  onResume,
}: GuideQuickStartProps) {
  const actionMap: Record<(typeof QUICK_START_OPTIONS)[number]["id"], () => void> = {
    adc: onChooseAdc,
    support: onChooseSupport,
    iq: onOpenIQTest,
    manga: onOpenManga,
  };

  return (
    <div className="rounded-[1.7rem] border border-red-500/20 bg-[linear-gradient(135deg,rgba(20,8,12,0.82),rgba(5,8,10,0.72))] p-4 shadow-[0_0_18px_rgba(255,0,60,0.09)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
            Home routing
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black text-white md:text-[1.8rem]">
              Choose your route
            </h2>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/62">
              four clean doors
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/66">
            Same site, less wandering. Pick why you came here and land in the
            right part without playing menu roulette.
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

      <div className="mt-4 grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        {QUICK_START_OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = option.guideMode ? activeMode === option.guideMode : false;

          return (
            <button
              key={option.id}
              type="button"
              onClick={actionMap[option.id]}
              className={cn(
                "group rounded-[1.4rem] border p-3.5 text-left transition duration-200",
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
