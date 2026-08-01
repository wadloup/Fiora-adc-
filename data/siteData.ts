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
  "Vital Lab",
  "Vital Rush",
  "Videos / Clips",
] as const;

export type PageName = (typeof pages)[number];

export type EvidenceKind = "official" | "observed" | "author" | "inference";

export type NarrationEntry = {
  image: string;
  mood: string;
  summary: string;
  position?: string;
};

export const heroCertifiedImage = "/netanyahu-certified.png";
export const homeSupportShellAudio = "/voices/blocks/home-support-shell.wav";
export const homeHeroImage = "/duelist-hero.jpg";
export const whyWorksVisualImage =
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg";

export const pageMeta: Record<PageName, NarrationEntry> = {
  Home: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_0.jpg",
    mood: "Cold confidence",
    summary:
      "Use the saved draft to decide the level-1 posture, ninth-minion skill, first legal target, Riposte line and first item pivot before the lane starts.",
    position: "center 22%",
  },
  "Why Fiora ADC Works": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_1.jpg",
    mood: "Calculated arrogance",
    summary:
      "How support control, enemy spacing cooldowns, Riposte direction and wave length create a legal melee damage window.",
    position: "center 24%",
  },
  Runes: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_2.jpg",
    mood: "Precision",
    summary:
      "Your rune page decides whether the first two seconds matter most or the fight continues after the third hit.",
    position: "center 24%",
  },
  Build: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_3.jpg",
    mood: "Methodical",
    summary:
      "This guide teaches Hydra first, Greaves in the boot slot, and Hubris second. Adapt after that author spine, then use Cyclosword only when a specialist answer is not the real conversion threshold.",
    position: "78% center",
  },
  "Skill Order": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Discipline",
    summary:
      "Q always starts. The level-2 race and enemy crowd control decide whether E adds damage or W protects the all-in.",
    position: "center 24%",
  },
  Matchups: {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
    mood: "Analysis",
    summary:
      "Select the allied support and both opponents to identify the first legal target, level-2 skill, W trigger, escape queue and wave plan.",
    position: "center 24%",
  },
  "Lane Phase": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Aggressive patience",
    summary:
      "Start Q, own the nearest lane bush, decide the level-2 race early, and preserve enough health to convert the first real all-in.",
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
    mood: "Adaptive pressure",
    summary:
      "Read economy, waves, vision, cooldowns and team tempo, then preserve the sequence with the best conversion and exit.",
    position: "56% center",
  },
  "Mechanical Tips": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Demanding",
    summary:
      "Q endpoint, Vital path, auto-E sequencing and Riposte allocation explained through the enemy response they must solve.",
    position: "60% center",
  },
  "Vital Lab": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Tactical geometry",
    summary:
      "Move every champion, expose the cooldown state, and price a Vital through Q access, allied cover, enemy answers, wave tax and the route back out.",
    position: "60% center",
  },
  "Vital Rush": {
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_4.jpg",
    mood: "Arcade focus",
    summary:
      "A small reflex arena for dashing vitals, parrying shots, and keeping the lane alive under pressure.",
    position: "center 24%",
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
    "What Fiora gives up, what support access replaces, and where the conversion fails.",
  Runes: "Two rune pages. Two jobs.",
  Build: "What you rush, what you pivot, and what you close with.",
  "Skill Order": "Your first levels decide whether lane has teeth.",
  Matchups: "Draft-specific level 1, level 2, target, W, wave, reset, and build decisions.",
  "Lane Phase": "HP, bush control, wave shape, and engage timing.",
  "Fiora's Support": "Exact access, follow-up, protection, wave, and roam responsibilities.",
  "Mid/Late Game": "Map pressure, fight entry, and every reason the call can change.",
  "Mechanical Tips": "Execution patterns tied to specific enemy spells and lane geometry.",
  "Vital Lab": "A playable contact ledger for deciding whether a Vital is cheap, conditional, or bait.",
  "Vital Rush": "Dash vitals, parry shots, and chain the bot-lane arcade run.",
  "Videos / Clips": "Clips for setup, spacing, entries, and cleanup.",
};

export const voiceText: Record<PageName, string> = {
  Home:
    "Start with the complete draft, not a generic matchup tier. The allied support and both opponents decide whether level one is a punish or an HP-preservation lane, whether level two gives E or W, which enemy spell opens contact, and where Fiora must keep Q or Flash for the second position.",
  "Why Fiora ADC Works":
    "Fiora ADC gives up ranged uptime and safe neutral farming. The trade becomes worthwhile when allied control fixes a target, the enemy spacing spell is forced before Fiora spends Q, and Riposte remains for the counter-control. The pick is strongest when one short access window contains the full Hail and Bladework sequence; it fails when Fiora begins unsupported or crosses a prepared zone with no exit.",
  Runes:
    "Runes decide how lane starts before the first trade even happens. Hail of Blades is the default when Fiora has a short access window. Press the Attack is for durable first targets and extended contact.",
  Build:
    "The guide has an explicit author spine: Ravenous Hydra first, Gluttonous Greaves in the boot slot, and Hubris as the second legendary. The next purchase answers the enemy rotation, while Voltaic Cyclosword closes damage only when armor, shields, healing, or removable control does not demand a specialist slot.",
  "Skill Order":
    "Start Q every game. Take E at level 2 only when Fiora wins the push and the enemy lane lacks decisive lock. Take W when the wave comes in or one enemy crowd control can decide the all-in.",
  Matchups:
    "A matchup is the intersection of allied support, enemy carry, enemy support, wave arrival and cooldown state. Use the builder to decide who is reachable first, whether level two gives E or requires W, which spell Riposte must answer, where the carry escapes, and what wave position makes the same contact profitable or losing.",
  "Lane Phase":
    "Lane begins in the tower-side bush. Use vision denial, the nine-minion level-2 timing, and Riposte aimed through the enemy support toward the ADC to turn the first real opening into the kill that starts the snowball.",
  "Fiora's Support":
    "Support should create access without moving the target outside Fiora's follow-up, keep one spell for the enemy answer, and shape the wave before roaming. A catch is complete only when Fiora reaches the post-dash target and still has W, Flash, allied protection or a short lane for the exit.",
  "Mid/Late Game":
    "After lane, do not reduce the map to split or group. Read your economy, the next waves, relevant vision, enemy arrival tools, objective commitment, allied tempo, and the cost of failure. Clear, disappear, force information, then enter or leave with a real conversion plan.",
  "Mechanical Tips":
    "Mechanical execution begins before the input: choose Q's endpoint, build the enemy control queue, decide where Riposte should land, and identify the escape Vital. Speed matters only after those choices make the sequence legal.",
  "Vital Lab":
    "A visible Vital is not automatically a profitable Vital. Move Fiora, her support, the enemy carry and the enemy support, then expose the wave, cooldown and information state. The laboratory separates exact kit geometry from estimated support influence and from hidden information that only the player can supply.",
  "Vital Rush":
    "Vital Rush is the quick arcade lab. Dash through weak points, parry incoming pressure, and keep the combo moving before bot lane turns into a disaster.",
  "Videos / Clips":
    "Use clips to study decisions, spacing, entry timing, and reset windows. If a clip only shows the kill, it is hiding the part that actually mattered.",
};

