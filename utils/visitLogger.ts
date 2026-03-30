const loggedVisitKeys = new Set<string>();

export function logVisitorPageView(page: string) {
  if (typeof window === "undefined" || import.meta.env.DEV) {
    return;
  }

  const path =
    window.location.pathname +
    window.location.search +
    window.location.hash;
  const visitKey = `${page}::${path}`;

  if (loggedVisitKeys.has(visitKey)) {
    return;
  }

  loggedVisitKeys.add(visitKey);

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
