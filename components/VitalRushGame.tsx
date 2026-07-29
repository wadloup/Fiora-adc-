import {
  Activity,
  Flame,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Swords,
  Zap,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";

const ARENA_WIDTH = 1000;
const ARENA_HEIGHT = 600;
const PLAYER_SIZE = 56;
const ENEMY_SIZE = 62;
const PROJECTILE_SIZE = 16;
const MAX_HP = 100;
const STORAGE_KEY = "fiora-vital-rush-best";

const championIcon = (name: string) =>
  `https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${name}.png`;

type DifficultyKey = "warmup" | "ranked" | "chaos";
type GameStatus = "ready" | "running" | "paused" | "ended";
type VitalSide = 0 | 1 | 2 | 3;

type DifficultyConfig = {
  label: string;
  tone: string;
  enemyInterval: number;
  projectileInterval: number;
  projectileSpeed: number;
  enemySpeed: number;
  scoreMultiplier: number;
};

type Point = {
  x: number;
  y: number;
};

type Player = Point & {
  dashCooldown: number;
  parryCooldown: number;
  tempoCooldown: number;
  parryUntil: number;
  tempoUntil: number;
  invulnerableUntil: number;
};

type Enemy = Point & {
  id: number;
  name: string;
  image: string;
  size: number;
  hp: number;
  maxHp: number;
  speed: number;
  vitalSide: VitalSide;
  nextShotAt: number;
  stunnedUntil: number;
  lastHitAt: number;
};

type Projectile = Point & {
  id: number;
  vx: number;
  vy: number;
  size: number;
  kind: "bolt" | "trap";
};

type Slash = Point & {
  id: number;
  radius: number;
  until: number;
};

type Spark = Point & {
  id: number;
  until: number;
  label: string;
  tone: "gold" | "red" | "blue";
};

type EngineState = {
  status: GameStatus;
  difficulty: DifficultyKey;
  score: number;
  bestScore: number;
  combo: number;
  hp: number;
  wave: number;
  elapsed: number;
  now: number;
  message: string;
  messageUntil: number;
  player: Player;
  pointerTarget: Point | null;
  enemies: Enemy[];
  projectiles: Projectile[];
  slashes: Slash[];
  sparks: Spark[];
  nextEnemyAt: number;
  nextProjectileAt: number;
  lastNow: number;
  idSeed: number;
};

const DIFFICULTIES: Record<DifficultyKey, DifficultyConfig> = {
  warmup: {
    label: "Warmup",
    tone: "Clean spacing",
    enemyInterval: 1900,
    projectileInterval: 1120,
    projectileSpeed: 250,
    enemySpeed: 58,
    scoreMultiplier: 0.85,
  },
  ranked: {
    label: "Ranked",
    tone: "Real lane",
    enemyInterval: 1450,
    projectileInterval: 870,
    projectileSpeed: 315,
    enemySpeed: 72,
    scoreMultiplier: 1,
  },
  chaos: {
    label: "Chaos",
    tone: "Limit test",
    enemyInterval: 1050,
    projectileInterval: 690,
    projectileSpeed: 380,
    enemySpeed: 88,
    scoreMultiplier: 1.25,
  },
};

const ENEMY_POOL = [
  { name: "Caitlyn", image: championIcon("Caitlyn") },
  { name: "Draven", image: championIcon("Draven") },
  { name: "Jinx", image: championIcon("Jinx") },
  { name: "Lux", image: championIcon("Lux") },
  { name: "Thresh", image: championIcon("Thresh") },
  { name: "Ezreal", image: championIcon("Ezreal") },
] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const normalize = (x: number, y: number) => {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
};

const readBestScore = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  const value = Number(window.localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(value) ? value : 0;
};

const writeBestScore = (value: number) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, String(value));
};

const getVitalPoint = (enemy: Enemy): Point => {
  const offset = enemy.size * 0.58;

  if (enemy.vitalSide === 0) {
    return { x: enemy.x, y: enemy.y - offset };
  }

  if (enemy.vitalSide === 1) {
    return { x: enemy.x + offset, y: enemy.y };
  }

  if (enemy.vitalSide === 2) {
    return { x: enemy.x, y: enemy.y + offset };
  }

  return { x: enemy.x - offset, y: enemy.y };
};

