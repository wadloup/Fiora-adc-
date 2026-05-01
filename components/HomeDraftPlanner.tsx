import { useMemo, useState } from "react";
import {
  ArrowRight,
  Crosshair,
  HeartHandshake,
  Shield,
  Sparkles,
  Swords,
} from "lucide-react";
import { cn } from "../utils/cn";

type SupportProfile = "engage" | "peel" | "enchanter" | "unknown";
type EnemyProfile = "poke" | "hook" | "scaling" | "chaos";
type LaneGoal = "kill" | "stable" | "autofill";

type PlannerOption<T extends string> = {
  id: T;
  label: string;
  title: string;
  detail: string;
};

type PlannerResult = {
  eyebrow: string;
  title: string;
  detail: string;
  primaryLabel: string;
  secondaryLabel: string;
  tone: "red" | "cyan" | "amber";
  onPrimary: () => void;
  onSecondary: () => void;
};

type HomeDraftPlannerProps = {
  onOpenSupport: () => void;
  onOpenLaneSupport: () => void;
  onOpenRunes: () => void;
  onOpenBuild: () => void;
};

const supportOptions: Array<PlannerOption<SupportProfile>> = [
  {
    id: "engage",
    label: "Engage",
    title: "Alistar / Rakan",
    detail: "You can actually reach someone.",
  },
  {
    id: "peel",
    label: "Peel",
    title: "Braum / Taric",
    detail: "Short trades, survive contact.",
  },
  {
    id: "enchanter",
    label: "Enchanter",
    title: "Yuumi / Sona",
    detail: "Respect early HP, scale the repeat entry.",
  },
  {
    id: "unknown",
    label: "Unknown",
    title: "Autofill danger",
    detail: "Assume the lane needs instructions.",
  },
];

const enemyOptions: Array<PlannerOption<EnemyProfile>> = [
  {
    id: "poke",
    label: "Poke",
    title: "Double range",
    detail: "HP decides if Fiora ever plays.",
  },
  {
    id: "hook",
    label: "Hook",
    title: "All-in lane",
    detail: "Riposte timing and wave size matter.",
  },
  {
    id: "scaling",
    label: "Scaling",
    title: "Slow lane",
    detail: "Crash cleanly, then punish greed.",
  },
  {
    id: "chaos",
    label: "Chaos",
    title: "Unknown draft",
    detail: "Default to the safe first three waves.",
  },
];

const goalOptions: Array<PlannerOption<LaneGoal>> = [
  {
    id: "kill",
    label: "Kill",
    title: "Force contact",
    detail: "Only if access and wave are real.",
  },
  {
    id: "stable",
    label: "Stable",
    title: "No donation",
    detail: "Protect HP, take the first clean window.",
  },
  {
    id: "autofill",
    label: "Teach support",
    title: "Make it obvious",
    detail: "Open the support route before lane starts.",
  },
];

function PlannerGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: Array<PlannerOption<T>>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
        {title}
      </p>
      <div className="mt-3 grid gap-2">
        {options.map((option) => {
          const active = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "group rounded-2xl border px-3 py-3 text-left transition",
                active
                  ? "border-red-300/45 bg-red-500/12 shadow-[0_0_18px_rgba(255,0,64,0.14)]"
                  : "border-white/10 bg-white/[0.045] hover:border-red-500/24 hover:bg-red-500/[0.055]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-white">{option.label}</p>
                  <p className="mt-1 truncate text-xs font-semibold text-white/64">
                    {option.title}
                  </p>
                </div>
                <span
                  className={cn(
                    "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border",
                    active
                      ? "border-red-100 bg-red-300 shadow-[0_0_14px_rgba(255,90,120,0.55)]"
                      : "border-white/22 bg-white/8"
                  )}
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/52">
                {option.detail}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function HomeDraftPlanner({
  onOpenSupport,
  onOpenLaneSupport,
  onOpenRunes,
  onOpenBuild,
}: HomeDraftPlannerProps) {
  const [support, setSupport] = useState<SupportProfile>("unknown");
  const [enemy, setEnemy] = useState<EnemyProfile>("chaos");
  const [goal, setGoal] = useState<LaneGoal>("stable");

  const result = useMemo<PlannerResult>(() => {
    if (goal === "autofill" || support === "unknown") {
      return {
        eyebrow: "Support emergency",
        title: "Open the support route before anyone locks grief.",
        detail:
          "The lane needs clear engage rules, wave timing, and what not to press while Fiora is still walking.",
        primaryLabel: "Open Support Check",
        secondaryLabel: "Lane Support Timing",
        tone: "red",
        onPrimary: onOpenSupport,
        onSecondary: onOpenLaneSupport,
      };
    }

    if (enemy === "poke" || support === "enchanter") {
      return {
        eyebrow: "Stabilize first",
        title: "Do not trade HP for vibes. Build the lane slowly.",
        detail:
          "Start with rune safety and the first-wave rule. Fiora gets dangerous after HP is protected.",
        primaryLabel: "Open Runes",
        secondaryLabel: "Open Build Routes",
        tone: "cyan",
        onPrimary: onOpenRunes,
        onSecondary: onOpenBuild,
      };
    }

    if (support === "engage" && goal === "kill") {
      return {
        eyebrow: "Green light",
        title: "You can play for first real contact.",
        detail:
          "Hold engage until Fiora can Q in, respect wave size, then convert the first panic step.",
        primaryLabel: "Support Timing",
        secondaryLabel: "Open Build Routes",
        tone: "red",
        onPrimary: onOpenLaneSupport,
        onSecondary: onOpenBuild,
      };
    }

    if (enemy === "hook") {
      return {
        eyebrow: "Discipline lane",
        title: "Bait the hook lane into wasting its first threat.",
        detail:
          "The lane flips when Riposte, brush timing, and wave size line up. No hero walk-ups.",
        primaryLabel: "Lane Support Timing",
        secondaryLabel: "Open Runes",
        tone: "amber",
        onPrimary: onOpenLaneSupport,
        onSecondary: onOpenRunes,
      };
    }

    return {
      eyebrow: "Default plan",
      title: "Protect level 1, posture level 2, threaten level 3.",
      detail:
        "This is the clean route when draft is playable but not free. No coinflip needed.",
      primaryLabel: "Open Support Check",
      secondaryLabel: "Open Runes",
      tone: "cyan",
      onPrimary: onOpenSupport,
      onSecondary: onOpenRunes,
    };
  }, [
    enemy,
    goal,
    onOpenBuild,
    onOpenLaneSupport,
    onOpenRunes,
    onOpenSupport,
    support,
  ]);

  return (
    <section className="rounded-[1.7rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,67,98,0.16),transparent_34%),linear-gradient(135deg,rgba(12,14,18,0.92),rgba(21,7,13,0.86))] p-4 shadow-[0_0_20px_rgba(255,0,60,0.1)] md:p-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
                <Crosshair className="h-3.5 w-3.5" />
                Draft planner
              </p>
              <h2 className="mt-2 text-2xl font-black text-white md:text-[1.9rem]">
                Lock the first three minutes before lane starts
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/62">
                Pick the lane shape and get the fastest route through the guide.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/65">
              <Sparkles className="h-3.5 w-3.5 text-red-200" />
              local logic
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <PlannerGroup
              title="Your support"
              options={supportOptions}
              value={support}
              onChange={setSupport}
            />
            <PlannerGroup
              title="Enemy lane"
              options={enemyOptions}
              value={enemy}
              onChange={setEnemy}
            />
            <PlannerGroup
              title="Your goal"
              options={goalOptions}
              value={goal}
              onChange={setGoal}
            />
          </div>
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-[1.5rem] border p-5",
            result.tone === "red"
              ? "border-red-300/30 bg-[linear-gradient(180deg,rgba(255,55,90,0.16),rgba(10,8,12,0.72))]"
              : result.tone === "amber"
                ? "border-amber-300/25 bg-[linear-gradient(180deg,rgba(255,190,80,0.13),rgba(10,8,12,0.74))]"
                : "border-cyan-200/20 bg-[linear-gradient(180deg,rgba(80,210,255,0.12),rgba(10,8,12,0.74))]"
          )}
        >
          <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/20 p-3 text-white/55">
            {result.tone === "red" ? (
              <Swords className="h-5 w-5" />
            ) : result.tone === "amber" ? (
              <Shield className="h-5 w-5" />
            ) : (
              <HeartHandshake className="h-5 w-5" />
            )}
          </div>

          <p className="pr-14 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200">
            {result.eyebrow}
          </p>
          <h3 className="mt-3 pr-10 text-2xl font-black leading-tight text-white">
            {result.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/68">
            {result.detail}
          </p>

          <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <button
              type="button"
              onClick={result.onPrimary}
              className="group inline-flex items-center justify-between gap-3 rounded-2xl border border-red-200/40 bg-red-500/16 px-4 py-3 text-left text-xs font-black uppercase tracking-[0.14em] text-white transition hover:border-red-100/70 hover:bg-red-500/24"
            >
              <span>{result.primaryLabel}</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={result.onSecondary}
              className="group inline-flex items-center justify-between gap-3 rounded-2xl border border-white/12 bg-white/[0.055] px-4 py-3 text-left text-xs font-black uppercase tracking-[0.14em] text-white/82 transition hover:border-red-500/28 hover:bg-red-500/[0.08] hover:text-white"
            >
              <span>{result.secondaryLabel}</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
