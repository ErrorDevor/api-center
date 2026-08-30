"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Comments } from "screens/03-Reviews";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.data";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

interface Props {
   params: Promise<{ vendor?: string[] }>;
}

interface ReviewsContentProps {
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
}

const ReviewsContent: React.FC<ReviewsContentProps> = ({
   selectedVendorId,
   onSelectVendor,
}) => {
   const searchParams = useSearchParams();
   const providerDomain = searchParams.get("provider") ?? undefined;

   return (
      <Comments
         providerDomain={providerDomain}
         selectedVendorId={selectedVendorId}
         onSelectVendor={onSelectVendor}
      />
   );
};

export default function ReviewsPage({ params }: Props) {
   const router = useRouter();
   const { vendor: segments } = React.use(params);

   const [collapsed, setCollapsed] = React.useState(false);
   const [mode, setMode] = React.useState<SidebarMode>("api");

   const selectedVendorId = segments?.[0];

   const handleSelectVendor = (vendorId: string | undefined) => {
      router.push(vendorId ? `/reviews/${vendorId}` : "/reviews");
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
               activeVendorId={selectedVendorId}
               onSelectVendor={handleSelectVendor}
            />
         }
      >
         <React.Suspense fallback={null}>
            <ReviewsContent
               selectedVendorId={selectedVendorId}
               onSelectVendor={handleSelectVendor}
            />
         </React.Suspense>
      </AppLayout>
   );
}