const getVitalClassName = (side: VitalSide) => {
  if (side === 0) {
    return "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2";
  }

  if (side === 1) {
    return "right-0 top-1/2 -translate-y-1/2 translate-x-1/2";
  }

  if (side === 2) {
    return "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2";
  }

  return "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2";
};

const createInitialEngine = (
  difficulty: DifficultyKey,
  bestScore = readBestScore()
): EngineState => ({
  status: "ready",
  difficulty,
  score: 0,
  bestScore,
  combo: 0,
  hp: MAX_HP,
  wave: 1,
  elapsed: 0,
  now: 0,
  message: "Vital Rush",
  messageUntil: 0,
  player: {
    x: ARENA_WIDTH * 0.5,
    y: ARENA_HEIGHT * 0.52,
    dashCooldown: 0,
    parryCooldown: 0,
    tempoCooldown: 0,
    parryUntil: 0,
    tempoUntil: 0,
    invulnerableUntil: 0,
  },
  pointerTarget: null,
  enemies: [],
  projectiles: [],
  slashes: [],
  sparks: [],
  nextEnemyAt: 0,
  nextProjectileAt: 700,
  lastNow: 0,
  idSeed: 1,
});

const nextId = (engine: EngineState) => {
  const id = engine.idSeed;
  engine.idSeed += 1;
  return id;
};

const addSpark = (
  engine: EngineState,
  point: Point,
  label: string,
  tone: Spark["tone"],
  now: number
) => {
  engine.sparks.push({
    id: nextId(engine),
    x: point.x,
    y: point.y,
    label,
    tone,
    until: now + 720,
  });
};

const setMessage = (engine: EngineState, message: string, now: number) => {
  engine.message = message;
  engine.messageUntil = now + 1450;
};

const awardScore = (
  engine: EngineState,
  baseScore: number,
  now: number,
  point: Point,
  label: string
) => {
  const difficulty = DIFFICULTIES[engine.difficulty];
  const comboBonus = Math.min(engine.combo, 12) * 4;
  const score = Math.round((baseScore + comboBonus) * difficulty.scoreMultiplier);
  engine.score += score;
  engine.combo += 1;
  engine.bestScore = Math.max(engine.bestScore, engine.score);
  addSpark(engine, point, `+${score}`, "gold", now);
  setMessage(engine, label, now);
};

const damagePlayer = (
  engine: EngineState,
  damage: number,
  now: number,
  point: Point
) => {
  if (now < engine.player.invulnerableUntil || now < engine.player.parryUntil) {
    awardScore(engine, 18, now, point, "Parried");
    return false;
  }

  engine.hp = clamp(engine.hp - damage, 0, MAX_HP);
  engine.combo = 0;
  engine.player.invulnerableUntil = now + 620;
  addSpark(engine, point, `-${damage}`, "red", now);
  setMessage(engine, engine.hp > 0 ? "Reset spacing" : "Defeat", now);
  return true;
};

const spawnEnemy = (engine: EngineState, now: number) => {
  const side = Math.floor(Math.random() * 4);
  const margin = 70;
  const spawn: Point =
    side === 0
      ? { x: Math.random() * ARENA_WIDTH, y: -margin }
      : side === 1
        ? { x: ARENA_WIDTH + margin, y: Math.random() * ARENA_HEIGHT }
        : side === 2
          ? { x: Math.random() * ARENA_WIDTH, y: ARENA_HEIGHT + margin }
          : { x: -margin, y: Math.random() * ARENA_HEIGHT };
  const enemy = ENEMY_POOL[Math.floor(Math.random() * ENEMY_POOL.length)];
  const waveBoost = Math.min(4, engine.wave - 1);

  engine.enemies.push({
    id: nextId(engine),
    name: enemy.name,
    image: enemy.image,
    x: spawn.x,
    y: spawn.y,
    size: ENEMY_SIZE,
    hp: 2 + Math.floor(waveBoost / 2),
    maxHp: 2 + Math.floor(waveBoost / 2),
    speed: DIFFICULTIES[engine.difficulty].enemySpeed + waveBoost * 5,
    vitalSide: Math.floor(Math.random() * 4) as VitalSide,
    nextShotAt: now + 450 + Math.random() * 650,
    stunnedUntil: 0,
    lastHitAt: 0,
  });
};

