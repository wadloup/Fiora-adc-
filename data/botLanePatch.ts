export const BOT_LANE_PATCH = {
  patch: "26.15",
  dataDragon: "16.15.1",
  publishedAt: "2026-07-28",
  reviewedAt: "2026-07-31",
  sources: {
    patchNotes:
      "https://www.leagueoflegends.com/en-us/news/game-updates/league-of-legends-patch-26-15-notes/",
    dataDragon:
      "https://ddragon.leagueoflegends.com/cdn/16.15.1/data/en_US/champion.json",
  },
} as const;

export type LaneIntent = "pressure" | "control" | "survive";
export type RuneBias = "hob" | "pta";
export type DamageProfile = "physical" | "magic" | "mixed";
export type SupportArchetype =
  | "catch"
  | "engage"
  | "peel"
  | "enchanter"
  | "mage"
  | "warden"
  | "roam";

export type LaneAbilities = {
  passive: string;
  q: string;
  w: string;
  e: string;
  r: string;
  key: string;
};

export type BotCarryProfile = {
  id: string;
  dataDragonId: string;
  name: string;
  archetype: string;
  image: string;
  difficulty: number;
  runeBias: RuneBias;
  damage: DamageProfile;
  abilities: LaneAbilities;
  threat: string;
  lanePlan: string;
  punish: string;
  parry: string;
  levelOne: string;
  levelTwo: string;
  wave: string;
  firstBack: string;
  avoid: string;
};

export type BotSupportProfile = {
  id: string;
  dataDragonId: string;
  name: string;
  archetype: SupportArchetype;
  image: string;
  difficulty: number;
  abilities: LaneAbilities;
  scores: {
    access: number;
    protection: number;
    sustain: number;
    discipline: number;
  };
  allyLabel: string;
  allyPlan: string;
  enemyPlan: string;
  trigger: string;
  rule: string;
  parry: string;
  levelOne: string;
  levelTwo: string;
  roam: string;
  avoid: string;
};

export type EarlyThreatTier = "low" | "medium" | "high";

const highEarlyLockSupports = new Set([
  "alistar",
  "amumu",
  "blitzcrank",
  "braum",
  "leona",
  "lux",
  "maokai",
  "morgana",
  "nautilus",
  "neeko",
  "pyke",
  "rakan",
  "rell",
  "taric",
  "thresh",
  "zyra",
  "anivia",
  "annie",
  "fiddlesticks",
  "galio",
  "gragas",
  "hwei",
  "ivern",
  "pantheon",
  "poppy",
  "shen",
  "swain",
  "taliyah",
  "zac",
]);

const lowEarlyLockSupports = new Set([
  "ashe",
  "milio",
  "orianna",
  "rumble",
  "sona",
  "yuumi",
]);

const highLevelOnePressureCarries = new Set([
  "ashe",
  "caitlyn",
  "draven",
  "hwei",
  "kalista",
  "kogmaw",
  "lucian",
  "missfortune",
  "seraphine",
  "sivir",
  "varus",
  "xerath",
  "ziggs",
]);

const lowLevelOnePressureCarries = new Set([
  "nilah",
  "samira",
  "smolder",
  "veigar",
  "yasuo",
]);

const earlyHardCcCarries = new Set([
  "caitlyn",
  "draven",
  "hwei",
  "jhin",
  "senna",
  "seraphine",
  "swain",
  "vayne",
  "veigar",
  "xayah",
  "yasuo",
  "xerath",
]);

const strongWaveHelpSupports = new Set([
  "anivia",
  "ashe",
  "brand",
  "heimerdinger",
  "hwei",
  "karma",
  "lux",
  "mel",
  "neeko",
  "orianna",
  "rumble",
  "senna",
  "seraphine",
  "sona",
  "swain",
  "taliyah",
  "velkoz",
  "xerath",
  "zyra",
]);

const hookSupportIds = new Set([
  "amumu",
  "blitzcrank",
  "nautilus",
  "pyke",
  "thresh",
]);

export function getSupportEarlyLock(
  support: Pick<BotSupportProfile, "id" | "archetype">
): EarlyThreatTier {
  if (highEarlyLockSupports.has(support.id)) {
    return "high";
  }

  if (lowEarlyLockSupports.has(support.id)) {
    return "low";
  }

  if (
    support.archetype === "engage" ||
    support.archetype === "catch" ||
    support.archetype === "warden"
  ) {
    return "high";
  }

  return "medium";
}

export function getCarryLevelOnePressure(
  carry: Pick<BotCarryProfile, "id">
): EarlyThreatTier {
  if (highLevelOnePressureCarries.has(carry.id)) {
    return "high";
  }

  if (lowLevelOnePressureCarries.has(carry.id)) {
    return "low";
  }

  return "medium";
}

export function carryHasEarlyHardCc(carry: Pick<BotCarryProfile, "id">) {
  return earlyHardCcCarries.has(carry.id);
}

export function getSupportWaveHelp(
  support: Pick<BotSupportProfile, "id" | "archetype">
) {
  if (strongWaveHelpSupports.has(support.id)) {
    return 18;
  }

  if (support.archetype === "enchanter" || support.archetype === "peel") {
    return 8;
  }

  if (support.archetype === "mage") {
    return 14;
  }

  return 2;
}

export function isHookSupport(support: Pick<BotSupportProfile, "id">) {
  return hookSupportIds.has(support.id);
}

export const laneIntents: Array<{
  id: LaneIntent;
  label: string;
  detail: string;
  difficulty: number;
}> = [
  {
    id: "pressure",
    label: "Pressure",
    detail: "Play for the first clean contact.",
    difficulty: 5,
  },
  {
    id: "control",
    label: "Control",
    detail: "Own wave shape before forcing.",
    difficulty: 0,
  },
  {
    id: "survive",
    label: "Survive",
    detail: "Protect HP and reach Hydra.",
    difficulty: -6,
  },
];

export function championLoadingImage(dataDragonId: string) {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${dataDragonId}_0.jpg`;
}
