import {
  carryHasEarlyHardCc,
  getCarryLevelOnePressure,
  getSupportEarlyLock,
  getSupportWaveHelp,
  isHookSupport,
  type BotCarryProfile,
  type BotSupportProfile,
  type EarlyThreatTier,
  type LaneIntent,
} from "./botLanePatch";

export type LaneArrival = "first" | "even" | "late";

export type LaneGameContext = {
  intent: LaneIntent;
  arrival: LaneArrival;
  allySupportForward: boolean;
  enemyControlSpent: boolean;
  fioraFlashAvailable: boolean;
  enemyCarryFlashAvailable: boolean;
  junglePathBot: boolean;
  triBrushControl: boolean;
};

export type ReadTone = "red" | "cyan" | "amber" | "emerald" | "neutral";

export type LaneDimension = {
  label: string;
  value: string;
  detail: string;
  tone: ReadTone;
};

export type LanePhase = {
  id:
    | "setup"
    | "wave-one"
    | "level-two"
    | "level-three"
    | "gank-window"
    | "first-reset"
    | "support-window"
    | "level-six";
  marker: string;
  title: string;
  objective: string;
  plan: string;
  conditions: string[];
  reversal: string;
  failure: string;
};

export type ThreatStep = {
  number: string;
  label: string;
  detail: string;
  tone: ReadTone;
};

export type LaneGameplan = {
  headline: string;
  summary: string;
  levelOneCall: string;
  levelOneTone: ReadTone;
  levelOneWhy: string;
  levelOneAllIn: string;
  levelOneSequence: string[];
  planChangesWhen: string[];
  rune: "Hail of Blades" | "Press the Attack";
  runeReason: string;
  runeAlternative: string;
  levelTwoSkill: "E - Bladework" | "W - Riposte";
  levelTwoReason: string;
  levelTwoReversal: string;
  starter: string;
  starterReason: string;
  pivot: string;
  build: string;
  buildReason: string;
  dimensions: LaneDimension[];
  threats: ThreatStep[];
  phases: LanePhase[];
  enemyPlan: string;
  punishWindow: string;
  ripostePlan: string;
  targetPlan: string;
  vitalPlan: string;
  supportSync: string;
  summonerPlan: string;
  supportMovementPlan: string;
  levelSixPlan: string;
  evidenceNote: string;
};

const mobileCarryIds = new Set([
  "corki",
  "ezreal",
  "kaisa",
  "kalista",
  "lucian",
  "samira",
  "tristana",
  "vayne",
  "zeri",
]);

const preparedZoneCarryIds = new Set([
  "aphelios",
  "caitlyn",
  "heimerdinger",
  "jhin",
  "kalista",
  "xayah",
  "ziggs",
]);

const longChaseCarryIds = new Set([
  "ashe",
  "draven",
  "kalista",
  "kogmaw",
  "lucian",
  "nilah",
  "samira",
  "tristana",
  "vayne",
  "zeri",
]);

const deathDenialSupportIds = new Set([
  "janna",
  "lulu",
  "milio",
  "renata",
  "soraka",
  "tahmkench",
  "taric",
  "zilean",
]);

function tierLabel(tier: EarlyThreatTier) {
  if (tier === "high") return "High";
  if (tier === "medium") return "Present";
  return "Low";
}

function supportAccess(support: BotSupportProfile) {
  if (support.scores.access >= 74) return "reliable" as const;
  if (support.scores.access >= 58) return "conditional" as const;
  return "limited" as const;
}

function supportProtection(support: BotSupportProfile) {
  const protection = support.scores.protection + support.scores.sustain;
  if (protection >= 138) return "strong" as const;
  if (protection >= 100) return "usable" as const;
  return "thin" as const;
}

function isRangedTaxLane(carry: BotCarryProfile, support: BotSupportProfile) {
  const archetype = carry.archetype.toLowerCase();
  return (
    support.archetype === "mage" ||
    archetype.includes("range") ||
    archetype.includes("poke") ||
    archetype.includes("artillery") ||
    ["ashe", "caitlyn", "draven", "hwei", "kalista", "varus", "xerath", "ziggs"].includes(
      carry.id
    )
  );
}

function formatConditions(items: Array<string | false>) {
  return items.filter((item): item is string => Boolean(item));
}

