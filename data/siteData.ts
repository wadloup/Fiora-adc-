export const pages = [
  "Home",
  "Why Fiora ADC Works",
  "Runes",
  "Build",
  "Skill Order",
  "Matchups",
  "Lane Phase",
  "Fiora's Support",
  "Mid/Late Game",
  "Mechanical Tips",
  "Videos / Clips",
] as const;

export type PageName = (typeof pages)[number];

export type NarrationEntry = {
  image: string;
  mood: string;
  summary: string;
  position?: string;
};

export const heroCertifiedImage = "/netanyahu.png";
export const homeHeroImage =
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_8.jpg";
export const whyWorksVisualImage =
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg";

export const pageMeta: Record<PageName, NarrationEntry> = {
  Home: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_0.jpg",
    mood: "Cold confidence",
    summary:
      "If top lane bores you, this guide turns Fiora ADC into a real plan instead of a random troll pick.",
    position: "center 22%",
  },
  "Why Fiora ADC Works": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_1.jpg",
    mood: "Calculated arrogance",
    summary:
      "This page explains why Fiora ADC creates pressure when enemies misjudge spacing, cooldowns, and all-in timing.",
    position: "center 24%",
  },
  Runes: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    mood: "Precision",
    summary:
      "Your rune page changes how the lane starts: immediate burst or stronger mobility and chase comfort.",
    position: "center 24%",
  },
  Build: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_3.jpg",
    mood: "Methodical",
    summary:
      "The build follows the game state. Start with tempo and sustain, then choose burst, stability, or safety.",
    position: "78% center",
  },
  "Skill Order": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Discipline",
    summary:
      "Early skill points decide whether lane is only survivable or actually threatening.",
    position: "center 24%",
  },
  Matchups: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
    mood: "Analysis",
    summary:
      "Matchups are trends, not destiny. One first lead changes the whole lane dynamic.",
    position: "center 24%",
  },
  "Lane Phase": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Aggressive patience",
    summary:
      "Lane phase is about timing, brush control, level spikes, and waiting for one committed opening.",
    position: "62% center",
  },
  "Fiora's Support": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    mood: "In sync",
    summary:
      "Fiora does not need random help. She needs clean access, protected entry, and coordinated timing.",
    position: "58% center",
  },
  "Mid/Late Game": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
    mood: "Clear-minded",
    summary:
      "After lane, pick one plan and execute it well: split, flank, pick, or group with intent.",
    position: "56% center",
  },
  "Mechanical Tips": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Demanding",
    summary:
      "Mechanics are not only speed. They are angle, timing, discipline, and confidence under pressure.",
    position: "60% center",
  },
  "Videos / Clips": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    mood: "Showy",
    summary:
      "Clips should teach setup and decisions, not just show flashy kills.",
    position: "center 24%",
  },
};

export const pageSubtitle: Record<PageName, string> = {
  Home: "Fast draft read with a support-first priority.",
  "Why Fiora ADC Works":
    "Why the pick works when played with structure and intent.",
  Runes: "Two rune pages, two clear purposes.",
  Build: "Core route plus adaptations and finishing logic.",
  "Skill Order": "Early levels and simple baseline progression.",
  Matchups: "Trend-based reading with practical expectations.",
  "Lane Phase": "Key lane information without giant unreadable walls.",
  "Fiora's Support": "What support must actually do for Fiora ADC.",
  "Mid/Late Game": "How to convert lane advantage into game pressure.",
  "Mechanical Tips": "Short execution reminders before queue.",
  "Videos / Clips": "Space for examples, highlights, and teaching clips.",
};

