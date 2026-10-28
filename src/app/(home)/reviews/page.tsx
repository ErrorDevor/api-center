import type { Metadata } from "next";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

import ReviewsView from "./ReviewsView";

export const dynamic = "force-dynamic";

interface Props {
   searchParams: Promise<{ provider?: string | string[] }>;
}

// Provider domains only — anything else (typos, injected markup) falls back
// to the general reviews page instead of reaching the <title>/canonical.
const DOMAIN_PATTERN = /^[a-z0-9]([a-z0-9.-]{0,251}[a-z0-9])?$/i;

// ?provider=<domain> is one page per provider, so each gets its own title,
// description and canonical — otherwise search engines fold all of them into
// the bare /reviews.
export const generateMetadata = async ({ searchParams }: Props): Promise<Metadata> => {
   const { provider } = await searchParams;
   const domain = typeof provider === "string" && DOMAIN_PATTERN.test(provider) ? provider : null;

   if (!domain) {
      return buildPageMetadata({
         title: "AI API Provider Reviews – BEST AI PRICE",
         description:
            "Real user reviews and feedback on AI API providers and resellers: reliability, pricing and payment methods.",
         path: "/reviews",
      });
   }

   return buildPageMetadata({
      title: `${domain} Reviews – AI API Provider – BEST AI PRICE`,
      description: `User reviews and feedback on ${domain}: reliability, pricing, payment methods and the models it offers.`,
      path: `/reviews?provider=${encodeURIComponent(domain)}`,
   });
};

export default function ReviewsPage() {
   return <ReviewsView />;
}
