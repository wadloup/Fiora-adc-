import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Copy,
  Crosshair,
  Eye,
  Info,
  Maximize2,
  RotateCcw,
  Shield,
  Swords,
  Target,
  Timer,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { botLaneCarries } from "../data/botLaneCarries";
import {
  BOT_LANE_PATCH,
  laneIntents,
  type BotCarryProfile,
  type BotSupportProfile,
} from "../data/botLanePatch";
import { botLaneSupports } from "../data/botLaneSupports";
import {
  buildLaneGameplan,
  type LaneArrival,
  type ReadTone,
} from "../data/laneGameplan";
import {
  DEFAULT_DRAFT_SELECTION,
  LANE_GAMEPLAN_STORAGE_KEY,
  readLaneGameplanSelection,
  type DraftSelection,
} from "../data/laneGameplanState";
import { cn } from "../utils/cn";
import { recoverImage } from "../utils/imageFallback";

type HomePregameDeskPatchProps = {
  onOpenSupport: () => void;
  onOpenLaneSupport: () => void;
  onOpenRunes: () => void;
  onOpenBuild: () => void;
  onOpenMacro: () => void;
};

type ChampionOption = Pick<
  BotCarryProfile | BotSupportProfile,
  "id" | "name" | "image"
> & {
  descriptor: string;
};

const ARRIVAL_OPTIONS: Array<{
  id: LaneArrival;
  label: string;
  detail: string;
}> = [
  { id: "first", label: "First", detail: "Your duo enters lane first." },
  { id: "even", label: "Even", detail: "Both duos arrive together." },
  { id: "late", label: "Late", detail: "Enemy lane owns the first setup." },
];

const toneText: Record<ReadTone, string> = {
  red: "text-red-200",
  cyan: "text-cyan-200",
  amber: "text-amber-200",
  emerald: "text-emerald-200",
  neutral: "text-white/68",
};

function ChampionSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: ChampionOption[];
  onChange: (value: string) => void;
}) {
  const selected = options.find((option) => option.id === value) || options[0];

  return (
    <label className="grid min-w-0 grid-cols-[42px_1fr] items-center gap-3 border-b border-white/10 pb-3 last:border-b-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3 sm:last:border-r-0 sm:last:pr-0">
      <img
        src={selected.image}
        alt=""
        className="h-10 w-10 rounded-md border border-white/15 object-cover object-top"
        loading="lazy"
        decoding="async"
        onError={recoverImage}
      />
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/42">
          {label}
        </span>
        <select
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 h-7 w-full min-w-0 bg-transparent text-sm font-black text-white outline-none"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id} className="bg-[#101116]">
              {option.name} - {option.descriptor}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function ContextToggle({
  checked,
  label,
  detail,
  tone,
  onChange,
}: {
  checked: boolean;
  label: string;
  detail: string;
  tone: "red" | "cyan";
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-[68px] cursor-pointer items-start gap-3 border-l border-white/10 px-3 py-2 first:border-l-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className={cn(
          "mt-1 h-4 w-4 shrink-0",
          tone === "red" ? "accent-red-400" : "accent-cyan-300"
        )}
      />
      <span>
        <span className="block text-[10px] font-black uppercase tracking-[0.1em] text-white/76">
          {label}
        </span>
        <span className="mt-1 block text-[11px] leading-snug text-white/42">
          {detail}
        </span>
      </span>
    </label>
  );
}

export default function HomePregameDeskPatch({
  onOpenSupport,
  onOpenLaneSupport,
  onOpenRunes,
  onOpenBuild,
  onOpenMacro,
}: HomePregameDeskPatchProps) {
  const [selection, setSelection] = useState<DraftSelection>(readLaneGameplanSelection);
  const [activePhase, setActivePhase] = useState("wave-one");
  const [queueCardOpen, setQueueCardOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const allySupport =
    botLaneSupports.find((option) => option.id === selection.allySupport) ||
    botLaneSupports[0];
  const enemyCarry =
    botLaneCarries.find((option) => option.id === selection.enemyCarry) ||
    botLaneCarries[0];
  const enemySupport =
    botLaneSupports.find((option) => option.id === selection.enemySupport) ||
    botLaneSupports[0];

  const gameplan = useMemo(
    () =>
      buildLaneGameplan(allySupport, enemyCarry, enemySupport, {
        intent: selection.intent,
        arrival: selection.arrival,
        allySupportForward: selection.allySupportForward,
        enemyControlSpent: selection.enemyControlSpent,
        fioraFlashAvailable: selection.fioraFlashAvailable,
        enemyCarryFlashAvailable: selection.enemyCarryFlashAvailable,
        junglePathBot: selection.junglePathBot,
        triBrushControl: selection.triBrushControl,
      }),
    [allySupport, enemyCarry, enemySupport, selection]
  );

  const selectedPhase =
    gameplan.phases.find((phase) => phase.id === activePhase) || gameplan.phases[1];

  useEffect(() => {
    window.localStorage.setItem(LANE_GAMEPLAN_STORAGE_KEY, JSON.stringify(selection));
  }, [selection]);

  useEffect(() => {
    if (!queueCardOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setQueueCardOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [queueCardOpen]);

  const updateSelection = <Key extends keyof DraftSelection>(
    key: Key,
    value: DraftSelection[Key]
  ) => setSelection((current) => ({ ...current, [key]: value }));

  const resetGameplan = () => {
    setSelection(DEFAULT_DRAFT_SELECTION);
    setActivePhase("wave-one");
    setCopied(false);
  };

  const briefingText = useMemo(
    () =>
      [
        `FIORA ADC GAMEPLAN / PATCH ${BOT_LANE_PATCH.patch}`,
        `${allySupport.name} vs ${enemyCarry.name} + ${enemySupport.name}`,
        `LEVEL 1: ${gameplan.levelOneCall}`,
        gameplan.levelOneWhy,
        `ALL-IN READ: ${gameplan.levelOneAllIn}`,
        `RUNES: ${gameplan.rune} - ${gameplan.runeReason}`,
        `LEVEL 2: ${gameplan.levelTwoSkill} - ${gameplan.levelTwoReason}`,
        `REVERSAL: ${gameplan.levelTwoReversal}`,
        `TARGET: ${gameplan.targetPlan}`,
        `RIPOSTE: ${gameplan.ripostePlan}`,
        `VITALS: ${gameplan.vitalPlan}`,
        `SUMMONERS: ${gameplan.summonerPlan}`,
        `SUPPORT MOVEMENT: ${gameplan.supportMovementPlan}`,
        `LEVEL 6: ${gameplan.levelSixPlan}`,
        `BUILD: ${gameplan.build}`,
        ...gameplan.phases.map(
          (phase) =>
            `${phase.marker} / ${phase.title}: ${phase.plan} Reversal: ${phase.reversal}`
        ),
      ].join("\n\n"),
    [allySupport.name, enemyCarry.name, enemySupport.name, gameplan]
  );

  const copyBriefing = async () => {
    try {
      await navigator.clipboard.writeText(briefingText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const carryOptions = botLaneCarries.map((carry) => ({
    id: carry.id,
    name: carry.name,
    image: carry.image,
    descriptor: carry.archetype,
  }));
  const allySupportOptions = botLaneSupports.map((support) => ({
    id: support.id,
    name: support.name,
    image: support.image,
    descriptor: support.allyLabel,
  }));
  const enemySupportOptions = botLaneSupports.map((support) => ({
    id: support.id,
    name: support.name,
    image: support.image,
    descriptor: support.archetype,
  }));

  return (
    <>
      <section
        data-testid="gameplan-builder"
        className="overflow-hidden rounded-lg border border-white/14 bg-[rgba(7,8,11,0.96)] shadow-[0_22px_70px_rgba(0,0,0,0.32)]"
      >
        <header className="flex flex-col gap-4 border-b border-white/10 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
              <Crosshair className="h-3.5 w-3.5" />
              Fiora ADC gameplan
            </p>
            <h2 className="mt-1 text-xl font-black text-white md:text-2xl">
              Build the lane from the actual draft
            </h2>
            <p className="mt-1 text-xs text-white/46">
              Mechanics-first read. No invented matchup win rate.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-red-300/25 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-red-100">
              Patch {BOT_LANE_PATCH.patch}
            </span>
            <button
              type="button"
              onClick={resetGameplan}
              title="Reset gameplan"
              aria-label="Reset gameplan"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/12 bg-white/[0.04] text-white/62 transition hover:border-white/28 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="border-b border-white/10 px-4 py-4 md:px-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <ChampionSelect
              label="Your support"
              value={selection.allySupport}
              options={allySupportOptions}
              onChange={(value) => updateSelection("allySupport", value)}
            />
            <ChampionSelect
              label="Enemy carry"
              value={selection.enemyCarry}
              options={carryOptions}
              onChange={(value) => updateSelection("enemyCarry", value)}
            />
            <ChampionSelect
              label="Enemy support"
              value={selection.enemySupport}
              options={enemySupportOptions}
              onChange={(value) => updateSelection("enemySupport", value)}
            />
          </div>

          <div className="mt-4 grid gap-4 border-t border-white/8 pt-4 min-[1500px]:grid-cols-[0.9fr_0.9fr_1.7fr]">
            <fieldset>
              <legend className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/42">
                Lane arrival
              </legend>
              <div className="mt-2 grid h-10 grid-cols-3 overflow-hidden rounded-md border border-white/12">
                {ARRIVAL_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    title={option.detail}
                    onClick={() => updateSelection("arrival", option.id)}
                    className={cn(
                      "border-r border-white/10 text-[10px] font-black uppercase tracking-[0.08em] transition last:border-r-0",
                      selection.arrival === option.id
                        ? "bg-cyan-300/14 text-cyan-100"
                        : "bg-white/[0.025] text-white/46 hover:text-white"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/42">
                Lane posture
              </legend>
              <div className="mt-2 grid h-10 grid-cols-3 overflow-hidden rounded-md border border-white/12">
                {laneIntents.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    title={option.detail}
                    onClick={() => updateSelection("intent", option.id)}
                    className={cn(
                      "border-r border-white/10 text-[10px] font-black uppercase tracking-[0.08em] transition last:border-r-0",
                      selection.intent === option.id
                        ? "bg-red-500/16 text-red-100"
                        : "bg-white/[0.025] text-white/46 hover:text-white"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid overflow-hidden rounded-md border border-white/10 sm:grid-cols-2 min-[1800px]:grid-cols-3">
              <ContextToggle
                checked={selection.allySupportForward}
                label="Support in range"
                detail="Can share the first target."
                tone="red"
                onChange={(value) => updateSelection("allySupportForward", value)}
              />
              <ContextToggle
                checked={selection.enemyControlSpent}
                label="Key CC spent"
                detail="Enemy first answer is down."
                tone="cyan"
                onChange={(value) => updateSelection("enemyControlSpent", value)}
              />
              <ContextToggle
                checked={selection.fioraFlashAvailable}
                label="Fiora Flash ready"
                detail="Second-position follow is possible."
                tone="red"
                onChange={(value) => updateSelection("fioraFlashAvailable", value)}
              />
              <ContextToggle
                checked={selection.enemyCarryFlashAvailable}
                label="Carry Flash ready"
                detail="First catch may only force it."
                tone="cyan"
                onChange={(value) =>
                  updateSelection("enemyCarryFlashAvailable", value)
                }
              />
              <ContextToggle
                checked={selection.junglePathBot}
                label="Jungle paths bot"
                detail="Wave 3-4 route is possible."
                tone="red"
                onChange={(value) => updateSelection("junglePathBot", value)}
              />
              <ContextToggle
                checked={selection.triBrushControl}
                label="Tri-bush clear"
                detail="One warning angle removed."
                tone="cyan"
                onChange={(value) => updateSelection("triBrushControl", value)}
              />
            </div>
          </div>
        </div>

        <div className="relative min-h-[330px] overflow-hidden border-b border-white/10">
          <img
            src={enemyCarry.image}
            alt={enemyCarry.name}
            className="absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-46"
            loading="lazy"
            decoding="async"
            onError={recoverImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,8,0.98)_0%,rgba(5,6,8,0.88)_48%,rgba(5,6,8,0.42)_100%)]" />
          <div className="relative grid min-h-[330px] gap-6 px-4 py-6 md:px-6 md:py-7 min-[1500px]:grid-cols-[1.25fr_0.75fr]">
            <div className="flex flex-col justify-center">
              <p className={cn("text-[10px] font-black uppercase tracking-[0.18em]", toneText[gameplan.levelOneTone])}>
                Level 1 verdict
              </p>
              <motion.h3
                data-testid="level-one-verdict"
                key={gameplan.headline}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 max-w-3xl text-3xl font-black leading-tight text-white md:text-4xl"
              >
                {gameplan.headline}
              </motion.h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/72 md:text-base">
                {gameplan.levelOneWhy}
              </p>
              <p className="mt-3 max-w-3xl border-l-2 border-red-300/55 pl-3 text-sm leading-relaxed text-white/58">
                {gameplan.summary}
              </p>
            </div>

            <div className="self-end border-t border-white/14 pt-4 min-[1500px]:self-center min-[1500px]:border-l min-[1500px]:border-t-0 min-[1500px]:pl-5 min-[1500px]:pt-0">
              <div className="flex items-center gap-3">
                {[allySupport, enemyCarry, enemySupport].map((champion) => (
                  <div key={champion.id} className="text-center">
                    <img
                      src={champion.image}
                      alt={champion.name}
                      className="h-12 w-12 rounded-md border border-white/20 object-cover object-top"
                      loading="lazy"
                      decoding="async"
                      onError={recoverImage}
                    />
                    <span className="mt-1 block max-w-14 truncate text-[9px] font-black uppercase text-white/60">
                      {champion.name}
                    </span>
                  </div>
                ))}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.12em] text-white/40">Rune</dt>
                  <dd className="mt-1 font-black text-red-100">{gameplan.rune}</dd>
                </div>
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.12em] text-white/40">Level 2</dt>
                  <dd className="mt-1 font-black text-cyan-100">{gameplan.levelTwoSkill}</dd>
                </div>
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.12em] text-white/40">Start</dt>
                  <dd className="mt-1 font-black text-white/82">{gameplan.starter}</dd>
                </div>
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.12em] text-white/40">Post-Hubris</dt>
                  <dd className="mt-1 font-black text-amber-100">{gameplan.pivot}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="grid border-b border-white/10 sm:grid-cols-2 min-[1500px]:grid-cols-5">
          {gameplan.dimensions.map((dimension) => (
            <div key={dimension.label} className="group border-b border-white/10 px-4 py-4 last:border-b-0 sm:border-r min-[1500px]:border-b-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/38">
                {dimension.label}
              </p>
              <p className={cn("mt-1 text-sm font-black", toneText[dimension.tone])}>
                {dimension.value}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-white/46">
                {dimension.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="grid border-b border-white/10 min-[1500px]:grid-cols-[1.2fr_0.8fr]">
          <section className="p-4 md:p-6 min-[1500px]:border-r min-[1500px]:border-white/10">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-red-200" />
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-white">
                Can Fiora all-in level 1?
              </h3>
            </div>
            <p className="mt-3 text-base leading-relaxed text-white/78">
              {gameplan.levelOneAllIn}
            </p>

            <ol className="mt-5 border-y border-white/10">
              {gameplan.levelOneSequence.map((step, index) => (
                <li key={step} className="grid grid-cols-[34px_1fr] gap-3 border-b border-white/8 py-3 last:border-b-0">
                  <span className="text-[10px] font-black text-red-300">0{index + 1}</span>
                  <span className="text-sm leading-relaxed text-white/66">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <aside className="bg-white/[0.018] p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-cyan-200" />
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-white">
                What changes this read
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/44">
              These are reversal conditions, not separate generic tips.
            </p>
            <ul className="mt-4 space-y-3">
              {gameplan.planChangesWhen.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/66">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <section className="border-b border-white/10 px-4 py-5 md:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                <Clock3 className="h-3.5 w-3.5" />
                State changes
              </p>
              <h3 className="mt-1 text-xl font-black text-white">
                The same draft does not stay the same lane
              </h3>
            </div>
          </div>
          <div className="mt-5 grid border-y border-white/10 min-[1500px]:grid-cols-3">
            <div className="border-b border-white/10 py-4 min-[1500px]:border-b-0 min-[1500px]:border-r min-[1500px]:pr-5">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-red-200">
                <Zap className="h-3.5 w-3.5" />
                Flash economy
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/66">
                {gameplan.summonerPlan}
              </p>
            </div>
            <div className="border-b border-white/10 py-4 min-[1500px]:border-b-0 min-[1500px]:border-r min-[1500px]:px-5">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-200">
                <Eye className="h-3.5 w-3.5" />
                Support movement
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/66">
                {gameplan.supportMovementPlan}
              </p>
            </div>
            <div className="py-4 min-[1500px]:pl-5">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-amber-200">
                <Swords className="h-3.5 w-3.5" />
                Level 6 rebuild
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/66">
                {gameplan.levelSixPlan}
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-5 md:px-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                <Clock3 className="h-3.5 w-3.5" />
                Lane timeline
              </p>
              <h3 className="mt-1 text-xl font-black text-white">Play the state, not the label</h3>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-white/44">
              Each phase includes the intended play, the information required to execute it, and the condition that cancels it.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-md border border-white/12 sm:grid-cols-4 min-[1500px]:grid-cols-8">
            {gameplan.phases.map((phase) => {
              const active = phase.id === selectedPhase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setActivePhase(phase.id)}
                  aria-pressed={active}
                  className={cn(
                    "relative min-h-[66px] border-b border-r border-white/10 px-3 py-3 text-left transition focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/55 last:border-r-0 min-[1500px]:border-b-0",
                    active ? "bg-red-500/16" : "bg-white/[0.02] hover:bg-white/[0.06]"
                  )}
                >
                  <span className={cn("block text-[9px] font-black uppercase tracking-[0.12em]", active ? "text-red-200" : "text-white/35")}>
                    {phase.marker}
                  </span>
                  <span className={cn("mt-1 block text-xs font-black", active ? "text-white" : "text-white/55")}>
                    {phase.title}
                  </span>
                  {active ? <span className="absolute inset-x-2 bottom-0 h-0.5 bg-red-300" /> : null}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPhase.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="mt-4 grid gap-5 border-t border-white/10 pt-5 min-[1500px]:grid-cols-[1.15fr_0.85fr]"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.13em] text-red-200">Objective</p>
                <p className="mt-2 text-lg font-black leading-snug text-white">{selectedPhase.objective}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/66">{selectedPhase.plan}</p>
                <div className="mt-4 border-l-2 border-cyan-300/45 pl-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-cyan-200">Reversal condition</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/62">{selectedPhase.reversal}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.13em] text-white/42">Information to confirm</p>
                <ul className="mt-3 space-y-3">
                  {selectedPhase.conditions.map((condition) => (
                    <li key={condition} className="flex gap-3 text-sm leading-relaxed text-white/62">
                      <CircleDot className="mt-1 h-3.5 w-3.5 shrink-0 text-cyan-200" />
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-l-2 border-amber-300/45 pl-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-200">Failure pattern</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/58">{selectedPhase.failure}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <div className="grid border-b border-white/10 min-[1500px]:grid-cols-2">
          <section className="p-4 md:p-6 min-[1500px]:border-r min-[1500px]:border-white/10">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-200">
              <Target className="h-3.5 w-3.5" />
              Enemy answer queue
            </p>
            <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {gameplan.threats.map((threat) => (
                <div key={threat.number} className="grid grid-cols-[28px_1fr] gap-3 py-3 sm:grid-cols-[36px_8rem_1fr]">
                  <span className={cn("text-[10px] font-black", toneText[threat.tone])}>{threat.number}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/56">{threat.label}</span>
                  <span className="col-start-2 text-sm leading-relaxed text-white/64 sm:col-auto">{threat.detail}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="p-4 md:p-6">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
              <Shield className="h-3.5 w-3.5" />
              Contact rules for this lane
            </p>
            <div className="mt-4 space-y-4">
              {[
                ["First legal target", gameplan.targetPlan],
                ["Riposte geometry", gameplan.ripostePlan],
                ["Vital price", gameplan.vitalPlan],
                [`Sync with ${allySupport.name}`, gameplan.supportSync],
              ].map(([label, detail]) => (
                <div key={label} className="border-l-2 border-white/14 pl-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.11em] text-white/48">{label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/64">{detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="border-b border-white/10 px-4 py-5 md:px-6">
          <div className="grid gap-5 min-[1500px]:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200">
                <Zap className="h-3.5 w-3.5" />
                Rune and level 2
              </p>
              <h3 className="mt-2 text-xl font-black text-white">{gameplan.rune}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/64">{gameplan.runeReason}</p>
              <p className="mt-3 border-l-2 border-white/14 pl-3 text-xs leading-relaxed text-white/48">
                {gameplan.runeAlternative}
              </p>
            </div>
            <div className="grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2 min-[1500px]:border-l min-[1500px]:border-t-0 min-[1500px]:pl-5 min-[1500px]:pt-0">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-cyan-200">Selected second spell</p>
                <p className="mt-2 text-lg font-black text-white">{gameplan.levelTwoSkill}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/62">{gameplan.levelTwoReason}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-200">When to change it</p>
                <p className="mt-2 text-sm leading-relaxed text-white/62">{gameplan.levelTwoReversal}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-5 md:px-6">
          <div className="flex flex-col gap-4 min-[1500px]:flex-row min-[1500px]:items-start min-[1500px]:justify-between">
            <div className="max-w-4xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">Build conversion</p>
              <p className="mt-2 text-lg font-black leading-relaxed text-white">{gameplan.build}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{gameplan.buildReason}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={onOpenMacro}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-cyan-300/35 bg-cyan-300/[0.08] px-4 text-[10px] font-black uppercase tracking-[0.1em] text-cyan-100 transition hover:bg-cyan-300/[0.14]"
              >
                After bot tower <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setQueueCardOpen(true)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-300/42 bg-red-500/14 px-4 text-[10px] font-black uppercase tracking-[0.1em] text-white transition hover:bg-red-500/22"
              >
                <Maximize2 className="h-4 w-4" />
                Queue card
              </button>
              <button
                type="button"
                onClick={() => void copyBriefing()}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/14 bg-white/[0.04] px-4 text-[10px] font-black uppercase tracking-[0.1em] text-white/72 transition hover:text-white"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-200" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy plan"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="flex max-w-4xl gap-2 text-[11px] leading-relaxed text-white/40">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {gameplan.evidenceNote}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={onOpenRunes} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/58 hover:text-white">
                Runes <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={onOpenBuild} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/58 hover:text-white">
                Build <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={onOpenLaneSupport} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/58 hover:text-white">
                Lane guide <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={onOpenSupport} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/58 hover:text-white">
                Supports <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={onOpenMacro} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.1em] text-cyan-100/72 hover:text-cyan-100">
                Mid / Late <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
      </section>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {queueCardOpen ? (
                <motion.div
                  className="fixed inset-0 z-[110] overflow-y-auto bg-[rgba(2,3,5,0.97)] px-3 py-4 text-white backdrop-blur-xl md:px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Fiora ADC queue card"
                >
                  <motion.div
                    className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-white/14 bg-[#090a0d] shadow-[0_24px_100px_rgba(0,0,0,0.62)]"
                    initial={{ opacity: 0, y: 18, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.99 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <header className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-4 md:px-6">
                      <div>
                        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-red-300">
                          <Timer className="h-3.5 w-3.5" />
                          Queue briefing / Patch {BOT_LANE_PATCH.patch}
                        </p>
                        <h2 className="mt-2 text-2xl font-black md:text-3xl">
                          {allySupport.name} vs {enemyCarry.name} + {enemySupport.name}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQueueCardOpen(false)}
                        title="Close briefing"
                        aria-label="Close briefing"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/14 bg-white/[0.04] text-white/68 transition hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </header>

                    <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
                      <div className="relative min-h-[280px] overflow-hidden border-b border-white/10 lg:min-h-[650px] lg:border-b-0 lg:border-r">
                        <img
                          src={enemyCarry.image}
                          alt={enemyCarry.name}
                          className="absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-62"
                          decoding="async"
                          onError={recoverImage}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,4,6,0.98)_0%,rgba(3,4,6,0.2)_75%)]" />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <p className={cn("text-[10px] font-black uppercase tracking-[0.15em]", toneText[gameplan.levelOneTone])}>
                            Level 1
                          </p>
                          <p className="mt-2 text-2xl font-black leading-tight">{gameplan.levelOneCall}</p>
                          <p className="mt-3 text-sm leading-relaxed text-white/66">{gameplan.levelOneAllIn}</p>
                        </div>
                      </div>

                      <div className="p-4 md:p-6">
                        <div className="grid gap-4 border-b border-white/10 pb-5 sm:grid-cols-3">
                          {[
                            ["Rune", gameplan.rune],
                            ["Level 2", gameplan.levelTwoSkill],
                            ["First pivot", gameplan.pivot],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/38">{label}</p>
                              <p className="mt-1 text-sm font-black text-white">{value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5">
                          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.13em] text-cyan-200">
                            <Waves className="h-3.5 w-3.5" /> Opening sequence
                          </p>
                          <div className="mt-3 divide-y divide-white/10 border-y border-white/10">
                            {gameplan.phases.slice(0, 4).map((phase) => (
                              <div key={phase.id} className="grid gap-2 py-4 sm:grid-cols-[7rem_1fr]">
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-red-200">{phase.marker}</p>
                                  <p className="mt-1 text-xs font-black text-white/76">{phase.title}</p>
                                </div>
                                <div>
                                  <p className="text-sm leading-relaxed text-white/68">{phase.plan}</p>
                                  <p className="mt-2 text-xs leading-relaxed text-cyan-100/62">Change: {phase.reversal}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <div className="border-l-2 border-red-300/45 pl-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-red-200">Target</p>
                            <p className="mt-1 text-sm leading-relaxed text-white/64">{gameplan.targetPlan}</p>
                          </div>
                          <div className="border-l-2 border-cyan-300/45 pl-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-cyan-200">Riposte</p>
                            <p className="mt-1 text-sm leading-relaxed text-white/64">{gameplan.ripostePlan}</p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                          <button
                            type="button"
                            onClick={() => void copyBriefing()}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/14 bg-white/[0.04] px-4 text-[10px] font-black uppercase tracking-[0.1em] text-white/74"
                          >
                            {copied ? <Check className="h-4 w-4 text-emerald-200" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Copied" : "Copy full plan"}
                          </button>
                          <button
                            type="button"
                            onClick={onOpenLaneSupport}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-300/35 bg-red-500/12 px-4 text-[10px] font-black uppercase tracking-[0.1em] text-white"
                          >
                            <BookOpen className="h-4 w-4" /> Full lane guide
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
