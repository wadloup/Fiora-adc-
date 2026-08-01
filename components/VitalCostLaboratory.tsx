import type { PointerEvent as ReactPointerEvent } from "react";
import { useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BrainCircuit,
  Check,
  Crosshair,
  Eye,
  EyeOff,
  Gauge,
  Info,
  MapPinned,
  MousePointer2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { botLaneCarries } from "../data/botLaneCarries";
import { botLaneSupports } from "../data/botLaneSupports";
import { readLaneGameplanSelection } from "../data/laneGameplanState";
import {
  analyzeVitalCost,
  clampLabPoint,
  DEFAULT_VITAL_LAB_STATE,
  getChampionIcon,
  LAB_BOARD,
  VITAL_LAB_PATCH,
  VITAL_LAB_SCENARIOS,
  type HealthBand,
  type LabActor,
  type LabPoint,
  type VitalCostLabState,
  type VitalCostTone,
  type VitalSide,
  type WaveState,
} from "../data/vitalCostLab";
import { cn } from "../utils/cn";

type LabMode = "analysis" | "prediction";
type PredictionChoice = "cheap" | "conditional" | "trap" | "no-contact";

const toneStyles: Record<
  VitalCostTone,
  { text: string; border: string; background: string; dot: string }
> = {
  favorable: {
    text: "text-emerald-100",
    border: "border-emerald-300/30",
    background: "bg-emerald-300/[0.08]",
    dot: "bg-emerald-300",
  },
  conditional: {
    text: "text-amber-100",
    border: "border-amber-300/30",
    background: "bg-amber-300/[0.08]",
    dot: "bg-amber-300",
  },
  costly: {
    text: "text-red-100",
    border: "border-red-300/30",
    background: "bg-red-400/[0.09]",
    dot: "bg-red-300",
  },
};

const predictionOptions: Array<{
  id: PredictionChoice;
  label: string;
  description: string;
}> = [
  {
    id: "cheap",
    label: "Cheap / starter",
    description: "The proc is covered or opens a favorable contact.",
  },
  {
    id: "conditional",
    label: "Conditional",
    description: "One cooldown, position or exit detail decides it.",
  },
  {
    id: "trap",
    label: "Paid / trap",
    description: "The passive cannot repay the stacked retaliation.",
  },
  {
    id: "no-contact",
    label: "No contact",
    description: "The geometry is not yet legal.",
  },
];

const actorLabels: Record<LabActor, string> = {
  fiora: "Fiora",
  allySupport: "Ally support",
  enemyCarry: "Enemy carry",
  enemySupport: "Enemy support",
};

function stateFromSavedDraft(): VitalCostLabState {
  const saved = readLaneGameplanSelection();
  return {
    ...DEFAULT_VITAL_LAB_STATE,
    allySupportId: saved.allySupport,
    enemyCarryId: saved.enemyCarry,
    enemySupportId: saved.enemySupport,
    allyAccessReady: saved.allySupportForward,
    enemyControlReady: !saved.enemyControlSpent,
    carryEscapeReady: saved.enemyCarryFlashAvailable,
    jungleKnown: saved.junglePathBot,
    brushOwned: saved.triBrushControl,
    wave:
      saved.intent === "pressure"
        ? "allied"
        : saved.intent === "survive"
          ? "enemy"
          : "even",
  };
}

function copyState(state: VitalCostLabState): VitalCostLabState {
  return {
    ...state,
    actors: Object.fromEntries(
      Object.entries(state.actors).map(([key, point]) => [key, { ...point }])
    ) as Record<LabActor, LabPoint>,
  };
}

function verdictToPrediction(key: ReturnType<typeof analyzeVitalCost>["key"]): PredictionChoice {
  if (key === "no-contact") return "no-contact";
  if (key === "free" || key === "starter") return "cheap";
  if (key === "conditional") return "conditional";
  return "trap";
}

function LabToggle({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="group flex min-h-[58px] cursor-pointer items-center justify-between gap-3 border-b border-white/8 px-3 py-2.5 last:border-b-0 hover:bg-white/[0.025]">
      <span className="min-w-0">
        <span className="block text-[11px] font-black uppercase tracking-normal text-white/88">
          {label}
        </span>
        <span className="mt-0.5 block text-[11px] leading-snug text-white/46">
          {detail}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-200",
          checked
            ? "border-cyan-300/55 bg-cyan-300/[0.18]"
            : "border-white/20 bg-black/65"
        )}
      >
        <span
          className={cn(
            "absolute left-1 top-1 h-3.5 w-3.5 rounded-full transition-transform",
            checked ? "translate-x-5 bg-cyan-100" : "bg-white/45"
          )}
        />
      </span>
    </label>
  );
}

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[10px] font-black uppercase tracking-normal text-white/48">
        {label}
      </legend>
      <div
        className="grid border border-white/14 bg-black/45 p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-9 px-2 text-[10px] font-black uppercase tracking-normal transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200",
              value === option.id
                ? "bg-white text-black"
                : "text-white/55 hover:bg-white/[0.06] hover:text-white"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ActorNode({
  actor,
  point,
  image,
  name,
  selected,
  onPointerDown,
  onSelect,
}: {
  actor: LabActor;
  point: LabPoint;
  image: string;
  name: string;
  selected: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>, actor: LabActor) => void;
  onSelect: (actor: LabActor) => void;
}) {
  const ally = actor === "fiora" || actor === "allySupport";
  return (
    <button
      type="button"
      onPointerDown={(event) => onPointerDown(event, actor)}
      onClick={() => onSelect(actor)}
      aria-label={`Move ${actorLabels[actor]}: ${name}`}
      title={`Drag ${name}`}
      className={cn(
        "vital-lab-actor group absolute z-30 -translate-x-1/2 -translate-y-1/2 touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
        selected && "vital-lab-actor--selected"
      )}
      style={{
        left: `${(point.x / LAB_BOARD.width) * 100}%`,
        top: `${(point.y / LAB_BOARD.height) * 100}%`,
      }}
    >
      <span
        className={cn(
          "relative block h-12 w-12 overflow-hidden rounded-full border-2 bg-black shadow-xl sm:h-14 sm:w-14",
          ally
            ? "border-cyan-200/90 shadow-cyan-400/20"
            : "border-red-200/90 shadow-red-500/25"
        )}
      >
        <img
          src={image}
          alt=""
          draggable={false}
          className="h-full w-full select-none object-cover"
          decoding="async"
        />
      </span>
      <span className="absolute left-1/2 top-[calc(100%+5px)] min-w-max -translate-x-1/2 border border-white/15 bg-black/85 px-2 py-1 text-[9px] font-black uppercase tracking-normal text-white/82 shadow-lg">
        {name}
      </span>
    </button>
  );
}

