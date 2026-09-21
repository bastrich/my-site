export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    let path;
    try {
      path = decodeURIComponent(url.pathname);
    } catch {
      return env.ASSETS.fetch(request);
    }
    path = path.replace(/\/{2,}/g, "/");
    // Extensionless paths are pages and always end with a slash.
    if (!/\.[A-Za-z0-9]{2,5}$/.test(path) && !path.endsWith("/")) {
      path += "/";
    }
    if (path !== url.pathname) {
      url.pathname = path;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
