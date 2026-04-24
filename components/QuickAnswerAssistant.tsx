import { ArrowRight, Radar, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "../utils/cn";

export type QuickAnswerScenario = {
  id: string;
  label: string;
  category: string;
  answer: string;
  target: string;
  actionLabel: string;
  onAction: () => void;
};

type QuickAnswerAssistantProps = {
  scenarios: QuickAnswerScenario[];
};

export default function QuickAnswerAssistant({
  scenarios,
}: QuickAnswerAssistantProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(
    scenarios[0]?.id ?? ""
  );

  const selectedScenario = useMemo(() => {
    return (
      scenarios.find((scenario) => scenario.id === selectedScenarioId) ||
      scenarios[0] ||
      null
    );
  }, [scenarios, selectedScenarioId]);

  if (!selectedScenario) {
    return null;
  }

  return (
    <div className="premium-surface scroll-reveal rounded-[1.7rem] border border-red-500/20 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
            Quick answer
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-white md:text-[1.55rem]">
              Need the fast path?
            </h2>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/62">
              no blind scroll
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/66">
            Pick the situation and jump straight to the page that solves it.
          </p>
        </div>

        <div className="hidden rounded-2xl border border-red-400/20 bg-red-500/10 p-2.5 text-red-200 md:block">
          <Radar className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[0.96fr_1.04fr]">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {scenarios.map((scenario) => {
            const active = scenario.id === selectedScenario.id;

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={cn(
                  "premium-card-3d rounded-2xl border px-3.5 py-3 text-left transition",
                  active
                    ? "border-red-400/38 bg-[linear-gradient(180deg,rgba(255,55,90,0.13),rgba(25,8,12,0.66))] shadow-[0_0_14px_rgba(255,0,60,0.1)]"
                    : "border-white/10 bg-white/[0.04] hover:border-red-500/20 hover:bg-red-500/[0.05]"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.95rem] font-bold text-white">
                    {scenario.label}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/66">
                    {scenario.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="premium-card-3d rounded-[1.45rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] p-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            {selectedScenario.category}
          </div>

          <p className="mt-3 text-xl font-black text-white md:text-[1.6rem]">
            {selectedScenario.label}
          </p>

          <p className="mt-3 text-[0.95rem] leading-relaxed text-white/76">
            {selectedScenario.answer}
          </p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-3.5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
              Target
            </p>
            <p className="mt-1.5 text-sm text-white/84">
              {selectedScenario.target}
            </p>
          </div>

          <button
            type="button"
            onClick={selectedScenario.onAction}
            className="premium-cta mt-4 inline-flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/[0.12] px-4 py-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-red-100 transition hover:bg-red-500/[0.18]"
          >
            {selectedScenario.actionLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
