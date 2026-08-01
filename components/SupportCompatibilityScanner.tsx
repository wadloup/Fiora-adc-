import { useMemo, useState } from "react";
import { Brain, Gauge, Radar, Shield, Sword, Zap } from "lucide-react";
import {
  enemyLaneProfiles,
  supportMentalProfiles,
  supportScannerOptions,
  type EnemyLaneKey,
  type MentalKey,
  type ScannerScores,
  type SupportKey,
} from "../data/draftBrain";
import { cn } from "../utils/cn";
import NeonCard from "./ui/NeonCard";

const metricLabels: Array<{
  key: keyof ScannerScores;
  label: string;
  icon: typeof Sword;
}> = [
  { key: "access", label: "Access", icon: Sword },
  { key: "protection", label: "Peel", icon: Shield },
  { key: "sustain", label: "Sustain", icon: Zap },
  { key: "discipline", label: "Discipline", icon: Brain },
  { key: "chaos", label: "Chaos risk", icon: Radar },
];

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getVerdict(score: number, supportId: SupportKey, mentalId: MentalKey) {
  if (supportId === "yuumi" && mentalId === "roamer") {
    return {
      label: "Contradictory input",
      tone: "cyan",
      detail: "Yuumi cannot express a normal roam profile. Read this selection as early detachment or lane absence: Fiora loses attached protection, bush presence, and wave help at the same time.",
    };
  }

  if (score >= 88) {
    return {
      label: "Compatible",
      tone: "green",
      detail: "The selected support profile supplies both usable access and protection for this lane family. The score is role fit, not a win probability; the sequence and failure point below still decide the lane.",
    };
  }

  if (score >= 73) {
    return {
      label: "Playable",
      tone: "cyan",
      detail: "The pairing has a coherent contact pattern, but one dimension is conditional. Play through the strongest metric and do not force the lane through the missing access, protection, sustain, or discipline.",
    };
  }

  if (score >= 58) {
    return {
      label: "Narrow execution window",
      tone: "yellow",
      detail: "The draft can work only through the listed trigger. A generic engage or repeated neutral trade exposes the pairing's weak dimensions faster than its strength can pay off.",
    };
  }

  if (score >= 43) {
    return {
      label: "High support dependency",
      tone: "orange",
      detail: "Access, protection, or wave control is too low for repeated mistakes. Preserve HP and shorten the lane until jungle pressure, a missed enemy control spell, or an item threshold supplies the missing part.",
    };
  }

  return {
    label: "Draft does not solve access",
    tone: "red",
    detail: "The current support behavior and enemy lane leave Fiora without a reliable first target or protected exit. Do not manufacture an all-in; play for a held wave, jungle route, and Hydra timing.",
  };
}

function getToneClasses(tone: string) {
  if (tone === "green") {
    return "border-emerald-300/40 bg-emerald-400/10 text-emerald-100";
  }

  if (tone === "cyan") {
    return "border-cyan-200/40 bg-cyan-300/10 text-cyan-100";
  }

  if (tone === "yellow") {
    return "border-yellow-200/45 bg-yellow-300/10 text-yellow-100";
  }

  if (tone === "orange") {
    return "border-orange-300/45 bg-orange-400/10 text-orange-100";
  }

  return "border-red-300/45 bg-red-500/12 text-red-100";
}

function evaluateDraft(
  supportId: SupportKey,
  mentalId: MentalKey,
  enemyId: EnemyLaneKey
) {
  const support =
    supportScannerOptions.find((item) => item.id === supportId) ??
    supportScannerOptions[0];
  const mental =
    supportMentalProfiles.find((item) => item.id === mentalId) ??
    supportMentalProfiles[0];
  const enemy =
    enemyLaneProfiles.find((item) => item.id === enemyId) ??
    enemyLaneProfiles[0];

  const metrics = metricLabels.reduce((acc, metric) => {
    const key = metric.key;
    const value =
      support.scores[key] + (mental.patch[key] ?? 0) + (enemy.patch[key] ?? 0);
    return { ...acc, [key]: clamp(value) };
  }, {} as ScannerScores);

  let synergy = 0;

  if (enemyId === "draven" && ["braum", "taric", "alistar"].includes(supportId)) {
    synergy += 9;
  }

  if (enemyId === "doubleRange" && ["sona", "soraka", "yuumi"].includes(supportId)) {
    synergy += 8;
  }

  if (enemyId === "scaling" && ["leona", "nautilus", "rakan", "alistar"].includes(supportId)) {
    synergy += 7;
  }

  if (enemyId === "hook" && ["lulu", "braum", "taric", "thresh"].includes(supportId)) {
    synergy += 7;
  }

  if (mentalId === "roamer" && ["pyke", "rakan", "thresh"].includes(supportId)) {
    synergy -= 11;
  }

  if (mentalId === "panic" && ["leona", "nautilus", "pyke"].includes(supportId)) {
    synergy -= 8;
  }

  if (supportId === "sona" && enemyId === "draven") {
    synergy -= 14;
  }

  const weighted =
    metrics.access * 0.26 +
    metrics.protection * 0.23 +
    metrics.sustain * 0.16 +
    metrics.discipline * 0.25 +
    (100 - metrics.chaos) * 0.1;

  const score = clamp(weighted + mental.score + enemy.score + synergy);
  return {
    support,
    mental,
    enemy,
    metrics,
    score,
    verdict: getVerdict(score, supportId, mentalId),
    plan: [support.plan, enemy.advice, mental.note],
    risk: support.risk,
  };
}

