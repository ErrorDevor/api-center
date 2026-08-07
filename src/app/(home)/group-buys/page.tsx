"use client";

import React from "react";

import { GroupBuysContent } from "screens/02-GroupBuys";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.types";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

export default function GroupBuysPage() {
   const [collapsed, setCollapsed] = React.useState(false);

   const mode: SidebarMode = "group-buys";

   return (
      <AppLayout
         isSidebarCollapsed={collapsed}
         header={<Header />}
         sidebar={
            <Sidebar
               mode={mode}
               collapsed={collapsed}
               onToggleCollapsed={() => setCollapsed((current) => !current)}
            />
         }
      >
         <GroupBuysContent />
      </AppLayout>
   );
}