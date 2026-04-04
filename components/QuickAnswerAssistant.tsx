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
    <div className="rounded-3xl border border-red-500/25 bg-[rgba(18,8,11,0.76)] p-5 shadow-[0_0_24px_rgba(255,0,60,0.12)] md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300">
            Quick answer
          </p>
          <h2 className="mt-2 text-2xl font-black text-white md:text-[2rem]">
            Need the fast path?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/72 md:text-[0.98rem]">
            Pick the situation and the site sends you to the page that solves
            the question fastest instead of making you browse blind.
          </p>
        </div>

        <div className="hidden rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-red-200 md:block">
          <Radar className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-2">
          {scenarios.map((scenario) => {
            const active = scenario.id === selectedScenario.id;

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left transition",
                  active
                    ? "border-red-400/40 bg-[linear-gradient(180deg,rgba(255,55,90,0.14),rgba(25,8,12,0.76))] shadow-[0_0_20px_rgba(255,0,60,0.12)]"
                    : "border-white/10 bg-white/[0.04] hover:border-red-500/20 hover:bg-red-500/[0.05]"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-white">
                    {scenario.label}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/68">
                    {scenario.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            {selectedScenario.category}
          </div>

          <p className="mt-3 text-2xl font-black text-white">
            {selectedScenario.label}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-white/78 md:text-base">
            {selectedScenario.answer}
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
              Target
            </p>
            <p className="mt-2 text-sm text-white/84">{selectedScenario.target}</p>
          </div>

          <button
            type="button"
            onClick={selectedScenario.onAction}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/[0.12] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-red-100 transition hover:bg-red-500/[0.18]"
          >
            {selectedScenario.actionLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
