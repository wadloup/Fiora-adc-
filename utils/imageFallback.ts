import type React from "react";

export const DEFAULT_CHAMPION_IMAGE =
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Fiora_0.jpg";
export const DEFAULT_RUNE_PAGE_IMAGE = "/pta-page.png";
export const DEFAULT_ITEM_ICON =
  "https://ddragon.leagueoflegends.com/cdn/16.6.1/img/item/3077.png";

function applyFallback(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string
) {
  const img = event.currentTarget;

  if (img.dataset.fallbackApplied === "true") {
    return;
  }

  img.dataset.fallbackApplied = "true";
  img.src = fallback;
}

export function recoverImage(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string = DEFAULT_CHAMPION_IMAGE
) {
  applyFallback(event, fallback);
}

export function recoverAssetImage(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallback: string
) {
  applyFallback(event, fallback);
}
