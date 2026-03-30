import {
  buildVisitorIdentity,
  hasTrustedRequestSource,
  isJsonRequest,
  sanitize,
  setApiSecurityHeaders,
  getContentLength,
} from "./_shared/security.js";

const VALID_CHOICES = new Set(["up", "down", "poop"]);

const EMPTY_COUNTS = {
  up: 0,
  down: 0,
  poop: 0,
};

function buildSupabaseHeaders(serviceRoleKey, extraHeaders = {}) {
  return {
    "Content-Type": "application/json",
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    ...extraHeaders,
  };
}

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

function normalizeCounts(rows) {
  const counts = { ...EMPTY_COUNTS };

  for (const row of rows || []) {
    if (!row?.option_key || typeof row.count !== "number") {
      continue;
    }

    if (row.option_key in counts) {
      counts[row.option_key] = row.count;
    }
  }

  return counts;
}

async function fetchVoteCounts(supabaseUrl, serviceRoleKey) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/report_votes?select=option_key,count`,
    {
      headers: buildSupabaseHeaders(serviceRoleKey),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return normalizeCounts(await response.json());
}

async function callVoteRpc(supabaseUrl, serviceRoleKey, choice, visitorKey) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/cast_report_vote`, {
    method: "POST",
    headers: buildSupabaseHeaders(serviceRoleKey),
    body: JSON.stringify({
      p_choice: choice,
      p_visitor_key: visitorKey,
    }),
  });

  if (!response.ok) {
    return {
      ok: false,
      errorText: await response.text(),
    };
  }

  return {
    ok: true,
    payload: await response.json(),
  };
}

async function legacyIncrementVote(supabaseUrl, serviceRoleKey, choice) {
  const currentCounts = await fetchVoteCounts(supabaseUrl, serviceRoleKey);
  const nextValue = (currentCounts[choice] || 0) + 1;

  const updateResponse = await fetch(
    `${supabaseUrl}/rest/v1/report_votes?option_key=eq.${choice}`,
    {
      method: "PATCH",
      headers: buildSupabaseHeaders(serviceRoleKey, {
        Prefer: "return=minimal",
      }),
      body: JSON.stringify({ count: nextValue }),
    }
  );

  if (!updateResponse.ok) {
    throw new Error(await updateResponse.text());
  }

  const counts = await fetchVoteCounts(supabaseUrl, serviceRoleKey);

  return {
    applied: true,
    selectedChoice: choice,
    counts,
    protectionMode: "legacy",
  };
}

export default async function handler(request, response) {
  setApiSecurityHeaders(response);
  response.setHeader("Allow", "GET, POST");

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const fingerprintSalt =
    process.env.VISIT_LOG_HASH_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return response.status(202).json({
      ok: false,
      reason: "missing_vote_env",
    });
  }

  if (request.method === "GET") {
    try {
      const counts = await fetchVoteCounts(supabaseUrl, serviceRoleKey);
      return response.status(200).json({ ok: true, counts });
    } catch {
      return response.status(500).json({
        ok: false,
        reason: "vote_counts_unavailable",
      });
    }
  }

  if (request.method !== "POST") {
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

  if (getContentLength(request) > 1_024) {
    return response.status(413).json({
      ok: false,
      reason: "payload_too_large",
    });
  }

  const body = await readJsonBody(request);
  const choice = sanitize(body.choice || "", 12)?.toLowerCase() || null;

  if (!choice || !VALID_CHOICES.has(choice)) {
    return response.status(400).json({
      ok: false,
      reason: "invalid_vote_choice",
    });
  }

  const { visitorKey } = buildVisitorIdentity(request, fingerprintSalt);

  if (!visitorKey) {
    return response.status(400).json({
      ok: false,
      reason: "missing_visitor_identity",
    });
  }

  try {
    const rpcResult = await callVoteRpc(
      supabaseUrl,
      serviceRoleKey,
      choice,
      visitorKey
    );

    if (rpcResult.ok) {
      const counts = normalizeCounts(
        Object.entries(rpcResult.payload?.counts || {}).map(([optionKey, count]) => ({
          option_key: optionKey,
          count: Number(count) || 0,
        }))
      );

      return response.status(200).json({
        ok: true,
        applied: Boolean(rpcResult.payload?.applied),
        selectedChoice: sanitize(rpcResult.payload?.selected_choice || choice, 12),
        counts,
        protectionMode: "rpc",
      });
    }

    const fallbackResult = await legacyIncrementVote(
      supabaseUrl,
      serviceRoleKey,
      choice
    );

    return response.status(200).json({
      ok: true,
      ...fallbackResult,
    });
  } catch {
    return response.status(500).json({
      ok: false,
      reason: "vote_request_failed",
    });
  }
}