const spawnProjectile = (
  engine: EngineState,
  now: number,
  origin?: Enemy
) => {
  const source = origin ?? {
    x: Math.random() * ARENA_WIDTH,
    y: Math.random() > 0.5 ? -32 : ARENA_HEIGHT + 32,
  };
  const direction = normalize(
    engine.player.x - source.x + (Math.random() - 0.5) * 80,
    engine.player.y - source.y + (Math.random() - 0.5) * 80
  );
  const speed =
    DIFFICULTIES[engine.difficulty].projectileSpeed + engine.wave * 8;

  engine.projectiles.push({
    id: nextId(engine),
    x: source.x,
    y: source.y,
    vx: direction.x * speed,
    vy: direction.y * speed,
    size: PROJECTILE_SIZE,
    kind: Math.random() > 0.8 ? "trap" : "bolt",
  });
  engine.nextProjectileAt =
    now +
    Math.max(
      360,
      DIFFICULTIES[engine.difficulty].projectileInterval - engine.wave * 18
    );
};

const movePlayer = (
  engine: EngineState,
  keys: Record<string, boolean>,
  dt: number
) => {
  const player = engine.player;
  let dx = 0;
  let dy = 0;

  if (keys.ArrowLeft || keys.a || keys.A) {
    dx -= 1;
  }

  if (keys.ArrowRight || keys.d || keys.D) {
    dx += 1;
  }

  if (keys.ArrowUp || keys.w || keys.W) {
    dy -= 1;
  }

  if (keys.ArrowDown || keys.s || keys.S) {
    dy += 1;
  }

  if (dx === 0 && dy === 0 && engine.pointerTarget) {
    const toTarget = {
      x: engine.pointerTarget.x - player.x,
      y: engine.pointerTarget.y - player.y,
    };

    if (Math.hypot(toTarget.x, toTarget.y) > 8) {
      dx = toTarget.x;
      dy = toTarget.y;
    }
  }

  if (dx === 0 && dy === 0) {
    return;
  }

  const direction = normalize(dx, dy);
  const tempoBoost = engine.player.tempoUntil > engine.now ? 1.22 : 1;
  const speed = 245 * tempoBoost;
  player.x = clamp(player.x + direction.x * speed * dt, 28, ARENA_WIDTH - 28);
  player.y = clamp(player.y + direction.y * speed * dt, 28, ARENA_HEIGHT - 28);
};

const rotateVital = (side: VitalSide): VitalSide => ((side + 1) % 4) as VitalSide;

const hitEnemyVital = (
  engine: EngineState,
  enemy: Enemy,
  now: number,
  impact: Point,
  heavy = false
) => {
  if (now - enemy.lastHitAt < 260) {
    return;
  }

  enemy.lastHitAt = now;
  enemy.hp -= heavy ? 2 : 1;
  enemy.vitalSide = rotateVital(enemy.vitalSide);
  enemy.stunnedUntil = now + 420;
  awardScore(engine, heavy ? 78 : 48, now, impact, heavy ? "Grand Challenge" : "Vital hit");

  if (enemy.hp <= 0) {
    awardScore(engine, 90, now, enemy, "Shutdown");
    engine.enemies = engine.enemies.filter((current) => current.id !== enemy.id);
  }
};

const findDashTarget = (engine: EngineState) => {
  let nearest: { enemy: Enemy; vital: Point; distance: number } | null = null;

  for (const enemy of engine.enemies) {
    const vital = getVitalPoint(enemy);
    const vitalDistance = distance(engine.player, vital);

    if (!nearest || vitalDistance < nearest.distance) {
      nearest = { enemy, vital, distance: vitalDistance };
    }
  }

  return nearest;
};