export const narrationAudio: Partial<Record<PageName, string>> = {
  Home: "/voices/home.wav",
  "Why Fiora ADC Works": "/voices/why-fiora-adc-works.wav",
  Matchups: "/voices/matchups.wav",
  "Fiora's Support": "/voices/fioras-support.wav",
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
    level: "Attack reload, not permanent weakness",
    danger: "Root + trap check",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jhin_0.jpg",
    position: "center 24%",
    explanation:
      "Track his magazine before the wave, not only during the trade. Concede the fourth-shot last hit, then move during reload or after Deadly Flourish misses. Stand away from low allied minions so Dancing Grenade cannot bounce into Fiora. When support fixes Jhin, Q toward his retreat and hold W for the marked Deadly Flourish or enemy support CC; a reload window is not lethal if traps already cover Fiora's exit.",
    audio: "/voices/blocks/matchup-jhin.wav",
  },
  {
    name: "Jinx",
    level: "Access depends on the trap floor",
    danger: "Reset threat",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jinx_0.jpg",
    position: "center 24%",
    explanation:
      "Keep minions between Fiora and Zap, but inspect Flame Chompers before every Q. The traps can cut the retreat even when the support catch is clean. Force Chompers with the first engage or parry a forced root, then finish before Jinx's support restores distance. After any nearby takedown, her reset changes the chase completely; stop the extension if Fiora cannot kill before the movement and attack-speed reset activates.",
    audio: "/voices/blocks/matchup-jinx.wav",
  },
  {
    name: "Draven",
    level: "Axe position creates the punish",
    danger: "Level-1 damage",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Draven_0.jpg",
    position: "center 20%",
    explanation:
      "Do not contest his level-1 axe damage in open lane. Hold the wave on Fiora's half and read the next axe landing point: it predicts where allied control can connect. The punish begins after Stand Aside is spent or misses, not merely because Draven walks forward. Riposte the displacement or enemy support's decisive lock, burst before he catches a second axe cycle, and end contact if the wave is large enough to let Blood Rush turn retreat into a chase.",
    audio: "/voices/blocks/matchup-draven.wav",
  },
  {
    name: "Twitch",
    level: "Negative vision is unreliable",
    danger: "Ambush route",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Twitch_0.jpg",
    position: "center 24%",
    explanation:
      "When Twitch leaves vision, stop hitting the turret until his last route and support position are known; an accidental Q hit under tower can draw aggro before Fiora sees the ambush. Keep the wave short enough that Ambush movement speed cannot create a full-lane chase. After six, Spray and Pray attacks from beyond normal auto range and can pierce the frontline, so approach from the side, use W slow after he reveals, and retain Q for his retreat rather than opening from maximum distance.",
    audio: "/voices/blocks/matchup-twitch.wav",
  },
  {
    name: "Braum",
    level: "The passive stack is the timer",
    danger: "Delayed stun",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Braum_0.jpg",
    position: "center 20%",
    explanation:
      "One Winter's Bite or basic attack starts a delayed four-stack stun, so count stacks before deciding whether the trade can continue. Do not spend Hail into Unbreakable while Fiora is already marked. A cleaner line is to break contact before the stun, wait for the mark to expire or W the proc, then angle Riposte through Braum toward the carry. If Braum jumps back to the ADC with Stand Behind Me, reassess target access instead of following through his defensive stats.",
    audio: "/voices/blocks/matchup-braum.wav",
  },
  {
    name: "Lulu",
    level: "Force one save, then repeat",
    danger: "Layered peel",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Lulu_0.jpg",
    position: "center 24%",
    explanation:
      "Lulu protects in layers: shield, Whimsy, movement and Wild Growth. Do not count the carry's visible health as the kill timer while all four are ready. Use allied engage or a short Q-auto to force Polymorph or shield, leave before sustain resets the exchange, then re-enter during that cooldown. If Lulu separates to ward, she can become the first target; otherwise Fiora needs W and support follow-up for the remaining layer after Flash reaches the carry.",
    audio: "/voices/blocks/matchup-lulu.wav",
  },
  {
    name: "Caitlyn",
    level: "Fight on the bounce, not her push",
    danger: "Trap geometry",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Caitlyn_0.jpg",
    position: "center 20%",
    explanation:
      "Preserve HP through wave one instead of matching her autos; Doran's Shield is valuable when Caitlyn and support can damage Fiora before she chooses contact. Fight on the bounce, away from the trap line she prepared while pushing. Peacemaker or 90 Caliber Net being spent creates only the first half of the window: count the traps under allied CC, Q toward Net's landing point, and use W on a forced trap root when the returned stun can reach Caitlyn.",
    audio: "/voices/blocks/matchup-caitlyn.wav",
  },
  {
    name: "Ezreal",
    level: "First contact forces E",
    danger: "Second position",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ezreal_0.jpg",
    position: "center 24%",
    explanation:
      "Use minions to deny Mystic Shot while the wave builds, then make support contact force Arcane Shift without spending Fiora's full access. Aim Q at the destination after the blink; Q-ing the first position leaves no second gap closer. If Arcane Shift and enemy peel are both ready, take the wave or a short punish instead of chasing. Tiamat and Hydra matter because forcing Ezreal to clear under pressure gives support time to own the next bush and repeat before his escape returns.",
    audio: "/voices/blocks/matchup-ezreal.wav",
  },
];

export const itemIcons = {
  tiamat: "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3077.png",
  hydra: "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3074.png",
  hubris:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/6697.png",
  cyclosword:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/6699.png",
  triforce:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3078.png",
  eclipse:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/6692.png",
  dd: "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/6333.png",
  iceborn:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/6662.png",
  maw: "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3156.png",
  shojin:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3161.png",
  ga: "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3026.png",
  bt: "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3072.png",
  sterak:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3053.png",
  endless:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/2517.png",
  stride:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/6631.png",
  greaves:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3008.png",
  steelcaps:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3047.png",
  mercs:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3111.png",
  doranShield:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/1054.png",
  doranBlade:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/1055.png",
  doranHelm:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/1120.png",
  doranBow:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/1086.png",
  mercurial:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3139.png",
  serpent:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/6695.png",
  serylda:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/6694.png",
  chempunk:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/6609.png",
  edgeOfNight:
    "https://ddragon.leagueoflegends.com/cdn/16.15.1/img/item/3814.png",
} as const;

