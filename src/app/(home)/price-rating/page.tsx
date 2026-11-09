"use client";

import React from "react";

import { PriceRatingScreen } from "screens/13-PriceRating";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

export default function PriceRatingPage() {
   const [collapsed, setCollapsed] = React.useState(false);

   return (
      <AppLayout
         isSidebarCollapsed={collapsed}
         header={<Header />}
         sidebar={
            <Sidebar
               mode="api"
               collapsed={collapsed}
               onToggleCollapsed={() => setCollapsed((prev) => !prev)}
            />
         }
      >
         <PriceRatingScreen />
      </AppLayout>
   );
}
