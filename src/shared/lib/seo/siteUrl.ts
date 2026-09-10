// Public origin the site is served from, without a trailing slash.
// Overridable for staging/preview deploys via NEXT_PUBLIC_SITE_URL; falls
// back to the production domain so a plain `next build` still emits the
// absolute URLs that sitemap.xml and robots.txt require.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bestaiprice.com").replace(
   /\/+$/,
   ""
);