export const buildCoreStages = [
  {
    step: "01",
    eyebrow: "First full item",
    title: "Ravenous Hydra",
    images: [itemIcons.hydra],
    evidence: ["observed", "author"],
    text: "The guide's first-item standard. Wave control creates clean recalls, lifesteal repairs ranged chip, and the active turns one access window into real burst. Hydra appeared in 172 of 178 reviewed games, but the corpus also contains early-Hubris completions before Hydra; this page deliberately favors the more repeatable wave-control route.",
  },
  {
    step: "B",
    eyebrow: "Boot slot / guide standard",
    title: "Gluttonous Greaves",
    images: [itemIcons.greaves],
    evidence: ["official", "observed", "author"],
    text: "The guide keeps Greaves as its default boot slot because 4% base omnivamp grows by 0.6% per champion takedown, up to ten stacks. They appeared in 97 of 128 reviewed games after their introduction, so 'standard' describes this guide's snowball system rather than an empirically universal boot choice.",
  },
  {
    step: "02",
    eyebrow: "Second legendary / guide standard",
    title: "Hubris",
    images: [itemIcons.hubris],
    evidence: ["official", "observed", "author"],
    text: "The guide completes Hubris second with Hail and PTA so later lane fights, roams and objective skirmishes can grow Eminence early. The stored kill count increases the AD granted by future activations, but the active AD buff itself lasts 90 seconds; keeping it live requires another timely takedown rather than passive permanent damage.",
  },
  {
    step: "03+",
    eyebrow: "Matchup pivot",
    title: "Survive the answer",
    images: [itemIcons.dd, itemIcons.maw, itemIcons.sterak, itemIcons.endless],
    evidence: ["official", "inference", "author"],
    text: "Death's Dance buys time into physical burst, Maw covers a magic burst threshold, Sterak absorbs mixed front-loaded damage, and Endless Hunger rewards contact that already survives. This slot changes with the spell that ends Fiora's rotation; the first three purchases remain the guide's preferred spine, not a claim that every draft has identical optimal items.",
  },
  {
    step: "END",
    eyebrow: "Damage closer",
    title: "Voltaic Cyclosword",
    images: [itemIcons.cyclosword],
    evidence: ["official", "inference", "author"],
    text: "The guide's damage closer when target access and first-contact survival are already solved. Ability damage helps charge the Energized hit; that attack deals current-health damage and grants temporary lethality for the remaining rotation. Delay or replace it when armor, shields, removable control, or anti-heal changes the actual kill condition.",
  },
] as const;

export const buildStartRules = [
  {
    title: "Doran's Shield",
    image: itemIcons.doranShield,
    label: "Repeated poke",
    enemies:
      "Caitlyn, Ashe, Ezreal, Varus, Smolder, Ziggs, Hwei, or mage supports such as Lux, Xerath, Brand, Zyra, and Vel'Koz.",
    text: "Take Shield when health is taxed before Fiora can choose the trade. Its job is to preserve enough HP to contest the wave and reach the Hydra recall without donating lane control.",
  },
  {
    title: "Doran's Helm",
    image: itemIcons.doranHelm,
    label: "Explosive first lock",
    enemies:
      "Draven or Samira beside Leona, Nautilus, Rell, Alistar, Pyke, Pantheon, or another lane whose first crowd-control chain decides everything.",
    text: "Helm is the anti-burst start. Take it when 150 health and both resists matter more than passive regeneration, especially when physical and magic damage arrive in the same all-in.",
  },
  {
    title: "Doran's Blade",
    image: itemIcons.doranBlade,
    label: "Neutral default",
    enemies:
      "Balanced lanes, uncertain drafts, or matchups where Fiora can trade but cannot guarantee permanent pressure from level 1.",
    text: "Blade is the clean neutral start: health, damage, and omnivamp without committing the entire lane plan to defense or early attack speed.",
  },
  {
    title: "Doran's Bow",
    image: itemIcons.doranBow,
    label: "Owned access",
    enemies:
      "Short-range carries or weak level-1 lanes when Alistar, Blitzcrank, Nautilus, Leona, Rell, Braum, or another reliable partner already gives access.",
    text: "Bow is the pressure start, not the default. Use it only when Fiora can convert attack speed immediately and the missing defensive health will not cost control of the first three waves.",
  },
] as const;

export const buildEnemyReads = [
  {
    label: "Range and poke",
    title: "Protect the Hydra timing",
    enemies:
      "Caitlyn, Ashe, Ezreal, Jhin, Varus, Smolder, Ziggs, Hwei, plus Lux, Xerath, Vel'Koz, Brand, Zyra, or Karma.",
    route:
      "Shield -> Hydra -> Greaves -> Hubris. Maw is the first pivot into double AP; otherwise choose Death's Dance or Sterak from the actual burst profile, then Cyclosword.",
    rule:
      "Do not buy a damage component by sacrificing the HP needed to stay in lane. Hydra sustain and Greaves stacks only matter if Fiora reaches the next wave alive.",
  },
  {
    label: "Physical kill lane",
    title: "Damage comes after the first survival check",
    enemies:
      "Draven, Kalista, Lucian, Tristana, Samira, or Nilah with Leona, Nautilus, Rell, Pyke, Alistar, Pantheon, or Blitzcrank.",
    route:
      "Helm or Blade -> Hydra -> Greaves -> Hubris -> Death's Dance -> Cyclosword. Use Sterak instead when the crowd-control chain and mixed damage are the real threat.",
    rule:
      "Hubris remains second. The adaptation moves to the next slot: parry the decisive control, survive the return burst, then let Cyclosword finish the target before a second rotation.",
  },
  {
    label: "Magic or double AP",
    title: "Maw buys the right to keep attacking",
    enemies:
      "Ziggs, Swain, Seraphine, Hwei, Veigar, Karthus, or magic-heavy carries paired with Brand, Lux, Xerath, Vel'Koz, Zyra, Neeko, or Morgana.",
    route:
      "Shield -> Hydra -> Greaves -> Hubris -> Maw -> Endless Hunger or Shojin -> Cyclosword.",
    rule:
      "The point of Maw is not passive safety. Its shield and combat omnivamp keep Fiora in range long enough for Hydra, Greaves, vitals, and the late Cyclosword rotation to matter.",
  },
  {
    label: "Extended melee brawl",
    title: "PTA changes the fight, not the core",
    enemies:
      "Nilah, Samira, Yasuo, or Swain with Braum, Taric, Tahm Kench, Shen, Poppy, or another durable first target.",
    route:
      "Blade or Helm -> Hydra -> Greaves -> Hubris -> Death's Dance, Maw, or Endless Hunger -> Shojin when repeated rotations matter -> Cyclosword late.",
    rule:
      "PTA is often better here because contact continues after three hits. Hubris is still second; Endless Hunger and Shojin gain value only after the damage type no longer deletes Fiora on entry.",
  },
  {
    label: "Scaling with enchanter",
    title: "Stack before the lane becomes untouchable",
    enemies:
      "Jinx, Kog'Maw, Twitch, Vayne, Zeri, or Aphelios with Lulu, Milio, Janna, Soraka, Nami, Yuumi, or Sona.",
    route:
      "Blade or Bow when access is real -> Hydra -> Greaves -> Hubris -> Endless Hunger -> Cyclosword. Insert Death's Dance, Maw, or Sterak first if their damage already wins the return trade.",
    rule:
      "The lane rewards takedown conversion. Greaves improves every successful sequence, Hubris makes later catches heavier, and Cyclosword prevents a shielded carry from escaping the final burst window.",
  },
  {
    label: "Peel and pick",
    title: "Force one cooldown, then spend the build",
    enemies:
      "Xayah, Kai'Sa, Vayne, or mobile carries with Thresh, Renata, Rakan, Bard, Janna, Poppy, or disengage-heavy supports.",
    route:
      "Shield or Blade -> Hydra -> Greaves -> Hubris -> Sterak or the correct single-resist item -> Cyclosword after the peel cooldown has been drawn.",
    rule:
      "Cyclosword cannot solve inaccessible contact by itself. Use Hydra to control the next wave, make the support spend peel, reset the angle, and use the Energized hit on the second entry.",
  },
] as const;

