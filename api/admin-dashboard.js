import {
  hasTrustedRequestSource,
  sanitize,
  setApiSecurityHeaders,
} from "./_shared/security.js";

const VISIT_LIMIT = 360;
const THREAD_LIMIT = 80;
const VOTE_RECEIPT_LIMIT = 360;
const TOP_LIST_LIMIT = 8;
const RECENT_VISITOR_LIMIT = 60;
const RECENT_THREAD_LIMIT = 10;
const RECENT_VOTE_LIMIT = 14;
const DAY_MS = 24 * 60 * 60 * 1000;
const DASHBOARD_TREND_DAYS = 7;
const VOTE_CHOICES = ["up", "down", "poop"];

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

  if (
    normalized.includes("report_votes") ||
    normalized.includes("report_vote_receipts") ||
    normalized.includes("selected_choice")
  ) {
    return "vote_schema_missing";
  }

  return "dashboard_fetch_failed";
}

function normalizeDateRange(value) {
  const normalized = (sanitize(value || "", 12) || "").toLowerCase();

  if (normalized === "24h" || normalized === "7d" || normalized === "30d") {
    return normalized;
  }

  return "all";
}

function getDateThreshold(dateRange) {
  if (dateRange === "24h") {
    return Date.now() - DAY_MS;
  }

  if (dateRange === "7d") {
    return Date.now() - DAY_MS * 7;
  }

  if (dateRange === "30d") {
    return Date.now() - DAY_MS * 30;
  }

  return null;
}

function normalizeCountryLabel(value) {
  return sanitize(value || "", 40) || "Unknown";
}

function normalizePageLabel(value) {
  return sanitize(value || "", 80) || "Unknown";
}

function normalizeVoteChoice(value) {
  const normalized = (sanitize(value || "", 20) || "").toLowerCase();
  return VOTE_CHOICES.includes(normalized) ? normalized : "unknown";
}

function formatVoteChoice(value) {
  const normalized = normalizeVoteChoice(value);

  if (normalized === "up") {
    return "UP";
  }

  if (normalized === "down") {
    return "DOWN";
  }

  if (normalized === "poop") {
    return "POOP";
  }

  return "UNKNOWN";
}

function getParisDayKey(value) {
  const date = new Date(value || 0);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-CA", {
    timeZone: "Europe/Paris",
  });
}

function getParisDayLabel(value) {
  const date = new Date(value || 0);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Paris",
  });
}

