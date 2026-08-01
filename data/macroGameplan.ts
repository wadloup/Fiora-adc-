import {
  shadowTypes,
  type ThreatId,
} from "./midLateKnowledge";

export type ShadowId = "none" | (typeof shadowTypes)[number]["id"];
export type ResponderRead = "favored" | "contested" | "unfavored";
export type PermissionTone = "open" | "conditional" | "blocked" | "unknown";

export type MacroGameplanInput = {
  economy: number;
  information: number;
  teamReady: number;
  failureCost: number;
  objectiveBand: number;
  currentDepth: number;
  shadow: ShadowId;
  responder: ResponderRead;
  cooldowns: {
    w: boolean;
    r: boolean;
    flash: boolean;
  };
  selectedThreats: ThreatId[];
  selectedEnemyCount: number;
  selectedEnemyNames: string[];
};

export type MacroPermission = {
  id: string;
  label: string;
  value: string;
  tone: PermissionTone;
  detail: string;
};

export type MacroGameplan = {
  assignment: string;
  headline: string;
  now: string;
  next: string;
  stop: string;
  sequence: string[];
  competing: string;
  exit: string;
  maxDepth: number;
  depthStatus: string;
  depthReason: string;
  unlocks: string[];
  permissions: MacroPermission[];
  reasons: string[];
  changes: string[];
  entryRoute: string;
  attentionShift: string;
  firstLegalTarget: string;
  riposteQueue: string;
  flashJob: string;
  conversion: string;
};

const informationLabels = ["Untracked", "Stale", "Inferred", "Relevant routes", "Verified"];
const teamLabels = ["Unavailable", "Resetting", "Can delay", "Ready", "Converting"];
const failureLabels = ["Low", "Manageable", "Costly", "Shutdown", "Game deciding"];

function hasAny(threats: ThreatId[], ids: ThreatId[]) {
  return ids.some((id) => threats.includes(id));
}

function shadowLabel(shadow: ShadowId) {
  if (shadow === "none") return "No effective shadow";
  return shadowTypes.find((entry) => entry.id === shadow)?.label ?? "Allied shadow";
}

