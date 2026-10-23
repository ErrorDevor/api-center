import type { Metadata } from "next";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

// ?provider=<domain> is read client-side, so the server title/canonical are
// the page-level ones; the screen refines the tab title once it knows the
// provider.
export const generateMetadata = (): Metadata =>
   buildPageMetadata({
      title: "AI API Provider Reviews – BEST AI PRICE",
      description:
         "Real user reviews and feedback on AI API providers and resellers: reliability, pricing and payment methods.",
      path: "/reviews",
   });

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
   return children;
}
