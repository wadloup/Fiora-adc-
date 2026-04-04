import { randomUUID } from "node:crypto";
import {
  buildVisitorIdentity,
  getContentLength,
  hasTrustedRequestSource,
  isJsonRequest,
  sanitize,
  setApiSecurityHeaders,
} from "./_shared/security.js";

const MAX_NICKNAME_LENGTH = 24;
const MAX_CONTACT_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 280;
const VISITOR_MESSAGE_COOLDOWN_SECONDS = 8;
const THREAD_LIST_LIMIT = 80;
const THREAD_MESSAGE_LIMIT = 120;

function normalizeThreadStatus(value) {
  const normalized = sanitize(value || "", 24).toLowerCase();

  if (normalized === "archived") {
    return "archived";
  }

  if (normalized === "handled") {
    return "handled";
  }

  if (normalized === "open") {
    return "open";
  }

  return "all";
}

function normalizeSecret(value) {
  const raw = Array.isArray(value) ? value[0] : value;

  if (typeof raw !== "string") {
    return "";
  }

  return raw.trim().replace(/^["']+|["']+$/g, "");
}

function sanitizeMessageContent(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .trim();

  return normalized ? normalized.slice(0, MAX_MESSAGE_LENGTH) : null;
}

function buildSupabaseHeaders(serviceRoleKey, extraHeaders = {}) {
  return {
    "Content-Type": "application/json",
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    ...extraHeaders,
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

function getRequestUrl(request) {
  return new URL(request.url, "https://local.invalid");
}

function inferChatErrorReason(errorText) {
  const normalized = (errorText || "").toLowerCase();

  if (
    normalized.includes("chat_threads") ||
    normalized.includes("chat_messages") ||
    normalized.includes("relation") ||
    normalized.includes("does not exist")
  ) {
    return "chat_schema_missing";
  }

  return "chat_request_failed";
}

async function fetchThreadByToken(supabaseUrl, serviceRoleKey, threadToken) {
  const response = await fetch(
    createQueryUrl(supabaseUrl, "chat_threads", {
      select:
        "id,thread_token,created_at,updated_at,nickname,contact,country,region,city,status,last_message_preview,last_visitor_message_at,last_admin_message_at",
      thread_token: `eq.${threadToken}`,
      limit: 1,
    }),
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

async function fetchThreadById(supabaseUrl, serviceRoleKey, threadId) {
  const response = await fetch(
    createQueryUrl(supabaseUrl, "chat_threads", {
      select:
        "id,thread_token,created_at,updated_at,nickname,contact,country,region,city,status,last_message_preview,last_visitor_message_at,last_admin_message_at",
      id: `eq.${threadId}`,
      limit: 1,
    }),
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

async function fetchThreadMessages(supabaseUrl, serviceRoleKey, threadId) {
  const response = await fetch(
    createQueryUrl(supabaseUrl, "chat_messages", {
      select: "id,thread_id,created_at,author,content",
      thread_id: `eq.${threadId}`,
      order: "created_at.asc",
      limit: THREAD_MESSAGE_LIMIT,
    }),
    {
      headers: buildSupabaseHeaders(serviceRoleKey),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

async function fetchAdminThreads(supabaseUrl, serviceRoleKey, statusFilter = "all") {
  const response = await fetch(
    createQueryUrl(supabaseUrl, "chat_threads", {
      select:
        "id,thread_token,created_at,updated_at,nickname,contact,country,region,city,status,last_message_preview,last_visitor_message_at,last_admin_message_at",
      ...(statusFilter !== "all" ? { status: `eq.${statusFilter}` } : {}),
      order: "updated_at.desc",
      limit: THREAD_LIST_LIMIT,
    }),
    {
      headers: buildSupabaseHeaders(serviceRoleKey),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

async function fetchLatestVisitorMessage(supabaseUrl, serviceRoleKey, threadId) {
  const response = await fetch(
    createQueryUrl(supabaseUrl, "chat_messages", {
      select: "id,created_at",
      thread_id: `eq.${threadId}`,
      author: "eq.visitor",
      order: "created_at.desc",
      limit: 1,
    }),
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

async function insertThread(supabaseUrl, serviceRoleKey, payload) {
  const response = await fetch(`${supabaseUrl}/rest/v1/chat_threads`, {
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

async function insertChatMessage(supabaseUrl, serviceRoleKey, payload) {
  const response = await fetch(`${supabaseUrl}/rest/v1/chat_messages`, {
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

async function patchThread(supabaseUrl, serviceRoleKey, threadId, payload) {
  const response = await fetch(
    createQueryUrl(supabaseUrl, "chat_threads", {
      id: `eq.${threadId}`,
    }),
    {
      method: "PATCH",
      headers: buildSupabaseHeaders(serviceRoleKey, {
        Prefer: "return=representation",
      }),
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json();
  return rows?.[0] || null;
}

async function deleteThread(supabaseUrl, serviceRoleKey, threadId) {
  const response = await fetch(
    createQueryUrl(supabaseUrl, "chat_threads", {
      id: `eq.${threadId}`,
    }),
    {
      method: "DELETE",
      headers: buildSupabaseHeaders(serviceRoleKey, {
        Prefer: "return=minimal",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return true;
}

function buildThreadPatch({
  author,
  message,
  nickname,
  contact,
}) {
  const now = new Date().toISOString();
  const patch = {
    updated_at: now,
    last_message_preview: message.slice(0, 120),
  };

  if (author === "visitor") {
    patch.last_visitor_message_at = now;
    patch.status = "open";

    if (nickname) {
      patch.nickname = nickname;
    }

    if (contact !== undefined) {
      patch.contact = contact || null;
    }
  } else {
    patch.last_admin_message_at = now;
  }

  return patch;
}

async function fetchConversationPayload(
  supabaseUrl,
  serviceRoleKey,
  thread,
  adminMode = false
) {
  const messages = await fetchThreadMessages(supabaseUrl, serviceRoleKey, thread.id);

  return {
    ok: true,
    adminMode,
    thread,
    messages,
  };
}

async function handleVisitorThreadRead(
  response,
  supabaseUrl,
  serviceRoleKey,
  threadToken
) {
  if (!threadToken) {
    return response.status(400).json({
      ok: false,
      reason: "missing_thread_token",
    });
  }

  try {
    const thread = await fetchThreadByToken(supabaseUrl, serviceRoleKey, threadToken);

    if (!thread) {
      return response.status(404).json({
        ok: false,
        reason: "thread_not_found",
      });
    }

    const payload = await fetchConversationPayload(
      supabaseUrl,
      serviceRoleKey,
      thread,
      false
    );

    return response.status(200).json(payload);
  } catch (error) {
    return response.status(500).json({
      ok: false,
      reason: inferChatErrorReason(error instanceof Error ? error.message : ""),
    });
  }
}

async function handleAdminRead(
  response,
  supabaseUrl,
  serviceRoleKey,
  threadId,
  statusFilter = "all"
) {
  try {
    if (threadId) {
      const thread = await fetchThreadById(supabaseUrl, serviceRoleKey, threadId);

      if (!thread) {
        return response.status(404).json({
          ok: false,
          reason: "thread_not_found",
        });
      }

      const payload = await fetchConversationPayload(
        supabaseUrl,
        serviceRoleKey,
        thread,
        true
      );

      return response.status(200).json(payload);
    }

    const threads = await fetchAdminThreads(
      supabaseUrl,
      serviceRoleKey,
      statusFilter
    );

    return response.status(200).json({
      ok: true,
      adminMode: true,
      threads,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      reason: inferChatErrorReason(error instanceof Error ? error.message : ""),
    });
  }
}

async function handleVisitorMessageCreate(
  response,
  supabaseUrl,
  serviceRoleKey,
  fingerprintSalt,
  body,
  request
) {
  const nickname = sanitize(body.nickname || "", MAX_NICKNAME_LENGTH);
  const contact = sanitize(body.contact || "", MAX_CONTACT_LENGTH);
  const message = sanitizeMessageContent(body.message || "");
  const existingThreadToken = sanitize(body.threadToken || "", 96);

  if (!message || message.length < 2) {
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
    let thread = null;

    if (existingThreadToken) {
      thread = await fetchThreadByToken(
        supabaseUrl,
        serviceRoleKey,
        existingThreadToken
      );
    }

    if (!thread) {
      thread = await insertThread(supabaseUrl, serviceRoleKey, {
        thread_token: randomUUID(),
        visitor_key: visitorKey,
        source_fingerprint: sourceFingerprint,
        nickname,
        contact: contact || null,
        country,
        region,
        city,
        user_agent: userAgent,
        status: "open",
        last_message_preview: message.slice(0, 120),
        last_visitor_message_at: new Date().toISOString(),
      });
    } else {
      const latestVisitorMessage = await fetchLatestVisitorMessage(
        supabaseUrl,
        serviceRoleKey,
        thread.id
      );

      if (latestVisitorMessage?.created_at) {
        const elapsedMs =
          Date.now() - new Date(latestVisitorMessage.created_at).getTime();
        const cooldownMs = VISITOR_MESSAGE_COOLDOWN_SECONDS * 1000;

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
    }

    await insertChatMessage(supabaseUrl, serviceRoleKey, {
      thread_id: thread.id,
      author: "visitor",
      content: message,
    });

    const updatedThread =
      (await patchThread(
        supabaseUrl,
        serviceRoleKey,
        thread.id,
        buildThreadPatch({
          author: "visitor",
          message,
          nickname,
          contact,
        })
      )) || thread;

    const payload = await fetchConversationPayload(
      supabaseUrl,
      serviceRoleKey,
      updatedThread,
      false
    );

    return response.status(201).json(payload);
  } catch (error) {
    return response.status(500).json({
      ok: false,
      reason: inferChatErrorReason(error instanceof Error ? error.message : ""),
    });
  }
}

async function handleAdminReply(
  response,
  supabaseUrl,
  serviceRoleKey,
  body
) {
  const threadId = Number(body.threadId);
  const message = sanitizeMessageContent(body.message || "");

  if (!Number.isFinite(threadId) || threadId <= 0) {
    return response.status(400).json({
      ok: false,
      reason: "invalid_thread_id",
    });
  }

  if (!message || message.length < 2) {
    return response.status(400).json({
      ok: false,
      reason: "invalid_message",
    });
  }

  try {
    const thread = await fetchThreadById(supabaseUrl, serviceRoleKey, threadId);

    if (!thread) {
      return response.status(404).json({
        ok: false,
        reason: "thread_not_found",
      });
    }

    await insertChatMessage(supabaseUrl, serviceRoleKey, {
      thread_id: thread.id,
      author: "admin",
      content: message,
    });

    const updatedThread =
      (await patchThread(
        supabaseUrl,
        serviceRoleKey,
        thread.id,
        buildThreadPatch({
          author: "admin",
          message,
        })
      )) || thread;

    const payload = await fetchConversationPayload(
      supabaseUrl,
      serviceRoleKey,
      updatedThread,
      true
    );

    return response.status(201).json(payload);
  } catch (error) {
    return response.status(500).json({
      ok: false,
      reason: inferChatErrorReason(error instanceof Error ? error.message : ""),
    });
  }
}

async function handleAdminStatusUpdate(
  response,
  supabaseUrl,
  serviceRoleKey,
  body
) {
  const threadId = Number(body.threadId);
  const status = normalizeThreadStatus(body.status || "");

  if (!Number.isFinite(threadId) || threadId <= 0) {
    return response.status(400).json({
      ok: false,
      reason: "invalid_thread_id",
    });
  }

  if (status === "all") {
    return response.status(400).json({
      ok: false,
      reason: "invalid_thread_status",
    });
  }

  try {
    const thread = await fetchThreadById(supabaseUrl, serviceRoleKey, threadId);

    if (!thread) {
      return response.status(404).json({
        ok: false,
        reason: "thread_not_found",
      });
    }

    const updatedThread =
      (await patchThread(supabaseUrl, serviceRoleKey, thread.id, {
        status,
        updated_at: new Date().toISOString(),
      })) || thread;

    const payload = await fetchConversationPayload(
      supabaseUrl,
      serviceRoleKey,
      updatedThread,
      true
    );

    return response.status(200).json(payload);
  } catch (error) {
    return response.status(500).json({
      ok: false,
      reason: inferChatErrorReason(error instanceof Error ? error.message : ""),
    });
  }
}

async function handleAdminDeleteThread(
  response,
  supabaseUrl,
  serviceRoleKey,
  body
) {
  const threadId = Number(body.threadId);

  if (!Number.isFinite(threadId) || threadId <= 0) {
    return response.status(400).json({
      ok: false,
      reason: "invalid_thread_id",
    });
  }

  try {
    const thread = await fetchThreadById(supabaseUrl, serviceRoleKey, threadId);

    if (!thread) {
      return response.status(404).json({
        ok: false,
        reason: "thread_not_found",
      });
    }

    await deleteThread(supabaseUrl, serviceRoleKey, thread.id);

    return response.status(200).json({
      ok: true,
      deletedThreadId: thread.id,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      reason: inferChatErrorReason(error instanceof Error ? error.message : ""),
    });
  }
}

export default async function handler(request, response) {
  setApiSecurityHeaders(response);
  response.setHeader("Allow", "GET, POST");
  response.setHeader("Cache-Control", "no-store");
  try {
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
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

    const requestUrl = getRequestUrl(request);
    const threadToken = sanitize(
      requestUrl.searchParams.get("threadToken") || "",
      96
    );
    const rawThreadId = requestUrl.searchParams.get("threadId") || "";
    const threadId = Number(rawThreadId);
    const statusFilter = normalizeThreadStatus(
      requestUrl.searchParams.get("status") || ""
    );

    if (request.method === "GET") {
      if (!hasTrustedRequestSource(request)) {
        return response.status(403).json({
          ok: false,
          reason: "untrusted_request_source",
        });
      }

      const normalizedAdminKey = normalizeSecret(messageAdminKey);
      const providedAdminKey = normalizeSecret(
        request.headers["x-admin-key"] || request.headers["X-Admin-Key"]
      );

      if (providedAdminKey) {
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

        return handleAdminRead(
          response,
          supabaseUrl,
          serviceRoleKey,
          threadId,
          statusFilter
        );
      }

      return handleVisitorThreadRead(
        response,
        supabaseUrl,
        serviceRoleKey,
        threadToken
      );
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

    if (getContentLength(request) > 8_192) {
      return response.status(413).json({
        ok: false,
        reason: "payload_too_large",
      });
    }

    const body = await readJsonBody(request);
    const action =
      sanitize(body.action || "visitor_message", 24) || "visitor_message";
    const normalizedAdminKey = normalizeSecret(messageAdminKey);
    const providedAdminKey = normalizeSecret(
      request.headers["x-admin-key"] || request.headers["X-Admin-Key"]
    );

    if (action === "admin_reply") {
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

      return handleAdminReply(response, supabaseUrl, serviceRoleKey, body);
    }

    if (action === "admin_set_status") {
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

      return handleAdminStatusUpdate(
        response,
        supabaseUrl,
        serviceRoleKey,
        body
      );
    }

    if (action === "admin_delete_thread") {
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

      return handleAdminDeleteThread(
        response,
        supabaseUrl,
        serviceRoleKey,
        body
      );
    }

    return handleVisitorMessageCreate(
      response,
      supabaseUrl,
      serviceRoleKey,
      fingerprintSalt,
      body,
      request
    );
  } catch (error) {
    console.error("messages_handler_crashed", error);

    return response.status(500).json({
      ok: false,
      reason: "messages_handler_crashed",
      message: error instanceof Error ? error.message : "Unknown handler crash",
    });
  }
}
