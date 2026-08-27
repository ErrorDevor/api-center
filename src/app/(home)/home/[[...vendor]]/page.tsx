"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { Content } from "screens/01-Content";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.types";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

// /home -> nothing selected, /home/[vendor] -> that API's models,
// /home/[vendor]/[model] -> one model. Keeps the selection in the URL (so
// it's shareable/back-buttonable) instead of only in React state.
interface Props {
   params: Promise<{ vendor?: string[] }>;
}

export default function HomePage({ params }: Props) {
   const router = useRouter();
   const { vendor: segments } = React.use(params);

   const [collapsed, setCollapsed] = React.useState(false);
   // Not deep-linked like vendor/model above — just an in-page filter.
   const [selectedModelType, setSelectedModelType] = React.useState<string | undefined>(undefined);

   const selectedVendorId = segments?.[0];
   const selectedModelSlug = segments?.[1];
   const selectedModelId = selectedVendorId && selectedModelSlug
      ? `${selectedVendorId}/${selectedModelSlug}`
      : undefined;

   const mode: SidebarMode = "api";

   const handleSelectVendor = (vendorId: string | undefined) => {
      router.push(vendorId ? `/home/${vendorId}` : "/home");
   };

   const handleSelectModel = (canonicalModelId: string | undefined) => {
      if (canonicalModelId) {
         // Already "vendor/model-slug" — exactly the two path segments
         // this route expects.
         router.push(`/home/${canonicalModelId}`);
         return;
      }

      router.push(selectedVendorId ? `/home/${selectedVendorId}` : "/home");
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
               activeModelId={selectedModelId}
               activeModelTypeId={selectedModelType}
               onSelectVendor={handleSelectVendor}
               onSelectModel={handleSelectModel}
               onSelectModelType={setSelectedModelType}
            />
         }
      >
         <Content
            selectedVendorId={selectedVendorId}
            selectedModelId={selectedModelId}
            selectedModelType={selectedModelType}
         />
      </AppLayout>
   );
}
