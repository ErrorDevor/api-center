"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Comments } from "screens/03-Reviews";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.data";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

interface ReviewsContentProps {
   onSelectVendor?: (vendorId: string | undefined) => void;
}

// useSearchParams() opts the reading component out of static rendering
// unless it's wrapped in Suspense (see
// https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout) —
// split out so only this tiny piece needs the boundary.
const ReviewsContent: React.FC<ReviewsContentProps> = ({ onSelectVendor }) => {
   const searchParams = useSearchParams();
   const providerDomain = searchParams.get("provider") ?? undefined;

   return <Comments providerDomain={providerDomain} onSelectVendor={onSelectVendor} />;
};

export default function ReviewsPage() {
   const router = useRouter();

   const [collapsed, setCollapsed] = React.useState(false);
   const [mode] = React.useState<SidebarMode>("api");

   // /reviews is keyed by ?provider=<domain>, not by a path segment, so it
   // has no vendor route of its own. Picking a vendor in the sidebar takes
   // you to that vendor's page in the API catalog.
   const handleSelectVendor = (vendorId: string | undefined) => {
      router.push(vendorId ? `/home/${vendorId}` : "/home");
   };

   return (
      <AppLayout
         isSidebarCollapsed={collapsed}
         header={<Header />}
         sidebar={
            <Sidebar
               mode={mode}
               collapsed={collapsed}
               onToggleCollapsed={() => setCollapsed((prev) => !prev)}
               onSelectVendor={handleSelectVendor}
            />
         }
      >
         <React.Suspense fallback={null}>
            <ReviewsContent onSelectVendor={handleSelectVendor} />
         </React.Suspense>
      </AppLayout>
   );
}
