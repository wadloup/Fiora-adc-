import {
  hasTrustedRequestSource,
  sanitize,
  setApiSecurityHeaders,
} from "./_shared/security.js";

const VISIT_LIMIT = 360;
const THREAD_LIMIT = 80;
const TOP_LIST_LIMIT = 6;
const RECENT_VISITOR_LIMIT = 60;
const RECENT_THREAD_LIMIT = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeSecret(value) {
  const raw = Array.isArray(value) ? value[0] : value;

  if (typeof raw !== "string") {
    return "";
  }

  return raw.trim().replace(/^["']+|["']+$/g, "");
}

function buildSupabaseHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
}

function createQueryUrl(supabaseUrl, table, params = {}) {
  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url;
}

async function fetchRows(supabaseUrl, serviceRoleKey, table, params) {
  const response = await fetch(createQueryUrl(supabaseUrl, table, params), {
    headers: buildSupabaseHeaders(serviceRoleKey),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

function inferReason(errorText) {
  const normalized = (errorText || "").toLowerCase();

  if (normalized.includes("visit_logs") || normalized.includes("duration_seconds")) {
    return "visit_schema_missing";
  }

  if (
    normalized.includes("chat_threads") ||
    normalized.includes("chat_messages") ||
    normalized.includes("relation") ||
    normalized.includes("does not exist")
  ) {
    return "chat_schema_missing";
  }

  return "dashboard_fetch_failed";
}

function getReferrerLabel(referrer) {
  const cleaned = sanitize(referrer || "", 240);

  if (!cleaned) {
    return "Direct / Unknown";
  }

  try {
    const url = new URL(cleaned);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    return host || "Direct / Unknown";
  } catch {
    return cleaned;
  }
}

function buildVisitorKey(row) {
  return (
    row.source_fingerprint ||
    row.dedupe_key ||
    `${row.country || ""}|${row.region || ""}|${row.city || ""}|${
      row.user_agent || ""
    }`
  );
}

function threadNeedsReply(thread) {
  if (!thread?.last_visitor_message_at) {
    return false;
  }

  if (!thread.last_admin_message_at) {
    return true;
  }

  return (
    new Date(thread.last_visitor_message_at).getTime() >
    new Date(thread.last_admin_message_at).getTime()
  );
}

function pushMetricCount(map, label) {
  const normalizedLabel = sanitize(label || "", 120) || "Unknown";
  map.set(normalizedLabel, (map.get(normalizedLabel) || 0) + 1);
}

function sortMetricMap(map) {
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, TOP_LIST_LIMIT);
}

function formatReferrerBreakdown(visitRows) {
  const referrers = new Map();

  visitRows.forEach((row) => {
    pushMetricCount(referrers, getReferrerLabel(row.referrer));
  });

  return sortMetricMap(referrers);
}

function formatCountryBreakdown(visitors) {
  const countries = new Map();

  visitors.forEach((visitor) => {
    pushMetricCount(countries, visitor.latest_country || "Unknown");
  });

  return sortMetricMap(countries);
}

function formatPageBreakdown(visitRows) {
  const pages = new Map();

  visitRows.forEach((row) => {
    pushMetricCount(pages, row.guide_page || "Unknown");
  });

  return sortMetricMap(pages);
}

function aggregateVisitors(visitRows, threadRows) {
  const visitorMap = new Map();
  const threadLookup = new Map();

  threadRows.forEach((thread) => {
    if (thread.visitor_key) {
      threadLookup.set(thread.visitor_key, thread);
    } else if (thread.source_fingerprint) {
      threadLookup.set(thread.source_fingerprint, thread);
    }
  });

  visitRows.forEach((row) => {
    const visitorKey = buildVisitorKey(row);
    const durationSeconds = Number(row.duration_seconds || 0);
    const visitedAt = row.visited_at || new Date(0).toISOString();
    const referrerLabel = getReferrerLabel(row.referrer);
    const existing = visitorMap.get(visitorKey);

    if (!existing) {
      visitorMap.set(visitorKey, {
        visitor_key: visitorKey,
        visit_count: 1,
        first_seen_at: visitedAt,
        last_seen_at: visitedAt,
        total_duration_seconds: durationSeconds,
        latest_duration_seconds: durationSeconds,
        latest_country: row.country || null,
        latest_region: row.region || null,
        latest_city: row.city || null,
        latest_guide_page: row.guide_page || "Unknown",
        latest_pathname: row.pathname || "/",
        latest_referrer_label: referrerLabel,
        latest_referrer: row.referrer || null,
        latest_user_agent: row.user_agent || null,
        has_conversation: threadLookup.has(visitorKey),
        needs_reply: threadNeedsReply(threadLookup.get(visitorKey)),
      });
      return;
    }

    existing.visit_count += 1;
    existing.total_duration_seconds += durationSeconds;

    if (new Date(visitedAt).getTime() < new Date(existing.first_seen_at).getTime()) {
      existing.first_seen_at = visitedAt;
    }

    if (new Date(visitedAt).getTime() >= new Date(existing.last_seen_at).getTime()) {
      existing.last_seen_at = visitedAt;
      existing.latest_duration_seconds = durationSeconds;
      existing.latest_country = row.country || null;
      existing.latest_region = row.region || null;
      existing.latest_city = row.city || null;
      existing.latest_guide_page = row.guide_page || "Unknown";
      existing.latest_pathname = row.pathname || "/";
      existing.latest_referrer_label = referrerLabel;
      existing.latest_referrer = row.referrer || null;
      existing.latest_user_agent = row.user_agent || null;
      existing.has_conversation = threadLookup.has(visitorKey);
      existing.needs_reply = threadNeedsReply(threadLookup.get(visitorKey));
    }
  });

  return [...visitorMap.values()]
    .sort(
      (a, b) =>
        new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime()
    )
    .slice(0, RECENT_VISITOR_LIMIT);
}

function buildOverview(visitRows, visitors, threads) {
  const now = Date.now();
  const visits24h = visitRows.filter((row) => {
    const timestamp = Date.parse(row.visited_at || "");
    return Number.isFinite(timestamp) && now - timestamp <= DAY_MS;
  });
  const visitorKeys24h = new Set(visits24h.map(buildVisitorKey));
  const activeCountries = new Set(
    visitors.map((visitor) => visitor.latest_country).filter(Boolean)
  );
  const durations = visitRows
    .map((row) => Number(row.duration_seconds || 0))
    .filter((value) => Number.isFinite(value) && value > 0);
  const totalDurationSeconds = durations.reduce((sum, value) => sum + value, 0);
  const averageDurationSeconds = durations.length
    ? Math.round(totalDurationSeconds / durations.length)
    : 0;
  const threads24h = threads.filter((thread) => {
    const timestamp = Date.parse(thread.updated_at || thread.created_at || "");
    return Number.isFinite(timestamp) && now - timestamp <= DAY_MS;
  });
  const waitingReplies = threads.filter(threadNeedsReply);

  return {
    visit_events: visitRows.length,
    unique_visitors: visitors.length,
    unique_visitors_24h: visitorKeys24h.size,
    active_countries: activeCountries.size,
    total_duration_seconds: totalDurationSeconds,
    average_duration_seconds: averageDurationSeconds,
    conversations: threads.length,
    conversations_24h: threads24h.length,
    waiting_replies: waitingReplies.length,
  };
}

export default async function handler(request, response) {
  setApiSecurityHeaders(response);
  response.setHeader("Allow", "GET");
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET") {
    return response.status(405).json({ ok: false });
  }

  if (!hasTrustedRequestSource(request)) {
    return response.status(403).json({
      ok: false,
      reason: "untrusted_request_source",
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const messageAdminKey = process.env.MESSAGE_ADMIN_KEY;
  const normalizedAdminKey = normalizeSecret(messageAdminKey);
  const providedAdminKey = normalizeSecret(
    request.headers["x-admin-key"] || request.headers["X-Admin-Key"]
  );

  if (!supabaseUrl || !serviceRoleKey) {
    return response.status(500).json({
      ok: false,
      reason: "missing_dashboard_env",
    });
  }

  if (!normalizedAdminKey) {
    return response.status(500).json({
      ok: false,
      reason: "missing_admin_key_env",
    });
  }

  if (providedAdminKey !== normalizedAdminKey) {
    return response.status(403).json({
      ok: false,
      reason: "invalid_admin_key",
    });
  }

  let visitRows = [];
  let threadRows = [];
  let visitIssue = null;
  let chatIssue = null;

  try {
    visitRows = await fetchRows(supabaseUrl, serviceRoleKey, "visit_logs", {
      select:
        "id,visited_at,guide_page,pathname,country,region,city,referrer,user_agent,source_fingerprint,dedupe_key,duration_seconds",
      order: "visited_at.desc",
      limit: VISIT_LIMIT,
    });
  } catch (error) {
    visitIssue = inferReason(error instanceof Error ? error.message : "");
  }

  try {
    threadRows = await fetchRows(supabaseUrl, serviceRoleKey, "chat_threads", {
      select:
        "id,thread_token,created_at,updated_at,nickname,contact,country,region,city,status,last_message_preview,last_visitor_message_at,last_admin_message_at,visitor_key,source_fingerprint",
      order: "updated_at.desc",
      limit: THREAD_LIMIT,
    });
  } catch (error) {
    chatIssue = inferReason(error instanceof Error ? error.message : "");
  }

  const recentVisitors = aggregateVisitors(visitRows, threadRows);
  const overview = buildOverview(visitRows, recentVisitors, threadRows);
  const topCountries = formatCountryBreakdown(recentVisitors);
  const topPages = formatPageBreakdown(visitRows);
  const topReferrers = formatReferrerBreakdown(visitRows);
  const recentThreads = threadRows.slice(0, RECENT_THREAD_LIMIT);

  return response.status(200).json({
    ok: true,
    generatedAt: new Date().toISOString(),
    overview,
    topCountries,
    topPages,
    topReferrers,
    recentVisitors,
    recentThreads,
    issues: {
      visits: visitIssue,
      chat: chatIssue,
    },
  });
}
