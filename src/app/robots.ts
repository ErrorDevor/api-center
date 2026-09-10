import type { MetadataRoute } from "next";

import { SITE_URL } from "shared/lib/seo/siteUrl";

export default function robots(): MetadataRoute.Robots {
   return {
      rules: {
         userAgent: "*",
         allow: "/",
         // Route handlers plus the screens that only make sense for a
         // signed-in user or hold no indexable content of their own.
         disallow: ["/api/", "/login", "/signup", "/start", "/buys", "/create"],
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
      host: SITE_URL,
   };
}
