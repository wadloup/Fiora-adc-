const ORIGIN_URL = "https://fiora-adc.com";
const ORIGIN_PATH_PREFIXES = [
  "/api/",
  "/audio/",
  "/backgrounds/",
  "/manga/",
  "/voices/",
];

const shouldUseOrigin = (pathname) =>
  ORIGIN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

const proxyToOrigin = (request, url) => {
  const upstreamUrl = new URL(`${url.pathname}${url.search}`, ORIGIN_URL);
  return fetch(new Request(upstreamUrl, request));
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (shouldUseOrigin(url.pathname)) {
      return proxyToOrigin(request, url);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (
      assetResponse.status === 404 &&
      request.method === "GET" &&
      acceptsHtml
    ) {
      return env.ASSETS.fetch(
        new Request(new URL("/index.html", request.url), request)
      );
    }

    return assetResponse;
  },
};
