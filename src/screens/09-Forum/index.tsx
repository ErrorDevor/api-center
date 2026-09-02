"use client";

import React from "react";

import { forumComments, forumTopic, tabs } from "./lib/data";
import { ForumThread } from "./ui/ForumThread";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { ContentHeader, ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";

import css from "./ForumScreen.module.scss";

type TabId = (typeof tabs)[number]["id"];

interface Prop {
   className?: string;
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
}

export const ForumScreen: React.FC<Prop> = ({ className, selectedVendorId, onSelectVendor }) => {
   const { t } = useTranslation();

   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);

   const totalPages = 10;
   const resultsCount = 158;

   const headerTabs: ContentHeaderTab<TabId>[] = tabs.map((tab) => ({
      id: tab.id,
      label: t.forum.tabs[tab.translationKey],
   }));

   return (
      <div className={clsx(css.forum, className)}>
         <ContentHeader
            title="OpenAI"
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={headerTabs}
            activeTab={activeTab}
            actionsVariant="forum"
            onTabChange={setActiveTab}
            selectedVendorId={selectedVendorId}
            onSelectVendor={onSelectVendor}
         />

         <div className={css.forum_list}>
            <div className={css.forum_list_inner}>
               <ForumThread
                  comments={forumComments}
                  userName={forumTopic.userName}
                  userAvatar={forumTopic.userAvatar}
                  providers={forumTopic.providers}
                  title={forumTopic.title}
                  description={forumTopic.description}
                  replyPlaceholder={t.common.replyPlaceholder}
                  replyButtonText={t.common.buttonText}
               />

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
