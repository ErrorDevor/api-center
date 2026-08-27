"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { GroupBuysContent } from "screens/02-GroupBuys";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.types";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

// /group-buys -> every offer, /group-buys/[vendor] -> that vendor's offers
// only. Same [[...vendor]] catch-all shape as /home, so the Sidebar's
// provider selection behaves identically on both pages.
interface Props {
   params: Promise<{ vendor?: string[] }>;
}

export default function GroupBuysPage({ params }: Props) {
   const router = useRouter();
   const { vendor: segments } = React.use(params);

   const [collapsed, setCollapsed] = React.useState(false);

   const selectedVendorId = segments?.[0];

   const mode: SidebarMode = "group-buys";

   const handleSelectVendor = (vendorId: string | undefined) => {
      router.push(vendorId ? `/group-buys/${vendorId}` : "/group-buys");
   };

   return (
      <AppLayout
         isSidebarCollapsed={collapsed}
         header={<Header />}
         sidebar={
            <Sidebar
               mode={mode}
               collapsed={collapsed}
               onToggleCollapsed={() => setCollapsed((current) => !current)}
               activeVendorId={selectedVendorId}
               onSelectVendor={handleSelectVendor}
            />
         }
      >
         <GroupBuysContent selectedVendorId={selectedVendorId} />
      </AppLayout>
   );
}