export const buildAllyReads = [
  {
    label: "Hard engage / catch",
    supports:
      "Alistar, Blitzcrank, Leona, Nautilus, Rell, Thresh, Pyke, Rakan, Pantheon, Morgana, Lux, or Neeko",
    text: "These partners create the shortest and cleanest access windows. Hail is usually preferred, Doran's Bow becomes possible only into a safe level 1, and every successful catch accelerates both Greaves and Hubris. Keep the matchup pivot before Cyclosword unless the lane is completely broken open.",
  },
  {
    label: "Brawler / protection",
    supports:
      "Braum, Taric, Tahm Kench, Shen, Poppy, Galio, or Maokai",
    text: "They extend contact and protect the second half of the fight. PTA gains value into durable lanes, Blade or Helm is usually cleaner than Bow, and Endless Hunger or Shojin can follow the required defensive pivot before Cyclosword.",
  },
  {
    label: "Enchanter / sustain",
    supports:
      "Yuumi, Soraka, Sona, Nami, Milio, Lulu, Janna, Karma, Seraphine, or Senna",
    text: "Their sustain helps Fiora reach Hydra, but access is less guaranteed. Start Shield into heavy poke or Blade in neutral lanes, take Greaves and Hubris on schedule, then buy the item that prevents one enemy rotation from ending contact. Cyclosword is strongest once the ally can protect the re-entry.",
  },
  {
    label: "Mage pressure",
    supports:
      "Brand, Zyra, Xerath, Vel'Koz, Hwei, Heimerdinger, Swain, or Annie",
    text: "Let the support soften the target and control bush before Fiora commits. Blade is the normal start, Bow is reserved for lanes with genuine control, and Hubris stacks quickly when poke becomes a kill. If the ally cannot peel, take the defensive pivot before chasing Cyclosword damage.",
  },
  {
    label: "Roam / variable access",
    supports:
      "Bard, Rakan, Pyke, Shaco, Teemo, or any support leaving lane early",
    text: "Build for the minutes Fiora is actually alone: Shield or Blade, Hydra for wave ownership, Greaves, then Hubris. Do not force a Cyclosword timing while defending 1v2; use the roam's return or an objective fight to collect the takedowns that switch the build back on.",
  },
] as const;

export const buildLateRules = [
  {
    title: "Death's Dance",
    image: itemIcons.dd,
    text: "Buy when physical damage would kill Fiora before the first target falls: fed assassin, Draven/Kalista-style auto pressure, or an AD diver joining the carry. The delayed damage creates time for Grand Challenge, Greaves and Hydra healing to matter, but it does not answer magic burst or a control chain that prevents the takedown. Check the two largest incoming damage sources rather than buying it only because bot lane was physical.",
  },
  {
    title: "Maw of Malmortius",
    image: itemIcons.maw,
    text: "Buy when the spell that ends contact is magic burst: APC plus mage support, a fed AP mid, or a magic jungler arriving on side. The shield and combat omnivamp are valuable only if Fiora can keep attacking after they trigger. If the real stop is a removable root or suppression that leaves her unable to deal damage, solve that control first instead of treating magic resistance as access.",
  },
  {
    title: "Sterak's Gage",
    image: itemIcons.sterak,
    text: "Use when physical and magic damage arrive in the same short control chain and neither Death's Dance nor Maw covers the whole answer. The health and lifeline buy one combined burst cycle, but Sterak does not shorten the control itself. It is strongest when Fiora can Riposte the decisive lock and the shield covers the residual damage while she finishes Grand Challenge.",
  },
  {
    title: "Endless Hunger",
    image: itemIcons.endless,
    text: "Take only after entry already survives. Its AD, tenacity, omnivamp and basic-ability haste reward repeated Q/E cycles against a durable target or short-range composition. Delay it when Fiora is being deleted before the first E finishes, when a single displacement ends contact, or when anti-heal and kiting prevent the extended fight from ever starting.",
  },
  {
    title: "Spear of Shojin",
    image: itemIcons.shojin,
    text: "Choose when a fight reliably reaches a second Q, E and W cycle and Fiora no longer needs the slot to survive first contact. It gains value into frontline-to-backline brawls and side responders who cannot disengage. It loses value when Hail plus Cyclosword must kill a carry inside one support stun or when Fiora still needs a lifeline to reach the second cast.",
  },
  {
    title: "GA / Bloodthirster",
    image: itemIcons.ga,
    secondaryImage: itemIcons.bt,
    text: "Guardian Angel is for a decisive objective entry when allies can occupy the revive location and Fiora's removal or Grand Challenge field already wins first contact; a revive inside five enemies is not protection. Bloodthirster is the alternative when poke or side-wave chip prevents Fiora from arriving at full HP and she can keep hitting safely enough to rebuild the overshield before the next setup.",
  },
] as const;

