"use client";

import React from "react";

import { type GroupBuysTabId, tabs } from "./lib/groupBuys.data";
import { GroupBuysList } from "./ui/GroupBuysList";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { ContentActions } from "shared/ui/components/ContentActions";
import { ContentHeader } from "shared/ui/components/ContentHeader";
import { ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./GroupBuysContent.module.scss";

interface Props {
   className?: string;
}

type TabId = (typeof tabs)[number]["id"];

export const GroupBuysContent: React.FC<Props> = ({ className }) => {
   const { t } = useTranslation();

   const [activeTab, setActiveTab] = React.useState<GroupBuysTabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);

   const resultsCount = 158;
   const totalPages = 10;

   const headerTabs: ContentHeaderTab<TabId>[] = tabs.map((tab) => ({
      id: tab.id,
      label: t.groupBuys.tabs[tab.translationKey],
   }));

   return (
      <div className={clsx(css.content, className)}>
         <ContentHeader
            title="OpenAI"
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={headerTabs}
            activeTab={activeTab}
            actionsVariant="group"
            onTabChange={setActiveTab}
         />

         <ContentActions variant="group" className={css.content_actions} />

         <div className={css.content_scroll}>
            <div className={css.content_list}>
               <GroupBuysList />

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
