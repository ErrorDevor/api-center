import type { Metadata } from "next";

import { SITE_NAME } from "./siteUrl";

interface PageMetadataInput {
   title: string;
   description: string;
   // Site-relative path (no query string); resolved against metadataBase.
   path: string;
}

// Server-rendered title / description / canonical / og:* for a page. The
// screens are client components, so each route's layout.tsx calls this from
// generateMetadata to get the tags into the initial HTML.
export const buildPageMetadata = ({ title, description, path }: PageMetadataInput): Metadata => ({
   title,
   description,
   alternates: { canonical: path },
   openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: path,
   },
   twitter: { card: "summary", title, description },
});
