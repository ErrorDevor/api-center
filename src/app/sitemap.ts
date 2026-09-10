import type { MetadataRoute } from "next";

import { KNOWN_VENDOR_IDS, VENDOR_DISPLAY_NAMES } from "shared/lib/providers/vendors";
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

// Every model vendor the app knows about (the fixed sidebar list plus the
// ones that currently only carry a display name). Both /home and
// /group-buys take a `/[vendor]` segment that filters to that vendor, so
// each is its own shareable, indexable URL.
const VENDOR_IDS = Array.from(
   new Set([...KNOWN_VENDOR_IDS, ...Object.keys(VENDOR_DISPLAY_NAMES)])
);

export default function sitemap(): MetadataRoute.Sitemap {
   const lastModified = new Date();

   const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(
      ({ path, priority, changeFrequency }) => ({
         url: `${SITE_URL}${path}`,
         lastModified,
         changeFrequency,
         priority,
      })
   );

   const vendorEntries: MetadataRoute.Sitemap = VENDOR_IDS.flatMap((vendorId) => [
      {
         url: `${SITE_URL}/home/${vendorId}`,
         lastModified,
         changeFrequency: "daily",
         priority: 0.6,
      },
      {
         url: `${SITE_URL}/group-buys/${vendorId}`,
         lastModified,
         changeFrequency: "daily",
         priority: 0.5,
      },
   ]);

   return [...staticEntries, ...vendorEntries];
}
