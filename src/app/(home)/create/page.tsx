"use client";

import React from "react";

import { CreatePost } from "screens/05-CreatePost";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.data";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

export default function CreatePage() {
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
               onModeChange={setMode}
               onToggleCollapsed={() => setCollapsed((prev) => !prev)}
            />
         }
      >
         <CreatePost />
      </AppLayout>
   );
}
