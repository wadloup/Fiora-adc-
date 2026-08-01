import rawChampionData from "../research/champion-kits-26.15.json";

export type ThreatId =
  | "forced-control"
  | "displacement"
  | "anti-dash"
  | "death-denial"
  | "damage-denial"
  | "zone-control"
  | "rapid-collapse"
  | "side-response"
  | "artillery"
  | "carry-self-peel"
  | "support-enabler";

export type ChampionSpell = {
  id: string;
  name: string;
  description: string;
  cooldownBurn: string;
  costBurn: string;
  rangeBurn: string;
};

export type ChampionKit = {
  id: string;
  key: string;
  name: string;
  title: string;
  tags: string[];
  partype: string;
  passive: {
    name: string;
    description: string;
  };
  spells: ChampionSpell[];
};

type ChampionDataset = {
  patch: string;
  dataDragon: string;
  source: string;
  championCount: number;
  champions: ChampionKit[];
};

const championDataset = rawChampionData as ChampionDataset;

export const MID_LATE_PATCH = {
  patch: championDataset.patch,
  dataDragon: championDataset.dataDragon,
  reviewedAt: "2026-07-31",
  championCount: championDataset.championCount,
} as const;

export const championKits = [...championDataset.champions].sort((a, b) =>
  a.name.localeCompare(b.name)
);

export function championIcon(champion: Pick<ChampionKit, "id">) {
  return `https://ddragon.leagueoflegends.com/cdn/${MID_LATE_PATCH.dataDragon}/img/champion/${champion.id}.png`;
}

