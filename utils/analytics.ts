import { track } from "@vercel/analytics";

function sanitizeValue(value: string, maxLength = 120) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function trackGuidePageViewed(page: string) {
  track("Guide Page Viewed", {
    page: sanitizeValue(page, 80),
  });
}

export function trackSpeakableBlockPlayed(label: string) {
  track("Speakable Block Played", {
    label: sanitizeValue(label),
  });
}
