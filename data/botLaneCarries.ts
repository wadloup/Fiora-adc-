import {
  championLoadingImage,
  type BotCarryProfile,
} from "./botLanePatch";

function carry(
  profile: Omit<BotCarryProfile, "image">
): BotCarryProfile {
  return {
    ...profile,
    image: championLoadingImage(profile.dataDragonId),
  };
}

export const botLaneCarries: BotCarryProfile[] = [
  carry({
    id: "aphelios",
    dataDragonId: "Aphelios",
    name: "Aphelios",
    archetype: "Weapon cycle",
    difficulty: 69,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "The Hitman and the Seer",
      q: "Weapon Abilities",
      w: "Phase",
      e: "Weapon Queue System",
      r: "Moonlight Vigil",
      key: "Weapon Abilities",
    },
    threat:
      "His lane changes with every weapon pair: Calibrum controls range, Gravitum catches, and Severum wins extended trades.",
    lanePlan:
      "Read the two visible weapons before deciding whether the lane is poke, catch, or sustain.",
    punish:
      "Go when Gravitum is absent, Severum Q is spent, or his current pair cannot protect close range.",
    parry:
      "Riposte Gravitum root or the support CC. Do not guess into a harmless weapon swap.",
    levelOne:
      "Calibrum can tax every melee last hit. Preserve HP and track his ammo instead of forcing.",
    levelTwo:
      "His second weapon creates the first real combo. Wait until the active Q has been shown.",
    wave:
      "Keep the lane short against Calibrum and Gravitum; pressure harder into Infernum without a stacked wave.",
    firstBack:
      "Boots are valuable into Calibrum spacing. Tiamat is safe once the lane can be touched.",
    avoid:
      "Treating every weapon pair like the same champion.",
  }),
  carry({
    id: "ashe",
    dataDragonId: "Ashe",
    name: "Ashe",
    archetype: "Slow field",
    difficulty: 74,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Frost Shot",
      q: "Ranger's Focus",
      w: "Volley",
      e: "Hawkshot",
      r: "Enchanted Crystal Arrow",
      key: "Volley / Enchanted Crystal Arrow",
    },
    threat:
      "Repeated slows turn one bad step into a full-lane chase, then Arrow removes the safe engage angle at level 6.",
    lanePlan:
      "She wants a long lane, repeated autos, and Volley through open minion angles.",
    punish:
      "Enter after Volley misses or while Ranger's Focus is not primed, then front-load the trade before her slows take over.",
    parry:
      "Before 6, hold W for support CC. After 6, Arrow is the premium Riposte target.",
    levelOne:
      "Use minions to reduce Volley angles and never retreat in a straight line.",
    levelTwo:
      "Enter only with a real exit route; one extra auto is not worth losing the lane to slows.",
    wave:
      "Do not let her freeze a long lane. Crash fully or hold the wave on Fiora's half.",
    firstBack:
      "Early boots gain unusual value. Add Tiamat when the wave is stable.",
    avoid:
      "Spending Q before deciding how the trade ends.",
  }),
  carry({
    id: "caitlyn",
    dataDragonId: "Caitlyn",
    name: "Caitlyn",
    archetype: "Range lock",
    difficulty: 82,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Headshot",
      q: "Piltover Peacemaker",
      w: "Yordle Snap Trap",
      e: "90 Caliber Net",
      r: "Ace in the Hole",
      key: "Yordle Snap Trap",
    },
    threat:
      "Range, brush Headshots, and trap lines can deny the wave before Fiora has a legal engage.",
    lanePlan:
      "She pushes, owns brush, then places traps behind the minions or under allied CC.",
    punish:
      "Shorten the lane on the bounce and move after Peacemaker or Net is committed.",
    parry:
      "Use W on a forced trap root. Do not spend it fishing for 90 Caliber Net.",
    levelOne:
      "Give up the first auto war, preserve HP, and contest only the brush support can hold.",
    levelTwo:
      "Do not walk through a stacked wave. Fight after support creates a clean lane.",
    wave:
      "Let the wave leave her tower side, then freeze or slow push from Fiora's half.",
    firstBack:
      "Boots or defensive sustain first; Tiamat only when HP is stable.",
    avoid:
      "Taking three autos to secure one ranged minion.",
  }),
  carry({
    id: "corki",
    dataDragonId: "Corki",
    name: "Corki",
    archetype: "Spell burst",
    difficulty: 61,
    runeBias: "hob",
    damage: "mixed",
    abilities: {
      passive: "Hextech Munitions",
      q: "Phosphorus Bomb",
      w: "Valkyrie",
      e: "Gatling Gun",
      r: "Missile Barrage",
      key: "Valkyrie",
    },
    threat:
      "Mixed damage and Valkyrie make weak first engages expensive, while missiles control the lane after 6.",
    lanePlan:
      "He farms with spells, chips from range, and holds Valkyrie until the commitment is obvious.",
    punish:
      "Force Valkyrie with the support, then re-enter before it returns.",
    parry:
      "Use W on support CC or across Gatling Gun after Corki has committed forward.",
    levelOne:
      "Stand outside the wave so Phosphorus Bomb cannot hit both Fiora and minions.",
    levelTwo:
      "Pressure his escape angle instead of Q-ing directly at his current position.",
    wave:
      "Keep the wave moving; a static lane gives him free spell farming.",
    firstBack:
      "Tiamat keeps his spell clear occupied and opens support movement.",
    avoid:
      "Chasing through Gatling Gun after Valkyrie already created distance.",
  }),
  carry({
    id: "draven",
    dataDragonId: "Draven",
    name: "Draven",
    archetype: "Cash-out lane",
    difficulty: 88,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "League of Draven",
      q: "Spinning Axe",
      w: "Blood Rush",
      e: "Stand Aside",
      r: "Whirling Death",
      key: "Stand Aside",
    },
    threat:
      "Level 1 damage and an early cash-out can decide the lane before Fiora reaches wave control.",
    lanePlan:
      "He catches axes forward, refreshes Blood Rush, and wants the lane long enough to chase.",
    punish:
      "Attack the next axe landing point when support has pressure and Stand Aside is unavailable.",
    parry:
      "Hold W for Stand Aside or the support's hard CC.",
    levelOne:
      "No ego trade. Thin the wave and keep HP to punish his first bad axe.",
    levelTwo:
      "Fight only after his support misses or an axe lands on the wrong side.",
    wave:
      "Keep the wave close enough that his chase cannot use the full lane.",
    firstBack:
      "Buy stability before greed. Returning with low HP gives him the cash-out window.",
    avoid:
      "Starting contact while both axes and enemy engage are available.",
  }),
  carry({
    id: "ezreal",
    dataDragonId: "Ezreal",
    name: "Ezreal",
    archetype: "Slippery poke",
    difficulty: 56,
    runeBias: "hob",
    damage: "mixed",
    abilities: {
      passive: "Rising Spell Force",
      q: "Mystic Shot",
      w: "Essence Flux",
      e: "Arcane Shift",
      r: "Trueshot Barrage",
      key: "Arcane Shift",
    },
    threat:
      "Arcane Shift erases lazy engages and turns the lane into a bad chase.",
    lanePlan:
      "He hides Mystic Shot behind the wave and saves Arcane Shift for the second half of contact.",
    punish:
      "Build the wave, force Arcane Shift, then repeat before its cooldown returns.",
    parry:
      "Riposte the support setup or use the slow after his Arcane Shift.",
    levelOne:
      "Stand behind minions and make him choose between poke and last hits.",
    levelTwo:
      "Pressure the space Arcane Shift needs, not the position Ezreal currently occupies.",
    wave:
      "Stack a wave and make him farm while support takes brush and river space.",
    firstBack:
      "Tiamat components keep him occupied by the wave.",
    avoid:
      "Spending every gap closer before Arcane Shift is gone.",
  }),
  carry({
    id: "jhin",
    dataDragonId: "Jhin",
    name: "Jhin",
    archetype: "Fourth-shot catch",
    difficulty: 70,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Whisper",
      q: "Dancing Grenade",
      w: "Deadly Flourish",
      e: "Captive Audience",
      r: "Curtain Call",
      key: "Deadly Flourish",
    },
    threat:
      "Fourth shot, support damage, and Deadly Flourish create a clean catch pattern from outside Fiora's range.",
    lanePlan:
      "He sets up a marked target, roots from range, spends fourth shot, then disengages while reloading.",
    punish:
      "Go during reload or after Deadly Flourish misses; do not wait for his next fourth shot.",
    parry:
      "Riposte Deadly Flourish when marked or the support CC that enables it.",
    levelOne:
      "Track ammo and give the fourth shot space instead of trading HP for one minion.",
    levelTwo:
      "Stand away from low minions so Dancing Grenade cannot bounce into the trade.",
    wave:
      "Hold the wave off tower and deny straight root lines through open space.",
    firstBack:
      "Boots help break his fixed cadence; Tiamat follows when the wave is safe.",
    avoid:
      "Engaging as he reaches fourth shot with Deadly Flourish ready.",
  }),
  carry({
    id: "jinx",
    dataDragonId: "Jinx",
    name: "Jinx",
    archetype: "Immobile scaling",
    difficulty: 57,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Get Excited!",
      q: "Switcheroo!",
      w: "Zap!",
      e: "Flame Chompers!",
      r: "Super Mega Death Rocket!",
      key: "Flame Chompers!",
    },
    threat:
      "Chompers and support peel are the only barriers between Fiora and an otherwise immobile scaler.",
    lanePlan:
      "She uses rockets to control the wave and saves Chompers for the support's CC or Fiora's path.",
    punish:
      "Move after Chompers miss and the wave is not oversized.",
    parry:
      "Riposte a forced Chompers root; otherwise keep W for support control.",
    levelOne:
      "Avoid free rocket splash and preserve HP for the first real contact.",
    levelTwo:
      "Her lane breaks when Chompers are down and support cannot peel both angles.",
    wave:
      "Crash cleanly, then make her last-hit while allied support owns brush.",
    firstBack:
      "Tiamat into Hydra if the lane remains controlled.",
    avoid:
      "Diving through Chompers without Riposte.",
  }),
  carry({
    id: "kaisa",
    dataDragonId: "Kaisa",
    name: "Kai'Sa",
    archetype: "Burst follow-up",
    difficulty: 65,
    runeBias: "hob",
    damage: "mixed",
    abilities: {
      passive: "Second Skin",
      q: "Icathian Rain",
      w: "Void Seeker",
      e: "Supercharge",
      r: "Killer Instinct",
      key: "Icathian Rain",
    },
    threat:
      "Isolated Q and ally CC stack Plasma quickly; patch 26.15 also strengthens her late scaling.",
    lanePlan:
      "She follows support CC, isolates Q away from minions, then uses Supercharge to extend or exit.",
    punish:
      "Fight near allied minions and pressure before her support creates Plasma stacks.",
    parry:
      "Block the support setup or the return burst after Kai'Sa commits.",
    levelOne:
      "Stay near the wave so Icathian Rain cannot isolate onto Fiora.",
    levelTwo:
      "Force her to choose between following support and keeping a safe minion line.",
    wave:
      "Fight with allied minions nearby; avoid isolated river-side contact.",
    firstBack:
      "Tiamat is the default. Stable components beat a decorative damage buy.",
    avoid:
      "Entering alone after the allied wave has already died.",
  }),
  carry({
    id: "kalista",
    dataDragonId: "Kalista",
    name: "Kalista",
    archetype: "Spear tempo",
    difficulty: 84,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Martial Poise",
      q: "Pierce",
      w: "Sentinel",
      e: "Rend",
      r: "Fate's Call",
      key: "Rend",
    },
    threat:
      "Martial Poise kites every predictable Lunge and Rend converts a long trade before Fiora can leave.",
    lanePlan:
      "She stacks spears through the wave, hops away from contact, then Rends for damage and slow.",
    punish:
      "Short trades after Rend is spent are far safer than chasing through fresh spear stacks.",
    parry:
      "Riposte the support's hard CC or across Rend slow when the exit is otherwise lost.",
    levelOne:
      "Do not contest an extended auto lane. Force her hops toward brush or terrain.",
    levelTwo:
      "Track the bonded support's engage; Kalista converts their first contact immediately.",
    wave:
      "Keep the lane short and avoid letting her stack multiple minions beside Fiora.",
    firstBack:
      "Boots are mandatory value. Add Tiamat only after movement is playable.",
    avoid:
      "Following every hop with Lunge until no exit remains.",
  }),
  carry({
    id: "kogmaw",
    dataDragonId: "KogMaw",
    name: "Kog'Maw",
    archetype: "Range steroid",
    difficulty: 67,
    runeBias: "hob",
    damage: "mixed",
    abilities: {
      passive: "Icathian Surprise",
      q: "Caustic Spittle",
      w: "Bio-Arcane Barrage",
      e: "Void Ooze",
      r: "Living Artillery",
      key: "Bio-Arcane Barrage",
    },
    threat:
      "Bio-Arcane Barrage gives him the range and percent damage to win a straight front-to-back trade.",
    lanePlan:
      "He activates W, stands behind peel, and uses Void Ooze to make disengage expensive.",
    punish:
      "Back away during W, then attack its downtime before the support resets formation.",
    parry:
      "Use W on enemy hard CC, not on Kog'Maw poke.",
    levelOne:
      "Do not enter his W auto range without a full support-created plan.",
    levelTwo:
      "Threaten the support angle and save the second movement for Void Ooze.",
    wave:
      "Keep pressure on the wave so he cannot hold W only for Fiora.",
    firstBack:
      "Boots and Tiamat both reduce the time spent inside his range window.",
    avoid:
      "Committing at the start of Bio-Arcane Barrage.",
  }),
  carry({
    id: "lucian",
    dataDragonId: "Lucian",
    name: "Lucian",
    archetype: "Short burst",
    difficulty: 75,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Lightslinger",
      q: "Piercing Light",
      w: "Ardent Blaze",
      e: "Relentless Pursuit",
      r: "The Culling",
      key: "Relentless Pursuit",
    },
    threat:
      "His level 2 spell rotation and passive doubles win trades before Fiora settles into contact.",
    lanePlan:
      "He pairs with ally buffs or CC, dashes for an angle, then unloads passive shots.",
    punish:
      "Let the first rotation end and re-enter while Relentless Pursuit is unavailable.",
    parry:
      "Use W on support setup or across the committed dash line.",
    levelOne:
      "Keep the wave even and do not donate level 2 position.",
    levelTwo:
      "Respect the first rotation, then use the cooldown gap rather than forcing simultaneously.",
    wave:
      "Prevent the early crash that grants him a clean reset and another pressure cycle.",
    firstBack:
      "A stable first buy protects the next two waves better than pure damage.",
    avoid:
      "Trading into Lightslinger without a second phase planned.",
  }),
  carry({
    id: "missfortune",
    dataDragonId: "MissFortune",
    name: "Miss Fortune",
    archetype: "Bounce punish",
    difficulty: 71,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Love Tap",
      q: "Double Up",
      w: "Strut",
      e: "Make It Rain",
      r: "Bullet Time",
      key: "Double Up",
    },
    threat:
      "Double Up punishes last-hit alignment and Make It Rain lets support CC or Bullet Time land cleanly.",
    lanePlan:
      "She attacks through low minions, alternates Love Tap targets, and keeps Strut until threatened.",
    punish:
      "Stand off the bounce line and engage after Make It Rain or Strut is broken.",
    parry:
      "Riposte the support CC that starts Bullet Time; W does not cancel the channel by itself.",
    levelOne:
      "Never stand behind a low caster. That single rule protects most of the lane.",
    levelTwo:
      "Break Strut with support poke before Fiora commits Lunge.",
    wave:
      "Avoid thin, low-health minion lines that amplify Double Up.",
    firstBack:
      "Boots help dodge bounce geometry and Make It Rain. Tiamat follows.",
    avoid:
      "Using a low minion as cover from Miss Fortune.",
  }),
  carry({
    id: "nilah",
    dataDragonId: "Nilah",
    name: "Nilah",
    archetype: "Melee sustain",
    difficulty: 62,
    runeBias: "pta",
    damage: "physical",
    abilities: {
      passive: "Joy Unending",
      q: "Formless Blade",
      w: "Jubilant Veil",
      e: "Slipstream",
      r: "Apotheosis",
      key: "Jubilant Veil",
    },
    threat:
      "Shared experience spikes and Jubilant Veil can invalidate Fiora's short auto-based burst.",
    lanePlan:
      "She concedes some range, reaches level spikes early, then dashes through units for an extended fight.",
    punish:
      "Bait Jubilant Veil, disengage, and re-enter before it returns.",
    parry:
      "Riposte the support CC or Apotheosis pull at level 6.",
    levelOne:
      "Own the wave edge but do not stand where Slipstream can use a minion to reach Fiora.",
    levelTwo:
      "Check the experience race; her duo may hit level 2 before the wave looks ready.",
    wave:
      "Keep minions positioned so they are not free dash anchors.",
    firstBack:
      "Tiamat lets Fiora contest her wave sustain and reset cadence.",
    avoid:
      "Using Bladework entirely into Jubilant Veil.",
  }),
  carry({
    id: "samira",
    dataDragonId: "Samira",
    name: "Samira",
    archetype: "All-in reset",
    difficulty: 79,
    runeBias: "pta",
    damage: "physical",
    abilities: {
      passive: "Daredevil Impulse",
      q: "Flair",
      w: "Blade Whirl",
      e: "Wild Rush",
      r: "Inferno Trigger",
      key: "Blade Whirl",
    },
    threat:
      "Enemy knock-up starts her passive chain, and Blade Whirl can erase key allied projectiles.",
    lanePlan:
      "She waits for support CC, dashes in after it lands, and stacks style on trapped targets.",
    punish:
      "Counter-engage after she dashes forward and loses the easy exit.",
    parry:
      "Parry the engage CC, not a random pistol shot.",
    levelOne:
      "Track support distance. Samira alone does not deserve full engage respect.",
    levelTwo:
      "Punish a failed enemy engage before Blade Whirl and Wild Rush reset the lane.",
    wave:
      "Keep allied minions so her dash path cannot isolate Fiora.",
    firstBack:
      "Stable route first; a lost all-in costs more than a slower Hydra.",
    avoid:
      "Giving her multiple targets and a free style sequence.",
  }),
  carry({
    id: "senna",
    dataDragonId: "Senna",
    name: "Senna",
    archetype: "Range scaling",
    difficulty: 73,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Absolution",
      q: "Piercing Darkness",
      w: "Last Embrace",
      e: "Curse of the Black Mist",
      r: "Dawning Shadow",
      key: "Last Embrace",
    },
    threat:
      "Q sustain and soul range scaling reward every passive lane where Fiora cannot touch her.",
    lanePlan:
      "She trades through minions, collects souls, and uses Last Embrace to punish a direct path.",
    punish:
      "Engage after Last Embrace misses and before Q sustain erases the previous trade.",
    parry:
      "Riposte the delayed Last Embrace root or the partner's hard CC.",
    levelOne:
      "Do not give free auto-Q soul trades for one minion.",
    levelTwo:
      "Approach from brush or a second angle so Last Embrace cannot cover both players.",
    wave:
      "Keep the wave moving and deny a quiet soul-farming lane.",
    firstBack:
      "Boots reduce her range tax; Tiamat accelerates pressure afterward.",
    avoid:
      "Walking through open lane while marked by Last Embrace.",
  }),
  carry({
    id: "sivir",
    dataDragonId: "Sivir",
    name: "Sivir",
    archetype: "Wave shield",
    difficulty: 53,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Fleet of Foot",
      q: "Boomerang Blade",
      w: "Ricochet",
      e: "Spell Shield",
      r: "On The Hunt",
      key: "Spell Shield",
    },
    threat:
      "Permanent wave control and Spell Shield can turn a predictable support engage into mana and tempo for Sivir.",
    lanePlan:
      "She clears quickly, fishes for both passes of Boomerang Blade, and shields the first obvious spell.",
    punish:
      "Bait Spell Shield with a low-cost support spell, then engage before it returns.",
    parry:
      "Use W for enemy support control or the second Boomerang pass when escape is narrow.",
    levelOne:
      "Stand off the wave so Ricochet does not tax every last hit.",
    levelTwo:
      "Do not stack allied engage into one Spell Shield timing.",
    wave:
      "Match enough clear to avoid permanent tower pressure, then punish overextension.",
    firstBack:
      "Tiamat is high value because the matchup is decided by wave tempo.",
    avoid:
      "Telegraphing the only engage spell into Spell Shield.",
  }),
  carry({
    id: "smolder",
    dataDragonId: "Smolder",
    name: "Smolder",
    archetype: "Stacking lane",
    difficulty: 49,
    runeBias: "hob",
    damage: "mixed",
    abilities: {
      passive: "Dragon Practice",
      q: "Super Scorcher Breath",
      w: "Achooo!",
      e: "Flap, Flap, Flap",
      r: "MMOOOMMMM!",
      key: "Flap, Flap, Flap",
    },
    threat:
      "The lane threat is not burst; it is allowing free stacks and a safe route to his execute scaling.",
    lanePlan:
      "He Q-stacks minions, uses Achooo through the wave, and keeps Flap for disengage.",
    punish:
      "Make every Q stack cost position and repeat contact after Flap is spent.",
    parry:
      "Save W for support control or the slow that stops Fiora's exit.",
    levelOne:
      "Take space early and tax every stack attempt.",
    levelTwo:
      "Use support pressure to force a summoner before he settles into farming.",
    wave:
      "Crash on a plan, then contest the bounce instead of perma-shoving.",
    firstBack:
      "Tiamat keeps the lane moving and opens cleaner support roams.",
    avoid:
      "Calling a passive farm lane acceptable because nobody died.",
  }),
  carry({
    id: "tristana",
    dataDragonId: "Tristana",
    name: "Tristana",
    archetype: "Jump all-in",
    difficulty: 76,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Draw a Bead",
      q: "Rapid Fire",
      w: "Rocket Jump",
      e: "Explosive Charge",
      r: "Buster Shot",
      key: "Rocket Jump",
    },
    threat:
      "Explosive Charge plus Rocket Jump creates a committed burst that can reset if Fiora or support dies.",
    lanePlan:
      "She pushes passively with E splash, jumps only when the kill math or reset is favorable.",
    punish:
      "When she jumps in, turn on her after the landing slow and deny the fourth charge stack.",
    parry:
      "Riposte Buster Shot at 6 or the support CC that holds Fiora for the E detonation.",
    levelOne:
      "Use her forced splash push to prepare a safer bounce.",
    levelTwo:
      "Do not stand close enough for Rocket Jump to hit both bot laners.",
    wave:
      "She cannot freeze cleanly because Explosive Charge pushes; exploit the returning wave.",
    firstBack:
      "Stable HP and Tiamat let Fiora survive her burst and keep wave parity.",
    avoid:
      "Running away in a straight line while Explosive Charge reaches full stacks.",
  }),
  carry({
    id: "twitch",
    dataDragonId: "Twitch",
    name: "Twitch",
    archetype: "Stealth punish",
    difficulty: 78,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Deadly Venom",
      q: "Ambush",
      w: "Venom Cask",
      e: "Contaminate",
      r: "Spray and Pray",
      key: "Ambush",
    },
    threat:
      "His missing icon changes every tower hit, recall timing, and long-lane decision.",
    lanePlan:
      "He disappears, approaches from an unwarded angle, stacks poison, then cashes out with Contaminate.",
    punish:
      "Attack while Ambush is down or force the wave before he can create another disappearance.",
    parry:
      "Use W slow after he appears or on the support spell holding Fiora in place.",
    levelOne:
      "Mark his last visible position and do not trade through a poison stack race.",
    levelTwo:
      "If he vanishes, shorten the decision and back away before the angle exists.",
    wave:
      "Crash only when his position is known; do not Lunge at tower into stealth.",
    firstBack:
      "Boots and wave control matter more than a greedy component.",
    avoid:
      "Assuming he recalled because the lane went quiet.",
  }),
  carry({
    id: "varus",
    dataDragonId: "Varus",
    name: "Varus",
    archetype: "Poke or on-hit",
    difficulty: 77,
    runeBias: "hob",
    damage: "mixed",
    abilities: {
      passive: "Living Vengeance",
      q: "Piercing Arrow",
      w: "Blighted Quiver",
      e: "Hail of Arrows",
      r: "Chain of Corruption",
      key: "Chain of Corruption",
    },
    threat:
      "Poke Varus controls HP; on-hit Varus wins extended trades; both gain a hard catch at level 6.",
    lanePlan:
      "He stacks Blight before detonating it or keeps distance for charged Piercing Arrows.",
    punish:
      "Read the build, move after Hail of Arrows, and never give free Blight detonation.",
    parry:
      "Chain of Corruption is the level 6 Riposte target. Before then, hold for support CC.",
    levelOne:
      "Stand away from the minion line so Piercing Arrow cannot serve two jobs.",
    levelTwo:
      "Exit before three Blight stacks become a full spell trade.",
    wave:
      "Keep enough minions to block poke without allowing a permanent enemy crash.",
    firstBack:
      "Boots first into poke; Tiamat first only when HP control is secure.",
    avoid:
      "Using Riposte on poke seconds before Chain of Corruption.",
  }),
  carry({
    id: "vayne",
    dataDragonId: "Vayne",
    name: "Vayne",
    archetype: "Duel scaling",
    difficulty: 75,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Night Hunter",
      q: "Tumble",
      w: "Silver Bolts",
      e: "Condemn",
      r: "Final Hour",
      key: "Condemn",
    },
    threat:
      "Condemn and repeated short Tumbles punish wall-side entries while Silver Bolts wins careless extensions.",
    lanePlan:
      "She farms through weak early range, then turns every wall angle into a Condemn threat.",
    punish:
      "Own the wave and engage from open space before she receives free scaling.",
    parry:
      "Condemn is the spell. Keep W until the angle is real.",
    levelOne:
      "Pressure the wave without standing near terrain that gives her a stun.",
    levelTwo:
      "Make support start contact from open space and hold W through her panic step.",
    wave:
      "Push with purpose; do not give her a quiet lane.",
    firstBack:
      "Tiamat keeps the wave under pressure and limits comfortable trades.",
    avoid:
      "Chasing beside a wall while Riposte is unavailable.",
  }),
  carry({
    id: "xayah",
    dataDragonId: "Xayah",
    name: "Xayah",
    archetype: "Feather zone",
    difficulty: 81,
    runeBias: "hob",
    damage: "physical",
    abilities: {
      passive: "Clean Cuts",
      q: "Double Daggers",
      w: "Deadly Plumage",
      e: "Bladecaller",
      r: "Featherstorm",
      key: "Bladecaller",
    },
    threat:
      "Every engage path can cross three feathers, turning Bladecaller into a root and burst.",
    lanePlan:
      "She places feathers through the wave, invites pursuit, then pulls them through Fiora.",
    punish:
      "Approach from the side, count feathers, and re-engage after Bladecaller.",
    parry:
      "Riposte the three-feather root. Do not spend W before the pull line is known.",
    levelOne:
      "Do not stand in line with both minions and feather endpoints.",
    levelTwo:
      "Short contact only; Deadly Plumage wins a stationary auto race.",
    wave:
      "Avoid chasing through the center of her feather field.",
    firstBack:
      "Boots make feather geometry manageable; Tiamat keeps the lane moving.",
    avoid:
      "Following Xayah backward along the exact path she prepared.",
  }),
  carry({
    id: "yunara",
    dataDragonId: "Yunara",
    name: "Yunara",
    archetype: "Transcendent scaler",
    difficulty: 72,
    runeBias: "hob",
    damage: "mixed",
    abilities: {
      passive: "Vow of the First Lands",
      q: "Cultivation of Spirit",
      w: "Arc of Judgment / Arc of Ruin",
      e: "Kanmei's Steps / Untouchable Shadow",
      r: "Transcend One's Self",
      key: "Kanmei's Steps",
    },
    threat:
      "Q gives attack speed and spreading on-hit damage; level 6 upgrades her slow and mobility into a stronger combat form.",
    lanePlan:
      "She activates Q around a prepared wave, slows with W, then uses E movement to keep the ideal range.",
    punish:
      "Wait out Cultivation of Spirit and attack before it or her movement tool returns.",
    parry:
      "Riposte enemy support CC; her own W slow is usually not worth the cooldown.",
    levelOne:
      "Do not fight inside her active Q while nearby minions spread damage.",
    levelTwo:
      "Force E for spacing, then let support own the next contact.",
    wave:
      "Keep the wave from stacking, because her spread attacks gain value in dense fights.",
    firstBack:
      "Boots help break her spacing pattern; Tiamat then contests her wave tempo.",
    avoid:
      "Treating her level 6 Transcendent State like the same pre-6 lane.",
  }),
  carry({
    id: "zeri",
    dataDragonId: "Zeri",
    name: "Zeri",
    archetype: "Wall mobility",
    difficulty: 66,
    runeBias: "hob",
    damage: "mixed",
    abilities: {
      passive: "Living Battery",
      q: "Burst Fire",
      w: "Ultrashock Laser",
      e: "Spark Surge",
      r: "Lightning Crash",
      key: "Spark Surge",
    },
    threat:
      "Spark Surge makes wall-side engages disposable, while Burst Fire is blocked by minions.",
    lanePlan:
      "She farms through Q, positions near walls, and saves E until Fiora has spent movement.",
    punish:
      "Keep minions between both champions and fight away from walls after Spark Surge is used.",
    parry:
      "Use W on support control or the empowered wall laser if escape is otherwise impossible.",
    levelOne:
      "Use minions as a real shield and avoid isolated open-lane trades.",
    levelTwo:
      "Pressure the side opposite her wall escape.",
    wave:
      "Hold the wave away from thick walls and deny the free E exit.",
    firstBack:
      "Tiamat keeps minion cover available on Fiora's timing.",
    avoid:
      "Engaging beside a wall with Spark Surge ready.",
  }),
  carry({
    id: "ziggs",
    dataDragonId: "Ziggs",
    name: "Ziggs",
    archetype: "AP wave siege",
    difficulty: 70,
    runeBias: "hob",
    damage: "magic",
    abilities: {
      passive: "Short Fuse",
      q: "Bouncing Bomb",
      w: "Satchel Charge",
      e: "Hexplosive Minefield",
      r: "Mega Inferno Bomb",
      key: "Satchel Charge",
    },
    threat:
      "He erases waves, controls approach with mines, and converts one bad recall into turret plates.",
    lanePlan:
      "He pushes from range, mines the direct path, and holds Satchel to disengage Fiora.",
    punish:
      "Approach from brush, force Satchel, then repeat before the wave resets.",
    parry:
      "Riposte support CC or Satchel knockback if it denies the only contact.",
    levelOne:
      "Stand away from minions so Bouncing Bomb cannot hit both targets.",
    levelTwo:
      "Do not Lunge through Minefield; make allied support clear the angle first.",
    wave:
      "Match enough clear to protect tower, then punish his long positioning.",
    firstBack:
      "Early magic resistance or boots can be worth more than a greedy damage piece.",
    avoid:
      "Taking free poke while waiting for a perfect all-in that never comes.",
  }),
  carry({
    id: "seraphine",
    dataDragonId: "Seraphine",
    name: "Seraphine",
    archetype: "AP wave sustain",
    difficulty: 64,
    runeBias: "hob",
    damage: "magic",
    abilities: {
      passive: "Stage Presence",
      q: "High Note",
      w: "Surround Sound",
      e: "Beat Drop",
      r: "Encore",
      key: "Beat Drop",
    },
    threat:
      "Double-cast Beat Drop and Surround Sound make poor short trades disappear.",
    lanePlan:
      "She clears through the wave, stores an echo, and layers control with her support.",
    punish:
      "Track the passive echo, engage after Beat Drop, and leave before the shield-heal cycle.",
    parry:
      "Riposte the echoed root or Encore at level 6.",
    levelOne:
      "Do not stand in the wave where High Note hits both Fiora and minions.",
    levelTwo:
      "Her next spell indicator matters more than the base cooldown alone.",
    wave:
      "Avoid a permanent shove into her safe clear; contest the bounce.",
    firstBack:
      "Boots and magic resistance stabilize; Tiamat restores tempo.",
    avoid:
      "Committing into an echoed Beat Drop with Riposte already spent.",
  }),
  carry({
    id: "swain",
    dataDragonId: "Swain",
    name: "Swain",
    archetype: "Drain brawler",
    difficulty: 68,
    runeBias: "pta",
    damage: "magic",
    abilities: {
      passive: "Ravenous Flock",
      q: "Death's Hand",
      w: "Vision of Empire",
      e: "Nevermove",
      r: "Demonic Ascension",
      key: "Nevermove",
    },
    threat:
      "Nevermove punishes straight entry, and level 6 Demonic Ascension turns a long all-in into healing.",
    lanePlan:
      "He catches through the wave, pulls for a soul, then fights inside close-range Q damage.",
    punish:
      "Sidestep Nevermove and take a short trade before it returns.",
    parry:
      "Riposte Nevermove root. At level 6, use movement to leave Demonic Ascension rather than tank it.",
    levelOne:
      "Respect the return path of Nevermove, not only the outward projectile.",
    levelTwo:
      "Do not stand close enough for a pull to expose both bot laners.",
    wave:
      "Keep the lane mobile so he cannot fish from one fixed angle.",
    firstBack:
      "Early magic resistance is legitimate; Tiamat follows when HP is controlled.",
    avoid:
      "Extending a level 6 fight while his ultimate remains active.",
  }),
  carry({
    id: "hwei",
    dataDragonId: "Hwei",
    name: "Hwei",
    archetype: "AP spellbook",
    difficulty: 79,
    runeBias: "hob",
    damage: "magic",
    abilities: {
      passive: "Signature of the Visionary",
      q: "Subject: Disaster",
      w: "Subject: Serenity",
      e: "Subject: Torment",
      r: "Spiraling Despair",
      key: "Subject: Torment",
    },
    threat:
      "Three Torment controls cover fear, root, and displacement, so his available response changes by sequence.",
    lanePlan:
      "He clears from range, tags passive with two spells, and saves Torment for Fiora's direct line.",
    punish:
      "Track the last spell family used; once Torment is spent, his close-range safety drops sharply.",
    parry:
      "Riposte the Torment control spell or Spiraling Despair at level 6.",
    levelOne:
      "Stand off the wave and force him to spend Disaster on farm.",
    levelTwo:
      "Move after Torment, not after a harmless Serenity utility cast.",
    wave:
      "Do not let him freeze a large spell zone between Fiora and the wave.",
    firstBack:
      "Boots and magic resistance reduce his spell tax; then recover clear with Tiamat.",
    avoid:
      "Calling every Hwei animation the same cooldown window.",
  }),
  carry({
    id: "karthus",
    dataDragonId: "Karthus",
    name: "Karthus",
    archetype: "AP attrition",
    difficulty: 63,
    runeBias: "hob",
    damage: "magic",
    abilities: {
      passive: "Death Defied",
      q: "Lay Waste",
      w: "Wall of Pain",
      e: "Defile",
      r: "Requiem",
      key: "Wall of Pain",
    },
    threat:
      "Isolated Lay Waste hurts, Wall of Pain removes the clean exit, and killing him can still lose the trade.",
    lanePlan:
      "He spaces Q around last hits, slows the engage, then continues casting after death.",
    punish:
      "Fight inside allied minions so Lay Waste is not isolated and leave his passive zone immediately.",
    parry:
      "Use Riposte on support control or a predicted isolated Q during the escape.",
    levelOne:
      "Never stand alone beside the wave; shared Q damage is much safer.",
    levelTwo:
      "Keep a path around Wall of Pain before Lunge is spent.",
    wave:
      "Pressure his mana and make him choose between clear and isolated poke.",
    firstBack:
      "Magic resistance and boots are high value; Tiamat follows.",
    avoid:
      "Celebrating the kill while standing in Death Defied.",
  }),
  carry({
    id: "veigar",
    dataDragonId: "Veigar",
    name: "Veigar",
    archetype: "Cage scaler",
    difficulty: 72,
    runeBias: "hob",
    damage: "magic",
    abilities: {
      passive: "Phenomenal Evil Power",
      q: "Baleful Strike",
      w: "Dark Matter",
      e: "Event Horizon",
      r: "Primordial Burst",
      key: "Event Horizon",
    },
    threat:
      "Event Horizon controls Fiora's entire engage and exit geometry while Veigar stacks for free.",
    lanePlan:
      "He farms stacks, cages the direct approach, then layers Dark Matter and support damage.",
    punish:
      "Force Event Horizon, wait outside it, then engage before the cooldown returns.",
    parry:
      "Riposte the cage stun when crossing is unavoidable.",
    levelOne:
      "Pressure every Q stack without giving support a free counter-engage.",
    levelTwo:
      "Approach from a second angle so one cage cannot trap both allies.",
    wave:
      "Keep the lane moving and deny a peaceful stacking pattern.",
    firstBack:
      "Boots and magic resistance make cage follow-up survivable.",
    avoid:
      "Lunging into the center of an unused Event Horizon.",
  }),
  carry({
    id: "yasuo",
    dataDragonId: "Yasuo",
    name: "Yasuo",
    archetype: "Melee dash lane",
    difficulty: 67,
    runeBias: "pta",
    damage: "physical",
    abilities: {
      passive: "Way of the Wanderer",
      q: "Steel Tempest",
      w: "Wind Wall",
      e: "Sweeping Blade",
      r: "Last Breath",
      key: "Steel Tempest",
    },
    threat:
      "The minion wave is his mobility network, and third Q plus allied knock-up creates the level 6 all-in.",
    lanePlan:
      "He stacks Q, dashes through the wave, and uses Wind Wall to deny ranged support responses.",
    punish:
      "Track which minions have been dashed through and fight after third Q expires.",
    parry:
      "Riposte third Steel Tempest or the allied knock-up that enables Last Breath.",
    levelOne:
      "Do not give him repeated Q spacing through a full wave.",
    levelTwo:
      "Use minion health to predict his dash path and meet him at the exit.",
    wave:
      "Thin the wave so his dash network is limited without giving a free freeze.",
    firstBack:
      "Tiamat and stable durability let Fiora contest his wave movement.",
    avoid:
      "Fighting inside a full enemy wave with third Q ready.",
  }),
  carry({
    id: "xerath",
    dataDragonId: "Xerath",
    name: "Xerath",
    archetype: "AP artillery",
    difficulty: 83,
    runeBias: "hob",
    damage: "magic",
    abilities: {
      passive: "Mana Surge",
      q: "Arcanopulse",
      w: "Eye of Destruction",
      e: "Shocking Orb",
      r: "Rite of the Arcane",
      key: "Shocking Orb",
    },
    threat:
      "Extreme range can remove Fiora from the lane before any engage exists; Shocking Orb protects the direct path.",
    lanePlan:
      "He pushes and pokes from outside vision, slows with W, then stuns the predictable approach.",
    punish:
      "Use brush, force Shocking Orb, and commit before the next artillery cycle.",
    parry:
      "Riposte Shocking Orb. It is the spell that decides whether contact is legal.",
    levelOne:
      "Stand outside the wave so charged Arcanopulse cannot hit both jobs.",
    levelTwo:
      "Do not enter while slowed by Eye of Destruction; the stun becomes free.",
    wave:
      "Match enough clear to avoid tower lock, then attack his long positioning.",
    firstBack:
      "Boots and magic resistance before greed. Tiamat restores wave access.",
    avoid:
      "Walking straight through three artillery casts to save one minion.",
  }),
];

export const defaultBotCarryId = "caitlyn";
