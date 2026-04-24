import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import { cn } from "../utils/cn";

type GuideProgressProps = {
  routeLabel: string;
  routeSummary: string;
  currentPage: string;
  currentFocus: string;
  currentStep: number;
  totalSteps: number;
  previousPage: string | null;
  nextPage: string | null;
  onPrevious: () => void;
  onNext: () => void;
};

export default function GuideProgress({
  routeLabel,
  routeSummary,
  currentPage,
  currentFocus,
  currentStep,
  totalSteps,
  previousPage,
  nextPage,
  onPrevious,
  onNext,
}: GuideProgressProps) {
  const safeStep = Math.max(1, Math.min(currentStep, totalSteps || 1));
  const progressPercent = Math.max(
    8,
    Math.round((safeStep / Math.max(totalSteps, 1)) * 100)
  );

  return (
    <div className="premium-surface scroll-reveal rounded-[1.55rem] border border-red-500/18 p-3.5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-200">
              <Compass className="h-3.5 w-3.5" />
              {routeLabel}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/62">
              Step {safeStep}/{Math.max(totalSteps, 1)}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/58">
              Next: {nextPage || "done"}
            </span>
          </div>

          <p className="mt-2 text-base font-black text-white md:text-lg">
            {currentPage}
          </p>
          <p className="mt-1 text-[0.92rem] leading-relaxed text-white/66">
            {routeSummary}
          </p>
        </div>

        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto_auto] xl:min-w-[420px]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-300">
              Focus now
            </div>
            <p className="mt-1.5 text-[0.92rem] text-white/82">{currentFocus}</p>
          </div>

          <button
            type="button"
            onClick={onPrevious}
            disabled={!previousPage}
            className={cn(
              "premium-nav-pill inline-flex min-w-[118px] items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] transition",
              previousPage
                ? "border-white/12 bg-white/[0.05] text-white/84 hover:border-red-500/25 hover:bg-red-500/[0.07]"
                : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/30"
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!nextPage}
            className={cn(
              "premium-nav-pill inline-flex min-w-[118px] items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] transition",
              nextPage
                ? "border-red-400/28 bg-red-500/[0.1] text-red-100 hover:bg-red-500/[0.16]"
                : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/30"
            )}
          >
            Next
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,120,140,0.9),rgba(255,50,95,0.95))] shadow-[0_0_18px_rgba(255,0,60,0.22)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