export const buildExceptionRules = [
  {
    title: "Mercurial Scimitar / QSS tax",
    image: itemIcons.mercurial,
    trigger:
      "One removable control spell is the reason Fiora cannot begin or finish contact: suppression, charm, fear, root, or a long stun whose follow-up is otherwise survivable.",
    decision:
      "Name the exact spell before buying the cleanse. Mercurial is valuable when removing that event restores movement and damage immediately; it is poor insurance into knock-ups, layered non-removable control, or damage that kills Fiora after the cleanse anyway.",
    evidence: ["official", "inference"],
  },
  {
    title: "Serpent's Fang / shield threshold",
    image: itemIcons.serpent,
    trigger:
      "The intended target repeatedly survives the first rotation because several shields overlap, not because Fiora failed to reach them or entered before allied follow-up.",
    decision:
      "Compare the shield holders and their cast timing. Serpent's Fang earns a slot when reducing repeated shielding changes the same target from two rotations to one; it does not replace Cyclosword merely because one enchanter is present.",
    evidence: ["official", "inference"],
  },
  {
    title: "Serylda's Grudge / armor wall",
    image: itemIcons.serylda,
    trigger:
      "The first legal targets have enough armor that lethality no longer produces a short conversion, and Fiora must spend meaningful time on frontline or a side-lane responder.",
    decision:
      "Treat penetration as a target-access decision. Serylda gains value when armored champions are unavoidable and ability slows help preserve contact; it loses priority when Fiora can still bypass them and remove a low-armor carry inside one supported window.",
    evidence: ["official", "inference"],
  },
  {
    title: "Chempunk Chainsword / healing check",
    image: itemIcons.chempunk,
    trigger:
      "Healing during the actual kill window erases enough damage to prevent the first removal, and no allied champion can apply Grievous Wounds reliably to Fiora's target.",
    decision:
      "Do not buy anti-heal from the loading-screen portrait alone. Check who heals, when the heal lands, whether Fiora is hitting that target, and whether another teammate already owns the application before giving up a survival or burst slot.",
    evidence: ["official", "inference"],
  },
  {
    title: "Edge of Night / single-spell entry",
    image: itemIcons.edgeOfNight,
    trigger:
      "One visible spell consistently stops a flank or Q entry before Fiora can allocate Riposte to the more dangerous residual control.",
    decision:
      "The spell shield is useful only when Fiora can control what consumes it. Poke, traps, or multiple ranged spells can strip it before contact; in those games a direct defensive item or a different route is more reliable.",
    evidence: ["official", "inference"],
  },
] as const;

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
    text: "Headbutt-Pulverize fixes a ranged target long enough for Q into Hail-E, and Trample threatens a second control after the knock-up. Fiora should stand inside the distance Alistar can actually follow, then save W for the enemy counter-engage; if Alistar displaces the carry away from Fiora, Q must be held for the landing point rather than the original position.",
    audio: "/voices/blocks/support-alistar.wav",
  },
  {
    name: "Braum",
    role: "Dive + peel",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Braum_0.jpg",
    position: "center 20%",
    size: "h-64",
    text: "Braum creates a two-stage lane: Q or a basic attack applies Concussive Blows, then Fiora's Hail and E reset complete the stun quickly. Do not spend the whole burst before the mark appears. Braum must remain close enough to jump onto Fiora or block the return damage, otherwise the passive proc starts a fight the duo cannot finish.",
    audio: "/voices/blocks/support-braum.wav",
  },
  {
    name: "Yuumi",
    role: "Sustain + scaling",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Yuumi_0.jpg",
    position: "center 28%",
    size: "h-52",
    text: "Yuumi supplies sustain, movement and attached protection after Fiora reaches the target, but she does not independently own bush, thin the wave or fix a target at level 1. Keep the wave on Fiora's half, preserve HP through the first ranged rotations, and treat Yuumi's slow as pursuit after access rather than a substitute for hard engage. Jungle arrival or a spent enemy control spell usually creates the first legal entry.",
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
    description: "Pause before contact and identify wave size, support cast range, the carry's escape and whether Fiora Q is used on the first or second position.",
    focus: "Trigger",
    takeaway: "The useful trigger is the support spell fixing the target or forcing its movement tool. Fiora should arrive on the landing point with W or Flash still available for the enemy support's answer.",
    url: "https://youtu.be/ck-PQSpfRDY",
    embed: "https://www.youtube.com/embed/ck-PQSpfRDY",
  },
  {
    title: "Punish after contact",
    description: "Track which spell keeps the target inside E2 and which allied protection remains after the enemy counter-control begins.",
    focus: "Follow-up",
    takeaway: "After the first touch, support either applies the second control, shields the return burst or blocks the exit line. Recasting damage while Fiora is displaced does not extend the legal window.",
    url: "https://youtu.be/sTytoEHfY9w",
    embed: "https://www.youtube.com/embed/sTytoEHfY9w",
  },
  {
    title: "Angle and spacing",
    description: "Compare the support's body line with Fiora's Q endpoint and the escape route the enemy carry is trying to preserve.",
    focus: "Spacing",
    takeaway: "The support should occupy one side of the wave so the carry cannot retreat from both allied lines at once. Fiora threatens from the other edge and Qs only after the carry commits to an exit.",
    url: "https://youtu.be/4ASFCDwcHco",
    embed: "https://www.youtube.com/embed/4ASFCDwcHco",
  },
  {
    title: "Dive or cleanup",
    description: "Count the next enemy wave, respawn timer, turret aggro order and the component Fiora can complete before deciding whether the play continues.",
    focus: "Reset",
    takeaway: "Crash when the wave reaches tower before the enemy returns; hold when a fast push creates an enemy freeze. A plate is lower value than recalling on Hydra components and returning before the opponent repairs the lane.",
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
    title: "Level 1 / Bush Entry",
    summary:
      "Fiora starts Q and takes the lane bush closest to her tower before the ranged lane can make every last hit visible.",
    points: [
      "Against hook supports, hold the bush edge that gives the projectile its longest travel time. Dodge diagonally with Q; walking straight backward keeps Fiora inside the hook line.",
      "With Hail and Sixth Sense, briefly touch the opposite bush edge at lane start to ping an unseen ward within 900 units, then return to the safer edge before minions settle.",
      "Use bush vision drops between last hits. The goal is not hiding forever; it is forcing the enemy ADC to guess Fiora's spacing instead of preparing a free auto or spell every time she farms.",
    ],
  },
  {
    id: "wave",
    title: "Wave 1-4 / Level Race",
    summary:
      "Decide before the first wave whether Fiora can contest level 2 or must turn the enemy push into a gankable lane.",
    points: [
      "The bot duo reaches level 2 after wave 1 plus the three melee minions of wave 2. When contesting, move forward before the third melee dies so E can become immediate damage instead of a delayed level-up.",
      "When the enemy owns the push, level W, keep the wave outside tower, farm through bush vision drops, and refuse low-value poke. A healthy Fiora under a long lane is far more useful than one Vital and half a health bar.",
      "If the enemy stays extended, ping the jungler during wave 3 and hold through wave 4. A support control ward in tri-bush plus a cleared approach turns that timing from a hopeful ping into a real route.",
    ],
  },
  {
    id: "support",
    title: "First Kill / Support Sync",
    summary:
      "The first kill starts the sustain and Hubris snowball, so Fiora must convert a real support opening completely.",
    points: [
      "When the allied support fixes the correct target, use Flash and the combat summoner if they secure the first kill. Keeping both spells while making a half-entry that cannot finish is not discipline.",
      "Riposte is more than a shield. If Fiora blocks the enemy support's immobilization, aim the thrust toward the enemy ADC so their support's CC becomes the stun that enables the follow-up.",
      "Engage and catch supports create short Hail windows; protective supports extend PTA fights; mage supports must soften the target first. The scanner changes the exact call without changing the lane's need for shared target selection.",
    ],
  },
  {
    id: "matchups",
    title: "Vital / Matchup Discipline",
    summary:
      "A Vital is an option, not an order. Ranged champions punish predictable Q paths harder than Fiora heals from a bad proc.",
    points: [
      "Take a front Vital only when the enemy punish spell is down, the support cannot lock the exit, and the minion wave will not add a larger counter-chunk than the Vital deals.",
      "Q can last-hit, dodge, enter, or leave. Decide its job before casting. Using it only to touch the nearest mark removes Fiora's only repositioning tool and advertises the trade path.",
      "The selected ADC and support profiles identify the exact cooldowns to bait. Once those are spent, the same Vital that was bait one second earlier can become the start of the full all-in.",
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
      "Stand just outside the enemy carry's auto range while remaining one Q from the support's target. Step forward when they last-hit, then stop before Q: this makes the carry choose between conceding the minion, walking into allied control, or spending the spacing spell. Once Net, Arcane Shift, Stand Aside, Volley, or the support's root is used, Q toward the escape side rather than directly at the current model. Spacing is successful when Fiora forces a cooldown without paying HP or Q for it.",
    audio: "/voices/blocks/mechanics-spacing.wav",
  },
  {
    title: "Riposte timing",
    content:
      "Build the control queue before contact: opener, residual lock, lethal damage, exit denial. Against Nautilus, blocking hook does not solve passive root plus ultimate; against Leona, blocking E may still leave point-blank Q and R. Use W on the event that otherwise lets the enemy carry free-hit through the entire control duration, and aim the thrust toward that carry whenever the support's CC can be blocked from one angle and returned along another.",
    audio: "/voices/blocks/mechanics-riposte-timing.wav",
  },
  {
    title: "Burst windows",
    content:
      "A full commit requires three overlaps: allied control reaches the same post-dash target, the enemy's spacing or save spell cannot extend the kill past the first Hail/E cycle, and the minion wave does not out-damage the opening. If only access exists, use Q-auto-E1 as a short punish and retain W or Flash. Spend every combat resource only when the second enemy position and the target's escape destination are already accounted for.",
    audio: "/voices/blocks/mechanics-burst-windows.wav",
  },
  {
    title: "Vital angle",
    content:
      "Do not path directly at a front Vital while both ranged champions are ready to hit the Q endpoint. Walk sideways inside bush vision denial until the mark rotates toward the support-controlled side, or let it reset when the only available proc crosses the enemy wave. During an all-in, choose the next Vital by where it places Fiora after the proc: toward the carry's escape, through Riposte's line, or back toward allied protection. The healing is secondary when the proc removes the exit.",
    audio: "/voices/blocks/mechanics-vital-angle.wav",
  },
];

