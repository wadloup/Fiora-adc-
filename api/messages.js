import {
  buildVisitorIdentity,
  getContentLength,
  hasTrustedRequestSource,
  isJsonRequest,
  sanitize,
  setApiSecurityHeaders,
} from "./_shared/security.js";

const MAX_NICKNAME_LENGTH = 24;
const MAX_MESSAGE_LENGTH = 280;
const MESSAGE_COOLDOWN_SECONDS = 45;
const MESSAGE_ADMIN_LIMIT = 60;

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

async function fetchLatestMessage(supabaseUrl, serviceRoleKey, visitorKey) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/guest_messages?select=id,created_at&visitor_key=eq.${encodeURIComponent(visitorKey)}&order=created_at.desc&limit=1`,
    {
      headers: buildSupabaseHeaders(serviceRoleKey),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json();
  return rows?.[0] || null;
}

async function insertMessage(supabaseUrl, serviceRoleKey, payload) {
  const response = await fetch(`${supabaseUrl}/rest/v1/guest_messages`, {
    method: "POST",
    headers: buildSupabaseHeaders(serviceRoleKey, {
      Prefer: "return=representation",
    }),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json();
  return rows?.[0] || null;
}

async function fetchMessages(supabaseUrl, serviceRoleKey) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/guest_messages?select=id,created_at,nickname,message,country,region,city,user_agent&order=created_at.desc&limit=${MESSAGE_ADMIN_LIMIT}`,
    {
      headers: buildSupabaseHeaders(serviceRoleKey),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export default async function handler(request, response) {
  setApiSecurityHeaders(response);
  response.setHeader("Allow", "GET, POST");
  response.setHeader("Cache-Control", "no-store");

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const fingerprintSalt =
    process.env.VISIT_LOG_HASH_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const messageAdminKey = process.env.MESSAGE_ADMIN_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return response.status(500).json({
      ok: false,
      reason: "missing_message_env",
    });
  }

  if (request.method === "GET") {
    const providedAdminKey =
      request.headers["x-admin-key"] || request.headers["X-Admin-Key"];

    if (!messageAdminKey || providedAdminKey !== messageAdminKey) {
      return response.status(403).json({
        ok: false,
        reason: "invalid_admin_key",
      });
    }

    try {
      const messages = await fetchMessages(supabaseUrl, serviceRoleKey);
      return response.status(200).json({
        ok: true,
        count: Array.isArray(messages) ? messages.length : 0,
        messages,
      });
    } catch {
      return response.status(500).json({
        ok: false,
        reason: "messages_unavailable",
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

  if (getContentLength(request) > 2_048) {
    return response.status(413).json({
      ok: false,
      reason: "payload_too_large",
    });
  }

  const body = await readJsonBody(request);
  const nickname = sanitize(body.nickname || "", MAX_NICKNAME_LENGTH);
  const message = sanitize(body.message || "", MAX_MESSAGE_LENGTH);

  if (!message || message.length < 3) {
    return response.status(400).json({
      ok: false,
      reason: "invalid_message",
    });
  }

  const {
    country,
    region,
    city,
    userAgent,
    visitorKey,
    sourceFingerprint,
  } = buildVisitorIdentity(request, fingerprintSalt);

  if (!visitorKey) {
    return response.status(400).json({
      ok: false,
      reason: "missing_visitor_identity",
    });
  }

  try {
    const latestMessage = await fetchLatestMessage(
      supabaseUrl,
      serviceRoleKey,
      visitorKey
    );

    if (latestMessage?.created_at) {
      const elapsedMs =
        Date.now() - new Date(latestMessage.created_at).getTime();
      const cooldownMs = MESSAGE_COOLDOWN_SECONDS * 1000;

      if (Number.isFinite(elapsedMs) && elapsedMs < cooldownMs) {
        return response.status(429).json({
          ok: false,
          reason: "message_rate_limited",
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((cooldownMs - elapsedMs) / 1000)
          ),
        });
      }
    }

    const createdMessage = await insertMessage(supabaseUrl, serviceRoleKey, {
      nickname,
      message,
      visitor_key: visitorKey,
      source_fingerprint: sourceFingerprint,
      country,
      region,
      city,
      user_agent: userAgent,
    });

    return response.status(201).json({
      ok: true,
      id: createdMessage?.id || null,
      createdAt: createdMessage?.created_at || null,
    });
  } catch {
    return response.status(500).json({
      ok: false,
      reason: "message_request_failed",
    });
  }
}