export const voiceText: Record<PageName, string> = {
  Home:
    "Welcome to the Fiora ADC lab. This guide is built for players who want a real plan, a carry mindset, and a support-first draft read.",
  "Why Fiora ADC Works":
    "Fiora ADC works because she punishes bad spacing, panicked reactions, and bot lanes that do not understand her real all-in windows.",
  Runes:
    "Runes define your lane identity before the first trade begins. PTA for short burst windows, Phase Rush for mobility, cleaner access, and safer exits.",
  Build:
    "The build is not random. Start with Tiamat and Ravenous Hydra, then choose burst, stability, or defense depending on what the game demands.",
  "Skill Order":
    "Your early levels matter a lot. Q for access, E for burst timing, W for Riposte control and safer commits.",
  Matchups:
    "Treat matchups as trends. A hard lane can become playable if Fiora gets first lead, better tempo, or one strong support engage.",
  "Lane Phase":
    "Lane phase is patience plus violence. Manage HP, control brushes, respect level spikes, then commit completely when the opening is real.",
  "Fiora's Support":
    "Support sync is mandatory. Fiora wants a clean entry, vision support, and protection through the first committed action.",
  "Mid/Late Game":
    "After lane, pick one plan and commit to it. Splitting, flanking, or grouping all work, but random drifting wastes pressure.",
  "Mechanical Tips":
    "Good Fiora mechanics are not just fast fingers. They are calm timing, correct angles, and clean execution under pressure.",
  "Videos / Clips":
    "Use clips to study decisions, spacing, entry timing, and reset windows, not only the highlights.",
};

export const narrationAudio: Partial<Record<PageName, string>> = {
  Home: "/voices/home.wav",
  "Why Fiora ADC Works": "/voices/why-fiora-adc-works.wav",
  Runes: "/voices/runes.wav",
  Build: "/voices/build.wav",
  "Skill Order": "/voices/skill-order.wav",
  Matchups: "/voices/matchups.wav",
  "Lane Phase": "/voices/lane-phase.wav",
  "Fiora's Support": "/voices/fioras-support.wav",
  "Mid/Late Game": "/voices/mid-late-game.wav",
  "Mechanical Tips": "/voices/mechanical-tips.wav",
  "Videos / Clips": "/voices/videos-clips.wav",
};

export type Matchup = {
  name: string;
  level: string;
  danger: string;
  image: string;
  position: string;
  explanation: string;
};

export const matchups: Matchup[] = [
  {
    name: "Jhin",
    level: "Favorable",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jhin_0.jpg",
    position: "center 24%",
    explanation:
      "Punishable if he oversteps and support setup is not clean. Good opening windows if you take initiative.",
  },
  {
    name: "Jinx",
    level: "Favorable",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jinx_0.jpg",
    position: "center 24%",
    explanation:
      "No dash means one catch can flip lane control quickly when wave and brush state are favorable.",
  },
  {
    name: "Kai'Sa",
    level: "Playable",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Kaisa_0.jpg",
    position: "center 22%",
    explanation:
      "Volatile lane. Support timing and first all-in quality matter more than raw labels.",
  },
  {
    name: "Ashe",
    level: "Difficult",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ashe_0.jpg",
    position: "center 22%",
    explanation:
      "The slow breaks lane rhythm. You need cleaner HP discipline and more decisive engages.",
  },
  {
    name: "Draven",
    level: "Difficult",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Draven_0.jpg",
    position: "center 20%",
    explanation:
      "If he gets tempo first, the lane becomes very punishing. Every trade needs clear purpose.",
  },
  {
    name: "Caitlyn",
    level: "Difficult",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Caitlyn_0.jpg",
    position: "center 20%",
    explanation:
      "Range, traps, and push punish sloppy movement. Respect lane state, then punish overconfidence.",
  },
];

export const itemIcons = {
  tiamat: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3077.png",
  hydra: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3074.png",
  cyclosword:
    "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6699.png",
  triforce:
    "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3078.png",
  eclipse:
    "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6692.png",
  dd: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6333.png",
  iceborn:
    "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/6662.png",
  maw: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3156.png",
  shojin:
    "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3161.png",
  ga: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3026.png",
  bt: "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3072.png",
} as const;

export type SupportProfile = {
  name: string;
  role: string;
  image: string;
  position: string;
  size: string;
  text: string;
};

export const supportProfiles: SupportProfile[] = [
  {
    name: "Alistar",
    role: "Hard engage",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Alistar_0.jpg",
    position: "center 18%",
    size: "h-72",
    text: "Excellent with Fiora ADC because he gives immediate access to target and creates very clear commit windows.",
  },
  {
    name: "Braum",
    role: "Dive + peel",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Braum_0.jpg",
    position: "center 20%",
    size: "h-64",
    text: "A strong hybrid profile. He protects entry, stabilizes chaos, and still helps you commit when the opening is real.",
  },
  {
    name: "Yuumi",
    role: "Sustain + scaling",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Yuumi_0.jpg",
    position: "center 28%",
    size: "h-52",
    text: "Special case. She gives healing, shielding, chase comfort, and extended pressure patterns once lane becomes survivable.",
  },
];

