"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { RatingScreen } from "screens/08-RatingScreen";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.data";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

interface Props {
   params: Promise<{ vendor?: string[] }>;
}

export default function RatingPage({ params }: Props) {
   const router = useRouter();
   const { vendor: segments } = React.use(params);
   const [collapsed, setCollapsed] = React.useState(false);
   const [mode, setMode] = React.useState<SidebarMode>("api");
   const selectedVendorId = segments?.[0];
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
               onToggleCollapsed={() => setCollapsed((prev) => !prev)}
            />
         }
      >
         <RatingScreen selectedVendorId={selectedVendorId} onSelectVendor={handleSelectVendor} />
      </AppLayout>
   );
}
