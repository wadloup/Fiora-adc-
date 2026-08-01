import {
  championLoadingImage,
  type BotSupportProfile,
  type SupportArchetype,
} from "./botLanePatch";

const archetypeDefaults: Record<
  SupportArchetype,
  Pick<BotSupportProfile, "rule" | "roam" | "avoid">
> = {
  catch: {
    rule: "Keep minions between Fiora and the catch spell until allied support owns brush.",
    roam: "Ward the river and lane return before hitting tower or holding a freeze.",
    avoid: "Giving a clear line to the catch spell for one low-value minion.",
  },
  engage: {
    rule: "Do not stand close enough for one engage to control both bot laners.",
    roam: "When engage leaves vision, shorten the lane and ping the path before touching tower.",
    avoid: "Spending Riposte before the engage champion has declared the real target.",
  },
  peel: {
    rule: "Force the first peel cooldown, leave, then use the next contact on the carry.",
    roam: "Peel supports roam slowly; use their absence to crash without chasing too deep.",
    avoid: "Using the full first rotation on the support while the carry keeps free space.",
  },
  enchanter: {
    rule: "Trade on the main defensive cooldown and leave before sustain resets the lane.",
    roam: "Track whether the enchanter moved or only disappeared to ward; punish the carry briefly.",
    avoid: "Committing one long, telegraphed all-in through every shield and heal.",
  },
  mage: {
    rule: "Brush access and HP are worth more than one desperate melee minion.",
    roam: "Push only after the mage is seen elsewhere; fog turns every return path into a skillshot angle.",
    avoid: "Walking through open lane after the root or stun has already been aimed.",
  },
  warden: {
    rule: "Create two angles so the warden cannot protect the carry and stop Fiora's exit.",
    roam: "Ward the shortest return route and take plates only while the warden remains visible.",
    avoid: "Starting an extended fight on the tank while the enemy carry is untouched.",
  },
  roam: {
    rule: "Ward the return path before turning a temporary 2v1 into a trap.",
    roam: "Crash or threaten immediately when the support leaves; do not spend the window only pinging.",
    avoid: "Following the roam late and arriving to a fight after losing the entire bot wave.",
  },
};

function support(
  profile: Omit<BotSupportProfile, "image" | "rule" | "roam" | "avoid"> &
    Partial<Pick<BotSupportProfile, "rule" | "roam" | "avoid">>
): BotSupportProfile {
  return {
    ...archetypeDefaults[profile.archetype],
    ...profile,
    image: championLoadingImage(profile.dataDragonId),
  };
}

