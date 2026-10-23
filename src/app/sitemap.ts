import type { MetadataRoute } from "next";

import { parseProviderPriceRecords } from "shared/lib/providers/types";
import { getVendorId } from "shared/lib/providers/vendors";
import { SITE_URL } from "shared/lib/seo/siteUrl";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

// Top-level content pages worth indexing. Auth/onboarding routes (/login,
// /signup, /start), the personal /buys and /create screens, and the /api
// route handlers are deliberately left out — see robots.ts.
const STATIC_PATHS: Array<{
   path: string;
   priority: number;
   changeFrequency: ChangeFrequency;
}> = [
   { path: "/home", priority: 1, changeFrequency: "daily" },
   { path: "/group-buys", priority: 0.8, changeFrequency: "daily" },
   { path: "/reviews", priority: 0.7, changeFrequency: "daily" },
   { path: "/rating", priority: 0.7, changeFrequency: "daily" },
   { path: "/leaderboard", priority: 0.7, changeFrequency: "daily" },
   { path: "/discussions", priority: 0.6, changeFrequency: "daily" },
];

// Same feed the catalog reads in the browser (the daily parser's
// providers.json). Only an absolute URL can be fetched on the server; with
// the relative dev default the sitemap just lists the static pages.
const PROVIDERS_JSON_URL = process.env.NEXT_PUBLIC_PROVIDERS_JSON_URL ?? "";

// Regenerate hourly rather than on every request — the feed itself only
// changes when the parser runs.
export const revalidate = 3600;

const loadRecords = async () => {
   if (!/^https?:\/\//.test(PROVIDERS_JSON_URL)) {
      return [];
   }

   try {
      const response = await fetch(PROVIDERS_JSON_URL, { next: { revalidate } });

      return response.ok ? parseProviderPriceRecords(await response.json()) : [];
   } catch {
      return [];
   }
};

// Latest parse date per key, so each URL's lastmod is when its newest offer
// was actually checked rather than "now".
const trackLatest = (latest: Map<string, Date>, key: string, checkedAt: string) => {
   const date = new Date(checkedAt);

   if (Number.isNaN(date.getTime())) {
      return;
   }

   const current = latest.get(key);

   if (!current || date > current) {
      latest.set(key, date);
   }
};

const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const records = await loadRecords();

   // Built from records only, so a vendor/model/provider with no offers
   // never gets a URL (no empty categories).
   const vendors = new Map<string, Date>();
   const models = new Map<string, Date>();
   const providers = new Map<string, Date>();

   for (const record of records) {
      trackLatest(vendors, getVendorId(record.canonicalModelId), record.lastCheckedAt);
      trackLatest(models, record.canonicalModelId, record.lastCheckedAt);
      trackLatest(providers, record.providerDomain, record.lastCheckedAt);
   }

   const latestOverall = [...vendors.values()].reduce<Date | undefined>(
      (max, date) => (!max || date > max ? date : max),
      undefined
   );

   const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(
      ({ path, priority, changeFrequency }) => ({
         url: `${SITE_URL}${path}`,
         lastModified: latestOverall,
         changeFrequency,
         priority,
      })
   );

   const vendorEntries: MetadataRoute.Sitemap = [...vendors].flatMap(([vendorId, lastModified]) => [
      {
         url: `${SITE_URL}/home/${encodeURIComponent(vendorId)}`,
         lastModified,
         changeFrequency: "daily",
         priority: 0.6,
      },
      {
         url: `${SITE_URL}/group-buys/${encodeURIComponent(vendorId)}`,
         lastModified,
         changeFrequency: "daily",
         priority: 0.5,
      },
   ]);

   const modelEntries: MetadataRoute.Sitemap = [...models].map(([modelId, lastModified]) => ({
      url: `${SITE_URL}/home/${encodePath(modelId)}`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.5,
   }));

   const providerEntries: MetadataRoute.Sitemap = [...providers].map(
      ([domain, lastModified]) => ({
         url: `${SITE_URL}/reviews?provider=${encodeURIComponent(domain)}`,
         lastModified,
         changeFrequency: "daily",
         priority: 0.4,
      })
   );

   return [...staticEntries, ...vendorEntries, ...modelEntries, ...providerEntries];
}
