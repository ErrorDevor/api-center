"use client";

import React from "react";

import { AddProviderScreen } from "screens/12-AddProvider";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.data";

import { AppLayout } from "shared/ui/templates/AppLayout";

export default function AddProviderPage() {
   const [collapsed, setCollapsed] = React.useState(false);
   const [mode] = React.useState<SidebarMode>("api");

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
         <AddProviderScreen />
      </AppLayout>
   );
}
