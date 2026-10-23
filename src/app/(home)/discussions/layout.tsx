import type { Metadata } from "next";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

export const generateMetadata = (): Metadata =>
   buildPageMetadata({
      title: "AI API Discussions – BEST AI PRICE",
      description:
         "Community discussions about AI APIs, providers, prices and ways to save on tokens.",
      path: "/discussions",
   });

export default function DiscussionsLayout({ children }: { children: React.ReactNode }) {
   return children;
}
