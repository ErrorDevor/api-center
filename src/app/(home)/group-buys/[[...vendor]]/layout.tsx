import type { Metadata } from "next";

import { getVendorDisplayName } from "shared/lib/providers/vendors";
import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

interface Props {
   children: React.ReactNode;
   params: Promise<{ vendor?: string[] }>;
}

export const generateMetadata = async ({ params }: Pick<Props, "params">): Promise<Metadata> => {
   const { vendor: segments } = await params;
   const vendorId = segments?.[0];

   if (!vendorId) {
      return buildPageMetadata({
         title: "Group Buys – BEST AI PRICE",
         description: "Group-buy offers for AI API access from providers and aggregators.",
         path: "/group-buys",
      });
   }

   const vendorName = getVendorDisplayName(vendorId);

   return buildPageMetadata({
      title: `${vendorName} Group Buys – BEST AI PRICE`,
      description: `Group-buy offers for ${vendorName} API access from providers and aggregators.`,
      path: `/group-buys/${vendorId}`,
   });
};

export default function GroupBuysLayout({ children }: Pick<Props, "children">) {
   return children;
}
