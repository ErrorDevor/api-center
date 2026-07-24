"use client";

import React from "react";

import { type GroupBuysTabId, tabs } from "./lib/groupBuys.data";
import { GroupBuysList } from "./ui/GroupBuysList";
import clsx from "clsx";
import { ContentActions } from "shared/ui/components/ContentActions";

import { useTranslation } from "shared/lib/i18n";
import { Pagination } from "shared/ui/components/Pagination";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./GroupBuysContent.module.scss";

interface Props {
   className?: string;
}

export const GroupBuysContent: React.FC<Props> = ({ className }) => {
   const { t } = useTranslation();

   const [activeTab, setActiveTab] = React.useState<GroupBuysTabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);

   const resultsCount = 158;
   const totalPages = 10;

   return (
      <div className={clsx(css.content, className)}>
         <div className={css.content_top}>
            <div className={css.content_title}>
               <h2>OpenAI</h2>

               <span>
                  (<strong>{resultsCount}</strong> {t.content.results})
               </span>
            </div>

            <div className={css.divider} />

            <div className={css.content_buttons_nav}>
               {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                     <Button
                        key={tab.id}
                        variant="grey"
                        className={clsx(css.button_nav, isActive && css.button_nav_active)}
                        active={isActive}
                        onClick={() => setActiveTab(tab.id)}
                     >
                        {t.groupBuys.tabs[tab.translationKey]}
                     </Button>
                  );
               })}
            </div>

            <ContentActions variant="group" />
         </div>

         <div className={css.content_list}>
            <GroupBuysList />

            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onChange={setCurrentPage}
            />
         </div>
      </div>
   );
};