export type SimpleCard = {
  title: string;
  text: string;
  audio?: string;
};

export type EvidenceSimpleCard = SimpleCard & {
  evidence: EvidenceKind[];
};

export const homeStatCards: SimpleCard[] = [
  {
    title: "Before minions",
    text: "Start Q in the lane bush nearest your tower. Against hooks, hold the outer edge that gives the projectile the longest travel time and preserves a diagonal Q retreat. With Hail, briefly use Sixth Sense to check the opposite edge only if the lane arrival remains safe.",
    audio: "/voices/blocks/home-identity.wav",
  },
  {
    title: "Level 2 decision",
    text: "The ninth minion gives level 2. Move before it dies. Take E when allied control already delivers a target and the enemy lock is spent; take W when the push is contested or one enemy control spell decides the exchange.",
    audio: "/voices/blocks/home-tone.wav",
  },
  {
    title: "First kill conversion",
    text: "Spend Flash and the combat summoner on a real support-led lethal, then crash before recalling when the wave reaches tower in time. The lead compounds through bot quest progress, Greaves stacks, Hydra timing and the later Hubris stack project.",
    audio: "/voices/blocks/home-positioning.wav",
  },
  {
    title: "Author build spine",
    text: "This guide teaches Ravenous Hydra first, Gluttonous Greaves in the boot slot, and Hubris as the second legendary. The next slot answers the first enemy rotation that can end contact; Cyclosword closes damage only when armor, shielding, healing, or removable control does not demand a specialist replacement.",
    audio: "/voices/blocks/home-use.wav",
  },
];

export const homeStatValues = [
  "Q / near bush",
  "E converts / W reverses",
  "Crash, spend, repeat",
  "Hydra / Greaves / Hubris",
] as const;

export const homeFeatureCards: SimpleCard[] = [
  {
    title: "Rune from first contact",
    text: "Use Hail when the carry is reachable for only one short control window. Use PTA when a durable first target remains attached through a second damage cycle. Support class and target durability inform the choice, but neither decides it alone.",
    audio: "/voices/blocks/home-support-first.wav",
  },
  {
    title: "Riposte has a recipient",
    text: "Block the support's decisive CC, but aim W toward the carry when the line is open. Before contact, name the opener, the residual control and the spell that would end Fiora's exit; parrying the loudest animation is not always the winning allocation.",
    audio: "/voices/blocks/home-what-you-get.wav",
  },
  {
    title: "After bot tower",
    text: "Clear mid, disappear toward controlled fog, and preserve a return to the next wave. Side depth increases only when the likely responder, fastest collapse route, allied shadow and objective arrival are all identified.",
    audio: "/voices/blocks/home-fiora-energy.wav",
  },
];

export const whyWorksPoints: SimpleCard[] = [
  {
    title: "Support-created access",
    text: "Fiora replaces marksman range with a support's control line. A hook, knock-up, Braum mark, Nami slow or mage root fixes the target long enough for Q-auto-E to happen before the carry restores spacing. The pairing fails when Fiora Qs beyond the support's second spell or when both champions spend their access on the enemy support while the carry remains untouched.",
    audio: "/voices/blocks/why-surprise-factor.wav",
  },
  {
    title: "Ranged cooldowns become lane terrain",
    text: "Bot carries defend space with one movement, knockback, root or prepared zone. Fiora should force that tool with bush pressure or allied contact, keep Q for the destination, then use the cooldown gap before it returns. This is why Ezreal after Arcane Shift, Caitlyn after Net outside a trap line, or Xayah after feathers and R are different targets from the same champions with their floor state intact.",
    audio: "/voices/blocks/why-duel-pressure.wav",
  },
  {
    title: "Riposte can reverse target roles",
    text: "The support can begin the control while the carry receives the returned W. Blocking Leona E or Nautilus hook is useful; directing Riposte through them into the ADC can turn enemy engage into Fiora's Hail window. The play is only real when minions do not block the line and the allied support can reach the stunned carry before the residual control arrives.",
    audio: "/voices/blocks/why-execution-edge.wav",
  },
  {
    title: "The first kill compounds four systems",
    text: "A first kill advances the bot-role quest, adds a Greaves takedown stack, accelerates Hubris completion and lets Hydra control the next wave. Convert it by crashing before recall, returning on the enemy's lost wave and forcing the next contact while their defensive purchase is incomplete. Chasing a second kill before the crash can throw away more gold and experience than the first kill created.",
    audio: "/voices/blocks/why-snowball-conversion.wav",
  },
];

export const skillOrderCards: EvidenceSimpleCard[] = [
  {
    title: "Level 1 / Q is the site standard",
    text: "Lunge moves between bush edges, dodges the hook line, secures a necessary last hit, or begins a supported all-in. It started 177 of 178 reviewed non-remake games; the single W-start counterexample keeps this a documented standard rather than a claim that no exceptional level-1 event can exist.",
    evidence: ["official", "observed", "author"],
  },
  {
    title: "Level 2 / E for pressure",
    text: "Take Bladework after wave 1 plus the three melee minions of wave 2 only when Fiora levels first, allied control already delivers a target, and the enemy duo cannot answer with decisive layered control. Move before the ninth minion dies, then use the attack reset, slow, and second-hit crit while the support remains connected. This was the level-2 choice in 13 of 178 reviewed games.",
    evidence: ["official", "observed", "author", "inference"],
  },
  {
    title: "Level 2 / W for safety",
    text: "Take Riposte when the level race is even or lost, when hook, root, stun, knock-up or point-click control decides the exchange, or when E damage would tempt Fiora into an unsupported chase. W was taken second in 164 of 178 reviewed games. Block the event that protects the full enemy rotation and aim through the support toward the carry when the line is clear.",
    evidence: ["official", "observed", "inference"],
  },
  {
    title: "Level 3 / complete the kit",
    text: "Take the missing E or W. If the lane was conceded, wave 3 into wave 4 is the natural jungle call: keep the wave outside tower, preserve bush control, clear tri-bush vision, and make the enemy duo walk into the gank.",
    evidence: ["observed", "author", "inference"],
  },
];

