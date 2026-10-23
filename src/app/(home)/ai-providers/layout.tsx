import type { Metadata } from "next";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

export const generateMetadata = (): Metadata =>
   buildPageMetadata({
      title: "AI API Providers – BEST AI PRICE",
      description:
         "Directory of AI API providers and aggregators with prices, payment methods and ratings.",
      path: "/ai-providers",
   });

export default function AiProvidersLayout({ children }: { children: React.ReactNode }) {
   return children;
}
