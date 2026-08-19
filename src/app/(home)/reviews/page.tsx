"use client";

import React from "react";

import { useSearchParams } from "next/navigation";

import { Comments } from "screens/03-Reviews";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.data";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

// useSearchParams() opts the reading component out of static rendering
// unless it's wrapped in Suspense (see
// https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout) —
// split out so only this tiny piece needs the boundary.
const ReviewsContent: React.FC = () => {
   const searchParams = useSearchParams();
   const providerDomain = searchParams.get("provider") ?? undefined;

   return <Comments providerDomain={providerDomain} />;
};

export default function ReviewsPage() {
   const [collapsed, setCollapsed] = React.useState(false);
   const [mode, setMode] = React.useState<SidebarMode>("api");

   return (
      <AppLayout
         isSidebarCollapsed={collapsed}
         header={<Header />}
         sidebar={
            <Sidebar
               mode={mode}
               collapsed={collapsed}
               onToggleCollapsed={() => setCollapsed((prev) => !prev)}
            />
         }
      >
         <React.Suspense fallback={null}>
            <ReviewsContent />
         </React.Suspense>
      </AppLayout>
   );
}