const coreSupports: BotSupportProfile[] = [
  support({
    id: "alistar",
    dataDragonId: "Alistar",
    name: "Alistar",
    archetype: "engage",
    difficulty: 13,
    abilities: {
      passive: "Triumphant Roar",
      q: "Pulverize",
      w: "Headbutt",
      e: "Trample",
      r: "Unbreakable Will",
      key: "Headbutt / Pulverize",
    },
    scores: { access: 94, protection: 70, sustain: 31, discipline: 72 },
    allyLabel: "Hard access",
    allyPlan:
      "Let Alistar threaten brush, then Lunge only after Headbutt-Pulverize fixes the target.",
    enemyPlan:
      "He wants Fiora close to the carry, then converts Headbutt-Pulverize into a full disengage or kill.",
    trigger:
      "Punish after his combo misses or when he uses Headbutt without a clean Pulverize follow-up.",
    parry:
      "Riposte Pulverize. If he opens with Headbutt, cast W before the knock-up lands.",
    levelOne:
      "His level 1 is limited unless he starts Pulverize; own wave space without hugging terrain.",
    levelTwo:
      "Assume the combo is live and split from allied support before the second wave melee minion dies.",
  }),
  support({
    id: "amumu",
    dataDragonId: "Amumu",
    name: "Amumu",
    archetype: "engage",
    difficulty: 14,
    abilities: {
      passive: "Cursed Touch",
      q: "Bandage Toss",
      w: "Despair",
      e: "Tantrum",
      r: "Curse of the Sad Mummy",
      key: "Bandage Toss",
    },
    scores: { access: 91, protection: 45, sustain: 15, discipline: 60 },
    allyLabel: "Double-bandage access",
    allyPlan:
      "Use the first Bandage Toss to force movement and the second to lock the real Fiora entry.",
    enemyPlan:
      "He fishes through open minion gaps, then holds the second Q to stop Fiora's exit.",
    trigger:
      "Move after both Bandage Toss charges are spent, not merely after the first misses.",
    parry:
      "Riposte Bandage Toss or Curse of the Sad Mummy at level 6.",
    levelOne:
      "Keep a minion line and count both Q charges before taking brush space.",
    levelTwo:
      "Do not re-enter because the first bandage missed; the stored second cast is the trap.",
  }),
  support({
    id: "ashe",
    dataDragonId: "Ashe",
    name: "Ashe",
    archetype: "catch",
    difficulty: 10,
    abilities: {
      passive: "Frost Shot",
      q: "Ranger's Focus",
      w: "Volley",
      e: "Hawkshot",
      r: "Enchanted Crystal Arrow",
      key: "Volley / Enchanted Crystal Arrow",
    },
    scores: { access: 78, protection: 29, sustain: 5, discipline: 67 },
    allyLabel: "Slow and Arrow setup",
    allyPlan:
      "Use repeated slows to create Lunge range, then hold the real commit for Arrow.",
    enemyPlan:
      "She taxes HP with Volley and turns any exposed retreat into a slow chain.",
    trigger:
      "Engage after Volley and before the next slow cycle; at level 6, track Arrow at all times.",
    parry:
      "Riposte Enchanted Crystal Arrow. Before 6, save W for the enemy carry or jungle CC.",
    levelOne:
      "Stand behind healthy minions so Volley does not cover the entire lane.",
    levelTwo:
      "Do not chase through repeated slows without a short, planned exit.",
  }),
  support({
    id: "bard",
    dataDragonId: "Bard",
    name: "Bard",
    archetype: "roam",
    difficulty: 8,
    abilities: {
      passive: "Traveler's Call",
      q: "Cosmic Binding",
      w: "Caretaker's Shrine",
      e: "Magical Journey",
      r: "Tempered Fate",
      key: "Cosmic Binding",
    },
    scores: { access: 73, protection: 54, sustain: 36, discipline: 63 },
    allyLabel: "Catch and tempo",
    allyPlan:
      "Let Bard create the wall or minion stun, then take the short two-hit Fiora trade.",
    enemyPlan:
      "He searches for Q geometry, leaves shrines, and disappears to create map pressure.",
    trigger:
      "Punish after Cosmic Binding misses or the moment his roam leaves the enemy carry alone.",
    parry:
      "Riposte the second half of Cosmic Binding when the stun line is fixed.",
    levelOne:
      "Avoid standing in line with a minion or wall; the base Q slow is far less dangerous than the stun.",
    levelTwo:
      "Track portal access before chasing him toward river or alcove.",
  }),
  support({
    id: "blitzcrank",
    dataDragonId: "Blitzcrank",
    name: "Blitzcrank",
    archetype: "catch",
    difficulty: 17,
    abilities: {
      passive: "Mana Barrier",
      q: "Rocket Grab",
      w: "Overdrive",
      e: "Power Fist",
      r: "Static Field",
      key: "Rocket Grab",
    },
    scores: { access: 96, protection: 51, sustain: 4, discipline: 66 },
    allyLabel: "Immediate pick",
    allyPlan:
      "Hold Lunge until Rocket Grab lands; Fiora should arrive on the knock-up, not before it.",
    enemyPlan:
      "He controls the lane through the threat of one grab and walks forward when the wave thins.",
    trigger:
      "The missed Rocket Grab is a long green light. Use it before he restores lane position.",
    parry:
      "Riposte Rocket Grab if the line is visible, or Power Fist if the grab already connected.",
    levelOne:
      "Do not leash late into an empty lane. Keep a healthy minion wall between both champions.",
    levelTwo:
      "Back away as the wave thins; the same angle becomes much more dangerous with Power Fist.",
  }),
  support({
    id: "brand",
    dataDragonId: "Brand",
    name: "Brand",
    archetype: "mage",
    difficulty: 15,
    abilities: {
      passive: "Blaze",
      q: "Sear",
      w: "Pillar of Flame",
      e: "Conflagration",
      r: "Pyroclasm",
      key: "Sear",
    },
    scores: { access: 43, protection: 18, sustain: 3, discipline: 45 },
    allyLabel: "Damage lane",
    allyPlan:
      "Use Brand's burn to force movement, then enter only when Sear is available to secure the target.",
    enemyPlan:
      "He applies Blaze with easy spells, then turns Sear into a stun and full passive detonation.",
    trigger:
      "Move after Sear misses. If Fiora is already ablaze, respect the next stun angle.",
    parry:
      "Riposte Sear while marked by Blaze; it is the spell that converts poke into a kill.",
    levelOne:
      "Stand away from the wave so Pillar of Flame cannot damage and push simultaneously.",
    levelTwo:
      "Do not Lunge in while already carrying Blaze stacks.",
  }),
  support({
    id: "braum",
    dataDragonId: "Braum",
    name: "Braum",
    archetype: "warden",
    difficulty: 8,
    abilities: {
      passive: "Concussive Blows",
      q: "Winter's Bite",
      w: "Stand Behind Me",
      e: "Unbreakable",
      r: "Glacial Fissure",
      key: "Concussive Blows",
    },
    scores: { access: 62, protection: 96, sustain: 15, discipline: 90 },
    allyLabel: "Peel brawler",
    allyPlan:
      "Let Braum tag the target, then use Fiora's fast two attacks to finish Concussive Blows.",
    enemyPlan:
      "He marks Fiora once, jumps to the carry, and turns every following auto into stun pressure.",
    trigger:
      "Break contact before four passive stacks, then re-enter after the mark expires.",
    parry:
      "Riposte the Concussive Blows stun or Glacial Fissure knock-up.",
    levelOne:
      "One Winter's Bite is not the whole trade; the passive stacks that follow are the real cost.",
    levelTwo:
      "Do not hit the carry through Unbreakable while Fiora is already marked.",
  }),
  support({
    id: "janna",
    dataDragonId: "Janna",
    name: "Janna",
    archetype: "peel",
    difficulty: 9,
    abilities: {
      passive: "Tailwind",
      q: "Howling Gale",
      w: "Zephyr",
      e: "Eye Of The Storm",
      r: "Monsoon",
      key: "Howling Gale",
    },
    scores: { access: 54, protection: 98, sustain: 47, discipline: 92 },
    allyLabel: "Elite disengage",
    allyPlan:
      "Take controlled trades while Janna protects the exit; do not force her to start contact alone.",
    enemyPlan:
      "She hides tornado charge, slows Fiora's entry, shields the carry, then resets everything with Monsoon.",
    trigger:
      "Force shield or tornado, leave, and repeat before both are available together.",
    parry:
      "Riposte Howling Gale when the path is fixed. Monsoon knockback is the level 6 alternative.",
    levelOne:
      "Watch brush for a charged tornado and avoid telegraphing the Lunge line.",
    levelTwo:
      "Short trades only; her shield converts a long trade back in the carry's favor.",
  }),
  support({
    id: "karma",
    dataDragonId: "Karma",
    name: "Karma",
    archetype: "mage",
    difficulty: 14,
    abilities: {
      passive: "Gathering Fire",
      q: "Inner Flame",
      w: "Focused Resolve",
      e: "Inspire",
      r: "Mantra",
      key: "Focused Resolve",
    },
    scores: { access: 61, protection: 75, sustain: 29, discipline: 78 },
    allyLabel: "Pressure utility",
    allyPlan:
      "Use shield speed to enter, then keep Fiora close enough for Focused Resolve to root.",
    enemyPlan:
      "She controls level 1 with Mantra Q and turns a chase into a tether root plus shielded exit.",
    trigger:
      "Engage after Mantra Q or Inspire is spent, then leave before the next shield.",
    parry:
      "Riposte the Focused Resolve root at the end of its tether.",
    levelOne:
      "Do not stand inside the minion impact zone of Mantra Inner Flame.",
    levelTwo:
      "Break or parry the tether; continuing forward without a plan gives her the whole trade.",
  }),
  support({
    id: "leona",
    dataDragonId: "Leona",
    name: "Leona",
    archetype: "engage",
    difficulty: 16,
    abilities: {
      passive: "Sunlight",
      q: "Shield of Daybreak",
      w: "Eclipse",
      e: "Zenith Blade",
      r: "Solar Flare",
      key: "Zenith Blade / Shield of Daybreak",
    },
    scores: { access: 98, protection: 63, sustain: 6, discipline: 82 },
    allyLabel: "Reliable lockdown",
    allyPlan:
      "Let Zenith Blade connect, then Lunge as Shield of Daybreak fixes the carry in place.",
    enemyPlan:
      "She crosses the minion line with Zenith Blade, then chains stun while Sunlight amplifies carry damage.",
    trigger:
      "Punish a missed Zenith Blade immediately; she has no ranged exit tool.",
    parry:
      "Riposte Shield of Daybreak after Zenith Blade lands, or Solar Flare at level 6.",
    levelOne:
      "If she starts Q, keep distance from brush; if she starts E, keep a minion body line.",
    levelTwo:
      "Split from allied support so Zenith Blade cannot create a two-player collapse.",
  }),
  support({
    id: "lulu",
    dataDragonId: "Lulu",
    name: "Lulu",
    archetype: "enchanter",
    difficulty: 11,
    abilities: {
      passive: "Pix, Faerie Companion",
      q: "Glitterlance",
      w: "Whimsy",
      e: "Help, Pix!",
      r: "Wild Growth",
      key: "Whimsy",
    },
    scores: { access: 49, protection: 99, sustain: 38, discipline: 88 },
    allyLabel: "Carry protection",
    allyPlan:
      "Use speed and shield to survive entry, then keep Polymorph for the enemy counter-engage.",
    enemyPlan:
      "She shields the carry, polymorphs Fiora at contact, and extends the target's life with Wild Growth.",
    trigger:
      "Force Whimsy or Help, Pix!, disengage, then return before both are ready.",
    parry:
      "Riposte Polymorph if its cast is readable; otherwise save W for the enemy carry's control.",
    levelOne:
      "Respect auto plus Pix damage; do not donate repeated melee last-hit trades.",
    levelTwo:
      "Do not commit while Whimsy and shield are both available.",
  }),
  support({
    id: "lux",
    dataDragonId: "Lux",
    name: "Lux",
    archetype: "mage",
    difficulty: 16,
    abilities: {
      passive: "Illumination",
      q: "Light Binding",
      w: "Prismatic Barrier",
      e: "Lucent Singularity",
      r: "Final Spark",
      key: "Light Binding",
    },
    scores: { access: 68, protection: 43, sustain: 10, discipline: 62 },
    allyLabel: "Root and burst",
    allyPlan:
      "Let Light Binding create the line; Fiora uses the root duration to reach the carry without spending Riposte.",
    enemyPlan:
      "She slows first, waits for a predictable path, then roots through up to two targets.",
    trigger:
      "The missed Light Binding is the green light. Do not waste it by clearing one minion.",
    parry:
      "Riposte Light Binding. Its line through one minion is still live.",
    levelOne:
      "Stand away from the wave so Lucent Singularity cannot win lane and push together.",
    levelTwo:
      "Count the first minion hit by Light Binding; a second target can still be rooted.",
  }),
  support({
    id: "maokai",
    dataDragonId: "Maokai",
    name: "Maokai",
    archetype: "engage",
    difficulty: 13,
    abilities: {
      passive: "Sap Magic",
      q: "Bramble Smash",
      w: "Twisted Advance",
      e: "Sapling Toss",
      r: "Nature's Grasp",
      key: "Twisted Advance",
    },
    scores: { access: 92, protection: 75, sustain: 28, discipline: 84 },
    allyLabel: "Point-click access",
    allyPlan:
      "Use Twisted Advance as the guaranteed entry and save Fiora W for the enemy response.",
    enemyPlan:
      "He controls brush with saplings, becomes untargetable during W, then knocks Fiora away with Q.",
    trigger:
      "Punish after Twisted Advance and Bramble Smash are separated or used on allied support.",
    parry:
      "Riposte the Twisted Advance root at arrival or Nature's Grasp at level 6.",
    levelOne:
      "Do not face-check brush into empowered saplings.",
    levelTwo:
      "Keep enough space that his point-click W cannot start on Fiora for free.",
  }),
  support({
    id: "mel",
    dataDragonId: "Mel",
    name: "Mel",
    archetype: "mage",
    difficulty: 17,
    abilities: {
      passive: "Searing Brilliance",
      q: "Radiant Volley",
      w: "Rebuttal",
      e: "Solar Snare",
      r: "Golden Eclipse",
      key: "Solar Snare",
    },
    scores: { access: 64, protection: 70, sustain: 5, discipline: 76 },
    allyLabel: "Root and reflection",
    allyPlan:
      "Use Solar Snare to fix the target and hold Rebuttal for the enemy projectile response.",
    enemyPlan:
      "She stacks Overwhelm with repeated projectiles, roots the center line, and reflects incoming projectiles.",
    trigger:
      "Engage after Solar Snare or Rebuttal. Fiora's melee contact is less affected by reflection than ranged support spells.",
    parry:
      "Riposte Solar Snare's center root; avoid wasting allied projectiles into Rebuttal.",
    levelOne:
      "Do not stand in the wave where Radiant Volley can stack Overwhelm repeatedly.",
    levelTwo:
      "Approach from the edge of Solar Snare rather than its rooted center.",
  }),
  support({
    id: "milio",
    dataDragonId: "Milio",
    name: "Milio",
    archetype: "enchanter",
    difficulty: 8,
    abilities: {
      passive: "Fired Up!",
      q: "Ultra Mega Fire Kick",
      w: "Cozy Campfire",
      e: "Warm Hugs",
      r: "Breath of Life",
      key: "Ultra Mega Fire Kick",
    },
    scores: { access: 37, protection: 96, sustain: 81, discipline: 91 },
    allyLabel: "Range and cleanse",
    allyPlan:
      "Use shields to survive the walk-in and keep the kick for enemy counter-engage.",
    enemyPlan:
      "He increases carry range, layers two shields, and knocks Fiora away from direct contact.",
    trigger:
      "Force the kick or both shield charges, leave, then use the next window.",
    parry:
      "Riposte Ultra Mega Fire Kick if it is the only thing denying contact.",
    levelOne:
      "Do not trade repeatedly into Fired Up autos and two shield charges.",
    levelTwo:
      "Break Campfire range before taking a long trade with the enemy carry.",
  }),
  support({
    id: "morgana",
    dataDragonId: "Morgana",
    name: "Morgana",
    archetype: "catch",
    difficulty: 15,
    abilities: {
      passive: "Soul Siphon",
      q: "Dark Binding",
      w: "Tormented Shadow",
      e: "Black Shield",
      r: "Soul Shackles",
      key: "Dark Binding",
    },
    scores: { access: 66, protection: 88, sustain: 19, discipline: 82 },
    allyLabel: "Binding and spell cover",
    allyPlan:
      "Let Dark Binding land, then use Black Shield to protect Fiora's entry from counter-control.",
    enemyPlan:
      "She holds Binding for the straight Lunge line and Black Shield for allied engage.",
    trigger:
      "Move after Dark Binding misses or Black Shield is consumed.",
    parry:
      "Riposte Dark Binding. At level 6, the Soul Shackles stun is another high-value target.",
    levelOne:
      "Keep minions between both champions and do not let Tormented Shadow tax every last hit.",
    levelTwo:
      "Bait Black Shield before allied support spends the main CC.",
  }),
  support({
    id: "nami",
    dataDragonId: "Nami",
    name: "Nami",
    archetype: "enchanter",
    difficulty: 13,
    abilities: {
      passive: "Surging Tides",
      q: "Aqua Prison",
      w: "Ebb and Flow",
      e: "Tidecaller's Blessing",
      r: "Tidal Wave",
      key: "Aqua Prison",
    },
    scores: { access: 73, protection: 78, sustain: 77, discipline: 83 },
    allyLabel: "Sustain and bubble",
    allyPlan:
      "Use Tidecaller's Blessing to secure Fiora's first slow, then layer Aqua Prison on the committed target.",
    enemyPlan:
      "She wins short trades with Ebb and Flow and bubbles the point where Fiora must finish Lunge.",
    trigger:
      "Engage after Aqua Prison or Ebb and Flow, not while both control and sustain are ready.",
    parry:
      "Riposte Aqua Prison or Tidal Wave at level 6.",
    levelOne:
      "Avoid the bounce trade where Ebb and Flow touches three targets.",
    levelTwo:
      "Change direction after Lunge; the obvious landing point is where Bubble is aimed.",
  }),
  support({
    id: "nautilus",
    dataDragonId: "Nautilus",
    name: "Nautilus",
    archetype: "catch",
    difficulty: 17,
    abilities: {
      passive: "Staggering Blow",
      q: "Dredge Line",
      w: "Titan's Wrath",
      e: "Riptide",
      r: "Depth Charge",
      key: "Dredge Line",
    },
    scores: { access: 99, protection: 72, sustain: 5, discipline: 78 },
    allyLabel: "Maximum lockdown",
    allyPlan:
      "Follow Dredge Line and passive root, then save Riposte for the enemy's first response.",
    enemyPlan:
      "He hooks through open gaps, roots with the first auto, and saves Depth Charge for guaranteed follow-up.",
    trigger:
      "Punish a missed Dredge Line before he can anchor to terrain and reset spacing.",
    parry:
      "Riposte Dredge Line or the passive root on first contact; Depth Charge is unavoidable without timing W.",
    levelOne:
      "Never stand in an open hook corridor as the wave thins.",
    levelTwo:
      "Keep allied support separated so one hook does not expose both champions.",
  }),
  support({
    id: "neeko",
    dataDragonId: "Neeko",
    name: "Neeko",
    archetype: "mage",
    difficulty: 15,
    abilities: {
      passive: "Inherent Glamour",
      q: "Blooming Burst",
      w: "Shapesplitter",
      e: "Tangle-Barbs",
      r: "Pop Blossom",
      key: "Tangle-Barbs",
    },
    scores: { access: 76, protection: 46, sustain: 4, discipline: 65 },
    allyLabel: "Root and disguise",
    allyPlan:
      "Use Tangle-Barbs through minions for the empowered root, then let Fiora arrive before Blooming Burst finishes.",
    enemyPlan:
      "She roots through the wave, disguises as a minion or ally, and hides the level 6 engage.",
    trigger:
      "Move after Tangle-Barbs misses and count the minion wave for an extra body.",
    parry:
      "Riposte the empowered root or Pop Blossom knock-up.",
    levelOne:
      "Do not line up behind minions; Tangle-Barbs becomes stronger after passing through targets.",
    levelTwo:
      "Count enemy units before walking forward. A fake minion changes the engage.",
  }),
  support({
    id: "pyke",
    dataDragonId: "Pyke",
    name: "Pyke",
    archetype: "roam",
    difficulty: 16,
    abilities: {
      passive: "Gift of the Drowned Ones",
      q: "Bone Skewer",
      w: "Ghostwater Dive",
      e: "Phantom Undertow",
      r: "Death From Below",
      key: "Bone Skewer / Phantom Undertow",
    },
    scores: { access: 97, protection: 38, sustain: 9, discipline: 59 },
    allyLabel: "Snowball catch",
    allyPlan:
      "Let Bone Skewer displace the target, then enter as Phantom Undertow closes the escape.",
    enemyPlan:
      "He threatens from fog, regenerates grey health out of sight, then roams before the lane can answer.",
    trigger:
      "Punish after both hook and dash stun are unavailable; one missed spell is not enough.",
    parry:
      "Riposte Phantom Undertow stun or a visible Bone Skewer.",
    levelOne:
      "Respect brush more than the champion model; vision denial powers his hook.",
    levelTwo:
      "Do not chase his grey-health retreat into river fog.",
  }),
  support({
    id: "rakan",
    dataDragonId: "Rakan",
    name: "Rakan",
    archetype: "roam",
    difficulty: 14,
    abilities: {
      passive: "Fey Feathers",
      q: "Gleaming Quill",
      w: "Grand Entrance",
      e: "Battle Dance",
      r: "The Quickness",
      key: "Grand Entrance",
    },
    scores: { access: 95, protection: 84, sustain: 43, discipline: 86 },
    allyLabel: "Fast engage",
    allyPlan:
      "Rakan starts from outside vision; Fiora follows the knock-up and leaves space for his Battle Dance exit.",
    enemyPlan:
      "He dashes in, knocks up, then returns to his carry before Fiora can finish the trade.",
    trigger:
      "Punish after Grand Entrance and both Battle Dance charges are committed.",
    parry:
      "Riposte Grand Entrance knock-up or The Quickness charm.",
    levelOne:
      "His threat is modest without W; do not give free Q sustain anyway.",
    levelTwo:
      "Do not stack with allied support where one Grand Entrance hits both.",
  }),
];

