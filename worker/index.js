const canonicalOrigin = "https://www.selluplabs.com";
const productionHosts = new Set([
  "selluplabs.com",
  "www.selluplabs.com",
  "selluplabs-homepage.selluplabs.workers.dev",
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Local development and deployment previews remain usable.
    if (productionHosts.has(url.hostname) && url.origin !== canonicalOrigin) {
      return Response.redirect(canonicalOrigin + url.pathname + url.search, 308);
    }
    const response = await env.ASSETS.fetch(request);
    if (
      url.pathname !== "/" ||
      url.searchParams.get("lang") !== "en" ||
      !response.headers.get("content-type")?.includes("text/html")
    ) return response;

    const title = "selluplabs | AI Marketing Content Technology";
    const description = "selluplabs develops AI services that combine product specifications and images to create marketing content. Explore aiadcast, our packaging-focused mobile service, and 71 real generated examples.";
    const attribute = (name, value) => ({
      element(element) { element.setAttribute(name, value); },
    });
    return new HTMLRewriter()
      .on("html", attribute("lang", "en"))
      .on("title", { element(element) { element.setInnerContent(title); } })
      .on('link[rel="canonical"]', attribute("href", canonicalOrigin + "/?lang=en"))
      .on('meta[property="og:url"]', attribute("content", canonicalOrigin + "/?lang=en"))
      .on('meta[property="og:title"]', attribute("content", title))
      .on('meta[name="description"]', attribute("content", description))
      .on('meta[property="og:description"]', attribute("content", description))
      .on('meta[property="og:locale"]', attribute("content", "en_US"))
      .on('meta[property="og:locale:alternate"]', attribute("content", "ko_KR"))
      .on('meta[property="og:image:alt"]', attribute("content", "selluplabs — AI marketing content from product data, with actual aiadcast outputs"))
      .transform(response);
  },
};
