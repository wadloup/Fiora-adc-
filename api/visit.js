import {
  buildVisitorIdentity,
  hasTrustedRequestSource,
  isJsonRequest,
  sanitize,
  setApiSecurityHeaders,
  getContentLength,
} from "./_shared/security.js";

const RECENT_DUPLICATE_WINDOW_MS = 75 * 1000;

async function readJsonBody(request) {
  if (!request.body) {
    return {};
  }

  if (typeof request.body === "object" && !Buffer.isBuffer(request.body)) {
    return request.body;
  }

  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body);
    } catch {
      return {};
    }
  }

  if (Buffer.isBuffer(request.body)) {
    try {
      return JSON.parse(request.body.toString("utf8"));
    } catch {
      return {};
    }
  }

  return {};
}

function shouldIgnoreVisit(userAgent) {
  if (!userAgent) {
    return false;
  }

  const normalized = userAgent.toLowerCase();

  return (
    normalized.startsWith("vercel-screenshot/") ||
    normalized.includes("headlesschrome") ||
    normalized.includes("bytespider") ||
    normalized.includes("facebookexternalhit") ||
    normalized.includes("discordbot") ||
    normalized.includes("telegrambot") ||
    normalized.includes("googlebot") ||
    normalized.includes("bingbot") ||
    normalized.includes("crawler") ||
    normalized.includes("spider") ||
    normalized.includes("lighthouse") ||
    normalized.includes("playwright") ||
    normalized.includes("puppeteer") ||
    normalized.includes("selenium") ||
    normalized.includes("wget") ||
    normalized.includes("curl")
  );
}

function escapeFilterValue(value) {
  return `"${value.replace(/"/g, '\\"')}"`;
}

async function insertVisitRecord(supabaseUrl, serviceRoleKey, payload) {
  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/visit_logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify([payload]),
  });

  if (!insertResponse.ok) {
    const errorText = await insertResponse.text();
    return { ok: false, errorText };
  }

  return { ok: true };
}

async function findRecentDuplicate(
  supabaseUrl,
  serviceRoleKey,
  payload,
  dedupeKey
) {
  const baseUrl = new URL(`${supabaseUrl}/rest/v1/visit_logs`);
  baseUrl.searchParams.set("select", "visited_at,id");
  baseUrl.searchParams.set("order", "visited_at.desc");
  baseUrl.searchParams.set("limit", "1");
  baseUrl.searchParams.set("guide_page", `eq.${escapeFilterValue(payload.guide_page)}`);
  baseUrl.searchParams.set("pathname", `eq.${escapeFilterValue(payload.pathname)}`);

  if (payload.source_fingerprint) {
    baseUrl.searchParams.set(
      "source_fingerprint",
      `eq.${escapeFilterValue(payload.source_fingerprint)}`
    );
  } else {
    baseUrl.searchParams.set("dedupe_key", `eq.${escapeFilterValue(dedupeKey)}`);
  }

  const result = await fetch(baseUrl, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  if (!result.ok) {
    return false;
  }

  const rows = await result.json();
  const latest = rows?.[0];

  if (!latest?.visited_at) {
    return false;
  }

  const latestTimestamp = Date.parse(latest.visited_at);

  if (Number.isNaN(latestTimestamp)) {
    return false;
  }

  return Date.now() - latestTimestamp < RECENT_DUPLICATE_WINDOW_MS;
}

export default async function handler(request, response) {
  setApiSecurityHeaders(response);

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false });
  }

  if (!hasTrustedRequestSource(request)) {
    return response.status(403).json({
      ok: false,
      reason: "untrusted_request_source",
    });
  }

  if (!isJsonRequest(request)) {
    return response.status(415).json({
      ok: false,
      reason: "invalid_content_type",
    });
  }

  if (getContentLength(request) > 4_096) {
    return response.status(413).json({
      ok: false,
      reason: "payload_too_large",
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const fingerprintSalt =
    process.env.VISIT_LOG_HASH_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return response.status(202).json({
      ok: false,
      reason: "missing_visit_log_env",
    });
  }

  const body = await readJsonBody(request);
  const { country, region, city, userAgent, sourceFingerprint, dedupeKey } =
    buildVisitorIdentity(request, fingerprintSalt);
  const guidePage = sanitize(body.page || "Unknown", 80);
  const pathname = sanitize(body.path || "/", 200);
  const referrer = sanitize(body.referrer || "", 160);

  if (shouldIgnoreVisit(userAgent)) {
    return response.status(204).end();
  }

  const payload = {
    guide_page: guidePage,
    pathname,
    country,
    region,
    city,
    referrer,
    user_agent: userAgent,
    source_fingerprint: sourceFingerprint,
    dedupe_key: dedupeKey,
  };

  try {
    const isRecentDuplicate = await findRecentDuplicate(
      supabaseUrl,
      serviceRoleKey,
      payload,
      dedupeKey
    );

    if (isRecentDuplicate) {
      return response.status(202).json({
        ok: true,
        skipped: "recent_duplicate",
      });
    }

    let result = await insertVisitRecord(supabaseUrl, serviceRoleKey, payload);

    if (
      !result.ok &&
      (result.errorText.includes("source_fingerprint") ||
        result.errorText.includes("dedupe_key"))
    ) {
      const legacyPayload = {
        guide_page: payload.guide_page,
        pathname: payload.pathname,
        country: payload.country,
        region: payload.region,
        city: payload.city,
        referrer: payload.referrer,
        user_agent: payload.user_agent,
      };
      result = await insertVisitRecord(supabaseUrl, serviceRoleKey, legacyPayload);
    }

    if (!result.ok) {
      return response.status(500).json({
        ok: false,
        reason: "insert_failed",
        details: result.errorText.slice(0, 240),
      });
    }

    return response.status(201).json({
      ok: true,
      country,
      region,
      city,
      sourceFingerprint,
      guidePage,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      reason: "unexpected_error",
      details:
        error instanceof Error ? error.message.slice(0, 240) : "unknown",
    });
  }
}
