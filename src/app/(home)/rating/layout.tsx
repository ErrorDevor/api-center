import type { Metadata } from "next";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

export const generateMetadata = (): Metadata =>
   buildPageMetadata({
      title: "AI Model Rating – BEST AI PRICE",
      description:
         "Rating of AI models and API providers by price, quality and user feedback on BEST AI PRICE.",
      path: "/rating",
   });

export default function RatingLayout({ children }: { children: React.ReactNode }) {
   return children;
}