export type SupportClip = {
  title: string;
  description: string;
  url: string;
  embed: string;
};

export const supportClips: SupportClip[] = [
  {
    title: "Support Clip 1",
    description: "Opening timing and first engage window.",
    url: "https://youtu.be/ck-PQSpfRDY",
    embed: "https://www.youtube.com/embed/ck-PQSpfRDY",
  },
  {
    title: "Support Clip 2",
    description: "Follow-up pressure after first trade.",
    url: "https://youtu.be/sTytoEHfY9w",
    embed: "https://www.youtube.com/embed/sTytoEHfY9w",
  },
  {
    title: "Support Clip 3",
    description: "Positioning and setup around engage support.",
    url: "https://youtu.be/4ASFCDwcHco",
    embed: "https://www.youtube.com/embed/4ASFCDwcHco",
  },
  {
    title: "Support Clip 4",
    description: "Dive or cleanup sequence with support sync.",
    url: "https://youtu.be/rNob-ZD26Xs",
    embed: "https://www.youtube.com/embed/rNob-ZD26Xs",
  },
];

export const laneSectionIds = [
  "early",
  "wave",
  "support",
  "matchups",
] as const;

export type LaneSectionId = (typeof laneSectionIds)[number];

export type LaneSection = {
  id: LaneSectionId;
  title: string;
  summary: string;
  points: string[];
};

export const laneSections: LaneSection[] = [
  {
    id: "early",
    title: "Early Lane",
    summary: "Preserve HP, track spikes, then punish the first real opening.",
    points: [
      "Fiora ADC is short range, so losing HP for free is one of the fastest ways to lose lane control.",
      "Level 2 with Q then E can create surprising kill pressure, especially with PTA and support follow-up.",
      "At level 3, Riposte changes how confidently you can stand your ground if enemy CC has been identified.",
    ],
  },
  {
    id: "wave",
    title: "Wave / Bush Control",
    summary:
      "Vision and brush state often decide whether your all-in is fake or real.",
    points: [
      "Bush control creates hidden engage angles and can force panic spells from the enemy lane.",
      "If enemy Flash is burned, the next longer wave often becomes an excellent jungle punish timing.",
      "Into ranged lanes, preserve HP first and do not convert annoyance into random desperation trades.",
    ],
  },
  {
    id: "support",
    title: "Support Sync",
    summary: "Support timing matters more here than on a standard ADC lane.",
    points: [
      "Engage and hook supports are premium because they create direct target access for Fiora.",
      "After Ravenous Hydra, repeated pressure becomes easier because Fiora can sustain and re-enter more comfortably.",
      "Protective supports still work if the plan is survive lane, hold health, and spike later with cleaner entries.",
    ],
  },
  {
    id: "matchups",
    title: "Matchup Trend",
    summary: "Treat labels as tendencies, not absolute truths.",
    points: [
      "Favorable trends: Jhin, Jinx, Kai'Sa, Lucian, Senna, Sivir, Miss Fortune.",
      "Harder trends: Ashe, Draven, Kog'Maw, Varus, Vayne, Twitch, Caitlyn.",
      "Most lanes become far more playable once Fiora gets first lead, better tempo, or superior support timing.",
    ],
  },
];

export type MechanicTip = {
  title: string;
  content: string;
};

export const mechanics: MechanicTip[] = [
  {
    title: "Spacing",
    content:
      "Threaten without overcommitting. Good spacing forces panic movement before you even press forward fully.",
  },
  {
    title: "Riposte timing",
    content:
      "Parry the spell that actually decides the fight, not the first animation that looks scary.",
  },
  {
    title: "Burst windows",
    content:
      "Commit when support sync, target access, and lane state all agree. Do not force half-openings.",
  },
  {
    title: "Vital angle",
    content:
      "Use movement to create clean passive angles before full commitment whenever the lane allows it.",
  },
];

export type SimpleCard = {
  title: string;
  text: string;
};