export const skillLevelSequence = [
  "Q",
  "W",
  "E",
  "Q",
  "Q",
  "R",
  "Q",
  "E",
  "Q",
  "E",
  "R",
  "E",
  "E",
  "W",
  "W",
  "R",
  "W",
  "W",
] as const;

export const skillProgressionSections = [
  {
    levels: "4-9",
    title: "Max Q while lane access is still being negotiated",
    text: "Put points into Q at levels 4, 5, 7 and 9, with Grand Challenge at 6. Ranking Lunge reduces its base cooldown from 13 to 6 seconds by rank five, so last-hitting, dodging and re-entering stop competing for one long cooldown. The gain is not permission to Q first: missing the target or spending Q beyond support range still removes the reduced cooldown through bad geometry.",
    evidence: ["official", "observed", "inference"],
  },
  {
    levels: "10-13",
    title: "Max E second for the rotation after access",
    text: "Take E at 10, Grand Challenge at 11, then finish E at 12 and 13. Once Hydra controls the wave and Q has reached its shortest base cooldown, extra Bladework ranks improve the repeated auto-reset cycle that follows a catch, Riposte stun, or side-lane connection. E remains conversion damage; it cannot repair a target that Fiora and support cannot both reach.",
    evidence: ["official", "observed", "inference"],
  },
  {
    levels: "14-18",
    title: "Finish W after the damage pattern is established",
    text: "Put the remaining points into W at 14, 15, 17 and 18, with Grand Challenge at 16. Later Riposte ranks improve how often Fiora can answer control across repeated fights, but W still has to be assigned before entry: opener, residual lock, carry damage, or exit denial. More ranks do not make the first visible spell the correct parry.",
    evidence: ["official", "observed", "inference"],
  },
] as const;

const summonerIcon = (name: string) =>
  `https://ddragon.leagueoflegends.com/cdn/16.15.1/img/spell/${name}.png`;

export const summonerSpellPlans = [
  {
    title: "Flash + Barrier",
    count: "74 / 178",
    images: [summonerIcon("SummonerFlash"), summonerIcon("SummonerBarrier")],
    purpose:
      "Barrier buys the fraction of a second needed for Riposte, support protection, a Vital or Grand Challenge healing to enter the fight after front-loaded damage.",
    choose:
      "Use it when the first enemy answer is damage that arrives predictably while Fiora can still cast. It loses value into repeated poke, long chase damage, or a control chain that prevents Barrier before the lethal portion lands.",
    evidence: ["official", "observed", "inference"],
  },
  {
    title: "Flash + Ignite",
    count: "35 / 178",
    images: [summonerIcon("SummonerFlash"), summonerIcon("SummonerDot")],
    purpose:
      "Ignite converts a support-created lethal before healing, disengage or the enemy's second rotation can stabilize the target.",
    choose:
      "Take it when the duo can actually reach the intended target and its damage changes the kill threshold. Do not use Ignite to justify an entry through untouched control or a wave that already makes the trade losing.",
    evidence: ["official", "observed", "author", "inference"],
  },
  {
    title: "Flash + Ghost",
    count: "64 / 178",
    images: [summonerIcon("SummonerFlash"), summonerIcon("SummonerHaste")],
    purpose:
      "Ghost extends approach, pursuit, Vital access and post-burst repositioning when one Q cannot solve the whole distance.",
    choose:
      "The observed games are concentrated in one specialist mobility system, so this is documented rather than declared the default. It gains value in long lanes and later fights, but does little against point-blank burst or control that must be survived before movement matters.",
    evidence: ["official", "observed", "inference"],
  },
  {
    title: "Flash + Exhaust",
    count: "4 / 178",
    images: [summonerIcon("SummonerFlash"), summonerIcon("SummonerExhaust")],
    purpose:
      "Exhaust cuts the damage and chase of the champion who would otherwise win the committed 2v2 or the first extended contact.",
    choose:
      "Use it for a named damage pattern, not as generic safety. It can protect Fiora or the allied support from a Draven, Samira, Nilah or diver, but the four observed games are evidence of use rather than a broad matchup rule.",
    evidence: ["official", "observed", "inference"],
  },
  {
    title: "Flash + Cleanse",
    count: "1 / 178",
    images: [summonerIcon("SummonerFlash"), summonerIcon("SummonerBoost")],
    purpose:
      "Cleanse removes one decisive removable control event so Fiora can immediately move, Riposte the next layer, or finish the target.",
    choose:
      "Name the exact spell and its follow-up first. Cleanse does not answer knock-ups or suppression, and one observed game is a useful counterexample rather than enough evidence for a general recommendation.",
    evidence: ["official", "observed", "inference"],
  },
] as const;

export const summonerDecisionRules = [
  {
    label: "Flash job",
    text: "Choose before contact whether Flash reaches the post-dash target, changes the W line, completes the last Vital, or exits after the kill. A plan that needs Flash for two of those jobs is missing a resource.",
  },
  {
    label: "Enemy answer",
    text: "Barrier answers castable burst, Ignite changes a healing or damage threshold, Ghost changes distance, Exhaust changes one damage dealer, and Cleanse changes removable control. Select the event, then the spell.",
  },
  {
    label: "Wave and support",
    text: "An aggressive summoner is valuable only when support follow-up reaches the same target and the wave permits a chase. Defensive summoners cannot make unsupported first contact coherent either.",
  },
] as const;

export const supportPrinciples: SimpleCard[] = [
  {
    title: "Engage / hook",
    text: "The support's first spell should either pull the carry toward Fiora or hold them through Q-auto-E. Fiora waits for the landing point instead of dashing on the cast animation. If the enemy movement spell is still ready, use the first catch to force it and keep Q for the repeat; a hook on the tank is not automatically the lane's target.",
    audio: "/voices/blocks/support-principle-engage-hook.wav",
  },
  {
    title: "Hydra timing",
    text: "Hydra lets Fiora clear a damaged wave quickly, heal from the next one and disappear before the enemy support rebuilds vision. The support should use that hidden interval to sweep the next contact angle, not begin a fight while Fiora is still collecting. Avoid auto-pushing when a freeze near Fiora's tower is the only thing shortening the ranged approach.",
    audio: "/voices/blocks/support-principle-hydra-timing.wav",
  },
  {
    title: "Protective supports",
    text: "An enchanter or warden does not need to imitate Leona. Hold the wave on Fiora's side, use speed or shield when the enemy commits a spacing spell, and preserve the second protection for Fiora's exit. The first legal all-in often appears after a missed enemy control spell or jungle arrival; using every shield merely to absorb poke leaves no tool for that window.",
    audio: "/voices/blocks/support-principle-protective-supports.wav",
  },
];

