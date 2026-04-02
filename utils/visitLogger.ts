const MIN_DURATION_FLUSH_MS = 1_000;
const DURATION_SYNC_INTERVAL_MS = 15_000;

type ActiveVisit = {
  page: string;
  path: string;
  visitToken: string;
  referrer: string;
  visibleSince: number | null;
  accumulatedVisibleMs: number;
  lastSentDurationSeconds: number;
};

let activePage: string | null = null;
let activeVisit: ActiveVisit | null = null;
let listenersAttached = false;

function getCurrentPath() {
  return window.location.pathname;
}

function getSanitizedReferrer() {
  if (!document.referrer) {
    return "";
  }

  try {
    const referrerUrl = new URL(document.referrer);
    return `${referrerUrl.origin}${referrerUrl.pathname}`;
  } catch {
    return "";
  }
}

function createVisitToken() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `visit_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function sendVisitPayload(
  payload: Record<string, unknown>,
  useBeacon = false
) {
  const body = JSON.stringify(payload);

  if (useBeacon && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/visit", blob);
    return;
  }

  void fetch("/api/visit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  });
}

function pauseActiveVisit() {
  if (!activeVisit || activeVisit.visibleSince === null) {
    return;
  }

  activeVisit.accumulatedVisibleMs += Date.now() - activeVisit.visibleSince;
  activeVisit.visibleSince = null;
}

function resumeActiveVisit() {
  if (!activeVisit || activeVisit.visibleSince !== null) {
    return;
  }

  activeVisit.visibleSince = Date.now();
}

function flushActiveVisitDuration({
  clear = false,
  force = false,
  useBeacon = false,
}: {
  clear?: boolean;
  force?: boolean;
  useBeacon?: boolean;
} = {}) {
  if (!activeVisit) {
    return;
  }

  pauseActiveVisit();

  if (!force && activeVisit.accumulatedVisibleMs < MIN_DURATION_FLUSH_MS) {
    if (clear) {
      activeVisit = null;
    }
    return;
  }

  const durationSeconds = Math.max(
    1,
    Math.round(activeVisit.accumulatedVisibleMs / 1000)
  );

  if (durationSeconds > activeVisit.lastSentDurationSeconds) {
    activeVisit.lastSentDurationSeconds = durationSeconds;

    sendVisitPayload(
      {
        eventType: "duration",
        visitToken: activeVisit.visitToken,
        page: activeVisit.page,
        path: activeVisit.path,
        durationSeconds,
      },
      useBeacon
    );
  }

  if (clear) {
    activeVisit = null;
  }
}

function startVisit(page: string) {
  if (typeof window === "undefined" || import.meta.env.DEV) {
    return;
  }

  const path = getCurrentPath();

  if (activeVisit?.page === page && activeVisit.path === path) {
    activePage = page;
    resumeActiveVisit();
    return;
  }

  flushActiveVisitDuration({ clear: true });

  const visitToken = createVisitToken();
  const referrer = getSanitizedReferrer();
  const visibleSince =
    document.visibilityState === "visible" ? Date.now() : null;

  activeVisit = {
    page,
    path,
    visitToken,
    referrer,
    visibleSince,
    accumulatedVisibleMs: 0,
    lastSentDurationSeconds: 0,
  };
  activePage = page;

  sendVisitPayload({
    eventType: "view",
    visitToken,
    page,
    path,
    referrer,
  });
}

function attachLifecycleListeners() {
  if (listenersAttached || typeof window === "undefined") {
    return;
  }

  listenersAttached = true;

  window.setInterval(() => {
    if (document.visibilityState !== "visible") {
      return;
    }

    flushActiveVisitDuration();
    resumeActiveVisit();
  }, DURATION_SYNC_INTERVAL_MS);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushActiveVisitDuration({ useBeacon: true });
      return;
    }

    if (activePage) {
      resumeActiveVisit();
    }
  });

  window.addEventListener("pagehide", () => {
    flushActiveVisitDuration({ clear: true, force: true, useBeacon: true });
  });
}

export function logVisitorPageView(page: string) {
  attachLifecycleListeners();
  startVisit(page);
}
