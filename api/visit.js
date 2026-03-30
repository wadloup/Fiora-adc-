function sanitize(value, maxLength = 180) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function decodeHeaderValue(value, maxLength = 180) {
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

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return response.status(202).json({
      ok: false,
      reason: "missing_visit_log_env",
    });
  }

  const body = await readJsonBody(request);
  const country = sanitize(request.headers["x-vercel-ip-country"] || "", 8);
  const region = decodeHeaderValue(
    request.headers["x-vercel-ip-country-region"] || "",
    80
  );
  const city = decodeHeaderValue(request.headers["x-vercel-ip-city"] || "", 80);
  const userAgent = sanitize(request.headers["user-agent"] || "", 255);
  const guidePage = sanitize(body.page || "Unknown", 80);
  const pathname = sanitize(body.path || "/", 200);
  const referrer = sanitize(body.referrer || "", 200);

  const payload = {
    guide_page: guidePage,
    pathname,
    country,
    region,
    city,
    referrer,
    user_agent: userAgent,
  };

  try {
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
      return response.status(500).json({
        ok: false,
        reason: "insert_failed",
        details: errorText.slice(0, 240),
      });
    }

    return response.status(201).json({
      ok: true,
      country,
      region,
      city,
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
