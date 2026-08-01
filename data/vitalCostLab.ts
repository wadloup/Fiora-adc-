import championKits from "../research/champion-kits-26.15.json";
import { botLaneCarries } from "./botLaneCarries";
import { BOT_LANE_PATCH } from "./botLanePatch";
import { botLaneSupports } from "./botLaneSupports";

export type LabActor =
  | "fiora"
  | "allySupport"
  | "enemyCarry"
  | "enemySupport";

export type LabPoint = { x: number; y: number };
export type VitalSide = "north" | "east" | "south" | "west";
export type WaveState = "allied" | "even" | "enemy";
export type HealthBand = "healthy" | "traded" | "critical";
export type VitalCostTone = "favorable" | "conditional" | "costly";
export type VitalVerdictKey =
  | "no-contact"
  | "free"
  | "starter"
  | "conditional"
  | "paid"
  | "riposte-locked"
  | "trap";

export type VitalCostLabState = {
  allySupportId: string;
  enemyCarryId: string;
  enemySupportId: string;
  actors: Record<LabActor, LabPoint>;
  vitalSide: VitalSide;
  wave: WaveState;
  health: HealthBand;
  allyAccessReady: boolean;
  enemyControlReady: boolean;
  carryEscapeReady: boolean;
  carryCommitted: boolean;
  riposteReady: boolean;
  jungleKnown: boolean;
  brushOwned: boolean;
};

export type VitalCostFactor = {
  id: string;
  label: string;
  tone: VitalCostTone;
  score: number;
  summary: string;
  detail: string;
  fix?: string;
};

export type VitalLabGeometry = {
  vital: LabPoint;
  qRange: number;
  carryAttackRange: number;
  allySupportReach: number;
  enemySupportThreat: number;
  safeAnchor: LabPoint;
  qDistance: number;
};

export type VitalCostAnalysis = {
  key: VitalVerdictKey;
  label: string;
  eyebrow: string;
  tone: VitalCostTone;
  headline: string;
  summary: string;
  score: number;
  factors: VitalCostFactor[];
  counts: Record<VitalCostTone, number>;
  conditionsToFlip: string[];
  geometry: VitalLabGeometry;
};

export type VitalLabScenario = {
  id: string;
  label: string;
  subtitle: string;
  lesson: string;
  state: VitalCostLabState;
};

type ChampionKit = {
  id: string;
  stats: { attackrange: number };
  spells: Array<{
    name: string;
    rangeBurn: string;
    cooldownBurn: string;
  }>;
};

const kits = (championKits as { champions: ChampionKit[] }).champions;

export const VITAL_LAB_PATCH = BOT_LANE_PATCH;
export const LAB_BOARD = { width: 1000, height: 600 } as const;
export const GAME_TO_BOARD = LAB_BOARD.width / 2400;
export const FIORA_Q_RANGE = 400 * GAME_TO_BOARD;
const VITAL_OFFSET = 74;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const distance = (a: LabPoint, b: LabPoint) =>
  Math.hypot(a.x - b.x, a.y - b.y);

function pointToSegmentDistance(point: LabPoint, start: LabPoint, end: LabPoint) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return distance(point, start);
  const t = clamp(
    ((point.x - start.x) * dx + (point.y - start.y) * dy) /
      lengthSquared,
    0,
    1
  );
  return distance(point, { x: start.x + t * dx, y: start.y + t * dy });
}

function getKit(dataDragonId: string) {
  return kits.find(
    (kit) => kit.id.toLowerCase() === dataDragonId.toLowerCase()
  );
}

function parseSpellRange(rangeBurn: string) {
  const parsed = Number.parseFloat(rangeBurn.split("/")[0] || "0");
  return Number.isFinite(parsed) && parsed >= 180 && parsed <= 1400
    ? parsed
    : 0;
}

function supportRange(dataDragonId: string, fallback: number) {
  const kit = getKit(dataDragonId);
  const ranges = kit?.spells.slice(0, 3).map((spell) =>
    parseSpellRange(spell.rangeBurn)
  );
  const usable = ranges?.filter((range) => range > 0) ?? [];
  return (usable.length ? Math.max(...usable) : fallback) * GAME_TO_BOARD;
}

