"use client";

import React from "react";

import { topics, topicsTabs } from "./lib/data";
import { TopicsList } from "./ui/TopicsList";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { ContentHeader, ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";

import css from "./TopicsScreen.module.scss";

type TabId = (typeof topicsTabs)[number]["id"];

interface Prop {
   className?: string;
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
}

export const TopicsScreen: React.FC<Prop> = ({ className, selectedVendorId, onSelectVendor }) => {
   const { t } = useTranslation();

   const [activeTab, setActiveTab] = React.useState<TabId>(topicsTabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);

   const totalPages = 10;
   const resultsCount = 158;

   const headerTabs: ContentHeaderTab<TabId>[] = topicsTabs.map((tab) => ({
      id: tab.id,
      label: t.forum.tabs[tab.translationKey],
   }));

   const handleTopicClick = (topicId: number) => {
      console.log("Open topic:", topicId);
   };

   return (
      <div className={clsx(css.topics, className)}>
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
            withTabs={false}
         />

         <div className={css.topics_list}>
            <div className={css.topics_list_inner}>
               <TopicsList topics={topics} onTopicClick={handleTopicClick} />
               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={setCurrentPage}
               />
            </div>
         </div>
      </div>
   );
};
