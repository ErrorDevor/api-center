const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

// Crawlable URL of a vendor ("anthropic") or a model ("anthropic/claude-x"),
// same shape the sitemap lists.
export const getCatalogHref = (id: string) => `/home/${encodePath(id)}`;