export default function VitalCostLaboratory() {
  const [state, setState] = useState<VitalCostLabState>(stateFromSavedDraft);
  const [activeScenario, setActiveScenario] = useState("saved-draft");
  const [mode, setMode] = useState<LabMode>("analysis");
  const [showOverlays, setShowOverlays] = useState(true);
  const [dragging, setDragging] = useState<LabActor | null>(null);
  const [selectedActor, setSelectedActor] = useState<LabActor>("fiora");
  const [prediction, setPrediction] = useState<PredictionChoice | null>(null);
  const [revealed, setRevealed] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const analysis = useMemo(() => analyzeVitalCost(state), [state]);
  const allySupport = botLaneSupports.find(
    (item) => item.id === state.allySupportId
  ) ?? botLaneSupports[0];
  const enemyCarry = botLaneCarries.find(
    (item) => item.id === state.enemyCarryId
  ) ?? botLaneCarries[0];
  const enemySupport = botLaneSupports.find(
    (item) => item.id === state.enemySupportId
  ) ?? botLaneSupports[0];
  const correctPrediction = verdictToPrediction(analysis.key);
  const readVisible = mode === "analysis" || revealed;
  const overlayVisible = showOverlays && readVisible;

  const updateState = (patch: Partial<VitalCostLabState>) => {
    setState((current) => ({ ...current, ...patch }));
    setActiveScenario("custom");
    setRevealed(false);
  };

  const moveActor = (actor: LabActor, point: LabPoint) => {
    setState((current) => ({
      ...current,
      actors: { ...current.actors, [actor]: clampLabPoint(point) },
    }));
    setActiveScenario("custom");
    setRevealed(false);
  };

  const pointerToBoard = (event: ReactPointerEvent) => {
    const bounds = boardRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    return clampLabPoint({
      x: ((event.clientX - bounds.left) / bounds.width) * LAB_BOARD.width,
      y: ((event.clientY - bounds.top) / bounds.height) * LAB_BOARD.height,
    });
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    actor: LabActor
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(actor);
    setSelectedActor(actor);
    const point = pointerToBoard(event);
    if (point) moveActor(actor, point);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const point = pointerToBoard(event);
    if (point) moveActor(dragging, point);
  };

  const applyScenario = (scenarioId: string) => {
    if (scenarioId === "saved-draft") {
      setState(stateFromSavedDraft());
    } else {
      const scenario = VITAL_LAB_SCENARIOS.find(
        (item) => item.id === scenarioId
      );
      if (scenario) setState(copyState(scenario.state));
    }
    setActiveScenario(scenarioId);
    setPrediction(null);
    setRevealed(false);
  };

  const actorData: Record<LabActor, { name: string; image: string }> = {
    fiora: { name: "Fiora", image: getChampionIcon("Fiora") },
    allySupport: {
      name: allySupport.name,
      image: getChampionIcon(allySupport.dataDragonId),
    },
    enemyCarry: {
      name: enemyCarry.name,
      image: getChampionIcon(enemyCarry.dataDragonId),
    },
    enemySupport: {
      name: enemySupport.name,
      image: getChampionIcon(enemySupport.dataDragonId),
    },
  };

  const nudge = (dx: number, dy: number) => {
    const point = state.actors[selectedActor];
    moveActor(selectedActor, { x: point.x + dx, y: point.y + dy });
  };

  const waveOffset = state.wave === "allied" ? 65 : state.wave === "enemy" ? -65 : 0;
  const verdictTone = toneStyles[analysis.tone];
  const activeScenarioData = VITAL_LAB_SCENARIOS.find(
    (item) => item.id === activeScenario
  );

  return (
    <section className="vital-lab overflow-hidden border border-white/12 bg-[#08090c]/95 shadow-[0_24px_90px_rgba(0,0,0,0.5)]">
      <header className="border-b border-white/10 bg-black/60 px-4 py-5 md:px-6 lg:px-8">
        <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-end 2xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-normal text-red-200">
              <span className="inline-flex items-center gap-2 border border-red-300/25 bg-red-400/[0.08] px-2.5 py-1.5">
                <Crosshair className="h-3.5 w-3.5" />
                Vital Cost Laboratory
              </span>
              <span className="border border-white/12 bg-white/[0.035] px-2.5 py-1.5 text-white/58">
                Patch {VITAL_LAB_PATCH.patch}
              </span>
              <span className="border border-cyan-300/20 bg-cyan-300/[0.06] px-2.5 py-1.5 text-cyan-100/75">
                Riot kit geometry {VITAL_LAB_PATCH.dataDragon}
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-normal text-white md:text-5xl">
              Price the Vital before Q pays for it.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/62 md:text-base">
              Drag the four champions, change the cooldown and wave state, then read what Fiora gains and what the enemy lane charges back. The lab models contact geometry; it does not invent a win rate.
            </p>
          </div>

          <div className="grid min-w-[280px] grid-cols-2 border border-white/14 bg-black/45 p-1">
            <button
              type="button"
              onClick={() => setMode("analysis")}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 px-3 text-xs font-black uppercase tracking-normal transition",
                mode === "analysis"
                  ? "bg-white text-black"
                  : "text-white/58 hover:bg-white/[0.05] hover:text-white"
              )}
            >
              <Eye className="h-4 w-4" /> Analysis
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("prediction");
                setRevealed(false);
                setPrediction(null);
              }}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 px-3 text-xs font-black uppercase tracking-normal transition",
                mode === "prediction"
                  ? "bg-white text-black"
                  : "text-white/58 hover:bg-white/[0.05] hover:text-white"
              )}
            >
              <BrainCircuit className="h-4 w-4" /> Prediction
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-white/10 bg-white/[0.018] px-4 py-4 md:px-6 lg:px-8">
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => applyScenario("saved-draft")}
            className={cn(
              "min-w-[190px] border px-4 py-3 text-left transition",
              activeScenario === "saved-draft"
                ? "border-cyan-200/50 bg-cyan-300/[0.09]"
                : "border-white/12 bg-black/35 hover:border-white/30"
            )}
          >
            <span className="block text-[10px] font-black uppercase tracking-normal text-cyan-100">
              Saved draft
            </span>
            <span className="mt-1 block text-xs text-white/52">
              Load the Home gameplan state
            </span>
          </button>
          {VITAL_LAB_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => applyScenario(scenario.id)}
              className={cn(
                "min-w-[220px] border px-4 py-3 text-left transition",
                activeScenario === scenario.id
                  ? "border-red-200/50 bg-red-400/[0.09]"
                  : "border-white/12 bg-black/35 hover:border-white/30"
              )}
            >
              <span className="block text-[10px] font-black uppercase tracking-normal text-red-100">
                {scenario.label}
              </span>
              <span className="mt-1 block text-xs text-white/52">
                {scenario.subtitle}
              </span>
            </button>
          ))}
        </div>
        {activeScenarioData ? (
          <p className="mt-3 flex max-w-4xl items-start gap-2 text-xs leading-relaxed text-white/52">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
            {activeScenarioData.lesson}
          </p>
        ) : null}
      </div>

      <div className="grid 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 border-b border-white/10 2xl:border-b-0 2xl:border-r">
          <div className="grid gap-px border-b border-white/10 bg-white/10 sm:grid-cols-3">
            <label className="bg-[#0a0b0f] px-4 py-3">
              <span className="mb-1.5 block text-[9px] font-black uppercase tracking-normal text-cyan-100/70">
                Your support
              </span>
              <select
                value={state.allySupportId}
                onChange={(event) => updateState({ allySupportId: event.target.value })}
                className="h-10 w-full border border-white/14 bg-black/65 px-3 text-sm font-bold text-white outline-none focus:border-cyan-200/70"
              >
                {botLaneSupports.map((support) => (
                  <option key={support.id} value={support.id}>
                    {support.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="bg-[#0a0b0f] px-4 py-3">
              <span className="mb-1.5 block text-[9px] font-black uppercase tracking-normal text-red-100/70">
                Enemy carry
              </span>
              <select
                value={state.enemyCarryId}
                onChange={(event) => updateState({ enemyCarryId: event.target.value })}
                className="h-10 w-full border border-white/14 bg-black/65 px-3 text-sm font-bold text-white outline-none focus:border-red-200/70"
              >
                {botLaneCarries.map((carry) => (
                  <option key={carry.id} value={carry.id}>
                    {carry.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="bg-[#0a0b0f] px-4 py-3">
              <span className="mb-1.5 block text-[9px] font-black uppercase tracking-normal text-red-100/70">
                Enemy support
              </span>
              <select
                value={state.enemySupportId}
                onChange={(event) => updateState({ enemySupportId: event.target.value })}
                className="h-10 w-full border border-white/14 bg-black/65 px-3 text-sm font-bold text-white outline-none focus:border-red-200/70"
              >
                {botLaneSupports.map((support) => (
                  <option key={support.id} value={support.id}>
                    {support.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {mode === "prediction" && !revealed ? (
            <div className="border-b border-amber-300/20 bg-amber-300/[0.045] px-4 py-4 md:px-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-normal text-amber-100">
                <BrainCircuit className="h-4 w-4" /> Make the read before revealing overlays
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {predictionOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPrediction(option.id)}
                    className={cn(
                      "min-h-[74px] border px-3 py-2.5 text-left transition",
                      prediction === option.id
                        ? "border-amber-200 bg-amber-100 text-black"
                        : "border-white/14 bg-black/35 text-white hover:border-amber-200/50"
                    )}
                  >
                    <span className="block text-[10px] font-black uppercase tracking-normal">
                      {option.label}
                    </span>
                    <span className={cn("mt-1 block text-[10px] leading-snug", prediction === option.id ? "text-black/65" : "text-white/44") }>
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={!prediction}
                onClick={() => setRevealed(true)}
                className="mt-3 inline-flex min-h-10 items-center gap-2 border border-amber-200/60 bg-amber-100 px-4 text-xs font-black uppercase tracking-normal text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                Reveal the cost <Eye className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          <div className="relative bg-black">
            <div className="absolute left-3 top-3 z-40 flex flex-wrap gap-2 sm:left-4 sm:top-4">
              <span className="inline-flex items-center gap-2 border border-white/14 bg-black/78 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-normal text-white/66 backdrop-blur-sm">
                <MousePointer2 className="h-3.5 w-3.5 text-cyan-200" /> Drag champions
              </span>
              <button
                type="button"
                onClick={() => setShowOverlays((current) => !current)}
                className="inline-flex min-h-8 items-center gap-2 border border-white/14 bg-black/78 px-2.5 text-[9px] font-black uppercase tracking-normal text-white/66 backdrop-blur-sm hover:border-white/35 hover:text-white"
              >
                {showOverlays ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showOverlays ? "Hide read" : "Show read"}
              </button>
            </div>

            <div
              ref={boardRef}
              className="vital-lab-board relative aspect-square min-h-0 w-full select-none overflow-hidden sm:aspect-[5/3]"
              onPointerMove={handlePointerMove}
              onPointerUp={() => setDragging(null)}
              onPointerCancel={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              <div className="vital-lab-river absolute inset-y-0 left-[47%] w-[8%]" />
              <div className="vital-lab-brush vital-lab-brush--top absolute left-[8%] top-[9%] h-[20%] w-[28%]" />
              <div className="vital-lab-brush vital-lab-brush--bottom absolute bottom-[8%] left-[8%] h-[20%] w-[28%]" />
              <div className="vital-lab-tower vital-lab-tower--ally absolute bottom-[18%] left-[4%]" />
              <div className="vital-lab-tower vital-lab-tower--enemy absolute right-[4%] top-[18%]" />

              <div
                className="absolute left-1/2 top-1/2 z-10 h-20 w-[42%] -translate-x-1/2 -translate-y-1/2"
                style={{ transform: `translate(calc(-50% + ${waveOffset}px), -50%)` }}
              >
                {[0, 1, 2, 3, 4, 5].map((minion) => (
                  <span
                    key={`ally-${minion}`}
                    className="vital-lab-minion vital-lab-minion--ally absolute"
                    style={{
                      left: `${10 + minion * 7}%`,
                      top: `${26 + (minion % 2) * 35}%`,
                    }}
                  />
                ))}
                {[0, 1, 2, 3, 4, 5].map((minion) => (
                  <span
                    key={`enemy-${minion}`}
                    className="vital-lab-minion vital-lab-minion--enemy absolute"
                    style={{
                      right: `${10 + minion * 7}%`,
                      top: `${26 + (minion % 2) * 35}%`,
                    }}
                  />
                ))}
              </div>

              {overlayVisible ? (
                <svg
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                  viewBox={`0 0 ${LAB_BOARD.width} ${LAB_BOARD.height}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <circle
                    cx={state.actors.fiora.x}
                    cy={state.actors.fiora.y}
                    r={analysis.geometry.qRange}
                    className="vital-lab-range vital-lab-range--q"
                  />
                  <circle
                    cx={state.actors.enemyCarry.x}
                    cy={state.actors.enemyCarry.y}
                    r={analysis.geometry.carryAttackRange}
                    className="vital-lab-range vital-lab-range--carry"
                  />
                  <circle
                    cx={state.actors.allySupport.x}
                    cy={state.actors.allySupport.y}
                    r={analysis.geometry.allySupportReach}
                    className="vital-lab-range vital-lab-range--ally"
                  />
                  <circle
                    cx={state.actors.enemySupport.x}
                    cy={state.actors.enemySupport.y}
                    r={analysis.geometry.enemySupportThreat}
                    className="vital-lab-range vital-lab-range--support"
                  />
                  <line
                    x1={state.actors.fiora.x}
                    y1={state.actors.fiora.y}
                    x2={analysis.geometry.vital.x}
                    y2={analysis.geometry.vital.y}
                    className="vital-lab-path vital-lab-path--entry"
                  />
                  <line
                    x1={analysis.geometry.vital.x}
                    y1={analysis.geometry.vital.y}
                    x2={analysis.geometry.safeAnchor.x}
                    y2={analysis.geometry.safeAnchor.y}
                    className="vital-lab-path vital-lab-path--exit"
                  />
                </svg>
              ) : null}

              {readVisible ? (
                <span
                  className={cn(
                    "vital-lab-vital absolute z-40 -translate-x-1/2 -translate-y-1/2",
                    analysis.tone === "favorable" && "vital-lab-vital--favorable",
                    analysis.tone === "conditional" && "vital-lab-vital--conditional",
                    analysis.tone === "costly" && "vital-lab-vital--costly"
                  )}
                  style={{
                    left: `${(analysis.geometry.vital.x / LAB_BOARD.width) * 100}%`,
                    top: `${(analysis.geometry.vital.y / LAB_BOARD.height) * 100}%`,
                  }}
                  title="Selected Vital endpoint"
                >
                  <span />
                </span>
              ) : null}

              {(Object.keys(actorData) as LabActor[]).map((actor) => (
                <ActorNode
                  key={actor}
                  actor={actor}
                  point={state.actors[actor]}
                  image={actorData[actor].image}
                  name={actorData[actor].name}
                  selected={selectedActor === actor}
                  onPointerDown={handlePointerDown}
                  onSelect={setSelectedActor}
                />
              ))}
            </div>

            <div className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-[1fr_auto]">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-[#090a0d] px-4 py-3 text-[9px] font-black uppercase tracking-normal text-white/50">
                <span className="inline-flex items-center gap-2"><i className="h-2 w-5 bg-cyan-300/60" /> Fiora Q</span>
                <span className="inline-flex items-center gap-2"><i className="h-2 w-5 bg-emerald-300/60" /> Ally cover</span>
                <span className="inline-flex items-center gap-2"><i className="h-2 w-5 bg-red-300/60" /> Carry autos</span>
                <span className="inline-flex items-center gap-2"><i className="h-2 w-5 bg-amber-300/60" /> Support answer</span>
              </div>
              <div className="flex items-center gap-1 bg-[#090a0d] px-3 py-2">
                <span className="mr-2 hidden text-[9px] font-black uppercase tracking-normal text-white/42 sm:inline">
                  Nudge {actorLabels[selectedActor]}
                </span>
                {[
                  { label: "Left", icon: ArrowLeft, dx: -12, dy: 0 },
                  { label: "Up", icon: ArrowUp, dx: 0, dy: -12 },
                  { label: "Down", icon: ArrowDown, dx: 0, dy: 12 },
                  { label: "Right", icon: ArrowRight, dx: 12, dy: 0 },
                ].map(({ label, icon: Icon, dx, dy }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => nudge(dx, dy)}
                    title={`${label}: ${actorLabels[selectedActor]}`}
                    className="grid h-8 w-8 place-items-center border border-white/12 bg-white/[0.025] text-white/58 hover:border-white/35 hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="bg-[#090a0d]">
          <div className="border-b border-white/10 p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase tracking-normal text-white/45">
                Live verdict
              </span>
              <button
                type="button"
                onClick={() => applyScenario(activeScenario === "custom" ? "saved-draft" : activeScenario)}
                title="Reset current setup"
                className="grid h-9 w-9 place-items-center border border-white/14 bg-white/[0.025] text-white/58 hover:border-white/35 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {readVisible ? (
              <div aria-live="polite" className="mt-4">
                {mode === "prediction" && prediction ? (
                  <div
                    className={cn(
                      "mb-3 flex items-center gap-2 border px-3 py-2 text-[10px] font-black uppercase tracking-normal",
                      prediction === correctPrediction
                        ? "border-emerald-300/30 bg-emerald-300/[0.08] text-emerald-100"
                        : "border-red-300/30 bg-red-400/[0.08] text-red-100"
                    )}
                  >
                    {prediction === correctPrediction ? <Check className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}
                    {prediction === correctPrediction ? "Read matched" : `Re-price: ${analysis.label}`}
                  </div>
                ) : null}
                <div className={cn("border p-4", verdictTone.border, verdictTone.background)}>
                  <p className={cn("text-[9px] font-black uppercase tracking-normal", verdictTone.text)}>
                    {analysis.eyebrow}
                  </p>
                  <p className="mt-2 text-2xl font-black uppercase tracking-normal text-white">
                    {analysis.label}
                  </p>
                  <p className="mt-3 text-sm font-bold leading-snug text-white/88">
                    {analysis.headline}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white/56">
                    {analysis.summary}
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-px bg-white/10">
                  {(["favorable", "conditional", "costly"] as VitalCostTone[]).map((tone) => (
                    <div key={tone} className="bg-black/75 px-2 py-3 text-center">
                      <span className={cn("block text-xl font-black", toneStyles[tone].text)}>
                        {analysis.counts[tone]}
                      </span>
                      <span className="mt-1 block text-[8px] font-black uppercase tracking-normal text-white/40">
                        {tone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 border border-dashed border-white/18 bg-black/30 p-5 text-center">
                <EyeOff className="mx-auto h-7 w-7 text-white/28" />
                <p className="mt-3 text-sm font-bold text-white/70">Analysis hidden</p>
                <p className="mt-1 text-xs leading-relaxed text-white/42">
                  Read the wave, cooldowns and support positions before choosing a cost class.
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-4 p-4 md:p-5">
            <SegmentedControl<WaveState>
              label="Wave ownership"
              value={state.wave}
              options={[
                { id: "allied", label: "Allied" },
                { id: "even", label: "Even" },
                { id: "enemy", label: "Enemy" },
              ]}
              onChange={(wave) => updateState({ wave })}
            />
            <SegmentedControl<VitalSide>
              label="Vital side"
              value={state.vitalSide}
              options={[
                { id: "west", label: "Front" },
                { id: "north", label: "Top" },
                { id: "east", label: "Back" },
                { id: "south", label: "Bottom" },
              ]}
              onChange={(vitalSide) => updateState({ vitalSide })}
            />
            <SegmentedControl<HealthBand>
              label="Fiora HP"
              value={state.health}
              options={[
                { id: "healthy", label: "Healthy" },
                { id: "traded", label: "Traded" },
                { id: "critical", label: "Critical" },
              ]}
              onChange={(health) => updateState({ health })}
            />
          </div>

          <div className="border-t border-white/10">
            <LabToggle
              label="Ally access ready"
              detail={`${allySupport.name} can use the first fixing or cover spell.`}
              checked={state.allyAccessReady}
              onChange={(allyAccessReady) => updateState({ allyAccessReady })}
            />
            <LabToggle
              label="Enemy control ready"
              detail={`${enemySupport.name}'s key lane answer is available.`}
              checked={state.enemyControlReady}
              onChange={(enemyControlReady) => updateState({ enemyControlReady })}
            />
            <LabToggle
              label="Carry escape ready"
              detail={`${enemyCarry.name} can purchase a second position.`}
              checked={state.carryEscapeReady}
              onChange={(carryEscapeReady) => updateState({ carryEscapeReady })}
            />
            <LabToggle
              label="Carry committed"
              detail="The carry has stepped into a last-hit or punish animation."
              checked={state.carryCommitted}
              onChange={(carryCommitted) => updateState({ carryCommitted })}
            />
            <LabToggle
              label="Riposte ready"
              detail="Fiora still owns W for the enemy answer queue."
              checked={state.riposteReady}
              onChange={(riposteReady) => updateState({ riposteReady })}
            />
            <LabToggle
              label="Jungle known"
              detail="The contact can be priced as the visible 2v2."
              checked={state.jungleKnown}
              onChange={(jungleKnown) => updateState({ jungleKnown })}
            />
            <LabToggle
              label="Near bush owned"
              detail="Vision can break on Fiora's retreat line."
              checked={state.brushOwned}
              onChange={(brushOwned) => updateState({ brushOwned })}
            />
          </div>
        </aside>
      </div>

      {readVisible ? (
        <div className="border-t border-white/10">
          <div className="grid border-b border-white/10 lg:grid-cols-[260px_1fr]">
            <div className="border-b border-white/10 bg-black/55 p-5 lg:border-b-0 lg:border-r">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-normal text-white/45">
                <Gauge className="h-4 w-4 text-red-200" /> Cost ledger
              </p>
              <h3 className="mt-3 text-xl font-black uppercase tracking-normal text-white">
                What Fiora gains. What she pays.
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/48">
                These are state deductions from geometry and selected cooldowns. They are not measured outcome probabilities.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 2xl:grid-cols-4">
              {analysis.factors.map((item) => (
                <article
                  key={item.id}
                  className="border-b border-white/10 p-4 sm:border-r 2xl:[&:nth-last-child(-n+4)]:border-b-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-normal text-white/72">
                      {item.label}
                    </p>
                    <span className={cn("h-2.5 w-2.5 rounded-full", toneStyles[item.tone].dot)} />
                  </div>
                  <p className={cn("mt-3 text-sm font-bold leading-snug", toneStyles[item.tone].text)}>
                    {item.summary}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white/48">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2">
            <section className="border-b border-white/10 p-5 md:p-6 lg:border-b-0 lg:border-r">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-normal text-amber-100/75">
                <Sparkles className="h-4 w-4" /> Conditions that flip the read
              </p>
              <div className="mt-4 grid gap-2">
                {analysis.conditionsToFlip.length ? (
                  analysis.conditionsToFlip.map((condition, index) => (
                    <div key={condition} className="flex gap-3 border border-white/10 bg-white/[0.022] p-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center border border-amber-300/30 bg-amber-300/[0.08] text-[10px] font-black text-amber-100">
                        {index + 1}
                      </span>
                      <p className="text-xs leading-relaxed text-white/65">{condition}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-3 border border-emerald-300/20 bg-emerald-300/[0.05] p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" />
                    <p className="text-xs leading-relaxed text-white/62">
                      No major cost needs removal for the first proc. Re-evaluate immediately if the carry or support changes square.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="p-5 md:p-6">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-normal text-cyan-100/75">
                <MapPinned className="h-4 w-4" /> Draft-specific reminders
              </p>
              <div className="mt-4 grid gap-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-normal text-cyan-100/65">
                    {allySupport.name} cover
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/58">
                    {allySupport.allyPlan}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-normal text-red-100/65">
                    {enemyCarry.name} spacing
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/58">
                    {enemyCarry.punish}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-normal text-amber-100/65">
                    {enemySupport.name} Riposte line
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/58">
                    {enemySupport.parry}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : null}

      <footer className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-3">
        <div className="bg-black/65 px-4 py-3">
          <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-normal text-white/42">
            <Target className="h-3.5 w-3.5 text-cyan-200" /> Exact where available
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/55">
            Fiora Q and carry attack range use Riot kit values.
          </p>
        </div>
        <div className="bg-black/65 px-4 py-3">
          <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-normal text-white/42">
            <Activity className="h-3.5 w-3.5 text-amber-200" /> Estimated where composite
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/55">
            Support zones summarize usable basic-spell reach, not hit probability.
          </p>
        </div>
        <div className="bg-black/65 px-4 py-3">
          <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-normal text-white/42">
            <TriangleAlert className="h-3.5 w-3.5 text-red-200" /> You supply hidden state
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/55">
            Cooldowns, commitment and jungle knowledge stay explicit toggles.
          </p>
        </div>
      </footer>
    </section>
  );
}
