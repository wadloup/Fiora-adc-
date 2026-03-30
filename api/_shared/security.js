import { createHash } from "node:crypto";

export function sanitize(value, maxLength = 180) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

export function decodeHeaderValue(value, maxLength = 180) {
  const sanitized = sanitize(value, maxLength);

  if (!sanitized) {
    return null;
  }

  try {
    return decodeURIComponent(sanitized);
  } catch {
    return sanitized;
  }
}

export function readHeaderValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return typeof value === "string" ? value : "";
}

export function extractClientIp(headers) {
  const directIp = readHeaderValue(headers["x-real-ip"]);
  const vercelForwardedIp = readHeaderValue(headers["x-vercel-forwarded-for"]);
  const forwardedFor = readHeaderValue(headers["x-forwarded-for"]);
  const raw =
    directIp || vercelForwardedIp || forwardedFor.split(",")[0] || "";

  return sanitize(raw.trim(), 120);
}

export function buildHashedValue(rawValue, salt, length = 20) {
  if (!rawValue || !salt) {
    return null;
  }

  return createHash("sha256")
    .update(`${salt}:${rawValue}`)
    .digest("hex")
    .slice(0, length);
}

export function buildOriginFromRequest(request) {
  const proto =
    readHeaderValue(request.headers["x-forwarded-proto"]) || "https";
  const host =
    sanitize(
      readHeaderValue(request.headers["x-forwarded-host"]) ||
        readHeaderValue(request.headers.host),
      255
    ) || null;

  if (!host) {
    return null;
  }

  return `${proto}://${host}`;
}

function isSameOriginUrl(rawUrl, allowedOrigin) {
  try {
    return new URL(rawUrl).origin === allowedOrigin;
  } catch {
    return false;
  }
}

export function hasTrustedRequestSource(request) {
  const allowedOrigin = buildOriginFromRequest(request);

  if (!allowedOrigin) {
    return false;
  }

  const secFetchSite = readHeaderValue(
    request.headers["sec-fetch-site"]
  ).toLowerCase();
  const origin = readHeaderValue(request.headers.origin);
  const referer = readHeaderValue(request.headers.referer);

  if (
    secFetchSite &&
    secFetchSite !== "same-origin" &&
    secFetchSite !== "same-site" &&
    secFetchSite !== "none"
  ) {
    return false;
  }

  if (origin && !isSameOriginUrl(origin, allowedOrigin)) {
    return false;
  }

  if (referer && !isSameOriginUrl(referer, allowedOrigin)) {
    return false;
  }

  return Boolean(secFetchSite || origin || referer);
}

export function setApiSecurityHeaders(response) {
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("Pragma", "no-cache");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "same-origin");
  response.setHeader("Vary", "Origin, Referer, Sec-Fetch-Site");
}

export function getContentLength(request) {
  const rawLength = readHeaderValue(request.headers["content-length"]);
  const parsedLength = Number.parseInt(rawLength || "0", 10);

  return Number.isFinite(parsedLength) ? parsedLength : 0;
}

export function isJsonRequest(request) {
  const contentType = readHeaderValue(request.headers["content-type"]).toLowerCase();

  if (!contentType) {
    return true;
  }

  return (
    contentType.includes("application/json") ||
    contentType.includes("text/plain")
  );
}

export function buildVisitorIdentity(request, salt) {
  const country = sanitize(request.headers["x-vercel-ip-country"] || "", 8);
  const region = decodeHeaderValue(
    request.headers["x-vercel-ip-country-region"] || "",
    80
  );
  const city = decodeHeaderValue(request.headers["x-vercel-ip-city"] || "", 80);
  const userAgent = sanitize(request.headers["user-agent"] || "", 255);
  const clientIp = extractClientIp(request.headers);
  const sourceFingerprint = buildHashedValue(clientIp, salt);
  const dedupeKey = buildHashedValue(
    `${userAgent || "unknown"}|${country || ""}|${region || ""}|${city || ""}`,
    salt
  );

  return {
    country,
    region,
    city,
    userAgent,
    sourceFingerprint,
    dedupeKey,
    visitorKey: sourceFingerprint || dedupeKey,
  };
}