export const homeStatCards: SimpleCard[] = [
  {
    title: "Identity",
    text: "Aggressive, smoking, stomp",
  },
  {
    title: "Tone",
    text: "Direct, niche, practical, and built around pressure instead of autopilot.",
  },
  {
    title: "Positioning",
    text: "Not random troll value. The guide frames it as a real structured strategy.",
  },
  {
    title: "Use",
    text: "Support-first entry points make the site useful before lane even starts.",
  },
];

export const homeStatValues = [
  "Jewish Friendly ???",
  "Carry mindset",
  "Technical pocket pick",
  "Fast draft read",
] as const;

export const homeFeatureCards: SimpleCard[] = [
  {
    title: "Support-first",
    text: "The most important lane partner information is pushed forward immediately.",
  },
  {
    title: "Guide structure",
    text: "Runes, build, lane phase, support, mid-game, mechanics, and video sections all share one visual system.",
  },
  {
    title: "Personality",
    text: "The site still feels like Fiora: sharp, confident, and slightly disrespectful in the right way.",
  },
];

export const whyWorksPoints: SimpleCard[] = [
  {
    title: "Surprise factor",
    text: "Most bot lanes do not know Fiora ADC limits and overtrade at the wrong moments.",
  },
  {
    title: "Duel pressure",
    text: "One clean opening can flip lane state even when the matchup looked uncomfortable on paper.",
  },
  {
    title: "Execution edge",
    text: "Riposte timing plus support sync creates disproportionate value off one enemy mistake.",
  },
  {
    title: "Snowball conversion",
    text: "First lead gives wave tempo, objective setup, and much freer lane movement.",
  },
];

export const skillOrderCards: SimpleCard[] = [
  {
    title: "Level 1",
    text: "Q for access, repositioning, and creating your first real angle.",
  },
  {
    title: "Level 2",
    text: "E for burst timing, especially when PTA trade windows already look possible.",
  },
  {
    title: "Level 3",
    text: "W for Riposte control, CC answer, and far safer commitment.",
  },
];

export const supportPrinciples: SimpleCard[] = [
  {
    title: "Engage / hook",
    text: "Supports that create direct access are premium, because Fiora wins hardest when the target cannot freely kite the first commit.",
  },
  {
    title: "Hydra timing",
    text: "Once Ravenous Hydra is completed, repeated pressure becomes easier because Fiora can sustain, reset, and re-enter faster.",
  },
  {
    title: "Protective supports",
    text: "They still work when the goal is to survive lane, keep HP high, and unlock later spikes with cleaner entries.",
  },
];

export const midLateCards: SimpleCard[] = [
  {
    title: "Pick one plan",
    text: "Split, flank, pick, or group. Do not mix all plans at once.",
  },
  {
    title: "Entry timing",
    text: "Fight after vision and cooldown checks, not just because enemies are visible.",
  },
  {
    title: "Conversion",
    text: "Every successful fight should become objective pressure, tempo, or map space.",
  },
];

export type RunePage = {
  key: "pta" | "phase-rush";
  title: string;
  image: string;
  fallback: string;
  bullets: Array<{
    label: string;
    text: string;
  }>;
};

export const runePages: RunePage[] = [
  {
    key: "pta",
    title: "PTA PAGE",
    image: "/pta-page.png",
    fallback: "/phase-rush-page.png",
    bullets: [
      {
        label: "Why PTA:",
        text: "burst profile, short trades, better vs fragile ADCs.",
      },
      {
        label: "Secondary:",
        text: "Biscuits + Jack = safer lane.",
      },
      {
        label: "Mini:",
        text: "Adaptive / Adaptive / HP.",
      },
    ],
  },
  {
    key: "phase-rush",
    title: "PHASE RUSH PAGE",
    image: "/phase-rush-page.png",
    fallback: "/pta-page.png",
    bullets: [
      {
        label: "Why Phase Rush:",
        text: "mobility, disengage, access.",
      },
      {
        label: "Damage:",
        text: "Absolute Focus + Last Stand.",
      },
      {
        label: "Mini:",
        text: "AS / Adaptive / HP.",
      },
    ],
  },
];

export type VideoCard = {
  title: string;
  image: string;
  position: string;
};

export const videoCards: VideoCard[] = [
  {
    title: "Duel highlight",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    position: "center 24%",
  },
  {
    title: "Timing sample",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
    position: "center 24%",
  },
  {
    title: "Carry sequence",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_7.jpg",
    position: "center 25%",
  },
];
