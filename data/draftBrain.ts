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
    text: "Fixed displacement and knock-up create a post-dash target Fiora can actually reach.",
    plan: "Stand on Fiora's wave side and hold WQ until she is one Q from the landing point. Use Trample as the second lock and let Fiora save Riposte for counter-engage.",
    risk: "Maximum-range WQ can move the carry outside Fiora's follow-up, while a large enemy wave turns the fixed contact into losing damage even when the combo lands.",
    scores: { access: 96, protection: 76, sustain: 18, discipline: 78, chaos: 42 },
  },
  {
    id: "braum",
    name: "Braum",
    archetype: "Peel brawler",
    text: "Concussive Blows gives Fiora's Hail-E sequence a fast stun while Braum protects the return trade.",
    plan: "Apply the first mark before Fiora spends her burst, then remain in W range to add resistances or body-block. End contact after the stun if the carry has already escaped.",
    risk: "Braum standing behind Fiora supplies neither the first mark nor an exit. Hitting through Unbreakable while Fiora is enemy-marked creates the wrong extended fight.",
    scores: { access: 66, protection: 94, sustain: 22, discipline: 82, chaos: 28 },
  },
  {
    id: "yuumi",
    name: "Yuumi",
    archetype: "Scaling parasite",
    text: "Attached sustain and movement amplify contact after access, but Yuumi does not independently own bush or fix a target.",
    plan: "Hold the wave on Fiora's half, preserve HP, and use movement or slow after an enemy control miss or jungle arrival creates the first gap. Save one protection for retreat.",
    risk: "Double-range lanes can control wave and bush before Yuumi's scaling matters. Absorbing every poke spell removes the HP threshold required for the eventual all-in.",
    scores: { access: 38, protection: 58, sustain: 92, discipline: 70, chaos: 34 },
  },
  {
    id: "rakan",
    name: "Rakan",
    archetype: "Fast engage",
    text: "Fast multi-angle access can force a carry's movement spell and still leave a second knock-up line.",
    plan: "Use the first movement to draw spacing, then cast Grand Entrance where Fiora can reach the landing square. Preserve Battle Dance range on an ally for extraction.",
    risk: "A maximum-range engage with no return body strands both champions: Rakan exits late and Fiora has already spent Q trying to catch the first position.",
    scores: { access: 88, protection: 64, sustain: 28, discipline: 64, chaos: 58 },
  },
  {
    id: "sona",
    name: "Sona",
    archetype: "Sustain scale",
    text: "Sustain preserves Fiora's all-in threshold, Power Chord can create short access, and Crescendo later supplies direct fixation.",
    plan: "Use the wave to keep the approach short, hold the slow chord for the enemy spacing step, and retain Crescendo for the target or counter-engage line.",
    risk: "Sona cannot face-check hook lanes or tank the first engage. If she spends movement and healing only after Fiora drops below contact HP, the pairing never reaches its useful state.",
    scores: { access: 28, protection: 46, sustain: 88, discipline: 74, chaos: 24 },
  },
  {
    id: "taric",
    name: "Taric",
    archetype: "Anti-dive",
    text: "Bastion lets Fiora carry a stun line into melee range, and Cosmic Radiance protects the second half of a committed fight.",
    plan: "Link before contact, aim Dazzle through Fiora's Q destination, and begin the ultimate while allies still survive its delay. Use the invulnerability to finish or exit, not to start from impossible range.",
    risk: "Low range can concede bush and wave to double poke. A late ultimate animation does not repair a fight already decided by the first control chain.",
    scores: { access: 54, protection: 96, sustain: 64, discipline: 76, chaos: 30 },
  },
  {
    id: "leona",
    name: "Leona",
    archetype: "Lockdown",
    text: "Zenith Blade and Shield of Daybreak provide long enough fixation for Fiora's first rotation, with Solar Flare available for the second position.",
    plan: "Ping the carry, move before the level-2 minion dies, and engage only from Fiora's one-Q range. Chain the second control after the escape rather than stacking every stun on the opener.",
    risk: "Leona cannot disengage from a large wave or failed target. If Fiora must cross the whole lane after E lands, the support takes return damage before follow-up exists.",
    scores: { access: 91, protection: 62, sustain: 8, discipline: 56, chaos: 66 },
  },
  {
    id: "nautilus",
    name: "Nautilus",
    archetype: "Hook tax",
    text: "Dredge Line fixes or pulls a target, while passive root and Depth Charge can preserve a second control layer.",
    plan: "Hook only when Fiora can reach the pull endpoint, then hold passive root or ultimate for the carry's new position. Use the first miss window to regain bush rather than immediately fishing again.",
    risk: "A missed hook still leaves Nautilus with close control, but removes ranged access. Repeated hooks through an enemy wave spend HP and lane control before Fiora can convert anything.",
    scores: { access: 86, protection: 68, sustain: 10, discipline: 58, chaos: 62 },
  },
  {
    id: "lulu",
    name: "Lulu",
    archetype: "Buff shell",
    text: "Movement speed creates soft access, while shield, Polymorph and Wild Growth can protect the damage cycle after Fiora arrives.",
    plan: "Accelerate Fiora after the carry commits its spacing tool, then save Polymorph for the enemy damage source and Wild Growth for the control or burst threshold.",
    risk: "Using every buff to cross open lane leaves no spell for the enemy answer. Lulu also contributes limited wave control when the duo is being pushed by double range.",
    scores: { access: 48, protection: 88, sustain: 54, discipline: 80, chaos: 22 },
  },
  {
    id: "thresh",
    name: "Thresh",
    archetype: "Skill check",
    text: "Hook, Flay and lantern can divide access, counter-control and extraction instead of spending all utility on one cast.",
    plan: "Let hook force the first movement, Flay the new position or enemy counter-engage, then place lantern where Fiora can click it after W or Grand Challenge resolves.",
    risk: "Throwing lantern before Fiora commits reveals the exit and may remove Thresh from the follow-up line. A missed hook should become bush control, not an immediate walk into enemy range.",
    scores: { access: 82, protection: 80, sustain: 10, discipline: 60, chaos: 68 },
  },
  {
    id: "pyke",
    name: "Pyke",
    archetype: "Chaos income",
    text: "Hook and dash-stun create lethal early access, while execute gold accelerates the snowball beyond bot lane.",
    plan: "Use the first hook to force movement and hold E for the destination or counter-engage. Before roaming, crash or leave the wave returning toward Fiora and ward the shortest support-return path.",
    risk: "Pyke supplies little protection after the first rotation. A failed catch or early roam can leave Fiora defending an enemy freeze without wave clear or a safe bush.",
    scores: { access: 76, protection: 24, sustain: 8, discipline: 42, chaos: 90 },
  },
  {
    id: "soraka",
    name: "Soraka",
    archetype: "Hospital lane",
    text: "Healing preserves Fiora's contact threshold and Equinox can deny an enemy engage or the carry's escape cast, but Soraka does not supply reliable first fixation.",
    plan: "Keep the lane short, use Q sustain between waves, and place silence on the enemy's post-engage square while Fiora takes a brief punish. Save enough health to survive the support's focus.",
    risk: "Enemy engage can switch onto Soraka and remove the sustain engine first. Long Fiora chases outrange healing and silence, turning protection into late spectator value.",
    scores: { access: 22, protection: 52, sustain: 96, discipline: 78, chaos: 18 },
  },
];

