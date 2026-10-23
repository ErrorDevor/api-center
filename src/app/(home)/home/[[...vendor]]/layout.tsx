import type { Metadata } from "next";

import { getVendorDisplayName } from "shared/lib/providers/vendors";
import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

interface Props {
   children: React.ReactNode;
   params: Promise<{ vendor?: string[] }>;
}

const BASE_TITLE = "BEST AI PRICE – Compare AI API Prices Across 100+ Providers";
const BASE_DESCRIPTION =
   "Compare AI API prices across 100+ providers: input and output token costs, payment methods and discounts versus official prices.";

export const generateMetadata = async ({ params }: Pick<Props, "params">): Promise<Metadata> => {
   const { vendor: segments } = await params;
   const [vendorId, modelSlug] = segments ?? [];

   if (!vendorId) {
      return buildPageMetadata({
         title: `API - ${BASE_TITLE}`,
         description: BASE_DESCRIPTION,
         path: "/home",
      });
   }

   const vendorName = getVendorDisplayName(vendorId);
   const subject = modelSlug ? `${vendorName} ${modelSlug}` : vendorName;

   return buildPageMetadata({
      title: `${subject} API Price – ${BASE_TITLE}`,
      description: `Compare ${subject} API prices across providers: input and output token costs, payment methods and discounts versus the official price.`,
      path: `/home/${segments?.join("/")}`,
   });
};

export default function HomeRouteLayout({ children }: Pick<Props, "children">) {
   return children;
}