export function cleanKitText(text: string) {
  return text
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const threatDefinitions: Record<
  ThreatId,
  {
    label: string;
    shortLabel: string;
    accent: "red" | "cyan" | "amber" | "violet" | "emerald";
    weight: number;
    effect: string;
    response: string;
  }
> = {
  "forced-control": {
    label: "Forced control",
    shortLabel: "Forced CC",
    accent: "red",
    weight: 3,
    effect:
      "Point-click or reliable control removes the sidestep option and often exists to expose Fiora to the spell behind it. Malzahar R into follow-up damage and Nautilus R into passive root are not one-spell problems.",
    response:
      "Before entering, name the forced spell, the damaging or controlling spell that follows it, and the champion Fiora wants to hit with W. If W only answers the opener and no ally can interrupt the residual chain, wait for that opener to be spent on someone else.",
  },
  displacement: {
    label: "Displacement",
    shortLabel: "Displace",
    accent: "amber",
    weight: 2,
    effect:
      "A displacement can move Fiora outside support range, place her behind a wall, or send the target away after Q has already been spent. Its direction often matters more than its crowd-control duration.",
    response:
      "Mark the landing point before committing. Approach diagonally so the knockback does not send Fiora through the enemy formation, and keep Q or Flash for the post-displacement position when the spell cannot be baited first.",
  },
  "anti-dash": {
    label: "Anti-dash / route denial",
    shortLabel: "Route denial",
    accent: "violet",
    weight: 3,
    effect:
      "Grounding, anti-dash fields, walls and prepared zones can make the obvious Q endpoint illegal even when the target is in range. Walking to the same endpoint usually exposes Fiora to the rest of the control chain.",
    response:
      "Show the threat from one angle until the denial zone is placed, then rotate to its edge or delay the entry. Against persistent terrain, preserve Flash for the final crossing instead of spending it before the route is known.",
  },
  "death-denial": {
    label: "Death denial",
    shortLabel: "Death denial",
    accent: "emerald",
    weight: 3,
    effect:
      "Invulnerability, untargetability, rescue and revive effects stretch a two-second Hail conversion into a second enemy cooldown cycle. Grand Challenge can remain incomplete while Fiora is already surrounded.",
    response:
      "Force the save with allied engage or a short Q-E contact before committing R. If the save holder steps outside protection range, switch onto that champion; otherwise reserve the exit tool for the moment the original target becomes targetable again.",
  },
  "damage-denial": {
    label: "Damage denial",
    shortLabel: "Damage denial",
    accent: "cyan",
    weight: 2,
    effect:
      "Blind, evasion, spell shield and untargetability can consume the exact Hail attacks or allied control that make the entry lethal. Reaching the target is not the same as owning a damage window.",
    response:
      "Draw the denial with the cheapest resource available, usually allied poke, one Q-auto, or visible engage pressure. Start the full auto-E sequence only after the effect ends, and keep W for the counter-control rather than using it to wait out untargetability.",
  },
  "zone-control": {
    label: "Persistent zone",
    shortLabel: "Zone",
    accent: "violet",
    weight: 2,
    effect:
      "Cages, minefields, feathers, turrets and persistent damage can cover both Q's landing square and the retreat corridor. W blocks one event, but it does not remove the floor state.",
    response:
      "Inspect the ground before the champion. Force the zone before the objective starts, approach from fog on a second edge, or hold side pressure until the enemy formation leaves it. Entering through the prepared center is reserved for a guaranteed immediate kill plus extraction.",
  },
  "rapid-collapse": {
    label: "Rapid collapse",
    shortLabel: "Collapse",
    accent: "red",
    weight: 3,
    effect:
      "Globals, camouflage, wall crossing and extreme speed can beat the reaction time provided by a normal river ward. A recalled champion can also return to side faster through post-14-minute Homeguard.",
    response:
      "Track the actual arrival mechanic: channel cooldown for globals, last visible wall for terrain crossing, reveal radius for camouflage, and recall time for Homeguard. Lower side depth until the earliest arrival still leaves time to exit down lane.",
  },
  "side-response": {
    label: "Side responder",
    shortLabel: "Side response",
    accent: "amber",
    weight: 2,
    effect:
      "A side responder can win the duel, erase the wave without interacting, contain tower access, or deliberately waste Fiora's time before rejoining with Teleport or a global.",
    response:
      "Compare levels, completed items, wave-clear time, escape, Teleport and the spell W must answer. Push only until that champion shows, then choose duel, rotation or reset from what the allied four can gain during the response.",
  },
  artillery: {
    label: "Long-range compression",
    shortLabel: "Artillery",
    accent: "cyan",
    weight: 2,
    effect:
      "Artillery can remove Fiora's HP, W or flank secrecy before the engage begins. Walking through two poke rotations can make a mechanically clean backline entry non-lethal.",
    response:
      "Do not share a line with the wave or frontline. Enter the setup through swept fog, threaten Q-Flash from a side pocket, and reset the angle after taking meaningful poke instead of forcing with too little health to finish the carry.",
  },
  "carry-self-peel": {
    label: "Carry self-peel",
    shortLabel: "Self-peel",
    accent: "cyan",
    weight: 2,
    effect:
      "The carry can dash, knock back, become untargetable or prepare damage on Fiora's retreat without help from the support. The first position is often bait for the second.",
    response:
      "Force the escape with support control or one cheap contact, then aim Q at the destination rather than the current model. If Fiora must spend Q and Flash before the escape, change target or wait for a closer angle.",
  },
  "support-enabler": {
    label: "Support amplifier",
    shortLabel: "Ally value",
    accent: "emerald",
    weight: -1,
    effect:
      "As an ally, this champion can fix the target, accelerate Fiora, protect the damage cycle or provide an exit. Those jobs use different positioning and cannot be assumed from the support class alone.",
    response:
      "Name the exact enabling spell and its cast range before choosing the route. Fiora should not Q beyond the support's follow-up line, and the support should preserve the protection spell if its engage does not also provide extraction.",
  },
};

const threatMembers: Record<ThreatId, string[]> = {
  "forced-control": [
    "Alistar", "Ambessa", "Amumu", "Annie", "Blitzcrank", "Camille", "Galio",
    "Jarvan IV", "Leona", "Lissandra", "Malzahar", "Maokai", "Mordekaiser",
    "Nautilus", "Neeko", "Pantheon", "Poppy", "Rakan", "Rammus", "Rell",
    "Renekton", "Sejuani", "Skarner", "Syndra", "Tahm Kench", "Twisted Fate",
    "Vi", "Warwick", "Zaahen",
  ],
  displacement: [
    "Alistar", "Azir", "Blitzcrank", "Draven", "Gragas", "Hwei", "Jarvan IV",
    "Janna", "Lee Sin", "Milio", "Nautilus", "Orianna", "Poppy", "Renata Glasc",
    "Rell", "Sett", "Skarner", "Syndra", "Taliyah", "Thresh", "Tristana",
    "Trundle", "Vayne", "Xin Zhao", "Zac", "Zaahen",
  ],
  "anti-dash": [
    "Anivia", "Aurelion Sol", "Cassiopeia", "Poppy", "Singed", "Taliyah",
    "Trundle", "Veigar", "Vex", "Viktor",
  ],
  "death-denial": [
    "Bard", "Ekko", "Elise", "Fizz", "Gwen", "Kalista", "Kayle", "Kindred",
    "Lissandra", "Renata Glasc", "Shaco", "Tahm Kench", "Taric", "Tryndamere",
    "Vladimir", "Xayah", "Zaahen", "Zilean",
  ],
  "damage-denial": [
    "Akali", "Akshan", "Bard", "Fizz", "Graves", "Gwen", "Jax", "Mel", "Morgana",
    "Nilah", "Nocturne", "Pantheon", "Quinn", "Shen", "Sivir", "Teemo", "Xayah",
  ],
  "zone-control": [
    "Anivia", "Aurelion Sol", "Azir", "Cassiopeia", "Fiddlesticks", "Heimerdinger",
    "Hwei", "Karthus", "Kennen", "Orianna", "Rumble", "Shaco", "Singed", "Taliyah",
    "Teemo", "Veigar", "Viktor", "Ziggs", "Zyra",
  ],
  "rapid-collapse": [
    "Akali", "Akshan", "Ambessa", "Bard", "Briar", "Diana", "Ekko", "Evelynn",
    "Fizz", "Galio", "Hecarim", "Kassadin", "Katarina", "Kayn", "Kha'Zix", "Kled",
    "LeBlanc", "Locke", "Naafiri", "Nocturne", "Nunu & Willump", "Pantheon", "Qiyana",
    "Quinn", "Rammus", "Rek'Sai", "Rengar", "Ryze", "Shaco", "Shen", "Sion", "Talon",
    "Taliyah", "Twisted Fate", "Twitch", "Warwick", "Yone", "Zac", "Zed",
  ],
  "side-response": [
    "Aatrox", "Akali", "Ambessa", "Bel'Veth", "Camille", "Darius", "Dr. Mundo",
    "Fiora", "Gangplank", "Garen", "Gnar", "Gwen", "Illaoi", "Irelia", "Jax", "K'Sante",
    "Master Yi", "Mordekaiser", "Nasus", "Olaf", "Quinn", "Renekton", "Riven", "Sett",
    "Shen", "Singed", "Sylas", "Trundle", "Tryndamere", "Udyr", "Urgot", "Vayne",
    "Viego", "Volibear", "Warwick", "Yasuo", "Yone", "Yorick", "Zaahen",
  ],
  artillery: [
    "Corki", "Ezreal", "Hwei", "Jayce", "Jhin", "Lux", "Mel", "Nidalee", "Senna",
    "Varus", "Vel'Koz", "Xerath", "Ziggs", "Zoe",
  ],
  "carry-self-peel": [
    "Aphelios", "Caitlyn", "Corki", "Draven", "Ezreal", "Jhin", "Kai'Sa", "Kalista",
    "Lucian", "Nilah", "Quinn", "Samira", "Sivir", "Smolder", "Tristana", "Vayne",
    "Xayah", "Yunara", "Zeri", "Ziggs",
  ],
  "support-enabler": [
    "Alistar", "Bard", "Blitzcrank", "Braum", "Ivern", "Janna", "Karma", "Leona", "Lulu",
    "Maokai", "Milio", "Nami", "Nautilus", "Poppy", "Pyke", "Rakan", "Rell", "Renata Glasc",
    "Senna", "Seraphine", "Shen", "Sona", "Soraka", "Tahm Kench", "Taric", "Thresh", "Yuumi",
    "Zilean",
  ],
};

const threatSets = Object.fromEntries(
  Object.entries(threatMembers).map(([id, names]) => [id, new Set(names)])
) as Record<ThreatId, Set<string>>;

export function getChampionThreats(champion: Pick<ChampionKit, "name">) {
  return (Object.keys(threatDefinitions) as ThreatId[]).filter((id) =>
    threatSets[id].has(champion.name)
  );
}

export const advantageAxes = [
  {
    id: "economy",
    label: "Economy",
    inspect: "Compare completed items and combat-ready components against the likely responder, then add Hubris stacks, bot-quest completion and unspent gold. Do not use total team gold as a duel read.",
    decision: "Cross the responder line only when the advantage is already in inventory. If Fiora is holding a full component or legendary completion, clear the shallow wave and recall before converting the lead into side depth.",
    reversal: "The call changes when the responder completes armor, a lifeline, anti-heal or a full item on the next recall; the scoreboard can remain unchanged while the duel flips.",
  },
  {
    id: "experience",
    label: "Levels",
    inspect: "Compare Fiora directly with the champion who will answer side. Record rank-two ultimate, level-11/16 passives, top-role quest reward and whether the next wave gives either player a level during contact.",
    decision: "A one-level deficit can still allow wave pressure when the responder only clears; it sharply lowers permission to chase them down a long lane. Use the wave to force their reveal, then rotate before the level gap becomes an extended duel.",
    reversal: "A level gained from the approaching wave can change spell rank, base stats and ultimate access mid-play. Re-read before the all-in rather than after the level-up animation appears.",
  },
  {
    id: "tempo",
    label: "Tempo",
    inspect: "Track which wave has been cleared, the next wave's arrival, recall completion and the shortest route to the objective. Tempo is measured in actions available before losing income, not movement speed alone.",
    decision: "After Hydra clear, spend the hidden interval on one job: ward escort, side probe, reset or second-wave pocket. Return before the next central wave unless the action produces more than the lost wave and plate pressure.",
    reversal: "If an enemy fast-clears mid first or your side wave crashes into an allied tower, the available hidden interval disappears even when Fiora is stronger in combat.",
  },
  {
    id: "information",
    label: "Information",
    inspect: "Name the fastest champion who can reach Fiora, their last timestamp, recall state and arrival method. A river ward is relevant only if that champion must cross its vision early enough to permit an exit.",
    decision: "When the fastest route is unknown, stop before river and use the next wave to force the responder or collapse champion to show. Advance after a named threat appears elsewhere, not because the ward saw nothing.",
    reversal: "A global cooldown returning, a camouflage champion leaving reveal range, a wall-crosser disappearing or a recent recall invalidates negative information immediately.",
  },
  {
    id: "cooldowns",
    label: "Cooldowns",
    inspect: "Build a short queue: Fiora Q/W/R/Flash, allied engage and protection, enemy first control, residual control, carry escape, Exhaust and death denial. Count the order, not just how many icons are grey.",
    decision: "Enter when the resource that grants access and the resource that survives the answer are both available. If W must block the opener and Flash must reach the carry, identify what replaces Fiora's exit before committing.",
    reversal: "One cooldown can reverse the call: Xayah R, Janna R, Lulu W, Tahm Kench R, Exhaust or the enemy carry's movement spell returning can extend the kill beyond Hail and Hubris burst.",
  },
  {
    id: "structure",
    label: "Structure",
    inspect: "Read turret health, Overgrowth progress, wave size, enemy clear time and which jungle exit opens after the structure falls. Separate one charged hit, a guaranteed plate and a full turret commitment.",
    decision: "Take the smallest guaranteed structure reward, then leave on the same timer that produced it. A single Overgrowth hit can complete the objective of the side trip without staying for the next wave.",
    reversal: "If the turret falls and removes the lane wall protecting Fiora's retreat, the map can become less safe after the reward. Re-route before the responder and Homeguard arrivals close the new jungle entrance.",
  },
  {
    id: "liability",
    label: "Failure cost",
    inspect: "List the exact losses attached to Fiora's death: shutdown gold, Baron or Dragon damage during the death timer, an exposed mid wave, allied carry protection and whether Fiora is the only reliable structure damage.",
    decision: "With a large shutdown, require two protections before D2 or deeper: the fastest collapse threat is continuously tracked and the allied four can disengage or convert the responder. Spend unspent gold before testing a close side duel.",
    reversal: "After the objective is secured, shutdown is spent, allies reset or a second carry reaches an item, the same side death costs something different. Recalculate the permission instead of permanently switching to passive play.",
  },
] as const;

export const midPressureCycle = [
  {
    step: "01",
    label: "Arrive",
    text: "Choose the river side before touching the wave. It should contain the allied ward or body that can answer the fastest missing threat; after 14:00, include recently recalled enemies because Homeguard can beat an old side-lane timing.",
  },
  {
    step: "02",
    label: "Collect",
    text: "Use Hydra to shorten the time Fiora is visible, but do not auto-clear by habit. Fast clear creates a roam interval, a slow clear holds an enemy in lane, and abandoning three ranged minions is correct when the missing engage already owns the next route.",
  },
  {
    step: "03",
    label: "Disappear",
    text: "Leave vision toward the controlled side and pause before committing. If the enemy carry backs away, support checks the bush, or the responder leaves side, the disappearance already created value; Fiora can return mid without donating the next wave.",
  },
  {
    step: "04",
    label: "Threaten",
    text: "Hold a junction that keeps at least two exits open. From there, escort one ward, intercept the revealed responder, catch an isolated carry, or reset. Walking all the way into river before any target shows removes the uncertainty that was pressuring them.",
  },
  {
    step: "05",
    label: "Re-enter",
    text: "Reappear on the wave or fight that arrives first. If the roam found no target, returning before the next melee minions meet keeps the action cheap; missing a full wave or delaying a completed item is part of the play's cost even when nobody died.",
  },
] as const;

export const sideDepths = [
  {
    depth: 0,
    label: "Collect",
    location: "Allied structure",
    text: "Last-hit the incoming wave near allied structure and keep HP for the next action. Use this depth when the fastest collapse route is unknown, W is down, or the responder can force an extended duel Fiora cannot finish.",
    exit: "Leave through tower or allied jungle as soon as the wave is secured; do not follow the next wave merely because no enemy appeared.",
  },
  {
    depth: 1,
    label: "Probe",
    location: "Before river",
    text: "Thin or crash before river to make the defender show, create a bounce, or buy a recall. Keep Q for retreat unless the support or jungler is already close enough to convert contact.",
    exit: "Leave when the defender clears out of vision, the central wave is lost, or the objective enters commitment; the probe succeeded once it forced information.",
  },
  {
    depth: 2,
    label: "Pull",
    location: "Beyond river",
    text: "Cross river to force a named responder. Compare their clear speed, level, completed item, Teleport and W demand before choosing between a short duel, turret touch, immediate rotation or bait into the allied shadow.",
    exit: "Move into the assigned shadow pocket before a second enemy leaves vision. If the ally cannot affect the arriving champion, retreat down lane instead of through jungle fog.",
  },
  {
    depth: 3,
    label: "Commit",
    location: "Inner / inhibitor",
    text: "Hit inner or inhibitor structure only after the responder is beaten or unable to clear, the second arrival is timestamped, and the allied four can trade the bodies sent side. Name the exact structure threshold before staying.",
    exit: "Pre-plan whether the play ends by down-lane retreat, a swept flank toward the objective, or a cross-map finish. If none is available, D3 is not supported.",
  },
] as const;

export const shadowTypes = [
  {
    id: "vision",
    label: "Vision shadow",
    text: "Sweeps the lane-jungle junction or activates the Faelight region before Fiora crosses river, then stays off the same vision line so the enemy cannot see both the side push and the warding body.",
    check: "It buys a timestamp, not combat protection. Fiora must leave when the threat appears; vision alone cannot stop the arrival.",
  },
  {
    id: "protect",
    label: "Protective shadow",
    text: "Occupies the earliest collapse corridor with a spell that interrupts, shields, speeds or removes Fiora from contact. The ally should remain hidden until the arriving enemy commits beyond an easy retreat.",
    check: "Verify cast range and targetability: a Thresh lantern needs a clear click, Tahm Kench needs Devour range, and a shield does not stop displacement by itself.",
  },
  {
    id: "counter",
    label: "Counter-engage",
    text: "Allows the first enemy to cross the lane-jungle junction, then controls them while Fiora turns from the wave. The goal is to make the collapse champion the isolated target rather than merely scare them away.",
    check: "Fiora must still survive the opener. If the enemy control kills or displaces her before the ally can cast, the hiding position is too far or the bait is too deep.",
  },
  {
    id: "pick",
    label: "Pick shadow",
    text: "Uses Fiora's visible isolation to draw the named responder into allied control. Push only enough to make that champion walk through the prepared pocket; hitting tower can warn them that the setup is deeper than a normal wave catch.",
    check: "Price durability, escape and second arrival. A 2v1 that lasts through another enemy rotation can win the responder and still donate Fiora's shutdown.",
  },
] as const;

export const objectiveBands = [
  {
    id: "distant",
    label: "Distant setup",
    time: "Full sequence available",
    text: "Use the full sequence to build a side bounce, spend for the next completed item and identify who will answer Fiora. The goal is to enter setup with the wave already moving, not to begin pushing after both teams reach river.",
  },
  {
    id: "approach",
    label: "Approach",
    time: "Entrances contested",
    text: "Entrances are being contested. A wave action must now produce one named result: first river movement, a responder reveal, a ward escort, one guaranteed structure hit, or a recall that finishes before the objective can start.",
  },
  {
    id: "commitment",
    label: "Commitment",
    time: "Objective can start",
    text: "The objective can be started. Stop at a depth that still reaches the nearest useful fight pocket before the enemy can turn. Extra objective durability adds seconds, but engage range, blast cones, globals and allied delay determine whether those seconds belong to Fiora.",
  },
  {
    id: "contact",
    label: "Contact",
    time: "Fight or burn active",
    text: "Damage or contact is active. Choose one job now: threaten the enemy backline from a swept edge, counter-enter the diver, remove the exposed jungler before Smite, block a choke, or deliberately trade the objective for a named structure threshold.",
  },
  {
    id: "conversion",
    label: "Conversion",
    time: "Aftermath",
    text: "After the first removal, compare death timers, current HP, Grand Challenge healing, enemy wave position and structure health. Take the highest guaranteed reward that completes before respawns or Homeguard close the route, then reset rather than extending on the emotion of the win.",
  },
] as const;

export const fightPhases = [
  {
    number: "01",
    label: "Shape the map",
    text: "Push the wave that would expose an allied structure, enter through swept fog, and keep Fiora outside the same poke line as the frontline. A flank is ready only when allied contact can begin before the enemy turns and clears the pocket.",
  },
  {
    number: "02",
    label: "Read first contact",
    text: "Write the first three events mentally: opener, residual control, save. If Nautilus R starts the fight while Janna Q and Xayah R remain, the opener being spent has not yet created carry access.",
  },
  {
    number: "03",
    label: "Compress attention",
    text: "Move when the support and carry face or path toward the allied engager. That attention shift shortens Fiora's final distance; waiting after they turn back gives the peel formation time to reopen.",
  },
  {
    number: "04",
    label: "Price the entry",
    text: "Reject targets that require both Q and Flash before damage begins unless allied protection replaces the exit. Prefer the champion who dies inside the available Hail/PTA window and whose removal changes the objective or protects Fiora's team.",
  },
  {
    number: "05",
    label: "Allocate Riposte",
    text: "Assign W before contact: block the forced lock, deny the lethal spell, cut a carry's short attack-speed window, or preserve the exit. Aim through the CC source toward the carry when the geometry allows the block and the stun to hit different champions.",
  },
  {
    number: "06",
    label: "Place Grand Challenge",
    text: "R the carry when access and conversion are short. R the exposed jungler when Smite is the fight, the isolated peeler when their save blocks every carry line, or the diver when a fast healing field stabilizes threatened allies.",
  },
  {
    number: "07",
    label: "Convert or leave",
    text: "After the first kill, check Hubris duration, Fiora's HP, Q/W, healing-field position, objective health and enemy respawn path. Chase only when the next target dies before peel resets; otherwise turn the temporary combat buffs into objective or structure damage.",
  },
] as const;

export const targetFactors = [
  ["Strategic value", "Name what disappears with the target: carry DPS, Smite, the only death-denial spell, the diver threatening allies, or the wave clear stopping a finish. Damage dealt is not the target's value."],
  ["Access cost", "Count resources before damage begins. Q only preserves Flash for pursuit or exit; Q plus Flash plus W to cross the formation leaves no answer when the carry moves or peel returns."],
  ["Conversion time", "Estimate whether the target dies inside the allied control and first Hail/E cycle. Shields, Exhaust, armor, untargetability and rescue can extend a fragile health bar beyond the legal window."],
  ["Counter-control", "Identify the target's own escape or denial spell and the nearest ally's peel. Decide whether W answers the entry, the second layer, or the exit; it cannot cover all three."],
  ["Ally follow-up", "Check cast range and path, not ally proximity on the minimap. Fiora's support must reach the same post-dash target with control, shield or speed before the enemy answer lands."],
  ["Exit quality", "Point to the exit before entering: a Grand Challenge field, Q target, open corridor, lantern, Devour, shielded retreat or down-lane path. No visible exit raises the kill threshold required to commit."],
  ["Failure cost", "Add the shutdown, objective damage during death timer, Flash expenditure and what happens to the allied carry while Fiora leaves them. A high-value target can still be an unprofitable trade."],
] as const;

export const currentSystems = [
  {
    label: "Bot quest",
    value: "+300g / +2g CS / +50g takedown",
    text: "After completion, each collected minion and takedown is worth more, so abandoning a full wave for an uncertain roam has a larger explicit cost. The upgraded boot slot also means late recalls should be compared against a real sixth-item path rather than treated as empty inventory time.",
  },
  {
    label: "Faelights",
    value: "+25% radius / 45s region",
    text: "Activate the region before crossing the collapse line so the larger radius reveals a route early enough to retreat. The 45-second information window does not exclude globals, camouflage outside reveal rules, or enemies who remove the light before Fiora commits.",
  },
  {
    label: "Homeguard",
    value: "150% to 65% after 14:00",
    text: "After 14:00, record the recall timestamp instead of removing that champion from the side calculation. The decaying movement burst can return a defender or engager to lane before Fiora finishes a second wave or an inner-turret commitment.",
  },
  {
    label: "Overgrowth",
    value: "One hit can matter",
    text: "One charged hit can complete meaningful structure progress while Fiora retains the same retreat timer. Decide the hit count before stepping into range; Overgrowth value does not justify waiting for another wave after enemy recalls disappear.",
  },
] as const;

export const macroMyths = [
  {
    myth: "Bot tower fell, so Fiora lives mid.",
    truth: "Use mid when both river sides can be covered and Fiora can clear before the enemy carry. After Hydra clear, disappear toward the controlled side and return for the next wave; move side when the allied solo laner needs mid, the bounce is collectable, or central poke removes Fiora before she can threaten fog.",
  },
  {
    myth: "Fiora is a split-pusher, so she stays side.",
    truth: "Side is valuable when it forces a responder Fiora can pressure or out-rotate and the allied four can use that response. No Teleport, solo-lane level gaps, quest-enhanced central income and a strong backline angle can all make one side wave plus rotation better than permanent structure commitment.",
  },
  {
    myth: "Two enemies answered, so the split worked.",
    truth: "Name the allied conversion before showing side: objective start, mid structure, enemy jungle denial or disengage. If allies are recalling, cannot delay, or Fiora dies before the response becomes visible, two enemies moving side created no usable advantage.",
  },
  {
    myth: "Won bot means won side.",
    truth: "Compare Fiora directly with the likely responder. A two-level top-role lead, armor completion, Teleport, prepared terrain or one spell that demands W can turn a winning bot scoreline into a losing extended side duel. Force their reveal before deciding whether to fight.",
  },
  {
    myth: "Behind means group permanently.",
    truth: "Collect D0-D1 waves with the fastest threats visible, then disappear so the enemy cannot assign its strongest responder for free. Group when central clear and protection preserve more income; take shallow side when the bounce reaches allied structure and a real shadow covers the exit.",
  },
  {
    myth: "Wait for CC, then dive ADC.",
    truth: "The opener being spent is useful only if the residual spell no longer stops conversion. After Nautilus R, Janna Q and Xayah R may still cover the landing square; after Lulu W, Wild Growth and Exhaust can still extend the kill. Enter when the remaining queue fits W, allied follow-up and the exit.",
  },
  {
    myth: "Always R the carry.",
    truth: "R the carry when access is short and their save queue is broken. An exposed jungler outranks them while Smite decides the objective, an isolated peeler can remove every death-denial layer, and a diver inside allied space can produce the fastest four-Vital healing field.",
  },
  {
    myth: "Vision makes side safe.",
    truth: "A ward is useful only if it sees the fastest arrival early enough to leave. Globals, camouflage, wall crossing and Homeguard can bypass or compress ordinary ward timings; side depth also needs W, a down-lane retreat or an ally whose spell can actually affect the arriving champion.",
  },
] as const;

export const replayCases = [
  {
    label: "Ahead-game macro review",
    patch: "14.23 / macro-only evidence",
    moments: [
      "Clears mid with allies while ahead instead of locking into side.",
      "Enters the river fight from its upper edge after first contact.",
      "Returns to the wave immediately after a double kill.",
      "Takes a much deeper base line only once massive lead and allied numbers change the failure cost.",
    ],
  },
  {
    label: "Recovery-game macro review",
    patch: "26.2 / current-season sequence",
    moments: [
      "Finishes bot outer while the team is behind, then rotates into mid income.",
      "Backs away from rising mid pressure rather than forcing the entry.",
      "Returns side after central action, proving mid and side are consecutive states.",
      "Collects top while behind, then rejoins the final central conversion.",
    ],
  },
] as const;

export const evidenceSources = [
  {
    type: "OFFICIAL",
    label: "Patch 26.1 systems",
    url: "https://www.leagueoflegends.com/en-us/news/game-updates/patch-26-1-notes/",
    text: "Role quests, objective durability, Faelights, Homeguards, Overgrowth and turret rules.",
  },
  {
    type: "OFFICIAL",
    label: "Patch 26.15",
    url: "https://www.leagueoflegends.com/en-us/news/game-updates/league-of-legends-patch-26-15-notes/",
    text: "Current patch baseline and Jack of All Trades tuning.",
  },
  {
    type: "OFFICIAL",
    label: "Data Dragon 16.15.1",
    url: championDataset.source,
    text: "Current passive and four-spell kit data for every standard champion.",
  },
  {
    type: "REVIEWED SAMPLE",
    label: "High-elo Fiora ADC VOD review",
    url: "",
    text: "Repeated split-threat, second-wave teamfighting and edge-entry behavior, kept anonymous in the public guide.",
  },
  {
    type: "AUTHOR",
    label: "Guide doctrine",
    url: "#mid-late-command-room",
    text: "Hail versus PTA, Hydra into Hubris, Gluttonous Greaves, Cyclosword and tested lane/macro preferences.",
  },
] as const;
