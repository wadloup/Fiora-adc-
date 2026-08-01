import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  CircleDot,
  Crosshair,
  Database,
  Eye,
  Flag,
  Gauge,
  GitBranch,
  Info,
  Map as MapIcon,
  Radar,
  RefreshCw,
  Route,
  Search,
  Shield,
  ShieldCheck,
  TimerReset,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  buildMacroGameplan,
  type ResponderRead,
  type ShadowId,
} from "../data/macroGameplan";
import {
  MID_LATE_PATCH,
  advantageAxes,
  championIcon,
  championKits,
  cleanKitText,
  currentSystems,
  evidenceSources,
  fightPhases,
  getChampionThreats,
  macroMyths,
  midPressureCycle,
  objectiveBands,
  replayCases,
  shadowTypes,
  sideDepths,
  targetFactors,
  threatDefinitions,
  type ChampionKit,
  type ThreatId,
} from "../data/midLateKnowledge";

type ViewId = "decision" | "map" | "fight" | "atlas" | "evidence";

const views: Array<{
  id: ViewId;
  label: string;
  short: string;
  icon: typeof Gauge;
}> = [
  { id: "decision", label: "Decision Room", short: "Decision", icon: Gauge },
  { id: "map", label: "Map & Waves", short: "Map", icon: MapIcon },
  { id: "fight", label: "Fight Entry", short: "Fight", icon: Crosshair },
  { id: "atlas", label: "Threat Atlas", short: "Atlas", icon: Radar },
  { id: "evidence", label: "Evidence", short: "Sources", icon: BookOpen },
];

const accentClasses = {
  red: "border-red-300/30 bg-red-300/10 text-red-200",
  cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  amber: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  violet: "border-violet-300/30 bg-violet-300/10 text-violet-100",
  emerald: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
} as const;

const permissionToneClasses = {
  open: "border-emerald-300/24 bg-emerald-300/[0.055] text-emerald-100",
  conditional: "border-amber-300/24 bg-amber-300/[0.05] text-amber-100",
  blocked: "border-red-300/26 bg-red-300/[0.055] text-red-100",
  unknown: "border-white/12 bg-white/[0.025] text-white/58",
} as const;

const sliderLabels = {
  economy: ["Recovery", "Behind buy", "Neutral", "Item edge", "Snowball"],
  information: ["Blind", "Fragments", "One side", "Relevant vision", "Full read"],
  team: ["Unavailable", "Resetting", "Can delay", "Ready", "Converting"],
  failure: ["Low", "Manageable", "Costly", "Shutdown", "Game deciding"],
} as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ThreatBadge({ id, compact = false }: { id: ThreatId; compact?: boolean }) {
  const threat = threatDefinitions[id];

  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-1 font-bold uppercase tracking-[0.08em]",
        compact ? "text-[9px]" : "text-[10px]",
        accentClasses[threat.accent]
      )}
    >
      {compact ? threat.shortLabel : threat.label}
    </span>
  );
}

function SectionLead({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-300">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/58 md:text-base">
        {text}
      </p>
    </div>
  );
}

function RangeControl({
  label,
  value,
  labels,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: number;
  labels: readonly string[];
  onChange: (value: number) => void;
  icon: typeof Gauge;
}) {
  return (
    <label className="block border-b border-white/8 py-4 last:border-b-0">
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-white/76">
          <Icon className="h-4 w-4 text-red-200" />
          {label}
        </span>
        <span className="text-xs font-bold text-white">{labels[value]}</span>
      </span>
      <input
        type="range"
        min={0}
        max={labels.length - 1}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="control-slider mt-4 w-full"
      />
      <span className="mt-2 flex justify-between text-[9px] font-bold uppercase tracking-[0.08em] text-white/28">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </span>
    </label>
  );
}

