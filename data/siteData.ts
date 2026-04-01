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
export const homeSupportShellAudio = "/voices/blocks/home-support-shell.wav";
export const homeHeroImage =
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_7.jpg";
export const whyWorksVisualImage =
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg";

export const pageMeta: Record<PageName, NarrationEntry> = {
  Home: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_0.jpg",
    mood: "Cold confidence",
    summary:
      "If top lane bores you, this guide gives Fiora ADC an actual lane plan instead of random cope.",
    position: "center 22%",
  },
  "Why Fiora ADC Works": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_1.jpg",
    mood: "Calculated arrogance",
    summary:
      "Why the lane gets ugly when enemies misread spacing, cooldowns, or commit timing.",
    position: "center 24%",
  },
  Runes: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    mood: "Precision",
    summary:
      "Your rune page decides whether lane opens with raw burst or with enough movement to touch, reset, and leave clean.",
    position: "center 24%",
  },
  Build: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_3.jpg",
    mood: "Methodical",
    summary:
      "Start with tempo and sustain, then decide whether the game wants greed, balance, or something less greedy.",
    position: "78% center",
  },
  "Skill Order": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Discipline",
    summary:
      "The first few points decide whether lane just survives or actually bites back.",
    position: "center 24%",
  },
  Matchups: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
    mood: "Analysis",
    summary:
      "Matchups are trends. One clean lead can rewrite the lane anyway.",
    position: "center 24%",
  },
  "Lane Phase": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Aggressive patience",
    summary:
      "Lane phase is timing, brush control, wave shape, and waiting for the commit that actually matters.",
    position: "62% center",
  },
  "Fiora's Support": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    mood: "In sync",
    summary:
      "Fiora does not need random help. She needs access, cover, and timing that arrives on purpose.",
    position: "58% center",
  },
  "Mid/Late Game": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
    mood: "Clear-minded",
    summary:
      "After lane, pick the job and commit: split, flank, pick, or group with a reason.",
    position: "56% center",
  },
  "Mechanical Tips": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Demanding",
    summary:
      "Mechanics are not just speed. They are angle, timing, restraint, and nerve.",
    position: "60% center",
  },
  "Videos / Clips": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    mood: "Showy",
    summary:
      "Clips should teach the setup, the trigger, and the cleanup, not just the kill.",
    position: "center 24%",
  },
};

export const pageSubtitle: Record<PageName, string> = {
  Home: "Support first. Draft fast.",
  "Why Fiora ADC Works":
    "Where the pressure really comes from when the pick is played right.",
  Runes: "Two rune pages. Two jobs.",
  Build: "What you rush, what you pivot, and what you close with.",
  "Skill Order": "Your first levels decide whether lane has teeth.",
  Matchups: "What feels good, what feels awful, and why.",
  "Lane Phase": "HP, brush control, wave shape, and engage timing.",
  "Fiora's Support": "How support turns this pick from joke to threat.",
  "Mid/Late Game": "If lane is won, this is how you cash it in.",
  "Mechanical Tips": "Short execution reminders before queue.",
  "Videos / Clips": "Clips for setup, spacing, entries, and cleanup.",
};