function gameplanLevelThreeLine(
  carry: BotCarryProfile,
  support: BotSupportProfile
) {
  if (mobileCarryIds.has(carry.id)) {
    return `The clean sequence is often two-stage: allied pressure draws ${carry.abilities.key}, Fiora keeps Q for the new position, and W remains available for ${support.name}'s ${support.abilities.key}.`;
  }

  if (preparedZoneCarryIds.has(carry.id)) {
    return `Read the prepared floor before Q. The obvious endpoint may already be covered by ${carry.abilities.key}; angle to a side that lets W or E control the return rather than landing inside the prepared zone.`;
  }

  if (longChaseCarryIds.has(carry.id)) {
    return `${carry.name} gains value when the trade continues after Fiora turns away. Keep either Q, E slow, or support protection unused so the exit is part of the opening sequence.`;
  }

  return `Let the first support interaction reveal the enemy answer, then assign Q to angle or pursuit, W to the decisive control or burst, and E to the part of contact that can actually be completed.`;
}

export function buildLaneGameplan(
  allySupport: BotSupportProfile,
  enemyCarry: BotCarryProfile,
  enemySupport: BotSupportProfile,
  context: LaneGameContext
): LaneGameplan {
  const enemyLock = getSupportEarlyLock(enemySupport);
  const carryPressure = getCarryLevelOnePressure(enemyCarry);
  const allyWaveHelp = getSupportWaveHelp(allySupport);
  const allyAccess = supportAccess(allySupport);
  const allyProtection = supportProtection(allySupport);
  const carryAddsControl = carryHasEarlyHardCc(enemyCarry);
  const hookLane = isHookSupport(enemySupport);
  const rangedTaxLane = isRangedTaxLane(enemyCarry, enemySupport);
  const mobileCarry = mobileCarryIds.has(enemyCarry.id);
  const preparedZone = preparedZoneCarryIds.has(enemyCarry.id);
  const longChase = longChaseCarryIds.has(enemyCarry.id);
  const deathDenial = deathDenialSupportIds.has(enemySupport.id);
  const supportSixStartsFight =
    enemySupport.archetype === "engage" ||
    enemySupport.archetype === "catch" ||
    enemySupport.archetype === "roam";
  const supportSixResetsFight =
    enemySupport.archetype === "peel" ||
    enemySupport.archetype === "enchanter" ||
    enemySupport.archetype === "warden";
  const carrySixControlsEntry = new Set([
    "ashe",
    "seraphine",
    "varus",
    "xayah",
  ]).has(enemyCarry.id);
  const carrySixExtendsFight = new Set([
    "karthus",
    "kaisa",
    "nilah",
    "samira",
    "swain",
    "tristana",
    "vayne",
  ]).has(enemyCarry.id);
  const supportCanStart =
    allyAccess === "reliable" && context.allySupportForward;
  const enemyHasTwoControlLayers = enemyLock === "high" && carryAddsControl;
  const laneArrivedFirst = context.arrival === "first";
  const laneArrivedLate = context.arrival === "late";
  const controlWindowOpen = context.enemyControlSpent || enemyLock === "low";
  const hasWaveContest =
    !laneArrivedLate &&
    (allyWaveHelp >= 8 ||
      (allyAccess === "reliable" && laneArrivedFirst) ||
      (context.enemyControlSpent && carryPressure !== "high")) &&
    !(carryPressure === "high" && enemyLock === "high" && !context.enemyControlSpent);
  const ownsImmediateAccess =
    supportCanStart &&
    laneArrivedFirst &&
    carryPressure !== "high" &&
    controlWindowOpen;
  const canThreatenReactiveAllIn =
    supportCanStart &&
    (context.enemyControlSpent || carryPressure !== "high");
  const enemySupportMustBeFirst =
    (enemySupport.archetype === "engage" ||
      enemySupport.archetype === "warden" ||
      enemySupport.archetype === "catch") &&
    allyAccess !== "reliable";
  const usePta =
    enemySupportMustBeFirst ||
    (enemyCarry.runeBias === "pta" && allyAccess !== "reliable" && !mobileCarry);
  const rune = usePta ? "Press the Attack" : "Hail of Blades";

  let levelOneCall = "Probe the lane before committing";
  let levelOneTone: ReadTone = "cyan";
  let levelOneWhy = `${allySupport.name} can influence the first contact, but ${enemyCarry.name} and ${enemySupport.name} still decide whether the Q endpoint is safe.`;
  let levelOneAllIn = `A level-1 all-in is not the default. It becomes real when ${allySupport.name}'s opening spell fixes a target, Fiora enters beside rather than ahead of the support, and the enemy answer no longer turns the exit into a chase.`;

  if (laneArrivedLate) {
    levelOneCall = "Recover space before buying contact";
    levelOneTone = "amber";
    levelOneWhy = `${enemyCarry.name} and ${enemySupport.name} can establish bush or wave position before Fiora arrives. Walking directly into that setup spends HP without improving the next state.`;
    levelOneAllIn = `Do not treat late arrival as a permanent concession. Thin from the edge, identify which spell they used to secure the wave, and let ${allySupport.name} retake one side. A level-1 commit only appears if the enemy separates or spends the control protecting the push.`;
  } else if (ownsImmediateAccess) {
    levelOneCall = "Hold a real level-1 kill threat";
    levelOneTone = "emerald";
    levelOneWhy = `${allySupport.name} is already in range, your duo arrived first, and ${enemyCarry.name} does not own an uncontested damage pattern before contact. This gives Fiora permission to stand forward without forcing the first Q.`;
    levelOneAllIn = `The all-in is legal after ${allySupport.name} lands or forces the opening spell and ${enemySupport.name} cannot immediately restore distance. Q to the target's escape side, use Hail attacks only while the support remains connected, then leave before the enemy wave becomes the third champion.`;
  } else if (canThreatenReactiveAllIn) {
    levelOneCall = "Threaten the punish, not the blind engage";
    levelOneTone = "red";
    levelOneWhy = `${allySupport.name} can create access, but ${enemyCarry.name}'s ${enemyCarry.abilities.key} or ${enemySupport.name}'s ${enemySupport.abilities.key} still changes the return trade. Your pressure comes from making them spend that answer first.`;
    levelOneAllIn = `A level-1 all-in is conditional: let ${allySupport.name} begin or let ${enemySupport.name} miss the control. If Fiora must Q first through untouched control, a short punish is usually more coherent than chasing the kill.`;
  } else if (rangedTaxLane || carryPressure === "high") {
    levelOneCall = "Spend HP only to improve wave or access";
    levelOneTone = "amber";
    levelOneWhy = `${enemyCarry.name} can tax the approach while ${enemySupport.name} controls the next line. Fiora's health is the resource that makes the later Flash or support catch credible.`;
    levelOneAllIn = `The lane can still produce a level-1 kill, but it normally comes from an enemy overstep, a missed ${enemySupport.abilities.key}, or a clean ${allySupport.name} connection. Do not manufacture it by crossing the full enemy wave for a front Vital.`;
  }

  const flashLayer = context.fioraFlashAvailable
    ? context.enemyCarryFlashAvailable
      ? `${enemyCarry.name} still has Flash. Treat the first connection as a displacement test: Fiora should Flash after the new position only when ${allySupport.name} can continue there, W still answers the return control, and the wave does not turn the chase.`
      : `${enemyCarry.name} has no Flash while Fiora does. Flash is now a conversion tool, but it should cross the final spacing gap after access is established rather than replace the missing support connection.`
    : context.enemyCarryFlashAvailable
      ? `Fiora has no Flash while ${enemyCarry.name} does. The first contact should force the escape or create a wave win; do not spend Q as if a second gap closer still exists.`
      : `Neither carry has Flash. Support position, Q endpoint, and the length of lane decide the fight more than surprise range.`;
  levelOneAllIn = `${levelOneAllIn} ${flashLayer}`;

  const eSecond =
    hasWaveContest &&
    supportCanStart &&
    controlWindowOpen &&
    !enemyHasTwoControlLayers &&
    context.intent !== "survive";
  const levelTwoSkill = eSecond ? "E - Bladework" : "W - Riposte";

  const runeReason = usePta
    ? `${enemySupport.name} is likely to be the first legal target, or the lane requires Fiora to remain in contact after the third hit. PTA rewards that extended, front-to-back conversion better than a brief burst that cannot reach ${enemyCarry.name}.`
    : `${allySupport.name} can create or accelerate a short access window. Hail lets Fiora front-load the first three attacks before ${enemyCarry.name}'s escape, spacing tool, or ${enemySupport.name}'s second answer resets the lane.`;
  const runeAlternative = usePta
    ? `Hail becomes better if ${allySupport.name} repeatedly fixes ${enemyCarry.name} directly and the target must die inside one short control window.`
    : `PTA becomes defensible if ${enemySupport.name} is consistently the only reachable target and the fight continues after the first three attacks. Do not swap merely because the enemy lane looks durable on paper.`;

  const levelTwoReason = eSecond
    ? `E is selected because the current state supplies delivery: ${allySupport.name} is forward, the wave can be contested, and the decisive enemy control is spent or not strong enough to stop the first rotation. The reset, slow, and second-hit crit have a target now.`
    : `W is selected because access is still contested. ${enemySupport.name}'s ${enemySupport.abilities.key}${
        carryAddsControl ? ` plus ${enemyCarry.name}'s ${enemyCarry.abilities.key}` : ""
      } can decide the exchange before E pays off. W preserves HP and can turn their first commitment into your entry.`;
  const levelTwoReversal = eSecond
    ? `Change to W if ${enemySupport.name} reaches level 2 at the same time, ${allySupport.name} falls out of range, the enemy wave remains larger, or the control cooldown returns before the ninth minion dies.`
    : `E becomes available if your duo is clearly first, ${enemySupport.name} spends ${enemySupport.abilities.key}, ${allySupport.name} already controls the target's exit, and the enemy wave is small enough to finish the sequence.`;

  const bushPosition = hookLane
    ? `Start in the lane bush nearest your tower and hold the far outer edge from ${enemySupport.name}. That lengthens the hook line and preserves a diagonal Q dodge.`
    : `Start in the lane bush nearest your tower and hold an outer edge. Use the bush to remove ${enemyCarry.name}'s target vision between last hits, but do not call the bush safe until ${enemySupport.name}'s control and enemy vision are accounted for.`;
  const sixthSense = usePta
    ? `This PTA setup has no Sixth Sense. Let ${allySupport.name} establish whether early lane vision exists instead of sweeping the bush with Fiora's body.`
    : `With Sixth Sense, briefly touch the opposite edge before minions settle, then return. The ward ping is information for the next wave, not an order to engage.`;

  const levelOneSequence = [
    bushPosition,
    sixthSense,
    `Start Q. Its first job is to last-hit, dodge, or change angle. A front Vital is worth taking only when the enemy return spell, minion damage, and exit are already priced.`,
    supportCanStart
      ? `Stand on ${allySupport.name}'s usable line. Fiora confirms the support's contact; she does not arrive one Q ahead of the only champion who can keep the target in range.`
      : `${allySupport.name} is not currently forward. Keep the threat visible without entering first; the plan changes as soon as the support can share the same target.`,
  ];

  const planChangesWhen = formatConditions([
    context.arrival !== "first" &&
      `Your duo arrives first and can claim the near bush before ${enemyCarry.name} starts the wave.`,
    !context.allySupportForward &&
      `${allySupport.name} moves into real cast range instead of standing behind Fiora.`,
    !context.enemyControlSpent &&
      `${enemySupport.name} spends ${enemySupport.abilities.key} without creating a health or wave advantage.`,
    mobileCarry &&
      `${enemyCarry.name} uses the movement tool; the first access should force it, while Q is preserved for the second position.`,
    preparedZone &&
      `${enemyCarry.name}'s prepared zone disappears or moves away from Fiora's intended Q endpoint.`,
    deathDenial &&
      `${enemySupport.name} spends the main save; the repeat entry becomes more valuable than extending the first one.`,
    context.enemyCarryFlashAvailable &&
      `${enemyCarry.name} loses Flash; Q and Fiora's Flash no longer need to cover two separate escape positions.`,
    !context.fioraFlashAvailable &&
      `Fiora's Flash returns; Riposte direction and the second position can become offensive resources again.`,
    `The enemy wave gains enough extra minions that the same champion interaction becomes a losing contact.`,
  ]);

  const accessValue =
    allyAccess === "reliable"
      ? "Support-created"
      : allyAccess === "conditional"
        ? "Two-stage"
        : "Counter-entry";
  const accessDetail =
    allyAccess === "reliable"
      ? `${allySupport.name} can fix a first position. Fiora should preserve Q for the target's response whenever the support spell already reaches.`
      : allyAccess === "conditional"
        ? `${allySupport.name} can improve spacing or land control, but the first spell may only draw an escape. Fiora often enters on the second position.`
        : `${allySupport.name} does not reliably manufacture first contact. Wave location, an enemy miss, or jungle presence must provide the missing access.`;
  const waveValue = hasWaveContest
    ? laneArrivedFirst
      ? "Can be owned"
      : "Contestable"
    : "Thin and receive";
  const waveDetail = hasWaveContest
    ? `Your duo can prepare the ninth-minion level-up, but the step forward is valid only if ${allySupport.name} is already in range and Fiora has not paid too much HP.`
    : `Matching every enemy auto is too expensive. Thin enough to prevent a huge crash, keep the wave on Fiora's half, and preserve the wave-three/four punish.`;
  const exitValue = longChase || enemyHasTwoControlLayers ? "Expensive" : "Conditional";
  const exitDetail = longChase
    ? `${enemyCarry.name} can extend the trade after Fiora turns away. Decide whether Q or Flash is the exit before the first attack, not after the enemy chase begins.`
    : enemyHasTwoControlLayers
      ? `Blocking one control event does not remove the second. The exit depends on W allocation, support position, and whether Fiora entered through the wave.`
      : `The exit is available while Q, support peel, or a short lane remains unused. It disappears when every movement tool is spent on first access.`;

  const dimensions: LaneDimension[] = [
    { label: "First access", value: accessValue, detail: accessDetail, tone: "red" },
    { label: "Wave 1-2", value: waveValue, detail: waveDetail, tone: "cyan" },
    {
      label: "Enemy lock",
      value: enemyHasTwoControlLayers ? "Layered" : tierLabel(enemyLock),
      detail: enemyHasTwoControlLayers
        ? `${enemySupport.name} supplies the first immobilization and ${enemyCarry.name} adds another control event. W must be allocated to the event that protects the full rotation.`
        : `${enemySupport.name}'s first threat is ${enemySupport.abilities.key}. A miss can open space, but close-range follow-up may still remain.`,
      tone: enemyLock === "high" ? "amber" : "neutral",
    },
    {
      label: "HP tax",
      value: rangedTaxLane ? "High before contact" : "Manageable",
      detail: rangedTaxLane
        ? `Do not let one enemy spell hit Fiora and the wave together. HP preserved now becomes access when ${allySupport.name} creates the later window.`
        : `Fiora can contest selected last hits, but every Q still needs a purpose and an endpoint outside the enemy's clean return line.`,
      tone: rangedTaxLane ? "amber" : "emerald",
    },
    { label: "Exit", value: exitValue, detail: exitDetail, tone: "cyan" },
  ];

  const ripostePlan = enemyHasTwoControlLayers
    ? `Do not cast W at the first visual threat automatically. Identify whether ${enemySupport.name}'s ${enemySupport.abilities.key} begins the lethal chain or whether ${enemyCarry.name}'s ${enemyCarry.abilities.key} is the event that makes escape impossible. When blocking the support's immobilization, aim through the support toward ${enemyCarry.name} whenever the line is clear.`
    : `The premium W trigger is ${enemySupport.name}'s ${enemySupport.abilities.key}. A successful block is most valuable when the line reaches ${enemyCarry.name}; otherwise use the slow to create space and keep Q for the next angle. ${enemyCarry.parry}`;
  const targetPlan = enemySupportMustBeFirst
    ? `${enemyCarry.name} remains the desired target, but ${enemySupport.name} is often the first legal target because the support stands between Fiora and the carry. Damage the support only while it creates a route, forces a defensive cooldown, or prevents ${enemyCarry.name} from free-firing.`
    : mobileCarry
      ? `${enemyCarry.name} is the desired target, but the first contact should often force the movement spell. Let ${allySupport.name} threaten the first position, then use Q for the second instead of chasing the original square.`
      : `${enemyCarry.name} is normally the desired target after ${allySupport.name} creates access. Switch to ${enemySupport.name} when the support overextends, becomes the only target outside the wave, or must spend a major save on itself.`;
  const vitalPlan = `Price every Vital before Q: enemy cooldowns, support distance, minion damage, the next ranged auto, and the exit side. Into ${enemyCarry.name}, a Vital is cheap only when ${enemyCarry.abilities.key} cannot punish the endpoint or the proc begins a full supported all-in.`;
  const supportSync = `${allySupport.allyPlan} The important timing is shared contact: Fiora should not be one Q ahead of ${allySupport.name}, and ${allySupport.name} should keep the spell that answers ${enemySupport.name}'s second layer.`;
  const summonerPlan = context.fioraFlashAvailable
    ? context.enemyCarryFlashAvailable
      ? `Both carry Flashes are available. The clean sequence is usually access first, enemy Flash second, then a decision: follow only if ${allySupport.name} can cross the same distance and Fiora still owns W or Q for the enemy answer. Keeping Flash can be correct when the forced escape already wins wave, recall, or jungle access.`
      : `${enemyCarry.name} has no Flash while Fiora does. Hold Fiora's Flash for the point where ${enemyCarry.name}'s normal escape or ${enemySupport.name}'s peel would otherwise end a supported lethal. Flashing before that answer appears only compresses your own options.`
    : context.enemyCarryFlashAvailable
      ? `${enemyCarry.name} owns the Flash advantage. Threaten with ${allySupport.name}'s access and preserve Q for the escape square. A trade that removes enemy Flash without costing Fiora's HP or wave can be a successful result even without a kill.`
      : `No carry Flash is available. Lane length and support connection become the decisive movement resources. Fiora may commit Q more aggressively when the return path is short and ${enemySupport.name}'s displacement is already accounted for.`;
  const supportMovementPlan =
    enemySupport.archetype === "roam" || enemySupport.archetype === "catch"
      ? `${enemySupport.name} can turn a disappearance into a warding loop, river move, or lane gank. Do not auto-shove on the first missing ping. Ward the shortest return path, check whether ${enemyCarry.name} is baiting near a held wave, then choose between a controlled crash, a freeze, or pressure on the isolated carry. ${enemySupport.roam}`
      : `${enemySupport.name}'s absence still creates uncertainty even without a dedicated roam profile. Read ${enemyCarry.name}'s posture: defensive last-hitting suggests a real move, while sudden forward spacing can signal a lane return. Price the wave before following late. ${enemySupport.roam}`;
  const allyMovementPlan =
    allySupport.archetype === "roam"
      ? `${allySupport.name} can leave lane for map tempo. Before the move, the wave should either crash fully or return toward Fiora; a roam that leaves a freeze near ${enemyCarry.name}'s tower removes Fiora's access to farm and makes the later return predictable.`
      : `${allySupport.name} should move only after the wave state protects Fiora's collection. When the support leaves, Fiora's job is to preserve HP and prevent the enemy duo from building an uncontested dive wave, not to maintain the same contact pressure alone.`;
  const levelSixPlan = supportSixStartsFight
    ? `${enemySupport.name}'s ${enemySupport.abilities.r} adds a new first-engage or follow-up layer. A spent ${enemySupport.abilities.key} no longer means the lane is empty of control. Track which spell starts the chain, keep W for the event that makes the full chain unavoidable, and avoid standing where both Fiora and ${allySupport.name} can be hit by the same setup.`
    : supportSixResetsFight
      ? `${enemySupport.name}'s ${enemySupport.abilities.r} makes the first apparent lethal less reliable. The better sequence is often to force that reset with ${allySupport.name}'s first access, disengage before ${enemyCarry.name} free-fires, then re-enter while the protection layer is unavailable.`
      : `${enemySupport.name}'s ${enemySupport.abilities.r} changes the duration or area of the fight. Fiora should identify whether it denies entry, protects the target, or punishes the exit before treating the pre-six window as unchanged.`;
  const carrySixPlan = carrySixControlsEntry
    ? `${enemyCarry.name}'s ${enemyCarry.abilities.r} can control or erase the first entry. The target remains punishable, but Fiora should not spend Q, W, and Flash before that ultimate is forced or answered.`
    : carrySixExtendsFight
      ? `${enemyCarry.name}'s ${enemyCarry.abilities.r} increases the cost of a long second half. Front-load the supported window, decide the exit before the ultimate state takes over, and do not confuse winning the first three attacks with winning the complete fight.`
      : `${enemyCarry.name}'s ${enemyCarry.abilities.r} changes the kill timer without replacing the lane fundamentals. Recalculate damage, target access, and the escape route rather than forcing only because Fiora has Grand Challenge.`;
  const completeLevelSixPlan = `${levelSixPlan} ${carrySixPlan} Fiora's Grand Challenge should mark the target the duo can actually hold long enough to proc; the carry is a bias, not an obligation when ${enemySupport.name} is the only legal conversion.`;

  const threats: ThreatStep[] = [
    {
      number: "01",
      label: "First line",
      detail: `${enemySupport.name}: ${enemySupport.trigger}`,
      tone: "red",
    },
    {
      number: "02",
      label: "Carry answer",
      detail: `${enemyCarry.name}: ${enemyCarry.punish}`,
      tone: "amber",
    },
    {
      number: "03",
      label: "Riposte allocation",
      detail: ripostePlan,
      tone: "cyan",
    },
    {
      number: "04",
      label: "Exit check",
      detail: exitDetail,
      tone: "emerald",
    },
  ];

  const junglePlan = context.junglePathBot
    ? context.triBrushControl
      ? `Your jungler is pathing bot and tri-bush is cleared. Hold the wave outside tower through wave 3 into wave 4, protect the cleared route, and ping before the enemy finishes the crash. Do not reveal the setup with a last-second shove.`
      : `Your jungler is pathing bot, but tri-bush is not confirmed clear. Hold the lane long enough for the route, then have ${allySupport.name} sweep or control one entry before committing. The wave number alone does not make the gank hidden.`
    : `If ${enemyCarry.name} and ${enemySupport.name} push beyond lane center, wave 3 into wave 4 can create the request. Ping while the jungler can still choose the bot-side path; check both duos' HP, enemy summoners, river vision, and whether the wave will remain outside tower.`;

  const starter = rangedTaxLane
    ? "Doran's Shield"
    : enemyHasTwoControlLayers && allyProtection === "thin"
      ? "Doran's Helm"
      : ownsImmediateAccess
        ? "Doran's Bow"
        : "Doran's Blade";
  const starterReason =
    starter === "Doran's Shield"
      ? `${enemyCarry.name} and ${enemySupport.name} can tax Fiora before she chooses contact. Shield protects the HP needed for the first real support window and the Hydra recall.`
      : starter === "Doran's Helm"
        ? `The lane's first check is layered burst rather than repeated poke. Extra health and mixed resistance make W and support protection more likely to cover the full chain.`
        : starter === "Doran's Bow"
          ? `${allySupport.name} supplies immediate access and the arrival state gives Fiora room to convert attack speed. If bush ownership or support position changes before minions meet, Blade becomes the steadier start.`
          : `No single enemy damage pattern fully owns level 1. Blade gives the most stable mix of health, damage, and recovery while the lane reveals its actual first contact.`;
  const doubleMagic = enemyCarry.damage === "magic" && enemySupport.archetype === "mage";
  const mixedBurst =
    enemyCarry.damage === "mixed" ||
    (enemyCarry.damage === "physical" && enemySupport.archetype === "mage");
  const canExtend = allyProtection === "strong" && !deathDenial && enemySupport.archetype !== "catch";
  const pivot = canExtend
    ? "Endless Hunger"
    : doubleMagic || enemyCarry.damage === "magic"
      ? "Maw of Malmortius"
      : mixedBurst
        ? "Sterak's Gage"
        : "Death's Dance";
  const build = `Ravenous Hydra -> Gluttonous Greaves -> Hubris -> ${pivot} -> Voltaic Cyclosword`;
  const buildReason = `Hydra gives Fiora control over whether the wave stays, crashes, or moves. Greaves are locked for recovery and takedown snowball, while Hubris remains the second full item so early kills become lasting damage. ${pivot} answers the first enemy response after entry; Cyclosword closes the route when Fiora can survive long enough to convert its burst.`;

  const phases: LanePhase[] = [
    {
      id: "setup",
      marker: "00:00",
      title: "Before the wave",
      objective: "Own information without donating the HP that makes level 2 dangerous.",
      plan: `${bushPosition} ${sixthSense}`,
      conditions: [
        `Track which duo arrived first and whether ${enemySupport.name} showed ${enemySupport.abilities.key}.`,
        `Keep ${allySupport.name} close enough that stepping forward represents two champions, not Fiora alone.`,
        `Leave the bush if the enemy already occupies it or the jungle route makes the position unsafe.`,
      ],
      reversal: `If the enemy duo owns the bush first, give the pixel, approach behind minions, and recover one side after their opening spell touches the wave.`,
      failure: `Standing inside a warded or occupied bush because the plan said “start bush.”`,
    },
    {
      id: "wave-one",
      marker: "W1",
      title: "Wave one",
      objective: "Preserve HP while discovering whether the ninth-minion level-up has a legal delivery mechanism.",
      plan: levelOneAllIn,
      conditions: [
        `Q must have a job: last hit, dodge, angle, access, or exit.`,
        `A Vital must buy wave control, a meaningful cooldown, or supported lethal pressure.`,
        hasWaveContest
          ? `Prepare the push, but stop matching damage if ${allySupport.name} loses forward position.`
          : `Thin the incoming wave so the enemy cannot crash an unmanageable stack and reset for free.`,
      ],
      reversal: `A missed ${enemySupport.abilities.key}, a bad ${enemyCarry.name} position, or ${allySupport.name} reaching the same target can turn a defensive wave into a short all-in immediately.`,
      failure: `${enemyCarry.avoid} ${enemySupport.avoid}`,
    },
    {
      id: "level-two",
      marker: "9th minion",
      title: `Level 2 / ${levelTwoSkill}`,
      objective: "Move before the third melee dies, then spend the level advantage only if the space is already owned.",
      plan: levelTwoReason,
      conditions: [
        `Compare the remaining health of both sets of melee minions, not only the XP bar.`,
        `Check support distance, Fiora HP, Q cooldown, enemy wave size, and the escape route.`,
        `If both duos level together, position and first available control matter more than the animation.`,
      ],
      reversal: levelTwoReversal,
      failure: `Taking the level-up step inside a larger enemy wave or selecting E without a target that ${allySupport.name} can keep in range.`,
    },
    {
      id: "level-three",
      marker: "Level 3",
      title: "Full first rotation",
      objective: "Use Q, W, and E as a sequence with one reserved job instead of spending all three on first access.",
      plan: `At level 3 Fiora can combine damage and defense, but the contact does not automatically need to be longer. Against ${enemyCarry.name} and ${enemySupport.name}, decide before entry whether Q follows the escape, W answers the control chain, or E slows the target to create the exit. ${gameplanLevelThreeLine(enemyCarry, enemySupport)}`,
      conditions: [
        `${allySupport.name} must remain connected through the attack reset, not only through the first Q.`,
        `Track whether ${enemySupport.name}'s ${enemySupport.abilities.key} is being held for entry or exit.`,
        `Count the enemy wave and decide which movement resource remains after ${enemyCarry.name} responds.`,
      ],
      reversal: `If ${enemyCarry.name} spends the escape or ${enemySupport.name} spends control before Fiora enters, the reserved spell can change jobs: Q may become access, W may become damage denial, and E may extend the punish.`,
      failure: `Using Q for first access, W on harmless poke, and E immediately, then discovering that ${enemyCarry.name}'s real escape and ${enemySupport.name}'s real control are still available.`,
    },
    {
      id: "gank-window",
      marker: "W3-4",
      title: "Wave 3 into wave 4",
      objective: "Convert an enemy push into lane length, hidden access, and a coordinated jungle arrival.",
      plan: junglePlan,
      conditions: [
        `The wave must remain outside Fiora's tower long enough for the route.`,
        `Fiora and ${allySupport.name} need enough HP and key cooldowns to begin after the jungler shows.`,
        `Track the enemy jungle and the shortest warded return path, not only tri-bush.`,
      ],
      reversal: `If the wave crashes too early or vision cannot be cleared, collect cleanly and use the bounce instead of forcing a late gank through the tower.`,
      failure: `Calling the jungler because it is wave 3 while pathing, health, vision, or lane length says the play has already expired.`,
    },
    {
      id: "first-reset",
      marker: "Recall",
      title: "First reset",
      objective: "Leave a wave state that protects the return and moves Fiora toward Hydra without donating tempo.",
      plan: `${enemyCarry.firstBack} Start ${starter}: ${starterReason}`,
      conditions: [
        `Crash fully when the enemy cannot hold the wave; otherwise avoid leaving a freezeable half-push.`,
        `Do not stay for a plate if ${enemyCarry.name} returns with item advantage or ${enemySupport.name} can trap the retreat.`,
        `Tiamat is agency only when Fiora still has enough lane stability to touch the wave.`,
      ],
      reversal: `If the kill attempt leaves low HP without a clean crash, take the imperfect recall rather than donating the shutdown and the entire returning wave.`,
      failure: `Winning the trade, overstaying for one plate, then returning after ${enemyCarry.name} has already rebuilt the wave.`,
    },
    {
      id: "support-window",
      marker: "Support move",
      title: "Roam and lane absence",
      objective: "Convert missing support information without turning uncertainty into a blind shove or a late follow.",
      plan: `${supportMovementPlan} ${allyMovementPlan}`,
      conditions: [
        `Check the shortest lane-return path before attacking ${enemyCarry.name} under an apparently free wave.`,
        `Decide whether the wave should crash, hold, or be thinned before leaving lane.`,
        `Use enemy carry posture and visible map information to distinguish a real roam from a lane trap.`,
      ],
      reversal: `If ${enemySupport.name} shows far from bot and ${enemyCarry.name} has no safe wave position, pressure can accelerate immediately. If the support remains unlocated and the carry walks forward, keep Q or W for the return angle.`,
      failure: `Following ${enemySupport.name} after the play has already happened while losing the bot wave, or shoving into a freeze because “the support is missing.”`,
    },
    {
      id: "level-six",
      marker: "Level 6",
      title: "Ultimate layer",
      objective: "Rebuild the threat order now that both enemy ultimates and Grand Challenge can change target, timing, and exit.",
      plan: completeLevelSixPlan,
      conditions: [
        `Confirm whether ${enemySupport.name}'s ${enemySupport.abilities.r} starts, extends, or resets the fight.`,
        `Track ${enemyCarry.name}'s ${enemyCarry.abilities.r} before committing every movement resource.`,
        `Use Grand Challenge on the target that can be held through enough Vitals, not automatically on the carry nameplate.`,
      ],
      reversal: `Once the enemy defensive or engage ultimate is spent without a kill, the repeat window can be much stronger than the first. Preserve enough HP and one access tool to use it.`,
      failure: `Pressing Grand Challenge and Flash together because level 6 arrived, then entering the same control and protection layers that made the pre-six contact illegal.`,
    },
  ];

  const headline = levelOneCall;
  const summary = `${allySupport.name} gives this lane ${accessValue.toLowerCase()} access. ${enemyCarry.name}'s preferred lane state is clear: ${enemyCarry.lanePlan} Fiora wins the opening by preserving HP and Q freedom until ${enemySupport.name}'s first answer is known.`;

  return {
    headline,
    summary,
    levelOneCall,
    levelOneTone,
    levelOneWhy,
    levelOneAllIn,
    levelOneSequence,
    planChangesWhen,
    rune,
    runeReason,
    runeAlternative,
    levelTwoSkill,
    levelTwoReason,
    levelTwoReversal,
    starter,
    starterReason,
    pivot,
    build,
    buildReason,
    dimensions,
    threats,
    phases,
    enemyPlan: `${enemyCarry.lanePlan} ${enemySupport.enemyPlan}`,
    punishWindow: `${enemySupport.trigger} ${enemyCarry.punish}`,
    ripostePlan,
    targetPlan,
    vitalPlan,
    supportSync,
    summonerPlan,
    supportMovementPlan: `${supportMovementPlan} ${allyMovementPlan}`,
    levelSixPlan: completeLevelSixPlan,
    evidenceNote:
      "This read combines official spell behavior, reviewed high-elo Fiora ADC games, matchup mechanics, and author doctrine. It is a conditional plan, not a matchup win rate; current-patch samples are too small for false numerical certainty.",
  };
}
