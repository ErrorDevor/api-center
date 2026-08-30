"use client";

import React from "react";

import { CreatePostForm } from "./ui/CreatePostForm";
import clsx from "clsx";
import { tabs } from "screens/02-GroupBuys/lib/groupBuys.data";

import { useTranslation } from "shared/lib/i18n";
import { ContentHeader } from "shared/ui/components/ContentHeader";
import { ContentHeaderTab } from "shared/ui/components/ContentHeader";

import css from "./CreatePost.module.scss";

interface Prop {
   className?: string;
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
}

type TabId = (typeof tabs)[number]["id"];

const resultsCount = 158;

export const CreatePost: React.FC<Prop> = ({ className, selectedVendorId, onSelectVendor }) => {
   const { t } = useTranslation();
   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);

   const headerTabs: ContentHeaderTab<TabId>[] = tabs.map((tab) => ({
      id: tab.id,
      label: t.groupBuys.tabs[tab.translationKey],
   }));

   return (
      <div className={clsx(css.create_post, className)}>
         <ContentHeader
            title="OpenAI"
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={headerTabs}
            activeTab={activeTab}
            actionsVariant="group"
            onTabChange={setActiveTab}
            selectedVendorId={selectedVendorId}
            onSelectVendor={onSelectVendor}
         />

         <div className={css.create_post_inner}>
            <CreatePostForm />
         </div>
      </div>
   );
};