const moreCoreSupports: BotSupportProfile[] = [
  support({
    id: "rell",
    dataDragonId: "Rell",
    name: "Rell",
    archetype: "engage",
    difficulty: 16,
    abilities: {
      passive: "Break the Mold",
      q: "Shattering Strike",
      w: "Ferromancy: Crash Down",
      e: "Full Tilt",
      r: "Magnet Storm",
      key: "Ferromancy: Crash Down",
    },
    scores: { access: 98, protection: 72, sustain: 4, discipline: 82 },
    allyLabel: "Area lockdown",
    allyPlan:
      "Let Rell break the formation first, then use Fiora on the carry while Magnet Storm limits the exit.",
    enemyPlan:
      "She accelerates from fog, crashes down across both bot laners, then removes shields with Q.",
    trigger:
      "Punish a missed Crash Down; dismounted Rell cannot reset the same distance quickly.",
    parry:
      "Riposte the Crash Down knock-up or the remount toss.",
    levelOne:
      "Keep lateral spacing so one W cannot hit both allies.",
    levelTwo:
      "Do not rely on a shield as the whole trade plan; Shattering Strike removes it.",
  }),
  support({
    id: "renata",
    dataDragonId: "Renata",
    name: "Renata Glasc",
    archetype: "peel",
    difficulty: 13,
    abilities: {
      passive: "Leverage",
      q: "Handshake",
      w: "Bailout",
      e: "Loyalty Program",
      r: "Hostile Takeover",
      key: "Handshake",
    },
    scores: { access: 67, protection: 94, sustain: 24, discipline: 92 },
    allyLabel: "Bailout pressure",
    allyPlan:
      "Use Bailout to authorize a committed Fiora trade, but leave enough target HP for the takedown reset.",
    enemyPlan:
      "She roots and displaces Fiora, then turns a near kill into a revive window.",
    trigger:
      "Force Bailout, disengage, and wait out its timer before killing the target.",
    parry:
      "Riposte Handshake. At level 6, Hostile Takeover is the priority.",
    levelOne:
      "Do not stand in line with the carry where Handshake can throw one champion into the other.",
    levelTwo:
      "A low enemy with Bailout is not dead; decide whether the takedown is immediate before continuing.",
  }),
  support({
    id: "senna",
    dataDragonId: "Senna",
    name: "Senna",
    archetype: "catch",
    difficulty: 14,
    abilities: {
      passive: "Absolution",
      q: "Piercing Darkness",
      w: "Last Embrace",
      e: "Curse of the Black Mist",
      r: "Dawning Shadow",
      key: "Last Embrace",
    },
    scores: { access: 72, protection: 68, sustain: 70, discipline: 76 },
    allyLabel: "Range and sustain",
    allyPlan:
      "Let Senna chip and heal until Last Embrace gives Fiora a clean entry.",
    enemyPlan:
      "She farms souls, trades auto-Q through minions, and roots the direct engage path.",
    trigger:
      "Engage after Last Embrace misses and before Piercing Darkness erases the trade.",
    parry:
      "Riposte the delayed Last Embrace root.",
    levelOne:
      "Do not trade a melee minion for a free auto-Q soul pattern.",
    levelTwo:
      "Use brush or a second angle so Last Embrace cannot cover both allies.",
  }),
  support({
    id: "seraphine",
    dataDragonId: "Seraphine",
    name: "Seraphine",
    archetype: "enchanter",
    difficulty: 12,
    abilities: {
      passive: "Stage Presence",
      q: "High Note",
      w: "Surround Sound",
      e: "Beat Drop",
      r: "Encore",
      key: "Beat Drop",
    },
    scores: { access: 74, protection: 83, sustain: 75, discipline: 88 },
    allyLabel: "Control and sustain",
    allyPlan:
      "Use Fiora E slow to upgrade Beat Drop, then let the echoed control secure a longer trade.",
    enemyPlan:
      "She stores an echoed spell, layers control through the wave, and resets chip with Surround Sound.",
    trigger:
      "Track the passive echo and engage after Beat Drop or Surround Sound.",
    parry:
      "Riposte the echoed root or Encore.",
    levelOne:
      "Do not stand in the wave where High Note pushes and pokes together.",
    levelTwo:
      "Read the echo indicator before treating a slow as harmless.",
  }),
  support({
    id: "sona",
    dataDragonId: "Sona",
    name: "Sona",
    archetype: "enchanter",
    difficulty: 7,
    abilities: {
      passive: "Power Chord",
      q: "Hymn of Valor",
      w: "Aria of Perseverance",
      e: "Song of Celerity",
      r: "Crescendo",
      key: "Power Chord / Crescendo",
    },
    scores: { access: 45, protection: 79, sustain: 92, discipline: 84 },
    allyLabel: "Scaling sustain",
    allyPlan:
      "Take repeated short Fiora trades and let Sona heal between contacts rather than demanding hard engage.",
    enemyPlan:
      "She chips with Q aura, stores the correct Power Chord, and out-sustains uncommitted damage.",
    trigger:
      "Pressure when heal aura and Power Chord are not prepared; at 6, track Crescendo.",
    parry:
      "Riposte Crescendo. Pre-6, keep W for the enemy carry or jungle CC.",
    levelOne:
      "Punish her short range after Q instead of trading into the empowered auto.",
    levelTwo:
      "Do not let small, meaningless trades become free sustain scaling.",
  }),
  support({
    id: "soraka",
    dataDragonId: "Soraka",
    name: "Soraka",
    archetype: "enchanter",
    difficulty: 10,
    abilities: {
      passive: "Salvation",
      q: "Starcall",
      w: "Astral Infusion",
      e: "Equinox",
      r: "Wish",
      key: "Equinox",
    },
    scores: { access: 31, protection: 86, sustain: 100, discipline: 91 },
    allyLabel: "Maximum sustain",
    allyPlan:
      "Use Fiora's mobility to take measured trades while Soraka restores HP and denies counter-engage with Equinox.",
    enemyPlan:
      "She lands Starcall to fund heals and places Equinox where Fiora must finish contact.",
    trigger:
      "Dodge Starcall, then pressure Soraka or force her to spend health healing the carry.",
    parry:
      "Riposte the Equinox root if Fiora cannot leave the zone before it arms.",
    levelOne:
      "Dodge Starcall first; every hit makes the next enemy trade healthier.",
    levelTwo:
      "Change target when Soraka oversteps. Hitting only the carry gives her the easiest heal pattern.",
  }),
  support({
    id: "tahmkench",
    dataDragonId: "TahmKench",
    name: "Tahm Kench",
    archetype: "warden",
    difficulty: 10,
    abilities: {
      passive: "An Acquired Taste",
      q: "Tongue Lash",
      w: "Abyssal Dive",
      e: "Thick Skin",
      r: "Devour",
      key: "Tongue Lash / Devour",
    },
    scores: { access: 63, protection: 100, sustain: 66, discipline: 88 },
    allyLabel: "Save and front line",
    allyPlan:
      "Use Tahm as the durable first body, then keep Devour available to rescue Fiora after the commit.",
    enemyPlan:
      "He stacks passive in melee range, threatens a Q stun, and removes the carry from Fiora's ultimate.",
    trigger:
      "Force Devour, disengage, then attack the next window before the save returns.",
    parry:
      "Riposte the three-stack Tongue Lash stun. Do not waste W on ordinary poke.",
    levelOne:
      "Avoid extended melee contact that reaches three passive stacks.",
    levelTwo:
      "Do not use Grand Challenge later unless Devour is tracked.",
  }),
  support({
    id: "taric",
    dataDragonId: "Taric",
    name: "Taric",
    archetype: "warden",
    difficulty: 9,
    abilities: {
      passive: "Bravado",
      q: "Starlight's Touch",
      w: "Bastion",
      e: "Dazzle",
      r: "Cosmic Radiance",
      key: "Dazzle",
    },
    scores: { access: 69, protection: 99, sustain: 87, discipline: 95 },
    allyLabel: "Anti-dive",
    allyPlan:
      "Let Fiora carry the Bastion Dazzle angle into melee range and time the full commit with Cosmic Radiance.",
    enemyPlan:
      "He mirrors Dazzle from the carry, heals through repeated autos, and makes the duo invulnerable after a delay.",
    trigger:
      "Bait Dazzle, then either finish before Cosmic Radiance lands or leave completely.",
    parry:
      "Riposte Dazzle. The telegraphed line makes this a reliable stun conversion.",
    levelOne:
      "Do not extend into Bravado autos; they refresh his sustain and cooldowns.",
    levelTwo:
      "Track both Dazzle origins: Taric and his Bastion partner.",
  }),
  support({
    id: "thresh",
    dataDragonId: "Thresh",
    name: "Thresh",
    archetype: "catch",
    difficulty: 17,
    abilities: {
      passive: "Damnation",
      q: "Death Sentence",
      w: "Dark Passage",
      e: "Flay",
      r: "The Box",
      key: "Death Sentence / Flay",
    },
    scores: { access: 96, protection: 95, sustain: 6, discipline: 92 },
    allyLabel: "Catch and lantern",
    allyPlan:
      "Use hook or Flay to start, then keep Lantern as Fiora's exit instead of spending every tool forward.",
    enemyPlan:
      "He threatens hook from fog, interrupts Lunge with Flay, and rescues the carry with Lantern.",
    trigger:
      "Punish after Death Sentence and Flay are both unavailable; one missed hook is not the entire kit.",
    parry:
      "Riposte Flay at close range or a visible Death Sentence.",
    levelOne:
      "Keep minions between Fiora and hook while respecting Flay's empowered auto.",
    levelTwo:
      "Track Lantern position; the apparent isolated carry may still have a complete exit.",
  }),
  support({
    id: "yuumi",
    dataDragonId: "Yuumi",
    name: "Yuumi",
    archetype: "enchanter",
    difficulty: 5,
    abilities: {
      passive: "Feline Friendship",
      q: "Prowling Projectile",
      w: "You and Me!",
      e: "Zoomies",
      r: "Final Chapter",
      key: "Prowling Projectile",
    },
    scores: { access: 21, protection: 88, sustain: 84, discipline: 65 },
    allyLabel: "Attached sustain",
    allyPlan:
      "Use Yuumi to survive poke and amplify a self-started Fiora trade; do not wait for her to create access.",
    enemyPlan:
      "She converts the carry into one stronger unit, chips from attachment, and protects the retreat.",
    trigger:
      "Pressure before repeated shields and heals reset the lane; punish any detached passive attempt.",
    parry:
      "Riposte Final Chapter's root if Fiora remains in repeated waves.",
    levelOne:
      "Threaten the carry enough that Yuumi cannot detach safely for passive.",
    levelTwo:
      "The lane has only one target; wave position matters more than target switching.",
  }),
  support({
    id: "zilean",
    dataDragonId: "Zilean",
    name: "Zilean",
    archetype: "peel",
    difficulty: 12,
    abilities: {
      passive: "Time In A Bottle",
      q: "Time Bomb",
      w: "Rewind",
      e: "Time Warp",
      r: "Chronoshift",
      key: "Time Bomb",
    },
    scores: { access: 72, protection: 95, sustain: 10, discipline: 93 },
    allyLabel: "Speed and revive",
    allyPlan:
      "Use Time Warp to solve Fiora's range problem and double bomb the target after contact.",
    enemyPlan:
      "He slows Fiora, double-bombs the fixed path, and revives the target after full commitment.",
    trigger:
      "Engage after one bomb and Rewind are spent; at 6, force Chronoshift and leave.",
    parry:
      "Riposte the second bomb stun, not the first bomb attachment.",
    levelOne:
      "Do not stand near a bombed minion as it expires.",
    levelTwo:
      "Track Rewind; one missed bomb can immediately become a second stun attempt.",
  }),
  support({
    id: "zyra",
    dataDragonId: "Zyra",
    name: "Zyra",
    archetype: "mage",
    difficulty: 16,
    abilities: {
      passive: "Garden of Thorns",
      q: "Deadly Spines",
      w: "Rampant Growth",
      e: "Grasping Roots",
      r: "Stranglethorns",
      key: "Grasping Roots",
    },
    scores: { access: 71, protection: 43, sustain: 2, discipline: 61 },
    allyLabel: "Zone and root",
    allyPlan:
      "Let plants and roots control the corridor, then use Fiora only after the target has chosen a bad exit.",
    enemyPlan:
      "She seeds brush and wave, roots through units, then turns the engage area into plant damage.",
    trigger:
      "Move after Grasping Roots misses and avoid fighting inside multiple active plants.",
    parry:
      "Riposte Grasping Roots or the delayed Stranglethorns knock-up.",
    levelOne:
      "Do not face-check seeded brush and do not tank plants for one minion.",
    levelTwo:
      "Roots pass through minions; the wave is not protection against her E.",
  }),
];