export const supportMentalProfiles: MentalProfile[] = [
  {
    id: "locked",
    label: "Locked in",
    text: "Pings the target, moves before the level-up, and keeps one spell for the enemy answer.",
    score: 13,
    patch: { discipline: 12, chaos: -10 },
    note: "Preserve this coordination: Fiora can assign Q to the second position because support follow-up is predictable.",
  },
  {
    id: "autofill",
    label: "Autofill panic",
    text: "Does not know the ninth-minion timing, Fiora's Q range, or which spell must be saved for counter-engage.",
    score: -12,
    patch: { discipline: -18, protection: -8, chaos: 12 },
    note: "Use simple pings and play from a shorter wave. Do not select E at level 2 unless the support is already in cast range before the minion dies.",
  },
  {
    id: "roamer",
    label: "Roam addiction",
    text: "Leaves before crashing or bouncing the wave, exposing Fiora to a freeze and a 1v2 return path.",
    score: -18,
    patch: { protection: -22, sustain: -8, chaos: 18 },
    note: "Thin the wave without crossing river and ward the shortest lane return. The support's roam gains value only if Fiora keeps the wave or the map play exceeds the lost bot income.",
  },
  {
    id: "panic",
    label: "Panic engage",
    text: "Engages on the first visible target without checking Fiora's last-hit animation, wave size, Q distance or enemy escape.",
    score: -10,
    patch: { access: 8, discipline: -24, chaos: 24 },
    note: "Stand one Q behind the support and use the first engage as a short punish. Extend only when the target remains inside both champions' second spell range.",
  },
  {
    id: "ego",
    label: "Main character",
    text: "Repeats maximum-range engages after misses and treats landing the spell as proof the follow-up is legal.",
    score: -7,
    patch: { access: 6, protection: -12, discipline: -16, chaos: 20 },
    note: "Convert a missed spell into bush or wave control. Fiora should not spend Flash to repair an engage that moved outside allied follow-up.",
  },
];

