"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Content } from "screens/01-Content";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.types";

import { isModelContentType } from "shared/lib/models/modelType";
import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

// /home -> nothing selected, /home/[vendor] -> that API's models,
// /home/[vendor]/[model] -> one model. The Sidebar's "Model Type" filter
// rides along as `?type=<category>` (images/search/audioVideo/text/chat) so
// each category is its own shareable link too. All selection state lives in
// the URL rather than only in React state.
interface Props {
   params: Promise<{ vendor?: string[] }>;
}

const buildHomeHref = (path: string, opts: { type?: string; q?: string }): string => {
   const params = new URLSearchParams();

   if (opts.type) {
      params.set("type", opts.type);
   }

   if (opts.q) {
      params.set("q", opts.q);
   }

   const queryString = params.toString();

   return queryString ? `${path}?${queryString}` : path;
};

// useSearchParams() opts the reading component out of static rendering
// unless it's wrapped in Suspense (see
// https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout) —
// keep the whole interactive tree in here behind the page's boundary.
const HomeView: React.FC<Props> = ({ params }) => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const { vendor: segments } = React.use(params);

   const [collapsed, setCollapsed] = React.useState(false);

   const selectedVendorId = segments?.[0];
   const selectedModelSlug = segments?.[1];
   const selectedModelId =
      selectedVendorId && selectedModelSlug
         ? `${selectedVendorId}/${selectedModelSlug}`
         : undefined;

   // Unknown/typo'd `?type=` values are ignored rather than filtering the
   // table down to nothing.
   const typeParam = searchParams.get("type");
   const selectedModelType = isModelContentType(typeParam) ? typeParam : undefined;

   // Free-text search from the header box. A blank/whitespace `?q=` is treated
   // as no search at all.
   const searchQuery = searchParams.get("q")?.trim() || undefined;

   const mode: SidebarMode = "api";

   // The current path minus its query string — vendor/model navigation and
   // the type filter each rebuild the href from here so neither drops the
   // other.
   const currentPath = selectedModelId
      ? `/home/${selectedModelId}`
      : selectedVendorId
        ? `/home/${selectedVendorId}`
        : "/home";

   // Drilling into a vendor/model ends a search — only the type filter rides
   // along.
   const handleSelectVendor = (vendorId: string | undefined) => {
      router.push(
         buildHomeHref(vendorId ? `/home/${vendorId}` : "/home", { type: selectedModelType })
      );
   };

   const handleSelectModel = (canonicalModelId: string | undefined) => {
      if (canonicalModelId) {
         // Already "vendor/model-slug" — exactly the two path segments
         // this route expects.
         router.push(buildHomeHref(`/home/${canonicalModelId}`, { type: selectedModelType }));
         return;
      }

      router.push(
         buildHomeHref(selectedVendorId ? `/home/${selectedVendorId}` : "/home", {
            type: selectedModelType,
         })
      );
   };

   const handleSelectModelType = (modelTypeId: string | undefined) => {
      router.push(buildHomeHref(currentPath, { type: modelTypeId, q: searchQuery }));
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
               onSelectModelType={handleSelectModelType}
            />
         }
      >
         <Content
            selectedVendorId={selectedVendorId}
            selectedModelId={selectedModelId}
            selectedModelType={selectedModelType}
            selectedSearchQuery={searchQuery}
            onSelectVendor={handleSelectVendor}
            onSelectModel={handleSelectModel}
            onSelectModelType={handleSelectModelType}
         />
      </AppLayout>
   );
};

export default function HomePage({ params }: Props) {
   return (
      <React.Suspense fallback={null}>
         <HomeView params={params} />
      </React.Suspense>
   );
}