const triggerDash = (engine: EngineState, now: number) => {
  if (engine.status !== "running" || engine.player.dashCooldown > 0) {
    return;
  }

  const target = findDashTarget(engine);
  let direction: Point;

  if (target && target.distance < 360) {
    direction = normalize(target.vital.x - engine.player.x, target.vital.y - engine.player.y);
  } else if (engine.pointerTarget) {
    direction = normalize(
      engine.pointerTarget.x - engine.player.x,
      engine.pointerTarget.y - engine.player.y
    );
  } else {
    direction = { x: 1, y: 0 };
  }

  const range = now < engine.player.tempoUntil ? 178 : 148;
  engine.player.x = clamp(
    engine.player.x + direction.x * range,
    28,
    ARENA_WIDTH - 28
  );
  engine.player.y = clamp(
    engine.player.y + direction.y * range,
    28,
    ARENA_HEIGHT - 28
  );
  engine.player.dashCooldown = now < engine.player.tempoUntil ? 720 : 980;
  engine.player.invulnerableUntil = now + 180;
  engine.slashes.push({
    id: nextId(engine),
    x: engine.player.x,
    y: engine.player.y,
    radius: now < engine.player.tempoUntil ? 104 : 82,
    until: now + 230,
  });
  addSpark(engine, engine.player, "Q", "blue", now);
};

const triggerParry = (engine: EngineState, now: number) => {
  if (engine.status !== "running" || engine.player.parryCooldown > 0) {
    return;
  }

  engine.player.parryUntil = now + 880;
  engine.player.parryCooldown = 4200;
  engine.player.invulnerableUntil = now + 880;
  engine.slashes.push({
    id: nextId(engine),
    x: engine.player.x,
    y: engine.player.y,
    radius: 128,
    until: now + 520,
  });
  setMessage(engine, "Riposte armed", now);
};

const triggerTempo = (engine: EngineState, now: number) => {
  if (engine.status !== "running" || engine.player.tempoCooldown > 0) {
    return;
  }

  engine.player.tempoUntil = now + 3600;
  engine.player.tempoCooldown = 7800;
  addSpark(engine, engine.player, "E", "gold", now);
  setMessage(engine, "Duel tempo", now);
};

const updateCooldowns = (player: Player, dtMs: number) => {
  player.dashCooldown = Math.max(0, player.dashCooldown - dtMs);
  player.parryCooldown = Math.max(0, player.parryCooldown - dtMs);
  player.tempoCooldown = Math.max(0, player.tempoCooldown - dtMs);
};

