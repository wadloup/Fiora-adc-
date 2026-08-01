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
    <div
      className="overflow-hidden rounded-lg border border-white/12 bg-[rgba(10,8,10,0.72)] shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
      aria-label={`${currentPage} guide progress. ${routeSummary}`}
    >
      <div className="flex flex-col gap-3 px-3 py-3 sm:px-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-400/28 bg-red-500/10 text-red-200">
            <Compass className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-black uppercase tracking-normal">
              <span className="text-red-200">{routeLabel}</span>
              <span className="text-white/24">/</span>
              <span className="text-white/58">
                Step {safeStep} of {Math.max(totalSteps, 1)}
              </span>
              {nextPage ? (
                <>
                  <span className="text-white/24">/</span>
                  <span className="text-white/42">Next: {nextPage}</span>
                </>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-snug text-white/82">
              <span className="font-black text-white">Focus: </span>
              {currentFocus}
            </p>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!previousPage}
            aria-label={previousPage ? `Open previous page: ${previousPage}` : "No previous page"}
            title={previousPage || "No previous page"}
            className={cn(
              "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 text-xs font-black uppercase tracking-normal transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/60",
              previousPage
                ? "border-white/14 bg-white/[0.045] text-white/78 hover:border-white/28 hover:bg-white/[0.08] hover:text-white"
                : "cursor-not-allowed border-white/8 bg-white/[0.02] text-white/24"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!nextPage}
            aria-label={nextPage ? `Open next page: ${nextPage}` : "Guide complete"}
            title={nextPage || "Guide complete"}
            className={cn(
              "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 text-xs font-black uppercase tracking-normal transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/60",
              nextPage
                ? "border-red-300/38 bg-red-500/[0.12] text-red-100 hover:border-red-200/60 hover:bg-red-500/[0.2]"
                : "cursor-not-allowed border-white/8 bg-white/[0.02] text-white/24"
            )}
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-1 bg-white/[0.05]">
        <div
          className="h-full bg-[linear-gradient(90deg,rgba(255,120,140,0.9),rgba(255,50,95,0.95))] shadow-[0_0_16px_rgba(255,0,60,0.24)] transition-[width] duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