export function buildMacroGameplan(input: MacroGameplanInput): MacroGameplan {
  const hasCollapse = hasAny(input.selectedThreats, ["rapid-collapse", "side-response"]);
  const hasForcedRoute = hasAny(input.selectedThreats, [
    "forced-control",
    "displacement",
    "anti-dash",
  ]);
  const hasDenial = hasAny(input.selectedThreats, [
    "death-denial",
    "damage-denial",
    "carry-self-peel",
  ]);
  const objectiveLive = input.objectiveBand >= 2 && input.objectiveBand <= 3;
  const fightReachable = input.objectiveBand === 3 && input.teamReady >= 2;
  const deliberateCrossMap =
    input.objectiveBand === 3 &&
    input.teamReady <= 1 &&
    input.information >= 2 &&
    input.responder !== "unfavored";
  const selectedEnemyNames = input.selectedEnemyNames ?? [];
  const enemyList = selectedEnemyNames.length
    ? selectedEnemyNames.join(", ")
    : "the unselected enemy composition";

  let maxDepth = 3;
  const depthLimits: string[] = [];

  if (input.information === 0) {
    maxDepth = 0;
    depthLimits.push("No relevant arrival route is tracked, so even crossing river would be a guess.");
  } else if (input.information === 1) {
    maxDepth = Math.min(maxDepth, 1);
    depthLimits.push("The last sightings are already stale; use the wave to force a reveal before crossing river.");
  } else if (input.information === 2 && hasCollapse) {
    maxDepth = Math.min(maxDepth, 1);
    depthLimits.push("Inferred positions do not constrain the selected global or rapid-collapse threats.");
  } else if (input.information === 2) {
    maxDepth = Math.min(maxDepth, 2);
    depthLimits.push("The map read supports a responder pull, but not a blind structure commitment.");
  }

  if (input.responder === "unfavored") {
    maxDepth = Math.min(maxDepth, 1);
    depthLimits.push("The likely responder currently owns the direct fight; pressure must come from the wave and disappearance.");
  } else if (input.responder === "contested") {
    maxDepth = Math.min(maxDepth, 2);
    depthLimits.push("The responder can hold or delay long enough for a second enemy to matter.");
  }

  if (input.shadow === "none" && maxDepth > 1) {
    maxDepth = Math.min(maxDepth, input.information >= 4 && input.cooldowns.w ? 2 : 1);
    depthLimits.push("No ally protects the real collapse route; proximity on the minimap is not an extraction plan.");
  } else if (input.shadow === "vision" && hasCollapse && maxDepth > 1) {
    maxDepth = 1;
    depthLimits.push("A vision shadow can reveal the first route but cannot stop a global, camouflage or wall-crossing collapse after Fiora commits beyond river.");
  }

  if (!input.cooldowns.w && hasForcedRoute) {
    maxDepth = Math.min(maxDepth, input.cooldowns.flash ? 1 : 0);
    depthLimits.push("Riposte is unavailable into a selected control or route-denial layer.");
  }

  if (!input.cooldowns.flash && hasCollapse && input.currentDepth >= 2) {
    maxDepth = Math.min(maxDepth, 1);
    depthLimits.push("The collapse can arrive faster than a Q-only exit while Flash is unavailable.");
  }

  if (fightReachable) {
    maxDepth = Math.min(maxDepth, 1);
    depthLimits.push("Contact is reachable and the allied team can use Fiora's arrival; one more deep wave would spend the entry angle.");
  } else if (objectiveLive && input.teamReady >= 3) {
    maxDepth = Math.min(maxDepth, 2);
    depthLimits.push("The objective can start and the team is ready, so side pressure must preserve a fast second-wave arrival.");
  }

  if (input.failureCost >= 4 && !deliberateCrossMap) {
    maxDepth = Math.min(maxDepth, 1);
    depthLimits.push("The next death decides more than the next wave; protect the shutdown and objective damage.");
  } else if (input.failureCost === 3 && maxDepth > 2) {
    maxDepth = 2;
    depthLimits.push("A shutdown allows a responder pull, but makes an inhibitor-line commitment too expensive.");
  }

  if (deliberateCrossMap && input.information >= 3 && input.responder === "favored") {
    maxDepth = Math.max(maxDepth, 2);
    if (input.failureCost <= 2 && input.shadow !== "none") maxDepth = 3;
  }

  const currentDepthSupported = input.currentDepth <= maxDepth;
  const depthStatus = currentDepthSupported
    ? input.currentDepth === maxDepth
      ? `D${maxDepth} is the current edge`
      : `D${input.currentDepth} is supported; D${maxDepth} is the current ceiling`
    : `D${input.currentDepth} exceeds the current D${maxDepth} ceiling`;

  const unlocks = [
    input.information < 3
      ? "Reveal the likely responder and the fastest collapse route; a generic river ward is not enough."
      : null,
    input.responder !== "favored"
      ? "Confirm that the responder loses the short trade or cannot hold the wave without spending a major cooldown."
      : null,
    input.shadow === "none"
      ? "Assign a real shadow job: vision before the push, protection on the exit, counter-engage, or a responder pick."
      : null,
    !input.cooldowns.w
      ? "Wait for Riposte, or verify that the remaining control cannot intersect the intended route."
      : null,
    objectiveLive && input.teamReady >= 2
      ? "Let the objective window pass, or create a wave that can be left before contact starts."
      : null,
    input.failureCost >= 3
      ? input.economy >= 3
        ? "Spend the current buy before extending. A completed item can still be inactive while its gold is held, and dying first donates the shutdown before Fiora uses the advantage."
        : "Require continuous vision on the fastest collapse route and a team disengage call before crossing river with the shutdown."
      : null,
  ].filter((item): item is string => Boolean(item));

  if (!unlocks.length) {
    unlocks.push("The next depth is available only while the shown threats stay visible and the planned exit remains open.");
  }

  let assignment = "Central pressure cycle";
  let headline = "Collect mid briefly, disappear, and choose after the enemy reveals its answer.";
  let now = "Clear the central wave from the side connected to allied vision, then leave the screen before the enemy carry can match the next wave. Do not remain for turret damage unless the defender and fastest engage are both visible.";
  let next = `Pause at the nearest mid-to-river junction until one member of ${enemyList} answers side, checks fog, or shows on the next wave. Choose the route only after that reveal.`;
  let stop = "End the hidden interval when the next central melee minions reach mid, the allied side ward expires, or the fastest enemy engage disappears from its tracked route.";
  let sequence = ["Collect central wave", "Break vision", "Read the reveal", "Re-enter on the stronger line"];
  let competing = "A shallow side catch replaces the fog hold only when Fiora reaches it and returns before the next central melee minions die; otherwise collect the wave and rebuild the same disappearance one cycle later.";

  if (!currentDepthSupported) {
    assignment = "Extract, then rebuild pressure";
    headline = `Leave D${input.currentDepth} before trying to create another action.`;
    now = "Stop hitting the wave or structure and move while the known exit still exists.";
    next = "Reappear at the safe collection line, then rebuild information instead of instantly returning to the same side.";
    stop = "Do not route through jungle fog if the lane retreat remains the only verified exit.";
    sequence = ["Release the wave", "Take the known exit", "Spend or collect", "Rebuild the map read"];
    competing = "If enemies already committed to the opposite objective, convert only the guaranteed structure value and leave before recalls complete.";
  } else if (fightReachable) {
    assignment = "Objective edge / second wave";
    headline = "Protect the arrival window; side pressure is now only a reversible probe.";
    now = "Take immediate income, then occupy the nearest pocket that can follow allied contact without receiving free poke.";
    next = "Wait for attention and peel to move toward first contact, then enter against the residual control queue.";
    stop = "Do not spend Flash or W merely to reach the formation; the entry ends if allied follow-up cannot reach the same target.";
    sequence = ["Touch only safe income", "Hold the nearest pocket", "Read first contact", "Enter against what remains"];
    competing = "A single charged turret touch is acceptable only when the return route is already open and the objective cannot be forced during those seconds.";
  } else if (deliberateCrossMap) {
    assignment = "Deliberate cross-map conversion";
    headline = "The team cannot arrive cleanly; trade the map with a measured side sequence.";
    now = "Name the structure or wave value before crossing river and track the recall that can end the trade.";
    next = "Force one responder, take the guaranteed damage, then disappear before the second arrival can close the lane exit.";
    stop = "Leave when the objective trade is already matched, the responder buys enough time, or enemy recalls disappear from information.";
    sequence = ["Confirm the lost contest", "Push to the supported depth", "Take guaranteed value", "Exit before the recall closes"];
    competing = "If the team can delay rather than fully concede, force the first reveal side and rotate into a late edge instead of finishing the structure alone.";
  } else if (input.information <= 1) {
    assignment = "Information recovery";
    headline = "Buy a reveal before buying depth.";
    now = "Clear from the safe line or let an ally collect while Fiora holds a nearby fog pocket.";
    next = "Use a sweep, Faelight region, allied movement, or enemy wave response to identify the actual collapse route.";
    stop = "Do not interpret an empty ward as permission against globals, camouflage, wall crossing, or Homeguard.";
    sequence = ["Clear from allied side", "Sweep the next junction", "Make the responder or engage route show", "Cross only toward the verified return path"];
    competing = "Staying unseen beside mid can move the enemy carry and support without crossing river at all.";
  } else if (input.economy <= 1) {
    assignment = "Reversible income recovery";
    headline = "Recover through catchable waves and clean recalls, not permanent grouping.";
    now = "Collect the wave that ends closest to allied structure and protect the next completed item.";
    next = "Disappear after the clear so the enemy cannot freely assign its strongest responder or start vision uncontested.";
    stop = "Leave before the wave crosses the collapse line; being behind lowers depth, it does not ban side income.";
    sequence = ["Catch shallow income", "Compress show time", "Recall on threshold", "Rejoin through known space"];
    competing = "Mid is cleaner when both river sides are coverable and the allied solo laner can absorb the side bounce without losing tempo.";
  } else if (input.currentDepth >= 2 && input.responder === "favored") {
    assignment = "Responder pull";
    headline = "Force the named responder, then decide whether the value is duel, delay, or rotation.";
    now = "Push only far enough to make the defender show; do not pre-commit to killing them or hitting the tower.";
    next = "Read their clear speed, escape, item completion, and hidden follow-up, then leave toward the conversion your team can actually use.";
    stop = "Exit when the duel duration gives a second enemy time to arrive or when the allied four cannot convert the responder's absence.";
    sequence = ["Cross the reveal line", "Name the responder", "Price the duel time", "Rotate before second arrival"];
    competing = "Stay for structure only if the defender cannot contain the wave and the allied team already benefits from the bodies sent side.";
  }

  const routeTone: PermissionTone = input.information >= 3
    ? "open"
    : input.information === 2
      ? "conditional"
      : input.selectedEnemyCount === 0
        ? "unknown"
        : "blocked";
  const duelTone: PermissionTone = input.responder === "favored"
    ? "open"
    : input.responder === "contested"
      ? "conditional"
      : "blocked";
  const teamTone: PermissionTone = input.teamReady >= 3
    ? "open"
    : input.teamReady >= 2
      ? "conditional"
      : "blocked";
  const combatShadow = ["protect", "counter", "pick"].includes(input.shadow);
  const exitOpen = combatShadow && input.cooldowns.w && (!hasCollapse || input.cooldowns.flash);
  const exitTone: PermissionTone = exitOpen
    ? "open"
    : input.currentDepth <= 1
      ? "conditional"
      : "blocked";
  const liabilityTone: PermissionTone = input.failureCost <= 1
    ? "open"
    : input.failureCost === 2
      ? "conditional"
      : "blocked";
  const arrivalTone: PermissionTone = fightReachable
    ? "open"
    : input.objectiveBand <= 1
      ? "conditional"
      : deliberateCrossMap
        ? "blocked"
        : "conditional";

  const liabilityDetail = input.failureCost >= 4
    ? `Fiora's next death is game deciding. Do not cross into D2 unless the fastest arrival from ${enemyList} is continuously tracked and the allied four can disengage or take the objective when a responder leaves. Clear the shallow wave, spend, then rebuild the side sequence.`
    : input.failureCost === 3
      ? `A shutdown makes the second arrival more important than the nominal 1v1. Force the responder to show, take only value that completes before another enemy can arrive, and leave before the defender disappears from lane vision.`
      : input.failureCost === 2
        ? `Failure costs a normal death plus the current wave or objective window. Fiora can test the responder, but the test ends after one cooldown cycle; do not turn a failed short trade into a full-lane chase.`
        : `There is little shutdown liability, so Fiora can use HP or a short death timer more aggressively to force a defender or secure the objective. The play still needs a named reward before crossing river.`;

  const permissions: MacroPermission[] = [
    {
      id: "information",
      label: "Information",
      value: informationLabels[input.information],
      tone: routeTone,
      detail: hasCollapse
        ? `Against ${enemyList}, an empty entrance ward is insufficient. Track the fastest global, camouflage, wall-crossing or high-speed arrival from its last timestamp until Fiora can exit down lane.`
        : `Name which member of ${enemyList} can reach the side first and which ward sees that route early enough to leave. Total ward count does not answer either question.`,
    },
    {
      id: "responder",
      label: "Responder",
      value: input.responder === "favored" ? "Short window" : input.responder === "contested" ? "Can contain" : "Owns contact",
      tone: duelTone,
      detail: input.responder === "favored"
        ? "Push until the defender shows, then compare their escape and clear time with the next enemy arrival. Take the duel only if it ends before the allied four lose the objective window."
        : input.responder === "contested"
          ? "The defender can delay without winning cleanly. Use their reveal to rotate first, bait them into the shadow, or collect one structure threshold; a long all-in gives the second enemy time to decide it."
          : "Do not test the defender in open lane. Crash at D0-D1, disappear, and make them choose between holding the wave and following Fiora into fog with allied numbers.",
    },
    {
      id: "team",
      label: "Team conversion",
      value: teamLabels[input.teamReady],
      tone: teamTone,
      detail: input.teamReady >= 3
        ? "Before showing side, ping the conversion: start objective, take mid structure, invade the empty quadrant, or disengage after the responder moves. The side pull is complete when allies act, not when two portraits disappear."
        : input.teamReady === 2
          ? "Allies can delay but may not finish a conversion. Keep the side action reversible and rotate on the responder's first reveal instead of waiting for a second enemy."
          : "Allies are resetting or unavailable. A defender sent side currently creates no central reward, so collect income near safety and wait for allied items and positions to synchronize.",
    },
    {
      id: "arrival",
      label: "Objective clock",
      value: input.objectiveBand === 0 ? "Full sequence" : input.objectiveBand === 1 ? "Entrances forming" : input.objectiveBand === 2 ? "Can start" : input.objectiveBand === 3 ? "Contact live" : "Aftermath",
      tone: arrivalTone,
      detail: deliberateCrossMap
        ? "Fiora cannot reach first contact. Name the exact cross-map threshold before pushing: one turret, inhibitor health, or a wave denied. Leave when that threshold equals the objective value or an enemy recall vanishes."
        : input.objectiveBand === 3
          ? "Contact is live. Hold the nearest swept pocket that reaches the same target as allied engage; one more side wave is only legal if the team has already called a deliberate trade."
          : "Measure side depth by travel to the nearest useful fight edge, not travel to the pit center. Return before enemy engage can turn and finish its first control chain.",
    },
    {
      id: "exit",
      label: "Extraction",
      value: shadowLabel(input.shadow),
      tone: exitTone,
      detail: exitOpen
        ? `The assigned ally can affect the route used by ${enemyList}, while W covers the decisive control and Q or Flash remains for the retreat. Leave through that pocket before the second arrival.`
        : input.shadow === "none"
          ? "No ally owns the collapse corridor. Stop before river unless every fast arrival is visible; retreat down lane rather than improvising through unwarded jungle."
          : input.shadow === "vision"
            ? `The sweep or Faelight can reveal the first route from ${enemyList}, but it cannot interrupt the arrival. Use that information to leave before contact; D2 requires a protective, counter-engage or pick shadow behind the visible route.`
          : "The ally is nearby but does not yet cover the full arrival and control queue. Move the shadow onto the actual corridor or lower the side depth until Q alone reaches safety.",
    },
    {
      id: "liability",
      label: "Failure cost",
      value: failureLabels[input.failureCost],
      tone: liabilityTone,
      detail: liabilityDetail,
    },
  ];

  let entryRoute = "Side pocket into second contact";
  let attentionShift = "Wait for the enemy support or main control layer to turn toward the first allied threat.";
  let firstLegalTarget = "The carry remains the aggressive target only if Q or Flash crosses the final distance and allied follow-up reaches the same window.";

  if (input.teamReady <= 1) {
    entryRoute = "Front edge or deliberate absence";
    attentionShift = "Do not convert patience into isolation: without team reach, threaten space or trade the map instead of inventing a flank.";
  } else if (hasForcedRoute && !input.cooldowns.w) {
    entryRoute = "Counter-entry after route denial is spent";
    attentionShift = "Wait for the forced control and the next residual layer to separate; the first animation alone is not enough.";
  } else if (input.information >= 4 && input.cooldowns.flash && input.cooldowns.w) {
    entryRoute = "Cleared side pocket, with rear flank as an option";
    attentionShift = "Enter when peel movement compresses toward first contact; use the shortest angle that creates carry access, not the deepest angle available.";
  }

  if (hasDenial) {
    firstLegalTarget = "Force the save, isolate its holder, or change target before committing Grand Challenge; nominal carry fragility does not guarantee a short conversion.";
  } else if (input.objectiveBand === 3) {
    firstLegalTarget = "The exposed jungler can outrank the ADC while secure is live; otherwise choose the highest-value target that dies before peel resets.";
  } else if (input.economy <= 1) {
    firstLegalTarget = "A diver inside allied space can be more convertible than a speculative backline chase and may create the Grand Challenge field for the second wave.";
  }

  const riposteQueue = !input.cooldowns.w
    ? "Riposte is unavailable: remove the forced-control route from the plan or delay entry until the lethal residual spell is spent."
    : hasForcedRoute
      ? "Name the first forced control, the lethal spell after it, the desired W recipient, and the exit spell. Aim W toward the carry when geometry allows; do not spend it on harmless contact."
      : "Hold W for the spell that ends conversion or extraction. Its slow and attack-speed reduction can still be the winning allocation without a stun.";

  const flashJob = !input.cooldowns.flash
    ? "No Flash: the route must work with Q targets, allied protection, and a visible exit before entry."
    : hasForcedRoute
      ? "Reserve Flash to cross the final access distance or change the W line; spending it on entry requires healing, ally peel, or Q to replace the exit."
      : "Choose before contact whether Flash completes carry access, the final Vital, a terrain exit, or shutdown protection. It cannot perform every job in one fight.";

  const conversion = input.cooldowns.r
    ? "After the first kill or forced escape, re-read Grand Challenge healing, current HP, Q/W, Hubris duration, objective health, nearby structure, and the shutdown before continuing."
    : "Without Grand Challenge, value the first removal without assuming a healing field will stabilize the second contact; objective DPS or immediate exit often gains weight.";

  const exit = !currentDepthSupported
    ? "Use the lane exit while it is still visible. A shadow that cannot affect the arriving threat is a false shadow."
    : input.currentDepth >= 2
      ? input.shadow === "none"
        ? "Leave down lane before the responder disappears from information; the jungle route is not protected."
        : `Leave through the ${shadowLabel(input.shadow).toLowerCase()} pocket before the second arrival, then re-read mid and objective.`
      : fightReachable
        ? "Exit toward the controlled fight edge with a Q target available. Preserve W for the residual chain rather than the first harmless spell."
        : "Return to the next recoverable wave or item threshold. A play can finish with no kill when options and tempo were preserved.";

  const reasons = [
    input.information >= 3
      ? `${enemyList} are tracked well enough to name the fastest side arrival and preserve a lane exit.`
      : `The fastest arrival from ${enemyList} is not continuously tracked, so the wave must force a reveal before Fiora buys more depth.`,
    `The likely side responder ${input.responder === "favored" ? "can be pressured for one short cycle before help arrives" : input.responder === "contested" ? "can extend contact long enough for a second enemy to matter" : "wins open contact, making wave position and concealment the usable advantages"}.`,
    input.shadow === "none"
      ? "No ally currently owns an extraction corridor; the legal retreat must remain down lane."
      : input.shadow === "vision"
        ? "The vision shadow buys reaction time but no combat protection; Fiora must leave on the reveal rather than wait to see whether the collapse completes."
        : `${shadowLabel(input.shadow)} is useful only while its champion can reach the first arriving threat before Fiora is controlled.`,
    objectiveLive
      ? "The objective can be started, so the side sequence ends when allied delay no longer covers Fiora's travel to the fight edge."
      : "The objective is not yet in commitment; one complete clear-disappear-reveal sequence fits before teams must occupy entrances.",
  ];

  const changes = [
    hasCollapse
      ? "The selected global or rapid-collapse cooldown is spent elsewhere, or its user becomes continuously visible."
      : "The likely responder or enemy engage threat disappears from the tracked side.",
    "The responder completes an item, gains a level, shows an escape cooldown, or reveals hidden follow-up.",
    objectiveLive
      ? "The allied team loses delay tools or the objective moves into unavoidable contact."
      : "The objective moves from setup into commitment and shortens the legal side sequence.",
    input.cooldowns.w
      ? "Riposte is forced before the real contact, changing both side permission and fight entry."
      : "Riposte returns and reopens a route against the named control layer.",
  ];

  return {
    assignment,
    headline,
    now,
    next,
    stop,
    sequence,
    competing,
    exit,
    maxDepth,
    depthStatus,
    depthReason: depthLimits[0] ?? "Current information, responder, shadow, objective, tools, and failure cost support the selected ceiling.",
    unlocks,
    permissions,
    reasons,
    changes,
    entryRoute,
    attentionShift,
    firstLegalTarget,
    riposteQueue,
    flashJob,
    conversion,
  };
}
