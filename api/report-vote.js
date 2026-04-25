import {
  buildHashedValue,
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

function normalizeChoice(value) {
  const choice = sanitize(value || "", 12)?.toLowerCase() || null;

  return choice && VALID_CHOICES.has(choice) ? choice : null;
}

function normalizeBrowserToken(value) {
  const token = sanitize(value || "", 128);

  return token && token.length >= 16 ? token : null;
}

function buildVoteVisitorKey(request, body, salt) {
  const browserToken = normalizeBrowserToken(body.voterToken);
  const browserKey = buildHashedValue(browserToken, salt, 32);

  if (browserKey) {
    return `browser:${browserKey}`;
  }

  return buildVisitorIdentity(request, salt).visitorKey;
}

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
    const count = Number(row?.count);

    if (!row?.option_key || !Number.isFinite(count)) {
      continue;
    }

    if (row.option_key in counts) {
      counts[row.option_key] = count;
    }
  }

  return counts;
}

function normalizeRpcPayload(payload) {
  const rawPayload = Array.isArray(payload) ? payload[0] : payload;

  if (!rawPayload || typeof rawPayload !== "object") {
    return null;
  }

  return rawPayload;
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

  const payload = normalizeRpcPayload(await response.json());

  if (!payload) {
    return {
      ok: false,
      errorText: "invalid_vote_rpc_payload",
    };
  }

  return {
    ok: true,
    payload,
  };
}

async function fetchReceiptByVisitor(supabaseUrl, serviceRoleKey, visitorKey) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/report_vote_receipts?select=selected_choice&visitor_key=eq.${encodeURIComponent(
      visitorKey
    )}&limit=1`,
    {
      headers: buildSupabaseHeaders(serviceRoleKey),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json();
  const selectedChoice = normalizeChoice(rows?.[0]?.selected_choice);

  return selectedChoice;
}

async function insertReceipt(supabaseUrl, serviceRoleKey, choice, visitorKey) {
  const response = await fetch(`${supabaseUrl}/rest/v1/report_vote_receipts`, {
    method: "POST",
    headers: buildSupabaseHeaders(serviceRoleKey, {
      Prefer: "return=minimal",
    }),
    body: JSON.stringify({
      visitor_key: visitorKey,
      selected_choice: choice,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

async function setVoteCount(supabaseUrl, serviceRoleKey, choice, count) {
  const updateResponse = await fetch(
    `${supabaseUrl}/rest/v1/report_votes?option_key=eq.${choice}`,
    {
      method: "PATCH",
      headers: buildSupabaseHeaders(serviceRoleKey, {
        Prefer: "return=minimal",
      }),
      body: JSON.stringify({ count }),
    }
  );

  if (!updateResponse.ok) {
    throw new Error(await updateResponse.text());
  }
}

async function legacyCastVote(supabaseUrl, serviceRoleKey, choice, visitorKey) {
  const currentCounts = await fetchVoteCounts(supabaseUrl, serviceRoleKey);
  const previousChoice = await fetchReceiptByVisitor(
    supabaseUrl,
    serviceRoleKey,
    visitorKey
  );

  if (previousChoice) {
    return {
      applied: false,
      selectedChoice: previousChoice,
      counts: currentCounts,
      protectionMode: "legacy",
    };
  }

  await insertReceipt(supabaseUrl, serviceRoleKey, choice, visitorKey);
  await setVoteCount(
    supabaseUrl,
    serviceRoleKey,
    choice,
    (currentCounts[choice] || 0) + 1
  );

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
  const choice = normalizeChoice(body.choice);

  if (!choice) {
    return response.status(400).json({
      ok: false,
      reason: "invalid_vote_choice",
    });
  }

  const visitorKey = buildVoteVisitorKey(request, body, fingerprintSalt);

  if (!visitorKey) {
    return response.status(400).json({
      ok: false,
      reason: "missing_visitor_identity",
    });
  }

  try {
    const existingChoice = await fetchReceiptByVisitor(
      supabaseUrl,
      serviceRoleKey,
      visitorKey
    );

    if (existingChoice) {
      const counts = await fetchVoteCounts(supabaseUrl, serviceRoleKey);

      return response.status(200).json({
        ok: true,
        applied: false,
        selectedChoice: existingChoice,
        counts,
        protectionMode: "receipt",
      });
    }

    const rpcResult = await callVoteRpc(
      supabaseUrl,
      serviceRoleKey,
      choice,
      visitorKey
    );

    if (rpcResult.ok) {
      const selectedChoice =
        normalizeChoice(rpcResult.payload?.selected_choice) || choice;
      const counts = normalizeCounts(
        Object.entries(rpcResult.payload?.counts || {}).map(([optionKey, count]) => ({
          option_key: optionKey,
          count: Number(count) || 0,
        }))
      );

      return response.status(200).json({
        ok: true,
        applied: Boolean(rpcResult.payload?.applied),
        selectedChoice,
        counts,
        protectionMode: "rpc",
      });
    }

    const fallbackResult = await legacyCastVote(
      supabaseUrl,
      serviceRoleKey,
      choice,
      visitorKey
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