export const voiceText: Record<PageName, string> = {
  Home:
    "Welcome to the Fiora ADC lab. This is for players who want an actual lane plan, a carry mindset, and a support who understands what the lane needs before minions even meet.",
  "Why Fiora ADC Works":
    "Fiora ADC works because she punishes bad spacing, panicked reactions, and bot lanes that do not realize how fast one bad step can turn into a full commit.",
  Runes:
    "Runes decide how lane starts before the first trade even happens. PTA is for short brutal windows and direct punishment. Phase Rush is for access, resets, and getting out without donating the trade back.",
  Build:
    "The build is not random. Start with Tiamat and Ravenous Hydra, then ask whether the game wants burst, balance, or a less greedy answer to enemy damage.",
  "Skill Order":
    "Your early levels decide whether lane is fake pressure or real pressure. Q gives access, E gives the burst window, and W lets you stop pretending the enemy controls the trade.",
  Matchups:
    "Treat matchups as trends, not prison sentences. A bad lane becomes playable the second Fiora gets first lead, better tempo, or one engage that actually lands cleanly.",
  "Lane Phase":
    "Lane phase is patience plus violence. Keep your health, own the brush, respect the spikes, then go all the way in when the opening is finally real.",
  "Fiora's Support":
    "Support sync is mandatory. Fiora wants target access, cover on entry, and someone who understands the difference between a real go button and random enthusiasm.",
  "Mid/Late Game":
    "After lane, pick one job and commit to it. Split, flank, pick, or group, but stop drifting between ideas and bleeding pressure for free.",
  "Mechanical Tips":
    "Good Fiora mechanics are not just fast fingers. They are calm timing, correct angles, and knowing exactly when the lane wants patience instead of ego.",
  "Videos / Clips":
    "Use clips to study decisions, spacing, entry timing, and reset windows. If a clip only shows the kill, it is hiding the part that actually mattered.",
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
  audio?: string;
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
      "Punish him the second his spacing gets lazy. If your support touches him first, the lane can snap fast.",
    audio: "/voices/blocks/matchup-jhin.wav",
  },
  {
    name: "Jinx",
    level: "Favorable",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jinx_0.jpg",
    position: "center 24%",
    explanation:
      "No dash means one clean catch can flip the whole lane if wave and brush are already yours.",
    audio: "/voices/blocks/matchup-jinx.wav",
  },
  {
    name: "Kai'Sa",
    level: "Playable",
    danger: "Medium",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Kaisa_0.jpg",
    position: "center 22%",
    explanation:
      "Volatile lane. The label matters less than who gets the first real all-in cleanly.",
    audio: "/voices/blocks/matchup-kaisa.wav",
  },
  {
    name: "Ashe",
    level: "Difficult",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ashe_0.jpg",
    position: "center 22%",
    explanation:
      "Her slow ruins your rhythm. Stay healthier than you want to, then pick one hard commit instead of bleeding out in small trades.",
    audio: "/voices/blocks/matchup-ashe.wav",
  },
  {
    name: "Draven",
    level: "Difficult",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Draven_0.jpg",
    position: "center 20%",
    explanation:
      "If he gets tempo first, every lane step feels expensive. Do not trade for ego.",
    audio: "/voices/blocks/matchup-draven.wav",
  },
  {
    name: "Caitlyn",
    level: "Difficult",
    danger: "High",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Caitlyn_0.jpg",
    position: "center 20%",
    explanation:
      "Range, traps, and shove punish lazy movement. Respect the setup, then hit the moment she gets arrogant.",
    audio: "/voices/blocks/matchup-caitlyn.wav",
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
  audio?: string;
};

export const supportProfiles: SupportProfile[] = [
  {
    name: "Alistar",
    role: "Hard engage",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Alistar_0.jpg",
    position: "center 18%",
    size: "h-72",
    text: "Still the cleanest partner here. He gives direct target access and makes commit windows obvious.",
    audio: "/voices/blocks/support-alistar.wav",
  },
  {
    name: "Braum",
    role: "Dive + peel",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Braum_0.jpg",
    position: "center 20%",
    size: "h-64",
    text: "Messier than Alistar but still excellent. He protects entry, stabilizes chaos, and lets you keep fighting after first contact.",
    audio: "/voices/blocks/support-braum.wav",
  },
  {
    name: "Yuumi",
    role: "Sustain + scaling",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Yuumi_0.jpg",
    position: "center 28%",
    size: "h-52",
    text: "Special case. She gives sustain, chase comfort, and enough padding to survive until Fiora can re-enter again and again.",
    audio: "/voices/blocks/support-yuumi.wav",
  },
];

export type SupportClip = {
  title: string;
  description: string;
  focus: string;
  takeaway: string;
  url: string;
  embed: string;
};