function ChoiceButton({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group rounded-2xl border px-3 py-3 text-left transition duration-200 hover:-translate-y-0.5",
        active
          ? "border-red-200/60 bg-red-500/18 shadow-[0_0_24px_rgba(244,63,94,0.2)]"
          : "border-white/10 bg-black/24 hover:border-white/25 hover:bg-white/[0.055]"
      )}
    >
      <span className="block text-sm font-black text-white">{title}</span>
      <span className="mt-1 block text-xs leading-relaxed text-white/55">
        {subtitle}
      </span>
    </button>
  );
}

function Meter({
  label,
  value,
  icon: Icon,
  dangerous,
}: {
  label: string;
  value: number;
  icon: typeof Sword;
  dangerous?: boolean;
}) {
  const color = dangerous
    ? "from-red-400 via-orange-300 to-yellow-100"
    : "from-red-400 via-pink-200 to-cyan-100";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/28 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-red-200" />
          <span className="text-xs font-black uppercase tracking-[0.14em] text-white/62">
            {label}
          </span>
        </div>
        <span className="text-sm font-black text-white">{value}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function SupportCompatibilityScanner() {
  const [supportId, setSupportId] = useState<SupportKey>("alistar");
  const [mentalId, setMentalId] = useState<MentalKey>("locked");
  const [enemyId, setEnemyId] = useState<EnemyLaneKey>("doubleRange");

  const result = useMemo(
    () => evaluateDraft(supportId, mentalId, enemyId),
    [supportId, mentalId, enemyId]
  );

  return (
    <NeonCard className="relative overflow-hidden p-5 md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(244,63,94,0.18),transparent_32%),radial-gradient(circle_at_88%_20%,rgba(34,211,238,0.12),transparent_28%)]" />
      <div className="relative z-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-red-300/30 bg-red-500/12 p-3 text-red-100">
              <Radar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-red-300">
                Local rule model
              </p>
              <h3 className="text-2xl font-black text-white md:text-3xl">
                Support Compatibility Scanner
              </h3>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/68 md:text-base">
            Pick the support, their lane behavior, and the enemy lane family.
            The score compares access, protection, sustain, discipline and
            chaos risk; it is a draft explanation, not a fabricated win rate.
          </p>

          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
              Support pick
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {supportScannerOptions.map((support) => (
                <ChoiceButton
                  key={support.id}
                  active={support.id === supportId}
                  title={support.name}
                  subtitle={support.archetype}
                  onClick={() => setSupportId(support.id)}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                Support mental
              </p>
              <div className="mt-3 grid gap-2">
                {supportMentalProfiles.map((mental) => (
                  <ChoiceButton
                    key={mental.id}
                    active={mental.id === mentalId}
                    title={mental.label}
                    subtitle={mental.text}
                    onClick={() => setMentalId(mental.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                Enemy botlane
              </p>
              <div className="mt-3 grid gap-2">
                {enemyLaneProfiles.map((enemy) => (
                  <ChoiceButton
                    key={enemy.id}
                    active={enemy.id === enemyId}
                    title={enemy.label}
                    subtitle={enemy.text}
                    onClick={() => setEnemyId(enemy.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/12 bg-black/42 p-4 shadow-[0_0_38px_rgba(0,0,0,0.25)] md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-red-300">
                Verdict
              </p>
              <p className="mt-2 max-w-md text-3xl font-black leading-none text-white md:text-4xl">
                {result.verdict.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/64">
                {result.verdict.detail}
              </p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-black leading-none text-white md:text-7xl">
                {result.score}
              </div>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                compatibility
              </p>
            </div>
          </div>

          <div
            className={cn(
              "mt-5 inline-flex rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em]",
              getToneClasses(result.verdict.tone)
            )}
          >
            {result.support.name} into {result.enemy.label}
          </div>

          <div className="mt-5 grid gap-3">
            {metricLabels.map((metric) => (
              <Meter
                key={metric.key}
                label={metric.label}
                value={result.metrics[metric.key]}
                icon={metric.icon}
                dangerous={metric.key === "chaos"}
              />
            ))}
          </div>

          <div className="mt-5 rounded-3xl border border-red-300/18 bg-red-500/[0.07] p-4">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-red-200" />
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-200">
                Model limit and failure point
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/68">
              Risk: {result.risk}
            </p>
          </div>

          <div className="mt-4 grid gap-2">
            {result.plan.map((line, index) => (
              <div
                key={line}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-red-300/25 bg-red-500/10 text-xs font-black text-red-100">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-white/68">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NeonCard>
  );
}
