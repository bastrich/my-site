// Canonical URLs for bastrich.tech, the same rules as infra/fastly/snippets.vcl:
// HTTPS, www -> apex, index.html, duplicate slashes, encoded slashes (%2F) and
// the trailing slash, all in a single 301. Static files are served from the
// ASSETS binding, so there is no origin to fetch from.

const CANONICAL_HOST = "bastrich.tech";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let redirect = false;

    // Production domain only; *.workers.dev is left alone.
    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      redirect = true;
    }
    if (url.protocol !== "https:") {
      url.protocol = "https:";
      redirect = true;
    }

    // url.pathname keeps %2F encoded, so decode it first.
    let path = url.pathname;
    try {
      path = decodeURIComponent(path);
    } catch {
      // Malformed escapes are left as they are.
    }
    path = path.replace(/\/index\.html\/*$/i, "/").replace(/\/{2,}/g, "/");
    if (path === "") {
      path = "/";
    }
    // Extensionless paths are pages and always end with a slash.
    if (!/\.[A-Za-z0-9]{2,5}$/.test(path) && !path.endsWith("/")) {
      path += "/";
    }
    if (path !== url.pathname) {
      url.pathname = path;
      redirect = true;
    }

    if (redirect) {
      return Response.redirect(url.toString(), 301);
    }

    const asset = await env.ASSETS.fetch(request);
    const response = new Response(asset.body, asset);
    response.headers.set("Cache-Control", "public, max-age=3600");
    if (url.pathname === "/rss.xml") {
      response.headers.set("Content-Type", "application/rss+xml; charset=utf-8");
    }
    return response;
  },
};
