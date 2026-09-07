"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { ForumScreen } from "screens/09-Forum";

import { Header } from "widgets/Header";
import { Sidebar } from "widgets/Sidebar";
import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.data";

import { AppLayout } from "shared/ui/templates/AppLayout";

export const dynamic = "force-dynamic";

interface Props {
   params: Promise<{ id: string }>;
}

// One discussion thread: the topic itself plus its comments, both read
// through /api/forum/topics/[id]* (FORUM_API_GUIDE.md). Linked to from the
// topic cards on /discussions.
export default function TopicPage({ params }: Props) {
   const router = useRouter();
   const { id } = React.use(params);
   const [collapsed, setCollapsed] = React.useState(false);
   const [mode] = React.useState<SidebarMode>("api");

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
         <ForumScreen topicId={id} onSelectVendor={handleSelectVendor} />
      </AppLayout>
   );
}
