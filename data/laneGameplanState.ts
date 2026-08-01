import { botLaneCarries, defaultBotCarryId } from "./botLaneCarries";
import { laneIntents, type LaneIntent } from "./botLanePatch";
import { botLaneSupports, defaultBotSupportId } from "./botLaneSupports";
import type { LaneArrival } from "./laneGameplan";

export type DraftSelection = {
  allySupport: string;
  enemyCarry: string;
  enemySupport: string;
  intent: LaneIntent;
  arrival: LaneArrival;
  allySupportForward: boolean;
  enemyControlSpent: boolean;
  fioraFlashAvailable: boolean;
  enemyCarryFlashAvailable: boolean;
  junglePathBot: boolean;
  triBrushControl: boolean;
};

export const LANE_GAMEPLAN_STORAGE_KEY = "fiora-gameplan-builder-26-15";

export const DEFAULT_DRAFT_SELECTION: DraftSelection = {
  allySupport: defaultBotSupportId,
  enemyCarry: defaultBotCarryId,
  enemySupport: "lux",
  intent: "control",
  arrival: "even",
  allySupportForward: true,
  enemyControlSpent: false,
  fioraFlashAvailable: true,
  enemyCarryFlashAvailable: true,
  junglePathBot: false,
  triBrushControl: false,
};

const validArrivals: LaneArrival[] = ["first", "even", "late"];

export function readLaneGameplanSelection(): DraftSelection {
  if (typeof window === "undefined") return DEFAULT_DRAFT_SELECTION;

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(LANE_GAMEPLAN_STORAGE_KEY) || ""
    ) as Partial<DraftSelection>;

    return {
      allySupport: botLaneSupports.some((option) => option.id === stored.allySupport)
        ? (stored.allySupport as string)
        : DEFAULT_DRAFT_SELECTION.allySupport,
      enemyCarry: botLaneCarries.some((option) => option.id === stored.enemyCarry)
        ? (stored.enemyCarry as string)
        : DEFAULT_DRAFT_SELECTION.enemyCarry,
      enemySupport: botLaneSupports.some((option) => option.id === stored.enemySupport)
        ? (stored.enemySupport as string)
        : DEFAULT_DRAFT_SELECTION.enemySupport,
      intent: laneIntents.some((option) => option.id === stored.intent)
        ? (stored.intent as LaneIntent)
        : DEFAULT_DRAFT_SELECTION.intent,
      arrival: validArrivals.includes(stored.arrival as LaneArrival)
        ? (stored.arrival as LaneArrival)
        : DEFAULT_DRAFT_SELECTION.arrival,
      allySupportForward:
        typeof stored.allySupportForward === "boolean"
          ? stored.allySupportForward
          : DEFAULT_DRAFT_SELECTION.allySupportForward,
      enemyControlSpent:
        typeof stored.enemyControlSpent === "boolean"
          ? stored.enemyControlSpent
          : DEFAULT_DRAFT_SELECTION.enemyControlSpent,
      fioraFlashAvailable:
        typeof stored.fioraFlashAvailable === "boolean"
          ? stored.fioraFlashAvailable
          : DEFAULT_DRAFT_SELECTION.fioraFlashAvailable,
      enemyCarryFlashAvailable:
        typeof stored.enemyCarryFlashAvailable === "boolean"
          ? stored.enemyCarryFlashAvailable
          : DEFAULT_DRAFT_SELECTION.enemyCarryFlashAvailable,
      junglePathBot:
        typeof stored.junglePathBot === "boolean"
          ? stored.junglePathBot
          : DEFAULT_DRAFT_SELECTION.junglePathBot,
      triBrushControl:
        typeof stored.triBrushControl === "boolean"
          ? stored.triBrushControl
          : DEFAULT_DRAFT_SELECTION.triBrushControl,
    };
  } catch {
    return DEFAULT_DRAFT_SELECTION;
  }
}
