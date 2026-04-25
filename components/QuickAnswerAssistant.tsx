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
    <div className="rounded-[1.65rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,15,18,0.7),rgba(8,8,10,0.62))] p-5 shadow-[0_22px_54px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/52">
            Quick answer
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-white md:text-[1.55rem]">
              Need the fast path?
            </h2>
            <span className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/58">
              no blind scroll
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/66">
            Pick the situation and jump straight to the page that solves it.
          </p>
        </div>

        <div className="hidden rounded-2xl border border-white/10 bg-white/[0.055] p-2.5 text-white/62 md:block">
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
                  "rounded-2xl border px-3.5 py-3 text-left transition",
                  active
                    ? "border-red-200/24 bg-[linear-gradient(180deg,rgba(255,55,90,0.105),rgba(18,18,21,0.58))] shadow-[0_14px_32px_rgba(0,0,0,0.2)]"
                    : "border-white/10 bg-white/[0.035] hover:border-white/18 hover:bg-white/[0.055]"
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

        <div className="rounded-[1.45rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.044),rgba(255,255,255,0.018))] p-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/52">
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
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Target
            </p>
            <p className="mt-1.5 text-sm text-white/84">
              {selectedScenario.target}
            </p>
          </div>

          <button
            type="button"
            onClick={selectedScenario.onAction}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-red-200/28 bg-red-500/[0.105] px-4 py-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-red-100 transition hover:border-red-100/42 hover:bg-red-500/[0.16]"
          >
            {selectedScenario.actionLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
