export type SupportKey =
  | "alistar"
  | "braum"
  | "yuumi"
  | "rakan"
  | "sona"
  | "taric"
  | "leona"
  | "nautilus"
  | "lulu"
  | "thresh"
  | "pyke"
  | "soraka";

export type MentalKey =
  | "locked"
  | "autofill"
  | "roamer"
  | "panic"
  | "ego";

export type EnemyLaneKey =
  | "doubleRange"
  | "hook"
  | "scaling"
  | "draven"
  | "enchanter";

export type ScannerScores = {
  access: number;
  protection: number;
  sustain: number;
  discipline: number;
  chaos: number;
};

type ScorePatch = Partial<ScannerScores>;

export type SupportOption = {
  id: SupportKey;
  name: string;
  archetype: string;
  text: string;
  plan: string;
  risk: string;
  scores: ScannerScores;
};

export type MentalProfile = {
  id: MentalKey;
  label: string;
  text: string;
  score: number;
  patch: ScorePatch;
  note: string;
};

export type EnemyLaneProfile = {
  id: EnemyLaneKey;
  label: string;
  text: string;
  score: number;
  patch: ScorePatch;
  advice: string;
};

export const supportScannerOptions: SupportOption[] = [
  {
    id: "alistar",
    name: "Alistar",
    archetype: "Hard access",
    text: "Point-click threat. He makes the first target real.",
    plan: "Hold WQ until Fiora can Q in. Short call, clean commit, no theater.",
    risk: "If he engages through a massive wave, the scanner files a report.",
    scores: { access: 96, protection: 76, sustain: 18, discipline: 78, chaos: 42 },
  },
  {
    id: "braum",
    name: "Braum",
    archetype: "Peel brawler",
    text: "Stabilizes fights and turns messy contact into playable chaos.",
    plan: "Stand where Fiora wants to fight. Passive stacks make trades real fast.",
    risk: "If he plays behind tower all lane, he is ornamental furniture.",
    scores: { access: 66, protection: 94, sustain: 22, discipline: 82, chaos: 28 },
  },
  {
    id: "yuumi",
    name: "Yuumi",
    archetype: "Scaling parasite",
    text: "Not lane kingdom, but chase and sustain can become disgusting.",
    plan: "Keep Fiora healthy, speed re-entry, and do not pretend level 1 is free.",
    risk: "If she AFKs mentally, the lane becomes a documentary about suffering.",
    scores: { access: 38, protection: 58, sustain: 92, discipline: 70, chaos: 34 },
  },
  {
    id: "rakan",
    name: "Rakan",
    archetype: "Fast engage",
    text: "Great access if he times the entrance instead of performing circus jumps.",
    plan: "Dash in only when Fiora has angle. The engage is a bridge, not a solo album.",
    risk: "Too much ego turns him into a pretty int delivery system.",
    scores: { access: 88, protection: 64, sustain: 28, discipline: 64, chaos: 58 },
  },
  {
    id: "sona",
    name: "Sona",
    archetype: "Sustain scale",
    text: "Can work if lane stays calm and nobody speedruns the graveyard.",
    plan: "Bleed slowly, stabilize HP, and let Fiora reach item windows without drama.",
    risk: "Into kill lanes, she may disappear before the soundtrack starts.",
    scores: { access: 28, protection: 46, sustain: 88, discipline: 74, chaos: 24 },
  },
  {
    id: "taric",
    name: "Taric",
    archetype: "Anti-dive",
    text: "Turns enemy all-ins into a legally expensive mistake.",
    plan: "Play near Fiora, punish melee entries, and use ult before everyone is already dead.",
    risk: "Low range means the lane can get bullied if wave control is fake.",
    scores: { access: 54, protection: 96, sustain: 64, discipline: 76, chaos: 30 },
  },
  {
    id: "leona",
    name: "Leona",
    archetype: "Lockdown",
    text: "High access, high commitment. Great if Fiora can actually follow.",
    plan: "Ping target, count wave, then chain CC. Do not go sightseeing under enemy tower.",
    risk: "One bad E and she becomes a golden donation button.",
    scores: { access: 91, protection: 62, sustain: 8, discipline: 56, chaos: 66 },
  },
  {
    id: "nautilus",
    name: "Nautilus",
    archetype: "Hook tax",
    text: "Reliable catch, but the hook has to create Fiora access, not a funeral.",
    plan: "Hook when Fiora is in range. Ult the target that matters, not the nearest object.",
    risk: "If he misses two hooks, the lane starts asking for documentation.",
    scores: { access: 86, protection: 68, sustain: 10, discipline: 58, chaos: 62 },
  },
  {
    id: "lulu",
    name: "Lulu",
    archetype: "Buff shell",
    text: "Less explosive, but speed and protection make Fiora harder to punish.",
    plan: "Hold polymorph for the real threat and speed Fiora through the kill window.",
    risk: "If she plays pure spectator, the pick loses teeth.",
    scores: { access: 48, protection: 88, sustain: 54, discipline: 80, chaos: 22 },
  },
  {
    id: "thresh",
    name: "Thresh",
    archetype: "Skill check",
    text: "Can be elite if the player has hands and remembers lantern exists.",
    plan: "Hook for access, lantern after commit, flay the counter-engage.",
    risk: "Missed hook, missed lantern, missing person report.",
    scores: { access: 82, protection: 80, sustain: 10, discipline: 60, chaos: 68 },
  },
  {
    id: "pyke",
    name: "Pyke",
    archetype: "Chaos income",
    text: "Can snowball the map, can also abandon Fiora with rent unpaid.",
    plan: "Secure early contact and convert kills before lane stability collapses.",
    risk: "Roam addiction makes Fiora 1v2 and calls it macro.",
    scores: { access: 76, protection: 24, sustain: 8, discipline: 42, chaos: 90 },
  },
  {
    id: "soraka",
    name: "Soraka",
    archetype: "Hospital lane",
    text: "Keeps HP alive, but does not solve the access problem by herself.",
    plan: "Survive poke lanes, silence engages, and let Fiora take repeated short trades.",
    risk: "If enemies can force contact, she becomes a very polite emergency room.",
    scores: { access: 22, protection: 52, sustain: 96, discipline: 78, chaos: 18 },
  },
];