export const enemyLaneProfiles: EnemyLaneProfile[] = [
  {
    id: "doubleRange",
    label: "Double range poke",
    text: "Carry and support can damage Fiora while pushing the same wave, then control bush and tower approach.",
    score: -6,
    patch: { sustain: 12, protection: 6, access: -8, discipline: 8 },
    advice: "Stand away from the wave so one spell cannot hit both. Preserve HP, let the push return, and engage only after the main control spell misses or allied bush ownership shortens the approach.",
  },
  {
    id: "hook",
    label: "Hook kill lane",
    text: "One ranged catch begins a close control chain while the carry supplies enough early damage to punish a failed Q endpoint.",
    score: -4,
    patch: { protection: 12, discipline: 4, chaos: 6 },
    advice: "Keep a minion line, retreat before their ninth-minion level-up, and move forward immediately after the catch spell misses. Remember Nautilus, Thresh or Pyke may retain close-range control after the hook.",
  },
  {
    id: "scaling",
    label: "Scaling farm lane",
    text: "The enemy duo prefers protected waves and item scaling, but may still hold one disengage or prepared-zone answer.",
    score: 9,
    patch: { access: 8, discipline: 6 },
    advice: "Slow-push enough minions to protect Fiora's approach, force the movement or save spell with support, then repeat before sustain resets. Do not hand them a freeze by chasing beyond the completed crash.",
  },
  {
    id: "draven",
    label: "Draven incident",
    text: "Draven's axe state, Stand Aside and cash-out threat make every early HP loss and death worth more than the same trade into a normal carry.",
    score: -10,
    patch: { protection: 10, sustain: 6, chaos: 10 },
    advice: "Hold the wave on Fiora's half, attack the next axe landing point only after Stand Aside or support control is spent, and end contact before Blood Rush turns retreat into a full-lane chase.",
  },
  {
    id: "enchanter",
    label: "Enchanter casino",
    text: "Shields, healing and movement make failed short trades reset, while the carry remains vulnerable only during a specific defensive cooldown gap.",
    score: 5,
    patch: { access: 5, sustain: 4 },
    advice: "Use the first support interaction to force shield, Polymorph, Monsoon, Bailout or movement, then leave and re-enter before it returns. Consider the enchanter first when separated from the carry's protection line.",
  },
];