function buildDashboardFilters(request) {
  const requestUrl = new URL(request.url, "https://local.invalid");

  return {
    country: sanitize(requestUrl.searchParams.get("country") || "", 40),
    page: sanitize(requestUrl.searchParams.get("page") || "", 80),
    referrer: sanitize(requestUrl.searchParams.get("referrer") || "", 120),
    dateRange: normalizeDateRange(
      requestUrl.searchParams.get("date") ||
        requestUrl.searchParams.get("dateRange") ||
        ""
    ),
  };
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
  if (thread?.status === "handled" || thread?.status === "archived") {
    return false;
  }

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

function buildFilterOptions(visitRows) {
  const countries = new Set();
  const pages = new Set();
  const referrers = new Set();

  visitRows.forEach((row) => {
    countries.add(normalizeCountryLabel(row.country));
    pages.add(normalizePageLabel(row.guide_page));
    referrers.add(getReferrerLabel(row.referrer));
  });

  return {
    countries: [...countries].sort((a, b) => a.localeCompare(b)),
    pages: [...pages].sort((a, b) => a.localeCompare(b)),
    referrers: [...referrers].sort((a, b) => a.localeCompare(b)),
  };
}

function applyVisitFilters(visitRows, filters) {
  const dateThreshold = getDateThreshold(filters.dateRange);

  return visitRows.filter((row) => {
    if (
      filters.country &&
      normalizeCountryLabel(row.country) !== filters.country
    ) {
      return false;
    }

    if (filters.page && normalizePageLabel(row.guide_page) !== filters.page) {
      return false;
    }

    if (filters.referrer && getReferrerLabel(row.referrer) !== filters.referrer) {
      return false;
    }

    if (dateThreshold) {
      const timestamp = Date.parse(row.visited_at || "");

      if (!Number.isFinite(timestamp) || timestamp < dateThreshold) {
        return false;
      }
    }

    return true;
  });
}

function applyThreadFilters(threadRows, filters) {
  const dateThreshold = getDateThreshold(filters.dateRange);

  return threadRows.filter((thread) => {
    if (
      filters.country &&
      normalizeCountryLabel(thread.country) !== filters.country
    ) {
      return false;
    }

    if (dateThreshold) {
      const timestamp = Date.parse(thread.updated_at || thread.created_at || "");

      if (!Number.isFinite(timestamp) || timestamp < dateThreshold) {
        return false;
      }
    }

    return true;
  });
}

function applyVoteFilters(voteReceiptRows, filters) {
  const dateThreshold = getDateThreshold(filters.dateRange);

  if (!dateThreshold) {
    return voteReceiptRows;
  }

  return voteReceiptRows.filter((vote) => {
    const timestamp = Date.parse(vote.created_at || "");
    return Number.isFinite(timestamp) && timestamp >= dateThreshold;
  });
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

function formatVoteBreakdown(voteRows, voteReceiptRows, dateRange) {
  const votes = new Map(VOTE_CHOICES.map((choice) => [formatVoteChoice(choice), 0]));

  if (dateRange === "all" && voteRows.length) {
    voteRows.forEach((row) => {
      const label = formatVoteChoice(row.option_key);
      votes.set(label, Number(row.count || 0));
    });
  } else {
    voteReceiptRows.forEach((row) => {
      const label = formatVoteChoice(row.selected_choice);
      votes.set(label, (votes.get(label) || 0) + 1);
    });
  }

  return [...votes.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function buildVoteOverview(voteBreakdown, voteReceiptRows, visitors, threads) {
  const totalVotes = voteBreakdown.reduce((sum, item) => sum + item.count, 0);
  const topVote = voteBreakdown.find((item) => item.count > 0);
  const now = Date.now();
  const votes24h = voteReceiptRows.filter((vote) => {
    const timestamp = Date.parse(vote.created_at || "");
    return Number.isFinite(timestamp) && now - timestamp <= DAY_MS;
  }).length;
  const uniqueVisitors = Math.max(visitors.length, 0);
  const conversations = Math.max(threads.length, 0);
  const voteConversionRate = uniqueVisitors
    ? Math.round((totalVotes / uniqueVisitors) * 100)
    : 0;
  const conversationConversionRate = uniqueVisitors
    ? Math.round((conversations / uniqueVisitors) * 100)
    : 0;

  return {
    total_votes: totalVotes,
    votes_24h: votes24h,
    top_vote_label: topVote?.label || "None",
    top_vote_count: topVote?.count || 0,
    vote_conversion_rate: voteConversionRate,
    conversation_conversion_rate: conversationConversionRate,
  };
}

function buildActivityByDay(visitRows, threadRows, voteReceiptRows = []) {
  const now = new Date();
  const buckets = [];

  for (let index = DASHBOARD_TREND_DAYS - 1; index >= 0; index -= 1) {
    const day = new Date(now.getTime() - DAY_MS * index);
    const key = getParisDayKey(day.toISOString());

    buckets.push({
      key,
      label: getParisDayLabel(day.toISOString()),
      visits: 0,
      conversations: 0,
      votes: 0,
    });
  }

  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  visitRows.forEach((row) => {
    const bucket = bucketMap.get(getParisDayKey(row.visited_at));

    if (bucket) {
      bucket.visits += 1;
    }
  });

  threadRows.forEach((thread) => {
    const bucket = bucketMap.get(
      getParisDayKey(thread.updated_at || thread.created_at)
    );

    if (bucket) {
      bucket.conversations += 1;
    }
  });

  voteReceiptRows.forEach((vote) => {
    const bucket = bucketMap.get(getParisDayKey(vote.created_at));

    if (bucket) {
      bucket.votes += 1;
    }
  });

  return buckets;
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

  return [...visitorMap.values()].sort(
    (a, b) =>
      new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime()
  );
}

function buildOverview(visitRows, visitors, threads) {
  const now = Date.now();
  const activeVisitorCutoff = now - 5 * 60 * 1000;
  const visits24h = visitRows.filter((row) => {
    const timestamp = Date.parse(row.visited_at || "");
    return Number.isFinite(timestamp) && now - timestamp <= DAY_MS;
  });
  const activeVisitorsNow = visitors.filter((visitor) => {
    const timestamp = Date.parse(visitor.last_seen_at || "");
    return Number.isFinite(timestamp) && timestamp >= activeVisitorCutoff;
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
  const openThreads = threads.filter((thread) => thread.status === "open");
  const handledThreads = threads.filter((thread) => thread.status === "handled");
  const archivedThreads = threads.filter((thread) => thread.status === "archived");

  return {
    visit_events: visitRows.length,
    unique_visitors: visitors.length,
    unique_visitors_24h: visitorKeys24h.size,
    active_visitors_now: activeVisitorsNow.length,
    active_countries: activeCountries.size,
    total_duration_seconds: totalDurationSeconds,
    average_duration_seconds: averageDurationSeconds,
    conversations: threads.length,
    conversations_24h: threads24h.length,
    waiting_replies: waitingReplies.length,
    open_threads: openThreads.length,
    handled_threads: handledThreads.length,
    archived_threads: archivedThreads.length,
  };
}

export default async function handler(request, response) {
  setApiSecurityHeaders(response);
  response.setHeader("Allow", "GET");
  response.setHeader("Cache-Control", "no-store");
  try {
    if (request.method !== "GET") {
      return response.status(405).json({ ok: false });
    }

    if (!hasTrustedRequestSource(request)) {
      return response.status(403).json({
        ok: false,
        reason: "untrusted_request_source",
      });
    }

    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
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
    let voteRows = [];
    let voteReceiptRows = [];
    let visitIssue = null;
    let chatIssue = null;
    let voteIssue = null;
    const filters = buildDashboardFilters(request);

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

    try {
      voteRows = await fetchRows(supabaseUrl, serviceRoleKey, "report_votes", {
        select: "option_key,count",
        limit: 12,
      });

      voteReceiptRows = await fetchRows(
        supabaseUrl,
        serviceRoleKey,
        "report_vote_receipts",
        {
          select: "id,selected_choice,created_at",
          order: "created_at.desc",
          limit: VOTE_RECEIPT_LIMIT,
        }
      );
    } catch (error) {
      voteIssue = inferReason(error instanceof Error ? error.message : "");
    }

    const filterOptions = buildFilterOptions(visitRows);
    const filteredVisitRows = applyVisitFilters(visitRows, filters);
    const filteredThreadRows = applyThreadFilters(threadRows, filters);
    const filteredVoteReceiptRows = applyVoteFilters(voteReceiptRows, filters);
    const aggregatedVisitors = aggregateVisitors(
      filteredVisitRows,
      filteredThreadRows
    );
    const recentVisitors = aggregatedVisitors.slice(0, RECENT_VISITOR_LIMIT);
    const overview = buildOverview(
      filteredVisitRows,
      aggregatedVisitors,
      filteredThreadRows
    );
    const topCountries = formatCountryBreakdown(aggregatedVisitors);
    const topPages = formatPageBreakdown(filteredVisitRows);
    const topReferrers = formatReferrerBreakdown(filteredVisitRows);
    const voteBreakdown = formatVoteBreakdown(
      voteRows,
      filteredVoteReceiptRows,
      filters.dateRange
    );
    const voteOverview = buildVoteOverview(
      voteBreakdown,
      voteReceiptRows,
      aggregatedVisitors,
      filteredThreadRows
    );
    const recentThreads = filteredThreadRows.slice(0, RECENT_THREAD_LIMIT);
    const recentVotes = filteredVoteReceiptRows
      .slice(0, RECENT_VOTE_LIMIT)
      .map((vote) => ({
        id: vote.id,
        selected_choice: normalizeVoteChoice(vote.selected_choice),
        label: formatVoteChoice(vote.selected_choice),
        created_at: vote.created_at,
      }));
    const activityByDay = buildActivityByDay(
      filteredVisitRows,
      filteredThreadRows,
      filteredVoteReceiptRows
    );

    return response.status(200).json({
      ok: true,
      generatedAt: new Date().toISOString(),
      filtersApplied: filters,
      filterOptions,
      overview,
      topCountries,
      topPages,
      topReferrers,
      voteOverview,
      voteBreakdown,
      activityByDay,
      recentVisitors,
      recentThreads,
      recentVotes,
      issues: {
        visits: visitIssue,
        chat: chatIssue,
        votes: voteIssue,
      },
    });
  } catch (error) {
    console.error("admin_dashboard_handler_crashed", error);

    return response.status(500).json({
      ok: false,
      reason: "admin_dashboard_handler_crashed",
      message:
        error instanceof Error ? error.message : "Unknown dashboard crash",
    });
  }
}