export const supportMentalProfiles: MentalProfile[] = [
  {
    id: "locked",
    label: "Locked in",
    text: "Pings, waits, counts wave.",
    score: 13,
    patch: { discipline: 12, chaos: -10 },
    note: "Human detected. Rare, suspicious, valuable.",
  },
  {
    id: "autofill",
    label: "Autofill panic",
    text: "Asks what Fiora does after minions spawn.",
    score: -12,
    patch: { discipline: -18, protection: -8, chaos: 12 },
    note: "The scanner recommends supervision.",
  },
  {
    id: "roamer",
    label: "Roam addiction",
    text: "Leaves at wave 2 and calls it tempo.",
    score: -18,
    patch: { protection: -22, sustain: -8, chaos: 18 },
    note: "Fiora has been legally abandoned.",
  },
  {
    id: "panic",
    label: "Panic engage",
    text: "Presses buttons because silence felt awkward.",
    score: -10,
    patch: { access: 8, discipline: -24, chaos: 24 },
    note: "Contact exists. Thought process does not.",
  },
  {
    id: "ego",
    label: "Main character",
    text: "Every hook is content.",
    score: -7,
    patch: { access: 6, protection: -12, discipline: -16, chaos: 20 },
    note: "High confidence, unclear evidence.",
  },
];

export const enemyLaneProfiles: EnemyLaneProfile[] = [
  {
    id: "doubleRange",
    label: "Double range poke",
    text: "Caitlyn/Lux energy. Your HP is public property.",
    score: -6,
    patch: { sustain: 12, protection: 6, access: -8, discipline: 8 },
    advice: "Preserve HP, fight from brush, never engage because boredom won.",
  },
  {
    id: "hook",
    label: "Hook kill lane",
    text: "Nautilus/Draven style court date.",
    score: -4,
    patch: { protection: 12, discipline: 4, chaos: 6 },
    advice: "Hold peel, punish missed hook, and respect level 2 like rent is due.",
  },
  {
    id: "scaling",
    label: "Scaling farm lane",
    text: "They want peace. Disrespect their hobby.",
    score: 9,
    patch: { access: 8, discipline: 6 },
    advice: "Stack small pressure, crash clean, and force them to answer early.",
  },
  {
    id: "draven",
    label: "Draven incident",
    text: "The lane is loud and financially unstable.",
    score: -10,
    patch: { protection: 10, sustain: 6, chaos: 10 },
    advice: "Do not donate first blood. One clean counter-engage can flip the room.",
  },
  {
    id: "enchanter",
    label: "Enchanter casino",
    text: "Soft lane until someone misreads spacing.",
    score: 5,
    patch: { access: 5, sustain: 4 },
    advice: "Trade on cooldown gaps. Make them heal panic, not poke comfortably.",
  },
];

export const scannerRoasts = [
  "The lab says playable. The lab also asks why you queued this.",
  "Statistically legal. Emotionally suspicious.",
  "This draft has hands potential. Please locate the hands.",
  "The lane plan exists. Whether your support can read is outside the model.",
  "Verdict generated with fake science and very real trauma.",
  "The scanner approves, but with the facial expression of a ranked teammate.",
];