export const supportClips: SupportClip[] = [
  {
    title: "First engage window",
    description: "Watch how the lane is opened before the real commit starts.",
    focus: "Trigger",
    takeaway: "The lane only works because support starts the contact before Fiora spends her dash for free.",
    url: "https://youtu.be/ck-PQSpfRDY",
    embed: "https://www.youtube.com/embed/ck-PQSpfRDY",
  },
  {
    title: "Punish after contact",
    description: "What support should do once the first trade already hit.",
    focus: "Follow-up",
    takeaway: "The important part is not the first touch. It is whether support keeps the target locked long enough for Fiora to finish the idea.",
    url: "https://youtu.be/sTytoEHfY9w",
    embed: "https://www.youtube.com/embed/sTytoEHfY9w",
  },
  {
    title: "Angle and spacing",
    description: "How positioning creates a real entry instead of fake pressure.",
    focus: "Spacing",
    takeaway: "Support body position decides whether the engage is clean or whether Fiora has to force through too much space.",
    url: "https://youtu.be/4ASFCDwcHco",
    embed: "https://www.youtube.com/embed/4ASFCDwcHco",
  },
  {
    title: "Dive or cleanup",
    description: "The part after contact: finish the play or reset it cleanly.",
    focus: "Reset",
    takeaway: "Once contact happens, decide immediately whether the lane wants the kill, the crash, or the reset. Wasting that moment is the real throw.",
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
  audio?: string;
};

export const laneSections: LaneSection[] = [
  {
    id: "early",
    title: "Early Lane",
    summary: "Keep your health, track the spike, then cash in on the first real mistake.",
    audio: "/voices/blocks/lane-early-lane.wav",
    points: [
      "Fiora ADC is short range, so free damage is how you lose lane before the matchup even starts.",
      "Level 2 with Q then E creates real kill pressure if support is already in range to finish the idea.",
      "At level 3, Riposte changes how confidently you can stand your ground once enemy CC has been identified.",
    ],
  },
  {
    id: "wave",
    title: "Wave / Bush Control",
    summary:
      "Brush and wave state decide whether your all-in is real or just roleplay.",
    audio: "/voices/blocks/lane-wave-bush-control.wav",
    points: [
      "Brush control creates hidden engage angles and often bleeds enemy cooldowns before the real fight.",
      "If enemy Flash is burned, the next longer wave becomes one of the cleanest jungle punish timings you get.",
      "Into ranged lanes, keep your health first and do not turn annoyance into desperate trades.",
    ],
  },
  {
    id: "support",
    title: "Support Sync",
    summary: "Support timing matters more here than on a normal marksman lane.",
    audio: "/voices/blocks/lane-support-sync.wav",
    points: [
      "Engage and hook supports are premium because they let Fiora touch the target on purpose, not by miracle.",
      "After Ravenous Hydra, repeat pressure becomes much easier because Fiora can heal, reset, and walk back in faster.",
      "Protective supports still work if the plan is survive early, stay healthy, and punish later with cleaner entries.",
    ],
  },
  {
    id: "matchups",
    title: "Matchup Trend",
    summary: "Treat labels as tendencies. Gold, tempo, and support timing rewrite lanes quickly.",
    audio: "/voices/blocks/lane-matchup-trend.wav",
    points: [
      "Favorable trends: Jhin, Jinx, Kai'Sa, Lucian, Senna, Sivir, Miss Fortune.",
      "Harder trends: Ashe, Draven, Kog'Maw, Varus, Vayne, Twitch, Caitlyn.",
      "Most lanes become much more playable once Fiora gets first lead, better tempo, or stronger support timing.",
    ],
  },
];

export type MechanicTip = {
  title: string;
  content: string;
  audio?: string;
};

export const mechanics: MechanicTip[] = [
  {
    title: "Spacing",
    content:
      "Threaten first. Commit second. Good spacing makes the enemy spend the wrong cooldown before the fight even starts.",
    audio: "/voices/blocks/mechanics-spacing.wav",
  },
  {
    title: "Riposte timing",
    content:
      "Do not parry the loudest spell. Parry the one that decides whether you live, stick, or lose the whole trade.",
    audio: "/voices/blocks/mechanics-riposte-timing.wav",
  },
  {
    title: "Burst windows",
    content:
      "When support timing, target access, and wave state line up, go all the way in. Half-entries lose lanes.",
    audio: "/voices/blocks/mechanics-burst-windows.wav",
  },
  {
    title: "Vital angle",
    content:
      "Use movement to open cleaner vitals before you hard commit whenever the lane actually gives you room.",
    audio: "/voices/blocks/mechanics-vital-angle.wav",
  },
];

export type SimpleCard = {
  title: string;
  text: string;
  audio?: string;
};

export const homeStatCards: SimpleCard[] = [
  {
    title: "Identity",
    text: "Dark red, duel-heavy, and built to feel hostile.",
    audio: "/voices/blocks/home-identity.wav",
  },
  {
    title: "Tone",
    text: "Direct, practical, and written to win lane.",
    audio: "/voices/blocks/home-tone.wav",
  },
  {
    title: "Positioning",
    text: "Pocket pick with a plan, not a meme with excuses.",
    audio: "/voices/blocks/home-positioning.wav",
  },
  {
    title: "Use",
    text: "Best opened in champ select, before the lane starts lying to you.",
    audio: "/voices/blocks/home-use.wav",
  },
];

export const homeStatValues = [
  "Jewish Friendly ???",
  "Carry mindset",
  "Technical pocket pick",
  "Champ select read",
] as const;

export const homeFeatureCards: SimpleCard[] = [
  {
    title: "Support first",
    text: "If your support skips this, half the lane plan is already gone.",
    audio: "/voices/blocks/home-support-first.wav",
  },
  {
    title: "What you get",
    text: "Runes, build, lane, support, macro, clips. Each page answers a real question instead of wasting your time.",
    audio: "/voices/blocks/home-what-you-get.wav",
  },
  {
    title: "Fiora energy",
    text: "Sharp, smug, unforgiving. One enemy mistake should feel expensive.",
    audio: "/voices/blocks/home-fiora-energy.wav",
  },
];

export const whyWorksPoints: SimpleCard[] = [
  {
    title: "Surprise factor",
    text: "Most bot lanes know Fiora top. They do not know how little space she needs before bot lane turns lethal.",
    audio: "/voices/blocks/why-surprise-factor.wav",
  },
  {
    title: "Duel pressure",
    text: "One clean opening is enough to make a lane stop feeling annoying and start feeling dangerous.",
    audio: "/voices/blocks/why-duel-pressure.wav",
  },
  {
    title: "Execution edge",
    text: "Riposte plus support timing turns one enemy mistake into far more value than it should.",
    audio: "/voices/blocks/why-execution-edge.wav",
  },
  {
    title: "Snowball conversion",
    text: "First lead means wave control, cleaner recalls, dragon setup, and much freer movement.",
    audio: "/voices/blocks/why-snowball-conversion.wav",
  },
];

export const skillOrderCards: SimpleCard[] = [
  {
    title: "Level 1",
    text: "Q for access, repositioning, and creating your first real angle.",
    audio: "/voices/blocks/skill-order-level-1.wav",
  },
  {
    title: "Level 2",
    text: "E for burst timing, especially when PTA trade windows already look possible.",
    audio: "/voices/blocks/skill-order-level-2.wav",
  },
  {
    title: "Level 3",
    text: "W for Riposte control, CC answer, and far safer commitment.",
    audio: "/voices/blocks/skill-order-level-3.wav",
  },
];

export const supportPrinciples: SimpleCard[] = [
  {
    title: "Engage / hook",
    text: "If support can force contact, Fiora gets to play. If not, half the lane is spent asking for permission.",
    audio: "/voices/blocks/support-principle-engage-hook.wav",
  },
  {
    title: "Hydra timing",
    text: "Once Ravenous Hydra is done, repeat pressure gets much easier because Fiora can heal, reset, and walk back in fast.",
    audio: "/voices/blocks/support-principle-hydra-timing.wav",
  },
  {
    title: "Protective supports",
    text: "They still work when the lane plan is survive early, keep HP high, then punish later with cleaner entries.",
    audio: "/voices/blocks/support-principle-protective-supports.wav",
  },
];

export const midLateCards: SimpleCard[] = [
  {
    title: "Pick one plan",
    text: "Split, flank, pick, or group. Mixing all four plans is how leads evaporate.",
    audio: "/voices/blocks/mid-late-pick-one-plan.wav",
  },
  {
    title: "Entry timing",
    text: "Do not enter because enemies are visible. Enter because vision is set and the cooldowns that matter are gone.",
    audio: "/voices/blocks/mid-late-entry-timing.wav",
  },
  {
    title: "Conversion",
    text: "If a fight wins nothing, it barely counts. Turn kills into tempo, towers, dragon, or side space.",
    audio: "/voices/blocks/mid-late-conversion.wav",
  },
];

export type RunePage = {
  key: "pta" | "phase-rush";
  title: string;
  image: string;
  fallback: string;
  audio?: string;
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
    audio: "/voices/blocks/runes-pta-page.wav",
    bullets: [
      {
        label: "Why PTA:",
        text: "best when lane can be decided by one short, brutal trade.",
      },
      {
        label: "Secondary:",
        text: "Biscuits and Jack steady the lane when it gets ugly.",
      },
      {
        label: "Mini:",
        text: "Adaptive, Adaptive, HP for early damage that still feels honest.",
      },
    ],
  },
  {
    key: "phase-rush",
    title: "PHASE RUSH PAGE",
    image: "/phase-rush-page.png",
    fallback: "/pta-page.png",
    audio: "/voices/blocks/runes-phase-rush-page.wav",
    bullets: [
      {
        label: "Why Phase Rush:",
        text: "take this when sticking, weaving out, or re-entering matters more than raw burst.",
      },
      {
        label: "Damage:",
        text: "Absolute Focus and Last Stand keep the page useful at both clean and messy HP bars.",
      },
      {
        label: "Mini:",
        text: "Attack Speed, Adaptive, HP for smoother access and less clunky trades.",
      },
    ],
  },
];

export type VideoCard = {
  title: string;
  image: string;
  position: string;
  label: string;
  description: string;
  note: string;
  audio?: string;
};

export const videoCards: VideoCard[] = [
  {
    title: "Entry clip",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    position: "center 24%",
    label: "Look for",
    description: "How the target gets pinned before Fiora spends everything.",
    note: "The clip should start before the fight, not on the first crit frame.",
    audio: "/voices/blocks/videos-entry-clip.wav",
  },
  {
    title: "Spacing clip",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
    position: "center 24%",
    label: "Look for",
    description: "What changes in movement right before the lane flips from neutral to lethal.",
    note: "A good clip here teaches distance control, not just confidence.",
    audio: "/voices/blocks/videos-spacing-clip.wav",
  },
  {
    title: "Cleanup clip",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_7.jpg",
    position: "center 25%",
    label: "Look for",
    description: "How the kill becomes wave control, reset tempo, or the next target.",
    note: "The ending matters less than the chain of decisions that made it free.",
    audio: "/voices/blocks/videos-cleanup-clip.wav",
  },
];
