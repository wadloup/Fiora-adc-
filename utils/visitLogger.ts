const CLIENT_DEDUPE_WINDOW_MS = 15_000;
const RESUME_LOG_WINDOW_MS = 90_000;

const lastLoggedAtByVisitKey = new Map<string, number>();

let activePage: string | null = null;
let listenersAttached = false;

function getCurrentPath() {
  return (
    window.location.pathname +
    window.location.search +
    window.location.hash
  );
}

function sendVisit(page: string, minWindowMs: number) {
  if (typeof window === "undefined" || import.meta.env.DEV) {
    return;
  }

  const path = getCurrentPath();
  const visitKey = `${page}::${path}`;
  const now = Date.now();
  const lastLoggedAt = lastLoggedAtByVisitKey.get(visitKey) ?? 0;

  if (now - lastLoggedAt < minWindowMs) {
    return;
  }

  lastLoggedAtByVisitKey.set(visitKey, now);
  activePage = page;

  const payload = JSON.stringify({
    page,
    path,
    referrer: document.referrer || "",
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/visit", blob);
    return;
  }

  void fetch("/api/visit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  });
}

function logResumedVisit() {
  if (!activePage) {
    return;
  }

  sendVisit(activePage, RESUME_LOG_WINDOW_MS);
}

function attachResumeListeners() {
  if (listenersAttached || typeof window === "undefined") {
    return;
  }

  listenersAttached = true;

  window.addEventListener("focus", logResumedVisit);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      logResumedVisit();
    }
  });
}

export function logVisitorPageView(page: string) {
  attachResumeListeners();
  sendVisit(page, CLIENT_DEDUPE_WINDOW_MS);
}
