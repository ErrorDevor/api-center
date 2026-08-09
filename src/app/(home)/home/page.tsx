"use client";

import React from "react";

import { Content } from "screens/01-Content";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.types";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

export default function HomePage() {
   const [collapsed, setCollapsed] = React.useState(false);
   const [selectedVendorId, setSelectedVendorId] = React.useState<string | undefined>(undefined);
   const [selectedModelId, setSelectedModelId] = React.useState<string | undefined>(undefined);

   const mode: SidebarMode = "api";

   return (
      <AppLayout
         isSidebarCollapsed={collapsed}
         header={<Header />}
         sidebar={
            <Sidebar
               mode={mode}
               collapsed={collapsed}
               onToggleCollapsed={() => setCollapsed((current) => !current)}
               onSelectVendor={setSelectedVendorId}
               onSelectModel={setSelectedModelId}
            />
         }
      >
         <Content selectedVendorId={selectedVendorId} selectedModelId={selectedModelId} />
      </AppLayout>
   );
}