const updateEngine = (
  engine: EngineState,
  keys: Record<string, boolean>,
  now: number
) => {
  if (engine.lastNow === 0) {
    engine.lastNow = now;
  }

  if (engine.status !== "running") {
    engine.now = now;
    engine.lastNow = now;
    return;
  }

  const dtMs = Math.min(42, now - engine.lastNow);
  const dt = dtMs / 1000;
  engine.lastNow = now;
  engine.now = now;
  engine.elapsed += dtMs;
  engine.wave = 1 + Math.floor(engine.score / 650) + Math.floor(engine.elapsed / 26000);

  updateCooldowns(engine.player, dtMs);
  movePlayer(engine, keys, dt);

  if (now >= engine.nextEnemyAt) {
    spawnEnemy(engine, now);
    const interval = Math.max(
      540,
      DIFFICULTIES[engine.difficulty].enemyInterval - engine.wave * 52
    );
    engine.nextEnemyAt = now + interval;
  }

  if (now >= engine.nextProjectileAt) {
    spawnProjectile(engine, now);
  }

  for (const enemy of engine.enemies) {
    if (now >= enemy.stunnedUntil) {
      const direction = normalize(engine.player.x - enemy.x, engine.player.y - enemy.y);
      enemy.x += direction.x * enemy.speed * dt;
      enemy.y += direction.y * enemy.speed * dt;
    }

    if (now >= enemy.nextShotAt) {
      spawnProjectile(engine, now, enemy);
      enemy.nextShotAt =
        now + Math.max(620, DIFFICULTIES[engine.difficulty].projectileInterval + Math.random() * 520);
    }

    const vital = getVitalPoint(enemy);
    if (distance(engine.player, vital) < PLAYER_SIZE * 0.55 + 18) {
      hitEnemyVital(engine, enemy, now, vital, now < engine.player.tempoUntil);
    } else if (distance(engine.player, enemy) < PLAYER_SIZE * 0.52 + enemy.size * 0.42) {
      damagePlayer(engine, 9, now, enemy);
    }
  }

  for (const slash of engine.slashes) {
    for (const enemy of engine.enemies) {
      const vital = getVitalPoint(enemy);

      if (distance(slash, vital) < slash.radius) {
        hitEnemyVital(engine, enemy, now, vital, now < engine.player.tempoUntil);
      }
    }
  }

  engine.projectiles = engine.projectiles
    .map((projectile) => ({
      ...projectile,
      x: projectile.x + projectile.vx * dt,
      y: projectile.y + projectile.vy * dt,
    }))
    .filter((projectile) => {
      if (
        projectile.x < -80 ||
        projectile.x > ARENA_WIDTH + 80 ||
        projectile.y < -80 ||
        projectile.y > ARENA_HEIGHT + 80
      ) {
        return false;
      }

      if (distance(projectile, engine.player) < projectile.size + PLAYER_SIZE * 0.42) {
        if (now < engine.player.parryUntil) {
          awardScore(engine, projectile.kind === "trap" ? 42 : 26, now, projectile, "Countered");
          return false;
        }

        damagePlayer(engine, projectile.kind === "trap" ? 16 : 11, now, projectile);
        return false;
      }

      return true;
    });

  engine.slashes = engine.slashes.filter((slash) => slash.until > now);
  engine.sparks = engine.sparks.filter((spark) => spark.until > now);

  if (engine.hp <= 0) {
    engine.status = "ended";
    writeBestScore(engine.bestScore);
  }
};

const percentPosition = (point: Point) => ({
  left: `${(point.x / ARENA_WIDTH) * 100}%`,
  top: `${(point.y / ARENA_HEIGHT) * 100}%`,
});

const cooldownPercent = (value: number, max: number) =>
  `${clamp((1 - value / max) * 100, 0, 100)}%`;

