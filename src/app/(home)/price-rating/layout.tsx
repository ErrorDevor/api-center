import type { Metadata } from "next";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

export const generateMetadata = (): Metadata =>
   buildPageMetadata({
      title: "AI API Price Rating – BEST AI PRICE",
      description:
         "Ranking of AI API providers by price for OpenAI, Claude, Gemini and Kling models, with discounts versus the official price.",
      path: "/price-rating",
   });

export default function PriceRatingLayout({ children }: { children: React.ReactNode }) {
   return children;
}