export const midLateCards: SimpleCard[] = [
  {
    title: "Clear, disappear, preserve two exits",
    text: "Hydra should reduce Fiora's visible time mid. After the clear, hold a junction that can still return for the next wave or move into the controlled side. Commit only after the enemy reveal selects the better line; walking directly from mid into river removes the uncertainty before it creates pressure.",
    audio: "/voices/blocks/mid-late-pick-one-plan.wav",
  },
  {
    title: "Enter on the attention shift",
    text: "Wait until enemy peel faces or moves toward allied first contact, then use the shortest side angle that reaches the same target as support follow-up. Track the residual control and carry escape after the opener; the first CC being spent is not enough when another spell still covers Fiora's landing square.",
    audio: "/voices/blocks/mid-late-entry-timing.wav",
  },
  {
    title: "Re-read after the first removal",
    text: "Check Hubris duration, Grand Challenge healing, Q/W, current HP, objective health and enemy respawn route. Continue only if the next target dies before peel returns; otherwise use the temporary buffs to secure the objective, take the nearest structure threshold or reset before shutdown gold is exposed.",
    audio: "/voices/blocks/mid-late-conversion.wav",
  },
];

export type RunePage = {
  key: "hob" | "pta";
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
    key: "hob",
    title: "HAIL OF BLADES / DEFAULT",
    image: "/hail-of-blades-page.png",
    fallback: "/hail-of-blades-page.png",
    bullets: [
      {
        label: "Take it when:",
        text: "allied control reaches the carry directly and most of Fiora's first rotation must land before its dash, knockback, shield, Exhaust, or the enemy support's second spell restores distance.",
      },
      {
        label: "Why it fits:",
        text: "Hail compresses auto-E1-auto-E2 into the support-created window. The attack reset lets Fiora front-load damage without waiting for normal attack cadence, so Q can be assigned to angle or pursuit instead of spending the whole CC duration merely reaching the third hit.",
      },
      {
        label: "Page:",
        text: "Sudden Impact sharpens the post-Q physical rotation; Sixth Sense detects the early bush ward and later vision without requiring Fiora to face-check; Treasure Hunter accelerates the Hydra-Hubris project. Biscuits protect the HP threshold and Jack rewards the mixed-stat route, though its 5/10-stat adaptive rewards were reduced on 26.15.",
      },
      {
        label: "Mini:",
        text: "Attack Speed, Adaptive, scaling HP. Replace scaling HP with immediate HP when Draven, Kalista, Lucian, an engage support, or double early damage can force contact before the shard has time to scale.",
      },
      {
        label: "Change the call when:",
        text: "the enemy support is consistently the only reachable first target, the carry's escape cannot be forced cheaply, and allied protection keeps Fiora attached through a second Q/E cycle. A squishy ADC behind layered peel is not automatically a Hail lane.",
      },
    ],
  },
  {
    key: "pta",
    title: "PRESS THE ATTACK / EXTENDED",
    image: "/pta-page.png",
    fallback: "/pta-page.png",
    bullets: [
      {
        label: "Take it when:",
        text: "the first legal target survives Hail's burst and Fiora can remain attached after the third hit through a short lane, retained Q/E slow, Braum-style mark, Taric/Tahm protection, or enemy commitment into allied space.",
      },
      {
        label: "Why it fits:",
        text: "Fiora procs PTA quickly with autos and Bladework, then carries the amplification into the next ability and Vital cycle. The value appears only if contact continues; proccing PTA as the target dashes out is weaker than Hail converting the same short window.",
      },
      {
        label: "Page:",
        text: "Triumph supports the second target after a takedown, Alacrity improves repeated contact, and Last Stand rewards the low-health brawl Fiora often accepts. Biscuits stabilize lane and Jack of All Trades rewards the mixed-stat build, with the lower 26.15 adaptive values already priced in.",
      },
      {
        label: "Mini:",
        text: "Adaptive, Adaptive, scaling HP. Immediate HP is preferable when enemy engage or front-loaded carry damage can decide waves one and two before the extended-fight page has time to pay off.",
      },
      {
        label: "Change the call when:",
        text: "allied catch repeatedly fixes the carry for only one short burst, or the enemy tank is merely standing in front but does not need to be hit first. PTA is a contact forecast, not a vote for fighting the closest durable champion.",
      },
    ],
  },
];

export const runeMatchupRules = [
  {
    key: "hob",
    eyebrow: "Short access",
    title: "Make the first two seconds count",
    text: "Default into ranged, mobile, fragile, poke, or disengage lanes. Once Fiora reaches the target, Hail converts the brief opening before a dash, shield, knockback, or support rotation.",
    examples:
      "Caitlyn, Ezreal, Jinx, Varus, Vayne, Zeri, Ziggs, Xerath, Lux, Brand, Sona",
    support:
      "Best with catch and engage: Blitzcrank, Nautilus, Leona, Rell, Thresh, Pyke, Rakan, Morgana, Lux, Neeko, Pantheon, and Braum.",
  },
  {
    key: "pta",
    eyebrow: "Long contact",
    title: "Keep value after the first rotation",
    text: "Use PTA when Fiora can stay attached, must hit a durable first target, or expects a longer brawl. It trades immediate speed for damage that remains useful after the third hit.",
    examples:
      "Nilah, Samira, Yasuo, Swain, double-melee lanes, or a tank support that must be crossed first",
    support:
      "Best with endurance and protection: Taric, Tahm Kench, Shen, Soraka, Sona, or Yuumi. Hybrid enchanters depend on whether they create access or extend the fight.",
  },
] as const;

export const runeDecisionChecks = [
  {
    label: "First target",
    text: "Prefer Hail when allied control reaches the carry and the first three attacks must land before a dash, shield or knockback. PTA gains value when the support is the only legal first target and Fiora can remain attached after the proc; target durability alone does not decide it.",
  },
  {
    label: "Contact window",
    text: "Estimate the usable window after enemy answers, not the raw CC duration. Hail fits a short conversion before peel resets. PTA needs an exit-safe second cycle: enough lane length, retained Q/E slow, allied protection and no untouched disengage spell.",
  },
  {
    label: "Ally support",
    text: "Hard catch usually compresses damage toward Hail, while Braum, Taric or sustained protection can support PTA. But an enchanter that accelerates Fiora onto a fragile carry can still favor Hail, and a tank engage that only reaches the enemy tank can still favor PTA.",
  },
] as const;

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
    description: "Freeze before the engage and mark the support's first control, the carry's movement spell, Fiora's Q endpoint and the resource saved for exit.",
    note: "The clip is useful only if it begins early enough to show the wave and the cooldown that made contact legal.",
    audio: "/voices/blocks/videos-entry-clip.wav",
  },
  {
    title: "Spacing clip",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_5.jpg",
    position: "center 24%",
    label: "Look for",
    description: "Watch Fiora stand one Q outside the carry, step on the last-hit timing, and force the spacing spell before committing to its destination.",
    note: "Compare the unused Q threat with the actual cast. The enemy movement before Q often creates more value than the dash itself.",
    audio: "/voices/blocks/videos-spacing-clip.wav",
  },
  {
    title: "Cleanup clip",
    image:
      "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_7.jpg",
    position: "center 25%",
    label: "Look for",
    description: "After the kill, count minions, death timers, Hubris duration, Grand Challenge healing and the nearest completed purchase before following the next target.",
    note: "Label the stop condition. A clean clip can end with a crash and recall when chasing would lose the wave or expose the shutdown.",
    audio: "/voices/blocks/videos-cleanup-clip.wav",
  },
];
