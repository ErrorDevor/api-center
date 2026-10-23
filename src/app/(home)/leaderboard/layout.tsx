import type { Metadata } from "next";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

export const generateMetadata = (): Metadata =>
   buildPageMetadata({
      title: "AI Model Leaderboard – BEST AI PRICE",
      description:
         "Leaderboard of the best AI models by benchmark results, with API prices side by side.",
      path: "/leaderboard",
   });

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
   return children;
}