export function getChampionIcon(dataDragonId: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${BOT_LANE_PATCH.dataDragon}/img/champion/${dataDragonId}.png`;
}

export function getVitalPoint(
  carry: LabPoint,
  side: VitalSide
): LabPoint {
  const offset: Record<VitalSide, LabPoint> = {
    north: { x: 0, y: -VITAL_OFFSET },
    east: { x: VITAL_OFFSET, y: 0 },
    south: { x: 0, y: VITAL_OFFSET },
    west: { x: -VITAL_OFFSET, y: 0 },
  };
  return {
    x: carry.x + offset[side].x,
    y: carry.y + offset[side].y,
  };
}

export function clampLabPoint(point: LabPoint): LabPoint {
  return {
    x: clamp(point.x, 44, LAB_BOARD.width - 44),
    y: clamp(point.y, 44, LAB_BOARD.height - 44),
  };
}

export const DEFAULT_VITAL_LAB_STATE: VitalCostLabState = {
  allySupportId: "alistar",
  enemyCarryId: "caitlyn",
  enemySupportId: "lux",
  actors: {
    fiora: { x: 390, y: 355 },
    allySupport: { x: 320, y: 240 },
    enemyCarry: { x: 625, y: 345 },
    enemySupport: { x: 680, y: 225 },
  },
  vitalSide: "west",
  wave: "even",
  health: "healthy",
  allyAccessReady: true,
  enemyControlReady: true,
  carryEscapeReady: true,
  carryCommitted: false,
  riposteReady: true,
  jungleKnown: false,
  brushOwned: false,
};

export const VITAL_LAB_SCENARIOS: VitalLabScenario[] = [
  {
    id: "front-vital-tax",
    label: "Front Vital Tax",
    subtitle: "Ezreal + Braum, wave pushing into Fiora",
    lesson:
      "A front Vital can still be expensive when the Q endpoint enters Braum's answer radius and Ezreal keeps the second position.",
    state: {
      ...DEFAULT_VITAL_LAB_STATE,
      allySupportId: "blitzcrank",
      enemyCarryId: "ezreal",
      enemySupportId: "braum",
      actors: {
        fiora: { x: 385, y: 365 },
        allySupport: { x: 280, y: 245 },
        enemyCarry: { x: 615, y: 350 },
        enemySupport: { x: 570, y: 225 },
      },
      vitalSide: "west",
      wave: "enemy",
      enemyControlReady: true,
      carryEscapeReady: true,
      carryCommitted: false,
      jungleKnown: false,
      brushOwned: false,
    },
  },
  {
    id: "missed-control",
    label: "Missed Control Window",
    subtitle: "The support answer is down",
    lesson:
      "The same geometry becomes playable after the first control spell misses, provided allied access still covers Fiora's endpoint.",
    state: {
      ...DEFAULT_VITAL_LAB_STATE,
      allySupportId: "alistar",
      enemyCarryId: "caitlyn",
      enemySupportId: "lux",
      actors: {
        fiora: { x: 430, y: 355 },
        allySupport: { x: 360, y: 275 },
        enemyCarry: { x: 610, y: 350 },
        enemySupport: { x: 700, y: 230 },
      },
      vitalSide: "west",
      wave: "even",
      enemyControlReady: false,
      carryEscapeReady: true,
      carryCommitted: true,
      jungleKnown: true,
      brushOwned: true,
    },
  },
  {
    id: "short-lane-reversal",
    label: "Short Lane Reversal",
    subtitle: "Carry steps past the wave to punish",
    lesson:
      "A committed carry, allied wave and owned bush shorten the exit. Riposte can be held for the support instead of spent to manufacture entry.",
    state: {
      ...DEFAULT_VITAL_LAB_STATE,
      allySupportId: "braum",
      enemyCarryId: "draven",
      enemySupportId: "nautilus",
      actors: {
        fiora: { x: 410, y: 345 },
        allySupport: { x: 335, y: 255 },
        enemyCarry: { x: 555, y: 350 },
        enemySupport: { x: 700, y: 220 },
      },
      vitalSide: "west",
      wave: "allied",
      enemyControlReady: true,
      carryEscapeReady: false,
      carryCommitted: true,
      jungleKnown: true,
      brushOwned: true,
    },
  },
];

function factor(
  id: string,
  label: string,
  tone: VitalCostTone,
  score: number,
  summary: string,
  detail: string,
  fix?: string
): VitalCostFactor {
  return { id, label, tone, score, summary, detail, fix };
}

export function analyzeVitalCost(
  state: VitalCostLabState
): VitalCostAnalysis {
  const carry = botLaneCarries.find((item) => item.id === state.enemyCarryId);
  const ally = botLaneSupports.find((item) => item.id === state.allySupportId);
  const enemy = botLaneSupports.find((item) => item.id === state.enemySupportId);

  if (!carry || !ally || !enemy) {
    throw new Error("Vital Cost Laboratory received an unknown draft profile.");
  }

  const vital = getVitalPoint(state.actors.enemyCarry, state.vitalSide);
  const carryAttackRange =
    (getKit(carry.dataDragonId)?.stats.attackrange ?? 550) * GAME_TO_BOARD;
  const allySupportReach = supportRange(ally.dataDragonId, 600);
  const enemySupportThreat = supportRange(enemy.dataDragonId, 650);
  const safeAnchor = state.brushOwned
    ? { x: 145, y: 155 }
    : { x: 105, y: 445 };
  const qDistance = distance(state.actors.fiora, vital);
  const endpointToAlly = distance(vital, state.actors.allySupport);
  const endpointToCarry = distance(vital, state.actors.enemyCarry);
  const endpointToEnemySupport = distance(vital, state.actors.enemySupport);
  const enemyBlocksExit =
    pointToSegmentDistance(
      state.actors.enemySupport,
      vital,
      safeAnchor
    ) <
    enemySupportThreat * 0.55;
  const exitLength = distance(vital, safeAnchor);
  const factors: VitalCostFactor[] = [];

  if (qDistance <= FIORA_Q_RANGE) {
    factors.push(
      factor(
        "access",
        "Q access",
        "favorable",
        2,
        "The Vital is inside Lunge range.",
        `Fiora needs ${Math.round(qDistance)} board units for a ${Math.round(
          FIORA_Q_RANGE
        )}-unit Q. The endpoint is legal without Flash.`
      )
    );
  } else {
    factors.push(
      factor(
        "access",
        "Q access",
        "costly",
        -3,
        "The Vital is outside Lunge range.",
        `Fiora is ${Math.round(qDistance - FIORA_Q_RANGE)} board units short. Moving first advertises the entry and changes the enemy answer queue.`,
        "Wait for the carry to last-hit, move Fiora closer, or change the Vital side before pricing contact."
      )
    );
  }

  if (state.allyAccessReady && endpointToAlly <= allySupportReach) {
    factors.push(
      factor(
        "cover",
        "Allied cover",
        "favorable",
        2,
        `${ally.name} can influence the Q endpoint.`,
        `${ally.name}'s usable basic-spell reach covers the contact square. Fiora is not beginning the trade one body ahead of her support.`
      )
    );
  } else if (endpointToAlly <= allySupportReach * 1.18) {
    factors.push(
      factor(
        "cover",
        "Allied cover",
        "conditional",
        0,
        `${ally.name} is close, but the first action is not guaranteed.`,
        state.allyAccessReady
          ? "The endpoint sits on the edge of allied influence. A sidestep or displaced target can break the follow-up."
          : `${ally.name}'s access spell is marked unavailable, so proximity alone does not fix the target.`,
        `Move ${ally.name} onto Fiora's side of the wave or wait for access to return.`
      )
    );
  } else {
    factors.push(
      factor(
        "cover",
        "Allied cover",
        "costly",
        -2,
        `${ally.name} cannot cover Fiora's first endpoint.`,
        "The Vital can be reached, but the ally selected to fix or protect the target begins too far away to affect the first exchange.",
        `Move ${ally.name} forward before Fiora spends Q.`
      )
    );
  }

  if (
    state.enemyControlReady &&
    endpointToEnemySupport <= enemySupportThreat
  ) {
    if (state.riposteReady) {
      factors.push(
        factor(
          "answer",
          "Enemy answer queue",
          "conditional",
          0,
          `${enemy.name} can answer, but Riposte is available.`,
          `The Q endpoint enters ${enemy.name}'s estimated basic-spell threat radius. W makes the contact playable only if Fiora knows which control to parry and where to aim it.`,
          `Force ${enemy.abilities.key} first or move the endpoint outside ${enemy.name}'s line.`
        )
      );
    } else {
      factors.push(
        factor(
          "answer",
          "Enemy answer queue",
          "costly",
          -3,
          `${enemy.name}'s control is ready and Riposte is not.`,
          `The endpoint is inside ${enemy.name}'s answer radius. Fiora has no W buffer for the spell that can stop the attack sequence.`,
          `Do not buy this Vital until ${enemy.abilities.key} is spent or Riposte returns.`
        )
      );
    }
  } else {
    factors.push(
      factor(
        "answer",
        "Enemy answer queue",
        "favorable",
        2,
        state.enemyControlReady
          ? `${enemy.name} is outside the immediate answer line.`
          : `${enemy.name}'s key control is marked spent.`,
        state.enemyControlReady
          ? "The support still owns control, but current spacing does not cover the Vital endpoint. This advantage disappears if the support moves before Fiora commits."
          : "The most important support interruption is temporarily absent, so Fiora can reserve W for the carry or the exit."
      )
    );
  }

  if (state.carryCommitted && !state.carryEscapeReady) {
    factors.push(
      factor(
        "return-fire",
        "Carry second position",
        "favorable",
        2,
        `${carry.name} is committed without the spacing spell.`,
        `The Vital endpoint is ${Math.round(endpointToCarry)} board units from the carry. Return damage still exists, but ${carry.name} cannot immediately purchase a second position.`
      )
    );
  } else if (state.carryEscapeReady) {
    factors.push(
      factor(
        "return-fire",
        "Carry second position",
        "costly",
        -2,
        `${carry.name} keeps the escape or spacing spell.`,
        `Fiora spends Q to arrive inside the carry's ${Math.round(
          carryAttackRange
        )}-unit attack zone. ${carry.name} can move again while Fiora's shortest exit tool is on cooldown.`,
        `Draw ${carry.abilities.key} before turning the Vital into a committed contact.`
      )
    );
  } else {
    factors.push(
      factor(
        "return-fire",
        "Carry second position",
        "conditional",
        0,
        `${carry.name} lacks the escape, but is not committed forward.`,
        "The target can still retreat through allied support space. The Vital is an opening only if Fiora's support fixes the next square."
      )
    );
  }

  const waveFactor: Record<
    WaveState,
    Pick<VitalCostFactor, "tone" | "score" | "summary" | "detail" | "fix">
  > = {
    allied: {
      tone: "favorable",
      score: 2,
      summary: "The allied wave taxes enemy retaliation.",
      detail:
        "Enemy autos and targeted spells draw more minion damage, while Fiora's retreat crosses the friendlier half of the lane.",
    },
    even: {
      tone: "conditional",
      score: 0,
      summary: "The wave does not pay for the contact.",
      detail:
        "Neither side owns a clear minion advantage. Champion spacing and cooldown order decide whether the Vital is worth buying.",
    },
    enemy: {
      tone: "costly",
      score: -2,
      summary: "The enemy wave adds a second damage source.",
      detail:
        "Q lands where Fiora receives champion and minion return damage. A passive proc alone rarely repays that combined chunk.",
      fix: "Let the wave travel farther toward Fiora or thin it before spending Q on the carry.",
    },
  };
  const waveRead = waveFactor[state.wave];
  factors.push(factor("wave", "Wave tax", waveRead.tone, waveRead.score, waveRead.summary, waveRead.detail, waveRead.fix));

  if (state.brushOwned && !enemyBlocksExit) {
    factors.push(
      factor(
        "exit",
        "Exit route",
        "favorable",
        2,
        "Owned bush breaks the return line.",
        `The retreat to the nearest safe anchor is ${Math.round(
          exitLength
        )} board units and does not cross the enemy support's central threat line.`
      )
    );
  } else if (enemyBlocksExit) {
    factors.push(
      factor(
        "exit",
        "Exit route",
        "costly",
        -2,
        `${enemy.name} sits between the Vital and Fiora's retreat.`,
        "Even a successful proc can leave Fiora walking through the support's answer zone after Q has already been spent.",
        "Change the Q endpoint, pull the support away, or secure the lane bush before contact."
      )
    );
  } else {
    factors.push(
      factor(
        "exit",
        "Exit route",
        "conditional",
        0,
        "The retreat is open but remains visible.",
        "Fiora can walk out, yet the enemy lane retains vision for follow-up autos and skillshots. Bush ownership would shorten the punish window.",
        "Secure the near bush or keep an allied body on the retreat line."
      )
    );
  }

  if (state.jungleKnown) {
    factors.push(
      factor(
        "information",
        "Jungle information",
        "favorable",
        1,
        "The unseen third body is accounted for.",
        "The decision can be priced from the visible 2v2 instead of hiding a possible jungle arrival inside the verdict."
      )
    );
  } else {
    factors.push(
      factor(
        "information",
        "Jungle information",
        "conditional",
        -1,
        "Jungle position is unknown.",
        "This does not automatically forbid contact, but a long chase beyond the Vital cannot be evaluated as a clean 2v2.",
        "Keep the sequence short or wait for jungle information before extending past the first proc."
      )
    );
  }

  const healthRead: Record<HealthBand, VitalCostFactor> = {
    healthy: factor(
      "health",
      "HP threshold",
      "favorable",
      1,
      "Fiora can absorb one ordinary return cycle.",
      "Healthy does not make the contact correct, but it keeps one mistake from instantly removing the exit."
    ),
    traded: factor(
      "health",
      "HP threshold",
      "conditional",
      0,
      "The first counter-chunk changes the all-in threshold.",
      "A short proc can still work, but staying for a second target or missed W is no longer priced safely.",
      "Shorten the contact or restore HP before treating the Vital as an all-in starter."
    ),
    critical: factor(
      "health",
      "HP threshold",
      "costly",
      -3,
      "Fiora cannot pay normal retaliation.",
      "At critical HP, even a mechanically successful Vital can lose to one auto, minion focus or support damage on the exit.",
      "Preserve farm, recover HP, or require enemy control and carry spacing to be spent first."
    ),
  };
  factors.push(healthRead[state.health]);

  const score = factors.reduce((total, item) => total + item.score, 0);
  const counts = factors.reduce<Record<VitalCostTone, number>>(
    (total, item) => ({ ...total, [item.tone]: total[item.tone] + 1 }),
    { favorable: 0, conditional: 0, costly: 0 }
  );
  const cannotReach = qDistance > FIORA_Q_RANGE;
  const controlLocked =
    state.enemyControlReady &&
    !state.riposteReady &&
    endpointToEnemySupport <= enemySupportThreat;
  const key: VitalVerdictKey = cannotReach
    ? "no-contact"
    : controlLocked
      ? "riposte-locked"
      : score <= -5 || counts.costly >= 4
        ? "trap"
        : score >= 8 && counts.costly === 0
          ? "free"
          : score >= 4
            ? "starter"
            : score >= 1
              ? "conditional"
              : "paid";

  const verdicts: Record<
    VitalVerdictKey,
    Omit<VitalCostAnalysis, "score" | "factors" | "counts" | "conditionsToFlip" | "geometry">
  > = {
    "no-contact": {
      key,
      label: "NO CONTACT",
      eyebrow: "Geometry fails first",
      tone: "costly",
      headline: "The Vital is visible, but Q cannot buy it yet.",
      summary:
        "Walking into range changes the timing. Re-price after the carry moves, the wave advances, or Fiora gains a safer starting square.",
    },
    free: {
      key,
      label: "FREE VITAL",
      eyebrow: "Low immediate cost",
      tone: "favorable",
      headline: "The proc is covered and the first answer is weak.",
      summary:
        "Take the Vital as a short punish. Free does not mean chase: the favorable price ends when enemy spacing or control returns.",
    },
    starter: {
      key,
      label: "TRADE STARTER",
      eyebrow: "Contact can continue",
      tone: "favorable",
      headline: "The Vital opens a sequence instead of ending one.",
      summary:
        "Allied cover and the current answer queue let Fiora connect after the proc. Read the remaining costly factor before extending.",
    },
    conditional: {
      key,
      label: "CONDITIONAL",
      eyebrow: "One detail decides it",
      tone: "conditional",
      headline: "The Vital is playable only with a clean next action.",
      summary:
        "The geometry is legal, but the trade is not self-paying. Use the flip conditions below before committing beyond one proc.",
    },
    paid: {
      key,
      label: "PAID VITAL",
      eyebrow: "Proc does not cover the bill",
      tone: "costly",
      headline: "Fiora receives more than the passive returns.",
      summary:
        "The passive movement and heal are real, but the wave, support answer, second position or exit currently prices the contact higher.",
    },
    "riposte-locked": {
      key,
      label: "RIPOSTE-LOCKED",
      eyebrow: "Enemy control owns the square",
      tone: "costly",
      headline: "The Vital endpoint enters ready control without W.",
      summary:
        "This is not a reflex challenge. The required defensive tool is unavailable, so the correct improvement is to change the state before entering.",
    },
    trap: {
      key,
      label: "TRAP VITAL",
      eyebrow: "Multiple costs stack",
      tone: "costly",
      headline: "The highlighted passive is baiting Fiora through a prepared zone.",
      summary:
        "More than one enemy system is charging the same Q: wave, support, carry spacing, health or exit. Declining it preserves the real all-in threshold.",
    },
  };
  const verdict = verdicts[key];
  const conditionsToFlip = factors
    .filter((item) => item.tone !== "favorable" && item.fix)
    .sort((a, b) => a.score - b.score)
    .map((item) => item.fix as string)
    .slice(0, 4);

  return {
    ...verdict,
    score,
    factors,
    counts,
    conditionsToFlip,
    geometry: {
      vital,
      qRange: FIORA_Q_RANGE,
      carryAttackRange,
      allySupportReach,
      enemySupportThreat,
      safeAnchor,
      qDistance,
    },
  };
}

