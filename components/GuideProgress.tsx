import { ArrowLeft, ArrowRight, Compass, Gauge, Sparkles } from "lucide-react";
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
    <div className="rounded-3xl border border-red-500/22 bg-[rgba(16,8,11,0.74)] p-4 shadow-[0_0_22px_rgba(255,0,60,0.1)] md:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-200">
              <Compass className="h-3.5 w-3.5" />
              {routeLabel}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/62">
              Step {safeStep}/{Math.max(totalSteps, 1)}
            </span>
          </div>

          <p className="mt-3 text-lg font-black text-white md:text-xl">
            {currentPage}
          </p>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-white/68">
            {routeSummary}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:min-w-[360px]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
              <Sparkles className="h-3.5 w-3.5" />
              Current focus
            </div>
            <p className="mt-2 text-sm text-white/82">{currentFocus}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
              <Gauge className="h-3.5 w-3.5" />
              Recommended next
            </div>
            <p className="mt-2 text-sm text-white/82">
              {nextPage || "You reached the end of this route."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,120,140,0.9),rgba(255,50,95,0.95))] shadow-[0_0_18px_rgba(255,0,60,0.22)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!previousPage}
          className={cn(
            "inline-flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
            previousPage
              ? "border-white/12 bg-white/[0.05] text-white/84 hover:border-red-500/25 hover:bg-red-500/[0.07]"
              : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/30"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
              Previous
            </span>
          </span>
          <span className="truncate text-sm">{previousPage || "Start"}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!nextPage}
          className={cn(
            "inline-flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
            nextPage
              ? "border-red-400/28 bg-red-500/[0.1] text-red-100 hover:bg-red-500/[0.16]"
              : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/30"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
              Next
            </span>
            <ArrowRight className="h-4 w-4" />
          </span>
          <span className="truncate text-sm">{nextPage || "Done"}</span>
        </button>
      </div>
    </div>
  );
}