const flexSupports: BotSupportProfile[] = [
  support({
    id: "anivia",
    dataDragonId: "Anivia",
    name: "Anivia",
    archetype: "mage",
    difficulty: 14,
    abilities: {
      passive: "Rebirth",
      q: "Flash Frost",
      w: "Crystallize",
      e: "Frostbite",
      r: "Glacial Storm",
      key: "Flash Frost",
    },
    scores: { access: 65, protection: 72, sustain: 4, discipline: 74 },
    allyLabel: "Wall and stun",
    allyPlan:
      "Use Crystallize to remove the carry's escape, then layer Flash Frost after Fiora enters.",
    enemyPlan:
      "She holds stun for the straight approach and uses wall to split Fiora from support.",
    trigger:
      "Engage after Flash Frost and do not spend the entire trade killing Rebirth egg under a bad wave.",
    parry:
      "Riposte Flash Frost's detonation stun.",
    levelOne:
      "Move perpendicular to the slow projectile; do not Lunge along its path.",
    levelTwo:
      "Track wall geometry before using the only retreat angle.",
  }),
  support({
    id: "annie",
    dataDragonId: "Annie",
    name: "Annie",
    archetype: "engage",
    difficulty: 14,
    abilities: {
      passive: "Pyromania",
      q: "Disintegrate",
      w: "Incinerate",
      e: "Molten Shield",
      r: "Summon: Tibbers",
      key: "Pyromania",
    },
    scores: { access: 82, protection: 53, sustain: 3, discipline: 71 },
    allyLabel: "Point-click stun",
    allyPlan:
      "Wait for four Pyromania stacks, then use the guaranteed stun as Fiora's entry timer.",
    enemyPlan:
      "She hides the fourth stack through Molten Shield and threatens a point-click stun or Tibbers burst.",
    trigger:
      "Pressure when Pyromania is unstacked or immediately after the stun is spent.",
    parry:
      "Riposte the empowered Disintegrate or Tibbers impact.",
    levelOne:
      "Read passive stacks before every melee last hit.",
    levelTwo:
      "Do not assume three visible stacks are safe; Molten Shield creates the fourth instantly.",
  }),
  support({
    id: "fiddlesticks",
    dataDragonId: "Fiddlesticks",
    name: "Fiddlesticks",
    archetype: "roam",
    difficulty: 13,
    abilities: {
      passive: "A Harmless Scarecrow",
      q: "Terrify",
      w: "Bountiful Harvest",
      e: "Reap",
      r: "Crowstorm",
      key: "Terrify",
    },
    scores: { access: 77, protection: 44, sustain: 58, discipline: 56 },
    allyLabel: "Fear from fog",
    allyPlan:
      "Create vision denial first; fear and Crowstorm are far stronger when Fiddlesticks is unseen.",
    enemyPlan:
      "He hides in lane fog, fears the first target, and drains both champions if they stack.",
    trigger:
      "Interrupt or leave Bountiful Harvest, then punish before he reaches another fog angle.",
    parry:
      "Riposte Terrify or Crowstorm's fear when Fiddlesticks starts unseen.",
    levelOne:
      "Do not stand close enough for one drain to hit both allies.",
    levelTwo:
      "Treat every unverified brush effigy as a possible champion until vision resolves it.",
  }),
  support({
    id: "galio",
    dataDragonId: "Galio",
    name: "Galio",
    archetype: "peel",
    difficulty: 13,
    abilities: {
      passive: "Colossal Smash",
      q: "Winds of War",
      w: "Shield of Durand",
      e: "Justice Punch",
      r: "Hero's Entrance",
      key: "Shield of Durand",
    },
    scores: { access: 87, protection: 89, sustain: 4, discipline: 87 },
    allyLabel: "Taunt and counter-engage",
    allyPlan:
      "Let Galio absorb the first response, then use taunt duration for Fiora's clean target access.",
    enemyPlan:
      "He threatens dash plus taunt and punishes both bot laners for standing close.",
    trigger:
      "Move after Justice Punch misses or Shield of Durand is released.",
    parry:
      "Riposte the taunt release or Justice Punch knock-up.",
    levelOne:
      "Stand away from the wave so Winds of War does not push and poke together.",
    levelTwo:
      "Split from allied support and do not give a two-player taunt.",
  }),
  support({
    id: "gragas",
    dataDragonId: "Gragas",
    name: "Gragas",
    archetype: "engage",
    difficulty: 15,
    abilities: {
      passive: "Happy Hour",
      q: "Barrel Roll",
      w: "Drunken Rage",
      e: "Body Slam",
      r: "Explosive Cask",
      key: "Body Slam",
    },
    scores: { access: 90, protection: 84, sustain: 45, discipline: 78 },
    allyLabel: "Displacement engage",
    allyPlan:
      "Use Body Slam to start and save Explosive Cask to return the carry into Fiora, not away from her.",
    enemyPlan:
      "He blocks the direct Lunge with Body Slam and uses Cask to separate Fiora from the carry.",
    trigger:
      "Punish after Body Slam; without it, his close-range control is much weaker.",
    parry:
      "Riposte Body Slam or the Explosive Cask displacement.",
    levelOne:
      "Do not stand beside the wave where Barrel Roll gets free value.",
    levelTwo:
      "Approach from an angle that does not let Body Slam cover both Fiora and support.",
  }),
  support({
    id: "heimerdinger",
    dataDragonId: "Heimerdinger",
    name: "Heimerdinger",
    archetype: "mage",
    difficulty: 16,
    abilities: {
      passive: "Hextech Affinity",
      q: "H-28 G Evolution Turret",
      w: "Hextech Micro-Rockets",
      e: "CH-2 Electron Storm Grenade",
      r: "UPGRADE!!!",
      key: "CH-2 Electron Storm Grenade",
    },
    scores: { access: 44, protection: 61, sustain: 2, discipline: 58 },
    allyLabel: "Permanent zone",
    allyPlan:
      "Fight around turret control and use grenade stun to lock the carry inside Fiora's range.",
    enemyPlan:
      "He builds a turret nest, stuns the entry, and makes direct contact cost several turret shots.",
    trigger:
      "Clear or displace the turret line, then engage after grenade misses.",
    parry:
      "Riposte the grenade center stun.",
    levelOne:
      "Do not tank multiple turrets to secure one minion or brush.",
    levelTwo:
      "The lane is about dismantling the setup before forcing the champion.",
  }),
  support({
    id: "hwei",
    dataDragonId: "Hwei",
    name: "Hwei",
    archetype: "mage",
    difficulty: 17,
    abilities: {
      passive: "Signature of the Visionary",
      q: "Subject: Disaster",
      w: "Subject: Serenity",
      e: "Subject: Torment",
      r: "Spiraling Despair",
      key: "Subject: Torment",
    },
    scores: { access: 73, protection: 74, sustain: 21, discipline: 77 },
    allyLabel: "Flexible control",
    allyPlan:
      "Use Torment to start or protect Fiora, then choose damage only after the target path is fixed.",
    enemyPlan:
      "He clears from range and keeps three different control shapes for Fiora's entry.",
    trigger:
      "Track the spell family. Torment being spent is the meaningful engage window.",
    parry:
      "Riposte the selected Torment control spell or Spiraling Despair.",
    levelOne:
      "Stand away from the wave so Disaster cannot serve two targets.",
    levelTwo:
      "Do not confuse a Serenity utility cast with the main control cooldown.",
  }),
  support({
    id: "ivern",
    dataDragonId: "Ivern",
    name: "Ivern",
    archetype: "enchanter",
    difficulty: 8,
    abilities: {
      passive: "Friend of the Forest",
      q: "Rootcaller",
      w: "Brushmaker",
      e: "Triggerseed",
      r: "Daisy!",
      key: "Rootcaller",
    },
    scores: { access: 85, protection: 93, sustain: 18, discipline: 80 },
    allyLabel: "Root and shield delivery",
    allyPlan:
      "Rootcaller gives Fiora a free dash into range; Triggerseed then rewards staying on target.",
    enemyPlan:
      "He creates brush vision tricks, roots the direct path, and shields the carry for a slow explosion.",
    trigger:
      "Engage after Rootcaller or Triggerseed; do not fight the shield detonation by standing still.",
    parry:
      "Riposte Rootcaller.",
    levelOne:
      "Treat artificial brush as enemy-controlled vision space.",
    levelTwo:
      "Move away before Triggerseed detonates and slows the full exit.",
  }),
  support({
    id: "orianna",
    dataDragonId: "Orianna",
    name: "Orianna",
    archetype: "enchanter",
    difficulty: 10,
    abilities: {
      passive: "Clockwork Windup",
      q: "Command: Attack",
      w: "Command: Dissonance",
      e: "Command: Protect",
      r: "Command: Shockwave",
      key: "Command: Dissonance",
    },
    scores: { access: 55, protection: 83, sustain: 3, discipline: 82 },
    allyLabel: "Ball delivery",
    allyPlan:
      "Carry the ball on Fiora into melee range so Dissonance and Shockwave happen at the target.",
    enemyPlan:
      "She shields the carry, zones the approach with the ball, and punishes stacked targets at 6.",
    trigger:
      "Move after Dissonance or when the ball is far from the carry.",
    parry:
      "Riposte Command: Shockwave.",
    levelOne:
      "Track the ball, not only Orianna's model.",
    levelTwo:
      "Do not stand beside allied support when the ball is already between both champions.",
  }),
  support({
    id: "pantheon",
    dataDragonId: "Pantheon",
    name: "Pantheon",
    archetype: "engage",
    difficulty: 16,
    abilities: {
      passive: "Mortal Will",
      q: "Comet Spear",
      w: "Shield Vault",
      e: "Aegis Assault",
      r: "Grand Starfall",
      key: "Shield Vault",
    },
    scores: { access: 96, protection: 43, sustain: 2, discipline: 68 },
    allyLabel: "Point-click burst",
    allyPlan:
      "Use Shield Vault as the start signal and position Fiora around Aegis Assault instead of behind it.",
    enemyPlan:
      "He walks into point-click range, uses empowered W, then blocks retaliation with Aegis Assault.",
    trigger:
      "Punish after Shield Vault or when Aegis Assault faces the wrong direction.",
    parry:
      "Riposte Shield Vault. It is predictable and converts into a return stun.",
    levelOne:
      "Respect empowered spear poke but do not give brush control for free.",
    levelTwo:
      "Track passive stacks before entering his W range.",
  }),
  support({
    id: "poppy",
    dataDragonId: "Poppy",
    name: "Poppy",
    archetype: "warden",
    difficulty: 17,
    abilities: {
      passive: "Iron Ambassador",
      q: "Hammer Shock",
      w: "Steadfast Presence",
      e: "Heroic Charge",
      r: "Keeper's Verdict",
      key: "Steadfast Presence",
    },
    scores: { access: 84, protection: 100, sustain: 5, discipline: 93 },
    allyLabel: "Anti-dash control",
    allyPlan:
      "Use Heroic Charge or Steadfast Presence to fix mobile targets, then let Fiora clean the short lane.",
    enemyPlan:
      "She denies Lunge with W and turns every wall-side position into Heroic Charge stun.",
    trigger:
      "Force Steadfast Presence without using the full engage, then return during its long cooldown.",
    parry:
      "Riposte Heroic Charge stun or Keeper's Verdict knock-up.",
    levelOne:
      "Stay away from walls and do not Lunge while Steadfast Presence is active.",
    levelTwo:
      "The wall angle matters more than the carry's exact HP.",
  }),
  support({
    id: "rumble",
    dataDragonId: "Rumble",
    name: "Rumble",
    archetype: "mage",
    difficulty: 15,
    abilities: {
      passive: "Junkyard Titan",
      q: "Flamespitter",
      w: "Scrap Shield",
      e: "Electro Harpoon",
      r: "The Equalizer",
      key: "Electro Harpoon",
    },
    scores: { access: 54, protection: 35, sustain: 3, discipline: 52 },
    allyLabel: "Heat pressure",
    allyPlan:
      "Use repeated Harpoon slows to create Fiora range, then fight while Flamespitter controls the exit.",
    enemyPlan:
      "He owns brush with Flamespitter and stacks Harpoon slows until Fiora cannot leave.",
    trigger:
      "Engage while he is overheated without the right spell sequence or after both Harpoons.",
    parry:
      "Use Riposte on enemy carry control; Rumble's slows are usually handled with movement.",
    levelOne:
      "Do not contest brush through an active Flamespitter.",
    levelTwo:
      "Track heat before assuming his next spell is available.",
  }),
  support({
    id: "shaco",
    dataDragonId: "Shaco",
    name: "Shaco",
    archetype: "roam",
    difficulty: 15,
    abilities: {
      passive: "Backstab",
      q: "Deceive",
      w: "Jack In The Box",
      e: "Two-Shiv Poison",
      r: "Hallucinate",
      key: "Jack In The Box",
    },
    scores: { access: 48, protection: 67, sustain: 3, discipline: 42 },
    allyLabel: "Trap counter-engage",
    allyPlan:
      "Fight back toward prepared boxes and let Fiora draw the enemy into fear range.",
    enemyPlan:
      "He seeds brush and retreat paths, disappears from vision, and punishes direct pursuit.",
    trigger:
      "Clear boxes with vision and engage the carry while Deceive is known.",
    parry:
      "Riposte Jack In The Box fear if the trap is revealed too late.",
    levelOne:
      "Never face-check the first brush without sweeper or minion information.",
    levelTwo:
      "Do not chase Shaco; pressure the carry and wave instead.",
  }),
  support({
    id: "shen",
    dataDragonId: "Shen",
    name: "Shen",
    archetype: "warden",
    difficulty: 12,
    abilities: {
      passive: "Ki Barrier",
      q: "Twilight Assault",
      w: "Spirit's Refuge",
      e: "Shadow Dash",
      r: "Stand United",
      key: "Shadow Dash",
    },
    scores: { access: 87, protection: 99, sustain: 5, discipline: 94 },
    allyLabel: "Taunt and auto denial",
    allyPlan:
      "Use Shadow Dash for access and Spirit's Refuge to protect Fiora's close-range auto sequence.",
    enemyPlan:
      "He taunts the entry and places an auto-blocking zone over the carry.",
    trigger:
      "Bait Shadow Dash or Spirit's Refuge, leave, then repeat before both return.",
    parry:
      "Riposte Shadow Dash.",
    levelOne:
      "Do not trade into an empowered Q blade pull through Fiora.",
    levelTwo:
      "Bladework loses value inside Spirit's Refuge; wait it out.",
  }),
  support({
    id: "swain",
    dataDragonId: "Swain",
    name: "Swain",
    archetype: "mage",
    difficulty: 14,
    abilities: {
      passive: "Ravenous Flock",
      q: "Death's Hand",
      w: "Vision of Empire",
      e: "Nevermove",
      r: "Demonic Ascension",
      key: "Nevermove",
    },
    scores: { access: 75, protection: 39, sustain: 72, discipline: 66 },
    allyLabel: "Pull and drain",
    allyPlan:
      "Let Nevermove pull the target into Fiora, then split before Swain needs both enemies for healing.",
    enemyPlan:
      "He catches through the wave and turns a stacked fight into soul healing and level 6 drain.",
    trigger:
      "Move after Nevermove misses and end level 6 contact before Demonic Ascension stabilizes.",
    parry:
      "Riposte Nevermove root.",
    levelOne:
      "Respect the return path, not only the outward projectile.",
    levelTwo:
      "Do not stand close enough for one pull to expose both allies.",
  }),
  support({
    id: "taliyah",
    dataDragonId: "Taliyah",
    name: "Taliyah",
    archetype: "mage",
    difficulty: 16,
    abilities: {
      passive: "Rock Surfing",
      q: "Threaded Volley",
      w: "Seismic Shove",
      e: "Unraveled Earth",
      r: "Weaver's Wall",
      key: "Seismic Shove",
    },
    scores: { access: 79, protection: 69, sustain: 2, discipline: 78 },
    allyLabel: "Displacement zone",
    allyPlan:
      "Use Seismic Shove to move the carry toward Fiora and Unraveled Earth to punish their dash out.",
    enemyPlan:
      "She places anti-dash rocks in Fiora's route, then shoves the predictable landing point.",
    trigger:
      "Engage after Seismic Shove and avoid dashing through Unraveled Earth.",
    parry:
      "Riposte Seismic Shove if the knock direction would end the trade.",
    levelOne:
      "Stand away from the wave so Threaded Volley cannot clear and poke together.",
    levelTwo:
      "Lunge around, not through, Unraveled Earth.",
  }),
  support({
    id: "velkoz",
    dataDragonId: "Velkoz",
    name: "Vel'Koz",
    archetype: "mage",
    difficulty: 16,
    abilities: {
      passive: "Organic Deconstruction",
      q: "Plasma Fission",
      w: "Void Rift",
      e: "Tectonic Disruption",
      r: "Life Form Disintegration Ray",
      key: "Tectonic Disruption",
    },
    scores: { access: 56, protection: 36, sustain: 1, discipline: 59 },
    allyLabel: "Artillery and knock-up",
    allyPlan:
      "Use Tectonic Disruption to secure Fiora's entry, then let Vel'Koz damage the fixed target.",
    enemyPlan:
      "He angles split Q around minions and knocks up the point where Fiora must finish contact.",
    trigger:
      "Engage after Tectonic Disruption; his close-range protection then collapses.",
    parry:
      "Riposte Tectonic Disruption.",
    levelOne:
      "Watch the sideways Q split, not only the first projectile.",
    levelTwo:
      "Avoid three passive stacks; true damage turns small poke into a real loss.",
  }),
  support({
    id: "xerath",
    dataDragonId: "Xerath",
    name: "Xerath",
    archetype: "mage",
    difficulty: 18,
    abilities: {
      passive: "Mana Surge",
      q: "Arcanopulse",
      w: "Eye of Destruction",
      e: "Shocking Orb",
      r: "Rite of the Arcane",
      key: "Shocking Orb",
    },
    scores: { access: 50, protection: 32, sustain: 1, discipline: 60 },
    allyLabel: "Long-range pressure",
    allyPlan:
      "Let artillery lower the target first; Fiora enters only after Shocking Orb fixes or zones the retreat.",
    enemyPlan:
      "He removes HP from outside engage range, slows first, then stuns the predictable path.",
    trigger:
      "Use brush and engage after Shocking Orb. That cooldown decides whether contact is legal.",
    parry:
      "Riposte Shocking Orb.",
    levelOne:
      "Stand outside the wave so charged Arcanopulse cannot hit both jobs.",
    levelTwo:
      "Do not enter while slowed by Eye of Destruction.",
  }),
  support({
    id: "zac",
    dataDragonId: "Zac",
    name: "Zac",
    archetype: "engage",
    difficulty: 15,
    abilities: {
      passive: "Cell Division",
      q: "Stretching Strikes",
      w: "Unstable Matter",
      e: "Elastic Slingshot",
      r: "Let's Bounce!",
      key: "Elastic Slingshot",
    },
    scores: { access: 96, protection: 70, sustain: 62, discipline: 72 },
    allyLabel: "Fog engage",
    allyPlan:
      "Use long-range Slingshot from fog and keep Fiora ready to enter before the knock-up ends.",
    enemyPlan:
      "He charges from unseen angles, links two targets with Q, and survives through blobs.",
    trigger:
      "Punish a missed Slingshot and step on healing blobs during the trade.",
    parry:
      "Riposte Elastic Slingshot knock-up or the first Let's Bounce! displacement.",
    levelOne:
      "Do not let Stretching Strikes connect Fiora to allied support or a minion.",
    levelTwo:
      "Ward deep enough to see the Slingshot charge, not only the landing circle.",
  }),
];

export const botLaneSupports = [
  ...coreSupports,
  ...moreCoreSupports,
  ...flexSupports,
].sort((left, right) => left.name.localeCompare(right.name));

export const defaultBotSupportId = "alistar";
