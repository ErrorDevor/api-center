// providers.json / provider_descriptions.json key by bare domain
// ("yunwu.ai"), while UI-facing provider links are full URLs
// ("https://yunwu.ai/") — strip the protocol, any "www.", and the path to
// join the two. Shared by every consumer that needs to match a provider
// link against the feeds keyed by providerDomain (see CommentCard, ModelRow).
export const getDomainFromUrl = (url: string): string =>
   url
      .trim()
      .replace(/^[a-z]+:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\/.*$/, "")
      .toLowerCase();