function ChampionPicker({
  selectedIds,
  onAdd,
  onRemove,
}: {
  selectedIds: string[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const available = championKits.filter(
    (champion) => !selectedIds.includes(champion.id)
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        <select
          value=""
          onChange={(event) => {
            if (event.target.value) onAdd(event.target.value);
          }}
          className="min-w-0 flex-1 border border-white/12 bg-[#0b0b0d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-300/60"
          aria-label="Add enemy champion"
        >
          <option value="">Add enemy champion...</option>
          {available.map((champion) => (
            <option key={champion.id} value={champion.id}>
              {champion.name}
            </option>
          ))}
        </select>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-white/[0.035] text-white/45">
          <Users className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex min-h-10 flex-wrap gap-2">
        {selectedIds.map((id) => {
          const champion = championKits.find((entry) => entry.id === id);
          if (!champion) return null;

          return (
            <div
              key={id}
              className="flex items-center gap-2 border border-white/10 bg-white/[0.035] pr-1 text-xs font-bold text-white"
            >
              <img
                src={championIcon(champion)}
                alt=""
                className="h-8 w-8 object-cover"
                loading="lazy"
              />
              <span>{champion.name}</span>
              <button
                type="button"
                onClick={() => onRemove(id)}
                className="flex h-7 w-7 items-center justify-center text-white/45 transition hover:bg-white/8 hover:text-white"
                aria-label={`Remove ${champion.name}`}
                title={`Remove ${champion.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MidLateCommandRoom() {
  const [view, setView] = useState<ViewId>("decision");
  const [economy, setEconomy] = useState(2);
  const [information, setInformation] = useState(2);
  const [teamReady, setTeamReady] = useState(2);
  const [failureCost, setFailureCost] = useState(2);
  const [objectiveBand, setObjectiveBand] = useState(1);
  const [sideDepth, setSideDepth] = useState(1);
  const [shadow, setShadow] = useState<ShadowId>("vision");
  const [responder, setResponder] = useState<ResponderRead>("contested");
  const [cooldowns, setCooldowns] = useState({ w: true, r: true, flash: true });
  const [selectedEnemies, setSelectedEnemies] = useState([
    "Nocturne",
    "Janna",
    "Xayah",
  ]);
  const [atlasSearch, setAtlasSearch] = useState("");
  const [atlasFilter, setAtlasFilter] = useState<"all" | ThreatId>("all");
  const [selectedChampionId, setSelectedChampionId] = useState("Nocturne");

  const selectedChampion =
    championKits.find((champion) => champion.id === selectedChampionId) ??
    championKits[0];

  const selectedThreats = useMemo(() => {
    const ids = new Set<ThreatId>();
    selectedEnemies.forEach((id) => {
      const champion = championKits.find((entry) => entry.id === id);
      if (!champion) return;
      getChampionThreats(champion).forEach((threat) => {
        if (threat !== "support-enabler") ids.add(threat);
      });
    });
    return [...ids].sort(
      (a, b) => threatDefinitions[b].weight - threatDefinitions[a].weight
    );
  }, [selectedEnemies]);

  const decision = useMemo(
    () =>
      buildMacroGameplan({
        economy,
        information,
        teamReady,
        failureCost,
        objectiveBand,
        currentDepth: sideDepth,
        shadow,
        responder,
        cooldowns,
        selectedThreats,
        selectedEnemyCount: selectedEnemies.length,
        selectedEnemyNames: selectedEnemies
          .map((id) => championKits.find((champion) => champion.id === id)?.name)
          .filter((name): name is string => Boolean(name)),
      }),
    [
      cooldowns,
      economy,
      failureCost,
      information,
      objectiveBand,
      responder,
      selectedEnemies,
      selectedThreats,
      shadow,
      sideDepth,
      teamReady,
    ]
  );

  const filteredChampions = useMemo(() => {
    const query = atlasSearch.trim().toLowerCase();
    return championKits.filter((champion) => {
      const matchesSearch =
        !query ||
        champion.name.toLowerCase().includes(query) ||
        champion.title.toLowerCase().includes(query) ||
        champion.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchesFilter =
        atlasFilter === "all" || getChampionThreats(champion).includes(atlasFilter);
      return matchesSearch && matchesFilter;
    });
  }, [atlasFilter, atlasSearch]);

  const resetDecision = () => {
    setEconomy(2);
    setInformation(2);
    setTeamReady(2);
    setFailureCost(2);
    setObjectiveBand(1);
    setSideDepth(1);
    setShadow("vision");
    setResponder("contested");
    setCooldowns({ w: true, r: true, flash: true });
    setSelectedEnemies(["Nocturne", "Janna", "Xayah"]);
  };

  const addEnemy = (id: string) => {
    setSelectedEnemies((current) =>
      current.includes(id) || current.length >= 5 ? current : [...current, id]
    );
  };

  return (
    <section id="mid-late-command-room" className="overflow-hidden border-y border-white/10 bg-[#070708]">
      <header className="relative overflow-hidden border-b border-white/10 px-5 py-8 md:px-8 md:py-10">
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative flex flex-col gap-7 min-[1800px]:flex-row min-[1800px]:items-end min-[1800px]:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 border border-red-300/30 bg-red-300/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-red-200">
                <Brain className="h-3.5 w-3.5" />
                Mid / Late Command Room
              </span>
              <span className="border border-cyan-300/25 bg-cyan-300/8 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100">
                Patch {MID_LATE_PATCH.patch}
              </span>
            </div>
            <h2 className="mt-5 max-w-4xl text-3xl font-black leading-[1.04] text-white md:text-4xl">
              Read the state. Keep options alive. Enter when the fight finally makes sense.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/62 md:text-base">
              No five-rule shortcut. This workspace crosses economy, waves, vision,
              cooldowns, team tempo, all 173 champion kits and the cost of being wrong.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/10 border border-white/10 bg-black/45 min-[1800px]:w-[390px]">
            <div className="p-3.5">
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/35">Kits</p>
              <p className="mt-1 text-xl font-black text-white">{MID_LATE_PATCH.championCount}</p>
            </div>
            <div className="p-3.5">
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/35">Threat layers</p>
              <p className="mt-1 text-xl font-black text-cyan-100">11</p>
            </div>
            <div className="p-3.5">
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/35">Review</p>
              <p className="mt-1 whitespace-nowrap text-xs font-black text-red-200">31 JUL 26</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="hide-scrollbar flex overflow-x-auto border-b border-white/10 bg-black/55 px-3 md:px-6" aria-label="Mid and late game views">
        {views.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={cn(
                "relative flex min-h-14 shrink-0 items-center gap-2 px-4 text-xs font-black uppercase tracking-[0.08em] transition",
                active ? "text-white" : "text-white/42 hover:text-white/75"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("h-4 w-4", active ? "text-red-200" : "text-white/35")} />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.short}</span>
              {active ? <span className="absolute inset-x-3 bottom-0 h-0.5 bg-red-300" /> : null}
            </button>
          );
        })}
      </nav>

      {view === "decision" ? (
        <div>
          <div className="grid grid-cols-[minmax(0,1fr)] min-[1800px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="min-w-0 border-b border-white/10 p-5 md:p-8 min-[1800px]:border-b-0 min-[1800px]:border-r">
              <div className="flex items-start justify-between gap-4">
                <SectionLead
                  eyebrow="Live context"
                  title="Describe the pressure, not the scoreline."
                  text="Each input changes a permission, route, or stop condition. The result never hides uncertainty behind a percentage."
                />
                <button
                  type="button"
                  onClick={resetDecision}
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 text-white/45 transition hover:border-white/25 hover:text-white"
                  title="Reset decision room"
                  aria-label="Reset decision room"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-7 grid gap-x-7 min-[1500px]:grid-cols-2">
                <RangeControl label="Economy" value={economy} labels={sliderLabels.economy} onChange={setEconomy} icon={Activity} />
                <RangeControl label="Information" value={information} labels={sliderLabels.information} onChange={setInformation} icon={Eye} />
                <RangeControl label="Team tempo" value={teamReady} labels={sliderLabels.team} onChange={setTeamReady} icon={Users} />
                <RangeControl label="Failure cost" value={failureCost} labels={sliderLabels.failure} onChange={setFailureCost} icon={Shield} />
              </div>

              <div className="mt-7">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/42">Objective phase</p>
                <div className="hide-scrollbar mt-3 flex overflow-x-auto border border-white/10">
                  {objectiveBands.map((band, index) => (
                    <button
                      key={band.id}
                      type="button"
                      onClick={() => setObjectiveBand(index)}
                      className={cn(
                        "min-w-[96px] flex-1 border-r border-white/10 px-2 py-3 text-center text-[9px] font-black uppercase tracking-[0.04em] transition last:border-r-0 md:text-[10px]",
                        objectiveBand === index
                          ? "bg-amber-300/12 text-amber-100"
                          : "text-white/36 hover:bg-white/[0.035] hover:text-white/65"
                      )}
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/42">
                  {objectiveBands[objectiveBand].text}
                </p>
              </div>

              <div className="mt-7 grid gap-6 min-[1500px]:grid-cols-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/42">Current side depth</p>
                  <div className="mt-3 grid grid-cols-4 border border-white/10">
                    {sideDepths.map((depth) => (
                      <button
                        key={depth.depth}
                        type="button"
                        onClick={() => setSideDepth(depth.depth)}
                        className={cn(
                          "border-r border-white/10 px-2 py-3 text-[10px] font-black uppercase transition last:border-r-0",
                          sideDepth === depth.depth
                            ? "bg-red-300/12 text-red-100"
                            : "text-white/38 hover:text-white/70"
                        )}
                      >
                        D{depth.depth} {depth.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/42">Available tools</p>
                  <div className="mt-3 grid grid-cols-3 border border-white/10">
                    {(Object.keys(cooldowns) as Array<keyof typeof cooldowns>).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCooldowns((current) => ({ ...current, [key]: !current[key] }))}
                        className={cn(
                          "flex items-center justify-center gap-1.5 border-r border-white/10 px-2 py-3 text-[10px] font-black uppercase transition last:border-r-0",
                          cooldowns[key] ? "bg-emerald-300/10 text-emerald-100" : "text-white/28"
                        )}
                        aria-pressed={cooldowns[key]}
                      >
                        {cooldowns[key] ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        {key === "w" ? "Riposte" : key}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/42">Likely side responder</p>
                <div className="mt-3 grid gap-px bg-white/10 sm:grid-cols-3">
                  {([
                    ["favored", "Short Fiora window", "You can pressure the responder before help arrives."],
                    ["contested", "Can contain", "The duel is playable, but time and escape can erase its value."],
                    ["unfavored", "Owns contact", "Win through wave, fog, or numbers rather than a direct test."],
                  ] as const).map(([id, label, detail]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setResponder(id)}
                      className={cn(
                        "min-h-[76px] bg-[#09090b] px-3 py-3 text-left transition",
                        responder === id ? "bg-red-300/10 text-white" : "text-white/46 hover:text-white/72"
                      )}
                      aria-pressed={responder === id}
                    >
                      <span className="block text-[10px] font-black uppercase tracking-[0.06em]">{label}</span>
                      <span className="mt-1.5 block text-[10px] leading-snug text-white/38">{detail}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/42">Shadow geometry</p>
                <div className="mt-3 grid gap-px bg-white/10 sm:grid-cols-5">
                  {[{ id: "none", label: "No shadow" }, ...shadowTypes].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setShadow(item.id as ShadowId)}
                      className={cn(
                        "min-h-12 bg-[#09090b] px-2 py-2 text-[9px] font-black uppercase tracking-[0.05em] transition",
                        shadow === item.id ? "bg-cyan-300/12 text-cyan-100" : "text-white/36 hover:text-white/68"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.12em] text-white/42">Relevant enemies</p>
                <ChampionPicker selectedIds={selectedEnemies} onAdd={addEnemy} onRemove={(id) => setSelectedEnemies((current) => current.filter((entry) => entry !== id))} />
              </div>
            </div>

            <div className="min-w-0 bg-[#0a0a0c] p-5 md:p-8">
              <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200">
                    <CircleDot className="h-3.5 w-3.5" /> {decision.assignment}
                  </p>
                  <h3 className="mt-3 max-w-3xl text-2xl font-black leading-tight text-white md:text-4xl">
                    {decision.headline}
                  </h3>
                </div>
                <div className="min-w-36 border border-white/10 bg-black/30 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/38">Supported side depth</p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <span className="text-2xl font-black text-white">D{decision.maxDepth}</span>
                    <span className="pb-1 text-[9px] font-black uppercase tracking-[0.08em] text-white/34">Now D{sideDepth}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-px border-b border-white/10 bg-white/10 min-[1500px]:grid-cols-2 min-[1900px]:grid-cols-3">
                {decision.permissions.map((permission) => (
                  <article key={permission.id} className="bg-[#0a0a0c] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/38">{permission.label}</p>
                      <span className={cn("border px-2 py-1 text-[8px] font-black uppercase tracking-[0.08em]", permissionToneClasses[permission.tone])}>
                        {permission.tone}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-black text-white">{permission.value}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-white/44">{permission.detail}</p>
                  </article>
                ))}
              </div>

              <div className="grid gap-px border-b border-white/10 bg-white/10 min-[1700px]:grid-cols-3">
                {[
                  ["01 / Now", decision.now, "text-red-200"],
                  ["02 / Next", decision.next, "text-cyan-100"],
                  ["Stop condition", decision.stop, "text-amber-100"],
                ].map(([label, detail, tone]) => (
                  <article key={label} className="bg-[#0a0a0c] p-5">
                    <p className={cn("text-[10px] font-black uppercase tracking-[0.12em]", tone)}>{label}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/68">{detail}</p>
                  </article>
                ))}
              </div>

              <div className="py-7">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-red-300">Pressure sequence</p>
                <div className="mt-4 grid gap-2 md:grid-cols-2 min-[1800px]:grid-cols-4">
                  {decision.sequence.map((step, index) => (
                    <div key={step} className="relative border border-white/10 bg-black/25 p-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-white/32">0{index + 1}</span>
                        {index < decision.sequence.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-red-200/45" /> : <Flag className="h-3.5 w-3.5 text-emerald-200" />}
                      </div>
                      <p className="mt-3 text-sm font-bold leading-snug text-white">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-px border-y border-white/10 bg-white/10 lg:grid-cols-2">
                <div className="bg-[#0a0a0c] p-5">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100">
                    <GitBranch className="h-3.5 w-3.5" /> Competing line
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/68">{decision.competing}</p>
                </div>
                <div className="bg-[#0a0a0c] p-5">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-amber-100">
                    <Route className="h-3.5 w-3.5" /> Exit plan
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/68">{decision.exit}</p>
                </div>
              </div>

              <div className="grid gap-px border-b border-white/10 bg-white/10 min-[1700px]:grid-cols-[0.72fr_1.28fr]">
                <div className="bg-[#0a0a0c] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-red-200">Depth boundary</p>
                  <p className="mt-2 text-lg font-black text-white">{decision.depthStatus}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/58">{decision.depthReason}</p>
                </div>
                <div className="bg-[#0a0a0c] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100">What unlocks more depth</p>
                  <div className="mt-3 space-y-2.5">
                    {decision.unlocks.slice(0, 3).map((unlock) => (
                      <div key={unlock} className="flex gap-2.5 text-sm leading-relaxed text-white/58">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                        <p>{unlock}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-7 py-7 lg:grid-cols-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/42">Why this line leans ahead</p>
                  <div className="mt-4 space-y-3">
                    {decision.reasons.map((reason) => (
                      <div key={reason} className="flex gap-3 text-sm leading-relaxed text-white/66">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
                        <p>{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/42">What changes the call</p>
                  <div className="mt-4 space-y-3">
                    {decision.changes.map((change) => (
                      <div key={change} className="flex gap-3 text-sm leading-relaxed text-white/66">
                        <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-200" />
                        <p>{change}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 py-7">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-red-300">Fight handoff</p>
                    <h4 className="mt-2 text-xl font-black text-white">The map line ends where the entry queue begins.</h4>
                  </div>
                  <button type="button" onClick={() => setView("fight")} className="inline-flex shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-[0.08em] text-red-200 hover:text-red-100">
                    Full fight view <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-5 grid gap-px bg-white/10 min-[1500px]:grid-cols-2 min-[1900px]:grid-cols-3">
                  {[
                    ["Entry route", decision.entryRoute],
                    ["Attention shift", decision.attentionShift],
                    ["First legal target", decision.firstLegalTarget],
                    ["Riposte queue", decision.riposteQueue],
                    ["Flash job", decision.flashJob],
                    ["First conversion", decision.conversion],
                  ].map(([label, detail]) => (
                    <article key={label} className="bg-[#09090b] p-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/38">{label}</p>
                      <p className="mt-2 text-xs leading-relaxed text-white/58">{detail}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="mr-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/38">Danger queue</p>
                  {selectedThreats.length ? selectedThreats.map((id) => <ThreatBadge key={id} id={id} compact />) : <span className="text-xs text-white/38">Add enemies to build the queue.</span>}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-white/38">
                  This queue ranks interaction layers, not champion difficulty. Open Fight Entry for the complete W and target logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {view === "map" ? (
        <div>
          <div className="p-5 md:p-8">
            <SectionLead eyebrow="Pressure architecture" title="Mid and side are consecutive states." text="The map plan is a loop. Fiora collects, disappears, forces information and re-enters where the next resource overlaps the next fight." />
          </div>

          <div className="grid gap-px border-y border-white/10 bg-white/10 sm:grid-cols-2 min-[1800px]:grid-cols-4">
            {currentSystems.map((system) => (
              <article key={system.label} className="bg-[#09090b] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-red-300">{system.label}</p>
                <p className="mt-2 text-lg font-black text-white">{system.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/52">{system.text}</p>
              </article>
            ))}
          </div>

          <section className="border-b border-white/10 p-5 md:p-8">
            <div className="flex flex-col gap-3 min-[1800px]:flex-row min-[1800px]:items-end min-[1800px]:justify-between">
              <SectionLead eyebrow="Central pressure" title="Arrival to re-entry" text="Clearing mid is only the visible part. Concealment and preserved options create the actual pressure." />
              <p className="max-w-md text-xs leading-relaxed text-white/38 min-[1800px]:text-right">A roam can find no kill and still work when Fiora returns before the next wave and changed enemy positioning.</p>
            </div>
            <div className="mt-8 grid gap-px bg-white/10 md:grid-cols-2 min-[1800px]:grid-cols-5">
              {midPressureCycle.map((phase) => (
                <article key={phase.step} className="min-h-44 bg-[#09090b] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-200">{phase.step}</span>
                    <ArrowRight className="h-4 w-4 text-white/18" />
                  </div>
                  <h4 className="mt-5 text-lg font-black text-white">{phase.label}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/52">{phase.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-b border-white/10 p-5 md:p-8">
            <SectionLead eyebrow="Side pressure" title="Depth is adjustable every wave." text="The question is not split or group. It is how far Fiora can advance while the action remains worth its failure cost." />
            <div className="mt-8 grid gap-px bg-white/10 md:grid-cols-2 min-[1800px]:grid-cols-4">
              {sideDepths.map((depth) => (
                <article key={depth.depth} className="relative bg-[#09090b] p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center border border-red-300/25 bg-red-300/8 text-xs font-black text-red-100">D{depth.depth}</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/32">{depth.location}</span>
                  </div>
                  <h4 className="mt-5 text-xl font-black text-white">{depth.label}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/56">{depth.text}</p>
                  <p className="mt-5 border-l-2 border-cyan-300/30 pl-3 text-xs leading-relaxed text-cyan-50/62">{depth.exit}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid border-b border-white/10 min-[1800px]:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-white/10 p-5 md:p-8 min-[1800px]:border-b-0 min-[1800px]:border-r">
              <SectionLead eyebrow="Shadow geometry" title="Nearby does not mean available." text="Every shadow has a purpose, effective range, reveal cost and failure mode." />
              <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {shadowTypes.map((item, index) => (
                  <div key={item.id} className="grid gap-3 py-4 sm:grid-cols-[42px_1fr]">
                    <span className="flex h-9 w-9 items-center justify-center border border-cyan-300/20 bg-cyan-300/8 text-xs font-black text-cyan-100">0{index + 1}</span>
                    <div>
                      <h4 className="font-black text-white">{item.label}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-white/56">{item.text}</p>
                      <p className="mt-2 text-xs leading-relaxed text-amber-100/58">Check: {item.check}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 md:p-8">
              <SectionLead eyebrow="Objective choreography" title="Setup is a window, not a timer command." text="The same side wave changes value as vision, recalls and objective commitment compress the map." />
              <div className="mt-7">
                {objectiveBands.map((band, index) => (
                  <div key={band.id} className="grid grid-cols-[34px_1fr] gap-4 border-b border-white/8 py-4 last:border-b-0">
                    <div className="relative flex justify-center">
                      <span className="relative z-10 mt-1 h-3 w-3 border border-amber-200/60 bg-amber-200" />
                      {index < objectiveBands.length - 1 ? <span className="absolute bottom-[-18px] top-4 w-px bg-white/12" /> : null}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h4 className="font-black text-white">{band.label}</h4>
                        <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/30">{band.time}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-white/56">{band.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="p-5 md:p-8">
            <SectionLead eyebrow="Advantage vector" title="Seven readings can disagree at once." text="Fiora may be ahead in items, behind in levels, first on tempo, blind on information and carrying the highest shutdown." />
            <div className="mt-7 grid gap-px bg-white/10 md:grid-cols-2 min-[1800px]:grid-cols-3">
              {advantageAxes.map((axis) => (
                <details key={axis.id} className="group border border-transparent bg-[#09090b] p-2 transition hover:border-white/16 open:border-red-300/24 open:bg-[#0c0c0e] md:last:col-span-2 min-[1800px]:last:col-span-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-md p-3 font-black text-white transition hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/55">
                    {axis.label}
                    <span className="inline-flex min-h-8 shrink-0 items-center gap-2 rounded-md border border-white/16 bg-black/32 px-2.5 text-[9px] font-black uppercase tracking-[0.08em] text-red-100 transition group-hover:border-red-200/45 group-open:border-red-200/55 group-open:bg-red-500/12">
                      <span className="group-open:hidden">Open</span>
                      <span className="hidden group-open:inline">Close</span>
                      <ChevronRight className="h-3.5 w-3.5 transition group-open:rotate-90" />
                    </span>
                  </summary>
                  <div className="mx-3 mb-3 mt-3 space-y-3">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/32">Inspect</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/58">{axis.inspect}</p>
                    </div>
                    <div className="border-l-2 border-cyan-300/30 pl-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.1em] text-cyan-100/60">Apply</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-cyan-50/60">{axis.decision}</p>
                    </div>
                    <div className="border-l-2 border-amber-300/30 pl-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.1em] text-amber-100/60">Re-read when</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-amber-50/56">{axis.reversal}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="border-t border-white/10 p-5 md:p-8">
            <SectionLead eyebrow="Kill the shortcuts" title="Useful bias, no blind law." text="These myths sound efficient because they hide the information that actually decides the play." />
            <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
              {macroMyths.map((item, index) => (
                <div key={item.myth} className="grid gap-3 py-4 md:grid-cols-[42px_0.8fr_1.2fr] md:items-center">
                  <span className="text-xs font-black text-white/24">0{index + 1}</span>
                  <p className="text-sm font-black text-red-100/78">{item.myth}</p>
                  <p className="text-sm leading-relaxed text-white/56">{item.truth}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {view === "fight" ? (
        <div>
          <div className="grid border-b border-white/10 min-[1800px]:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-white/10 p-5 md:p-8 min-[1800px]:border-b-0 min-[1800px]:border-r">
              <SectionLead eyebrow="Enemy layers" title="Build the danger queue." text="The order matters. Riposte can solve one future state, not every spell attached to five champions." />
              <div className="mt-6">
                <ChampionPicker selectedIds={selectedEnemies} onAdd={addEnemy} onRemove={(id) => setSelectedEnemies((current) => current.filter((entry) => entry !== id))} />
              </div>
              <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {selectedThreats.length ? selectedThreats.map((id, index) => {
                  const threat = threatDefinitions[id];
                  return (
                    <div key={id} className="grid grid-cols-[32px_1fr] gap-3 py-4">
                      <span className="text-xs font-black text-white/25">0{index + 1}</span>
                      <div>
                        <ThreatBadge id={id} />
                        <p className="mt-3 text-sm leading-relaxed text-white/58">{threat.effect}</p>
                        <p className="mt-2 text-xs leading-relaxed text-cyan-50/58">Response: {threat.response}</p>
                      </div>
                    </div>
                  );
                }) : <p className="py-5 text-sm text-white/42">Add enemy champions to map the control chain.</p>}
              </div>
            </div>

            <div className="p-5 md:p-8">
              <SectionLead eyebrow="Fight timeline" title="Second-wave carry does not mean late by default." text="Fiora can create first contact on an isolated target, counter-enter on a diver, or wait for attention to compress before reaching the backline." />
              <div className="mt-7 grid gap-px bg-white/10 md:grid-cols-2">
                {fightPhases.map((phase, index) => (
                  <article key={phase.number} className={cn("bg-[#09090b] p-5", index === fightPhases.length - 1 && "md:col-span-2")}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-red-200">{phase.number}</span>
                      <h4 className="font-black text-white">{phase.label}</h4>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{phase.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <section className="grid border-b border-white/10 min-[1800px]:grid-cols-2">
            <div className="border-b border-white/10 p-5 md:p-8 min-[1800px]:border-b-0 min-[1800px]:border-r">
              <SectionLead eyebrow="Target pricing" title="The ADC is the bias, not the whole equation." text="A target becomes good when value, access, conversion, follow-up and exit align at the same time." />
              <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {targetFactors.map(([label, text], index) => (
                  <div key={label} className="grid grid-cols-[32px_1fr] gap-3 py-3.5">
                    <span className="text-[10px] font-black text-white/26">0{index + 1}</span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.08em] text-white">{label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/52">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 md:p-8">
              <SectionLead eyebrow="Riposte allocation" title="Choose which future state W buys." text="Parrying the first CC can still lose the entry when the second spell is the actual stop." />
              <div className="mt-7 grid gap-px bg-white/10 sm:grid-cols-2">
                {[
                  ["Entry", "Negate the forced lock and return the stun toward the conversion target."],
                  ["Lethal denial", "Absorb the damage or execute that ends the attempt even without returned hard CC."],
                  ["Attack control", "Use the attack-speed slow when the carry or diver depends on a short DPS window."],
                  ["Exit", "Hold W through first contact so the healing field or Q route remains survivable afterward."],
                ].map(([label, text], index) => (
                  <article key={label} className="bg-[#09090b] p-5">
                    <div className="flex items-center justify-between">
                      <ShieldCheck className="h-4 w-4 text-cyan-100" />
                      <span className="text-[10px] font-black text-white/22">0{index + 1}</span>
                    </div>
                    <h4 className="mt-4 font-black text-white">{label}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-white/54">{text}</p>
                  </article>
                ))}
              </div>

              <div className="mt-7 border-l-2 border-red-300/40 bg-red-300/[0.045] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-red-200">Grand Challenge read</p>
                <p className="mt-2 text-sm leading-relaxed text-white/62">A fragile carry maximizes removal. A jungler before Smite, an exposed peeler, or a diver that creates an instant healing field can become more valuable in the current contact. Death denial can turn the most fragile target into the slowest conversion.</p>
              </div>
            </div>
          </section>

          <section className="p-5 md:p-8">
            <div className="flex items-start gap-4 border border-emerald-300/18 bg-emerald-300/[0.035] p-5">
              <Zap className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" />
              <div>
                <h4 className="font-black text-white">The first kill creates a new state.</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/58">Re-read Hubris duration, Grand Challenge healing, Greaves sustain, Q cooldown, current health, objective health and structure access. Continuing is not automatically the reward for succeeding once.</p>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {view === "atlas" ? (
        <div>
          <div className="border-b border-white/10 p-5 md:p-8">
            <div className="flex flex-col gap-6 min-[1800px]:flex-row min-[1800px]:items-end min-[1800px]:justify-between">
              <SectionLead eyebrow="173 current kits" title="Search the interaction, then read the spell." text="Threat tags overlap. They explain what changes Fiora's route, W, target or side depth without pretending the champion has one fixed difficulty." />
              <div className="w-full min-[1800px]:max-w-xl">
                <label className="flex items-center gap-3 border border-white/12 bg-black/35 px-3 py-2.5 focus-within:border-red-300/55">
                  <Search className="h-4 w-4 shrink-0 text-white/35" />
                  <input
                    value={atlasSearch}
                    onChange={(event) => setAtlasSearch(event.target.value)}
                    placeholder="Search champion, title, or Riot role"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                  />
                  <span className="text-[10px] font-black text-white/28">{filteredChampions.length}</span>
                </label>
              </div>
            </div>

            <div className="hide-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setAtlasFilter("all")}
                className={cn("shrink-0 border px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em]", atlasFilter === "all" ? "border-white/30 bg-white/10 text-white" : "border-white/10 text-white/38")}
              >
                All champions
              </button>
              {(Object.keys(threatDefinitions) as ThreatId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAtlasFilter(id)}
                  className={cn(
                    "shrink-0 border px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] transition",
                    atlasFilter === id ? accentClasses[threatDefinitions[id].accent] : "border-white/10 text-white/38 hover:text-white/70"
                  )}
                >
                  {threatDefinitions[id].shortLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="grid min-[1800px]:grid-cols-[minmax(0,1fr)_420px]">
            <div className="border-b border-white/10 p-4 md:p-6 min-[1800px]:border-b-0 min-[1800px]:border-r">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5">
                {filteredChampions.map((champion) => {
                  const threats = getChampionThreats(champion);
                  const active = champion.id === selectedChampion.id;
                  return (
                    <button
                      key={champion.id}
                      type="button"
                      onClick={() => setSelectedChampionId(champion.id)}
                      className={cn(
                        "group min-w-0 border p-2 text-left transition",
                        active ? "border-red-300/65 bg-red-300/8" : "border-white/8 bg-white/[0.02] hover:border-white/22 hover:bg-white/[0.045]"
                      )}
                    >
                      <div className="relative aspect-square overflow-hidden bg-black">
                        <img src={championIcon(champion)} alt={champion.name} className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]" loading="lazy" />
                        <span className="absolute bottom-0 left-0 bg-black/78 px-1.5 py-1 text-[8px] font-black uppercase tracking-[0.06em] text-white/72">{threats.length || "Kit"} layers</span>
                      </div>
                      <p className="mt-2 truncate text-xs font-black text-white">{champion.name}</p>
                      <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.06em] text-white/32">{champion.tags.join(" / ")}</p>
                    </button>
                  );
                })}
              </div>
              {!filteredChampions.length ? (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <Search className="h-7 w-7 text-white/18" />
                  <p className="mt-3 font-black text-white/60">No champion matches this read.</p>
                  <button type="button" onClick={() => { setAtlasSearch(""); setAtlasFilter("all"); }} className="mt-3 text-xs font-bold text-red-200">Clear filters</button>
                </div>
              ) : null}
            </div>

            <ChampionDetail champion={selectedChampion} />
          </div>
        </div>
      ) : null}

      {view === "evidence" ? (
        <div>
          <div className="p-5 md:p-8">
            <SectionLead eyebrow="Evidence discipline" title="Deep does not mean pretending every source is equal." text="Current Riot facts, specialist behavior, broad macro consensus, editorial inference and author doctrine remain visibly separated." />
          </div>

          <div className="grid gap-px border-y border-white/10 bg-white/10 md:grid-cols-2 min-[1800px]:grid-cols-5">
            {[
              ["01", "OFFICIAL", "Patch notes and current kit text."],
              ["02", "REVIEWED PLAY", "Repeated high-elo Fiora ADC behavior, anonymized publicly."],
              ["03", "CONSENSUS", "Stable high-level macro principles."],
              ["04", "INFERENCE", "Application to this Fiora ADC build."],
              ["05", "AUTHOR", "Your tested route and doctrine."],
            ].map(([number, label, text]) => (
              <article key={label} className="bg-[#09090b] p-5">
                <span className="text-[10px] font-black text-red-200">{number}</span>
                <h4 className="mt-4 text-xs font-black uppercase tracking-[0.1em] text-white">{label}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/52">{text}</p>
              </article>
            ))}
          </div>

          <section className="grid border-b border-white/10 min-[1800px]:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-white/10 p-5 md:p-8 min-[1800px]:border-b-0 min-[1800px]:border-r">
              <SectionLead eyebrow="Primary source shelf" title="Every claim keeps its origin." text="Numerical facts are patch-bound. Durable macro patterns can survive an old replay only when the item details are explicitly discarded." />
              <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {evidenceSources.map((source) => {
                  const sourceContent = (
                    <>
                      <span className="text-[9px] font-black uppercase tracking-[0.1em] text-red-200">{source.type}</span>
                      <div>
                        <p className="text-sm font-black text-white group-hover:text-red-100">{source.label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/42">{source.text}</p>
                      </div>
                      {source.url ? <ChevronRight className="h-4 w-4 text-white/18 transition group-hover:translate-x-0.5 group-hover:text-red-200" /> : <ShieldCheck className="h-4 w-4 text-emerald-200/45" />}
                    </>
                  );

                  return source.url ? (
                    <a key={source.label} href={source.url} target="_blank" rel="noreferrer" className="group grid gap-2 py-4 sm:grid-cols-[90px_1fr_18px] sm:items-center">
                      {sourceContent}
                    </a>
                  ) : (
                    <div key={source.label} className="group grid gap-2 py-4 sm:grid-cols-[90px_1fr_18px] sm:items-center">
                      {sourceContent}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 md:p-8">
              <SectionLead eyebrow="Replay counterexamples" title="A sequence is evidence; a frame is not a rule." text="These examples show why mid, side, patience and deep pursuit can all appear in one game without contradiction." />
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {replayCases.map((replay) => (
                  <article key={replay.label} className="border border-white/10 bg-white/[0.025] p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-cyan-100">{replay.patch}</p>
                    <h4 className="mt-2 text-lg font-black text-white">{replay.label}</h4>
                    <div className="mt-4 space-y-3">
                      {replay.moments.map((moment) => (
                        <div key={moment} className="flex gap-2.5 text-sm leading-relaxed text-white/54">
                          <CircleDot className="mt-1 h-3 w-3 shrink-0 text-red-200" />
                          <p>{moment}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="grid min-[1800px]:grid-cols-3">
            {[
              [Database, "Current facts", "Re-fetch Data Dragon after kit changes and audit every item/rune number against Riot notes."],
              [TimerReset, "Invalidation notes", "Store what would make each conclusion stale: role quest, W interaction, item pattern or map system."],
              [Info, "Calibrated output", "Missing context stays visible as an unresolved permission instead of becoming a fake percentage."],
            ].map(([Icon, title, text], index) => {
              const ItemIcon = Icon as typeof Database;
              return (
                <article key={title as string} className={cn("p-5 md:p-8", index < 2 && "border-b border-white/10 min-[1800px]:border-b-0 min-[1800px]:border-r")}>
                  <ItemIcon className="h-5 w-5 text-emerald-200" />
                  <h4 className="mt-4 font-black text-white">{title as string}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/52">{text as string}</p>
                </article>
              );
            })}
          </section>
        </div>
      ) : null}
    </section>
  );
}

function ChampionDetail({ champion }: { champion: ChampionKit }) {
  const threats = getChampionThreats(champion);
  const strategicThreats = threats.filter((id) => id !== "support-enabler");

  return (
    <aside className="bg-[#0a0a0c] p-5 md:p-6 min-[1800px]:sticky min-[1800px]:top-0 min-[1800px]:h-fit">
      <div className="flex gap-4 border-b border-white/10 pb-5">
        <img src={championIcon(champion)} alt={champion.name} className="h-20 w-20 shrink-0 border border-white/12 object-cover" />
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-red-200">Current kit / 16.15.1</p>
          <h3 className="mt-1 text-2xl font-black text-white">{champion.name}</h3>
          <p className="mt-1 truncate text-xs text-white/38">{champion.title}</p>
          <p className="mt-2 text-[9px] font-black uppercase tracking-[0.1em] text-cyan-100/62">{champion.tags.join(" / ")} · {champion.partype}</p>
        </div>
      </div>

      <div className="py-5">
        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/36">Strategic layers</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {threats.length ? threats.map((id) => <ThreatBadge key={id} id={id} compact />) : <span className="border border-white/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-white/38">Kit-specific read</span>}
        </div>
        <div className="mt-4 space-y-3">
          {strategicThreats.slice(0, 3).map((id) => (
            <p key={id} className="border-l-2 border-white/10 pl-3 text-xs leading-relaxed text-white/52">
              <span className="font-black text-white/72">{threatDefinitions[id].shortLabel}: </span>
              {threatDefinitions[id].response}
            </p>
          ))}
          {!strategicThreats.length ? (
            <p className="border-l-2 border-white/10 pl-3 text-xs leading-relaxed text-white/52">Read the current abilities below, then price range, cooldowns, targetability and route. No generic class tag is precise enough by itself.</p>
          ) : null}
        </div>
      </div>

      <div className="border-y border-white/10 py-4">
        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-amber-100/70">Passive · {champion.passive.name}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/52">{cleanKitText(champion.passive.description)}</p>
      </div>

      <div className="divide-y divide-white/10">
        {champion.spells.map((spell, index) => (
          <details key={spell.id} className="group border border-transparent py-2 transition hover:border-white/12 open:border-white/10 open:bg-white/[0.018]" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/55">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/10 bg-white/[0.035] text-[10px] font-black text-red-100">{["Q", "W", "E", "R"][index]}</span>
                <p className="truncate text-sm font-black text-white">{spell.name}</p>
              </div>
              <span className="inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded-md border border-white/14 bg-black/28 px-2 text-[8px] font-black uppercase tracking-[0.08em] text-white/52 transition group-hover:text-white/76 group-open:border-red-300/38 group-open:text-red-100">
                <span className="group-open:hidden">Details</span>
                <span className="hidden group-open:inline">Close</span>
                <ChevronRight className="h-3 w-3 transition group-open:rotate-90" />
              </span>
            </summary>
            <p className="mx-3 mt-3 text-xs leading-relaxed text-white/52">{cleanKitText(spell.description)}</p>
            <p className="mx-3 mb-2 mt-3 text-[9px] font-black uppercase tracking-[0.08em] text-white/26">Cooldown {spell.cooldownBurn}</p>
          </details>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 border-t border-white/10 pt-4 text-[10px] leading-relaxed text-white/32">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>Riot kit text is factual. Strategic layers are editorial interpretation and can overlap or change with cooldowns, build, terrain and nearby champions.</p>
      </div>
    </aside>
  );
}