export default function VitalRushGame() {
  const [difficulty, setDifficulty] = useState<DifficultyKey>("ranked");
  const [snapshot, setSnapshot] = useState<EngineState>(() =>
    createInitialEngine("ranked")
  );
  const engineRef = useRef(snapshot);
  const keysRef = useRef<Record<string, boolean>>({});
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRenderRef = useRef(0);

  const config = DIFFICULTIES[snapshot.difficulty];
  const visibleMessage =
    snapshot.messageUntil > snapshot.now ? snapshot.message : "Chain vitals";

  const resetEngine = useCallback(
    (nextDifficulty = difficulty, status: GameStatus = "ready") => {
      const next = createInitialEngine(nextDifficulty, engineRef.current.bestScore);
      next.status = status;
      next.nextEnemyAt = status === "running" ? 180 : 0;
      engineRef.current = next;
      setSnapshot({ ...next });
    },
    [difficulty]
  );

  const startGame = useCallback(() => {
    const next = createInitialEngine(difficulty, engineRef.current.bestScore);
    const now = performance.now();
    next.status = "running";
    next.now = now;
    next.lastNow = now;
    next.nextEnemyAt = now + 120;
    next.message = "En garde";
    next.messageUntil = now + 1200;
    engineRef.current = next;
    setSnapshot({ ...next });
  }, [difficulty]);

  const pauseGame = useCallback(() => {
    const engine = engineRef.current;

    if (engine.status === "running") {
      engine.status = "paused";
    } else if (engine.status === "paused") {
      engine.status = "running";
      engine.lastNow = 0;
    }

    setSnapshot({ ...engine });
  }, []);

  const changeDifficulty = useCallback(
    (nextDifficulty: DifficultyKey) => {
      setDifficulty(nextDifficulty);
      resetEngine(nextDifficulty);
    },
    [resetEngine]
  );

  const abilityHandlers = useMemo(
    () => ({
      dash: () => {
        const now = performance.now();
        triggerDash(engineRef.current, now);
        setSnapshot({ ...engineRef.current });
      },
      parry: () => {
        const now = performance.now();
        triggerParry(engineRef.current, now);
        setSnapshot({ ...engineRef.current });
      },
      tempo: () => {
        const now = performance.now();
        triggerTempo(engineRef.current, now);
        setSnapshot({ ...engineRef.current });
      },
    }),
    []
  );

  const setPointerTarget = useCallback((clientX: number, clientY: number) => {
    const arena = arenaRef.current;

    if (!arena) {
      return;
    }

    const rect = arena.getBoundingClientRect();
    const x = clamp(((clientX - rect.left) / rect.width) * ARENA_WIDTH, 0, ARENA_WIDTH);
    const y = clamp(((clientY - rect.top) / rect.height) * ARENA_HEIGHT, 0, ARENA_HEIGHT);
    engineRef.current.pointerTarget = { x, y };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current[event.key] = true;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
        event.preventDefault();
      }

      if (event.key === "q" || event.key === "Q" || event.key === " ") {
        abilityHandlers.dash();
      }

      if (event.key === "e" || event.key === "E") {
        abilityHandlers.tempo();
      }

      if (event.key === "r" || event.key === "R") {
        abilityHandlers.parry();
      }

      if (event.key === "p" || event.key === "P") {
        pauseGame();
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [abilityHandlers, pauseGame]);

  useEffect(() => {
    const tick = (now: number) => {
      updateEngine(engineRef.current, keysRef.current, now);

      if (now - lastRenderRef.current > 32) {
        lastRenderRef.current = now;
        setSnapshot({ ...engineRef.current });
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    engineRef.current.difficulty = difficulty;
  }, [difficulty]);

  const hpColor =
    snapshot.hp > 55
      ? "from-emerald-300 to-lime-200"
      : snapshot.hp > 24
        ? "from-yellow-300 to-orange-300"
        : "from-red-400 to-rose-200";

  const abilityButtons = [
    {
      id: "dash",
      label: "Dash",
      title: "Dash",
      icon: Zap,
      cooldown: snapshot.player.dashCooldown,
      maxCooldown: 980,
      onClick: abilityHandlers.dash,
    },
    {
      id: "parry",
      label: "Parry",
      title: "Riposte",
      icon: Shield,
      cooldown: snapshot.player.parryCooldown,
      maxCooldown: 4200,
      onClick: abilityHandlers.parry,
    },
    {
      id: "tempo",
      label: "Tempo",
      title: "Duel tempo",
      icon: Swords,
      cooldown: snapshot.player.tempoCooldown,
      maxCooldown: 7800,
      onClick: abilityHandlers.tempo,
    },
  ];

  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-cyan-100/20 bg-[linear-gradient(135deg,rgba(6,9,18,0.92),rgba(20,6,11,0.9))] shadow-[0_0_34px_rgba(6,182,212,0.13)]">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <div className="border-b border-white/10 p-4 md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-cyan-100">
                  <Activity className="h-4 w-4" />
                  Arcade lab
                </div>
                <h2 className="mt-3 text-2xl font-black leading-tight text-white md:text-4xl">
                  Vital Rush
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/68 md:text-base">
                  Crack vitals, parry shots, and keep the combo alive while bot lane collapses into chaos.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(Object.keys(DIFFICULTIES) as DifficultyKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => changeDifficulty(key)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition",
                      snapshot.difficulty === key
                        ? "border-cyan-100/70 bg-cyan-200/18 text-white shadow-[0_0_20px_rgba(125,211,252,0.18)]"
                        : "border-white/10 bg-white/5 text-white/55 hover:border-white/25 hover:text-white"
                    )}
                  >
                    {DIFFICULTIES[key].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={arenaRef}
            className="vital-rush-grid relative h-[min(68vh,640px)] min-h-[410px] overflow-hidden bg-[#071016] touch-none"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setPointerTarget(event.clientX, event.clientY);
            }}
            onPointerMove={(event) => setPointerTarget(event.clientX, event.clientY)}
          >
            <img
              src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-36"
              draggable={false}
              style={{ objectPosition: "center 24%" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_36%),linear-gradient(90deg,rgba(2,6,23,0.88),rgba(14,5,13,0.54),rgba(2,6,23,0.82))]" />

            <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
              {[
                { label: "Score", value: snapshot.score },
                { label: "Best", value: snapshot.bestScore },
                { label: "Wave", value: snapshot.wave },
                { label: "Combo", value: `x${snapshot.combo}` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-black/42 px-3 py-2 backdrop-blur-md"
                >
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/42">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-black text-white md:text-base">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="absolute right-4 top-4 z-20 w-32 rounded-xl border border-white/10 bg-black/42 p-2 backdrop-blur-md md:w-44">
              <div className="flex items-center justify-between gap-2 text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/48">
                <span>HP</span>
                <span>{snapshot.hp}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn("h-full rounded-full bg-gradient-to-r transition-all", hpColor)}
                  style={{ width: `${snapshot.hp}%` }}
                />
              </div>
            </div>

            <div
              className="absolute z-30 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{
                ...percentPosition(snapshot.player),
                width: `${PLAYER_SIZE}px`,
                height: `${PLAYER_SIZE}px`,
              }}
            >
              <div
                className={cn(
                  "absolute inset-[-12px] rounded-full border transition",
                  snapshot.player.parryUntil > snapshot.now
                    ? "border-cyan-100/90 bg-cyan-200/15 shadow-[0_0_34px_rgba(125,211,252,0.52)]"
                    : snapshot.player.tempoUntil > snapshot.now
                      ? "border-yellow-100/75 bg-yellow-200/12 shadow-[0_0_30px_rgba(250,204,21,0.35)]"
                      : "border-red-200/45 bg-red-500/8 shadow-[0_0_24px_rgba(248,113,113,0.24)]"
                )}
              />
              <img
                src={championIcon("Fiora")}
                alt="Fiora"
                className="relative h-full w-full rounded-full border border-white/50 bg-black object-cover shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
                draggable={false}
              />
            </div>

            {snapshot.enemies.map((enemy) => (
              <div
                key={enemy.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  ...percentPosition(enemy),
                  width: `${enemy.size}px`,
                  height: `${enemy.size}px`,
                }}
              >
                <div className="relative h-full w-full">
                  <img
                    src={enemy.image}
                    alt={enemy.name}
                    className={cn(
                      "h-full w-full rounded-full border bg-black object-cover shadow-[0_10px_18px_rgba(0,0,0,0.42)]",
                      enemy.stunnedUntil > snapshot.now
                        ? "border-cyan-100/80 saturate-150"
                        : "border-red-200/45"
                    )}
                    draggable={false}
                  />
                  <div
                    className={cn(
                      "vital-rush-vital absolute h-5 w-5 rounded-full border border-yellow-100/80 bg-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.75)]",
                      getVitalClassName(enemy.vitalSide)
                    )}
                  />
                  <div className="absolute -bottom-3 left-1/2 h-1 w-12 -translate-x-1/2 overflow-hidden rounded-full bg-black/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-300 to-yellow-200"
                      style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {snapshot.projectiles.map((projectile) => (
              <div
                key={projectile.id}
                className={cn(
                  "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border shadow-[0_0_18px_rgba(248,113,113,0.44)]",
                  projectile.kind === "trap"
                    ? "border-fuchsia-100/75 bg-fuchsia-300"
                    : "border-red-100/75 bg-red-400"
                )}
                style={{
                  ...percentPosition(projectile),
                  width: `${projectile.size}px`,
                  height: `${projectile.size}px`,
                }}
              />
            ))}

            {snapshot.slashes.map((slash) => (
              <div
                key={slash.id}
                className="vital-rush-slash pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/70 bg-cyan-200/10 shadow-[0_0_38px_rgba(125,211,252,0.38)]"
                style={{
                  ...percentPosition(slash),
                  width: `${slash.radius * 2}px`,
                  height: `${slash.radius * 2}px`,
                }}
              />
            ))}

            {snapshot.sparks.map((spark) => (
              <div
                key={spark.id}
                className={cn(
                  "vital-rush-spark pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2 py-1 text-xs font-black shadow-[0_10px_20px_rgba(0,0,0,0.28)]",
                  spark.tone === "gold"
                    ? "border-yellow-100/70 bg-yellow-300 text-black"
                    : spark.tone === "blue"
                      ? "border-cyan-100/75 bg-cyan-300 text-black"
                      : "border-red-100/75 bg-red-400 text-white"
                )}
                style={percentPosition(spark)}
              >
                {spark.label}
              </div>
            ))}

            <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-4">
              <div className="rounded-full border border-white/10 bg-black/48 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.18em] text-white/82 backdrop-blur-md md:text-sm">
                {visibleMessage}
              </div>
            </div>

            {snapshot.status !== "running" ? (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/58 p-5 backdrop-blur-sm">
                <div className="w-full max-w-sm rounded-[1.4rem] border border-white/12 bg-[#090d14]/92 p-5 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-100/30 bg-cyan-200/10">
                    {snapshot.status === "paused" ? (
                      <Pause className="h-6 w-6 text-cyan-100" />
                    ) : snapshot.status === "ended" ? (
                      <RotateCcw className="h-6 w-6 text-red-100" />
                    ) : (
                      <Play className="h-6 w-6 text-cyan-100" />
                    )}
                  </div>
                  <h3 className="mt-4 text-2xl font-black text-white">
                    {snapshot.status === "ended"
                      ? "Run over"
                      : snapshot.status === "paused"
                        ? "Paused"
                        : "Vital Rush"}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {snapshot.status === "ended"
                      ? `Score ${snapshot.score}. Best ${snapshot.bestScore}.`
                      : `${config.label}: ${config.tone}.`}
                  </p>
                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={startGame}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-100/45 bg-cyan-200/14 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-cyan-200/20"
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </button>
                    <button
                      type="button"
                      onClick={() => resetEngine(snapshot.difficulty)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/6 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white/78 transition hover:bg-white/10"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="border-t border-white/10 bg-black/22 p-4 md:p-5 xl:border-l xl:border-t-0">
          <div className="flex flex-row gap-3 xl:flex-col">
            <button
              type="button"
              onClick={snapshot.status === "running" || snapshot.status === "paused" ? pauseGame : startGame}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200/40 bg-red-500/14 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-red-100/70 hover:bg-red-500/20"
            >
              {snapshot.status === "running" ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {snapshot.status === "running" ? "Pause" : "Start"}
            </button>
            <button
              type="button"
              onClick={() => resetEngine(snapshot.difficulty)}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/6 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white/72 transition hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 xl:grid-cols-1">
            {abilityButtons.map((ability) => {
              const Icon = ability.icon;
              const ready = ability.cooldown === 0 && snapshot.status === "running";

              return (
                <button
                  key={ability.id}
                  type="button"
                  onClick={ability.onClick}
                  disabled={!ready}
                  title={ability.title}
                  className={cn(
                    "relative min-h-[4.8rem] overflow-hidden rounded-xl border p-3 text-left transition",
                    ready
                      ? "border-cyan-100/45 bg-cyan-200/12 text-white hover:border-cyan-100/80 hover:bg-cyan-200/18"
                      : "border-white/10 bg-white/[0.035] text-white/42"
                  )}
                >
                  <div
                    className="absolute inset-x-0 bottom-0 h-1 bg-cyan-200/80 transition-all"
                    style={{ width: cooldownPercent(ability.cooldown, ability.maxCooldown) }}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="text-[0.62rem] font-black uppercase tracking-[0.14em]">
                      {ready ? "Ready" : "CD"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-black uppercase tracking-[0.08em]">
                    {ability.label}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 text-sm text-white/68">
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-100">
                <Gauge className="h-4 w-4" />
                Lane speed
              </div>
              <p className="mt-2 text-2xl font-black text-white">{config.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/52">
                {config.tone}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-yellow-100">
                <Flame className="h-4 w-4" />
                Chain
              </div>
              <p className="mt-2 text-2xl font-black text-white">x{snapshot.combo}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/52">
                {snapshot.combo > 6 ? "Nasty tempo." : "Find the next vital."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
