"use client";

import React from "react";

import { card, tabs } from "./lib/buys.data";
import clsx from "clsx";
import { GroupBuyCard } from "screens/02-GroupBuys/ui/GroupBuyCard";
import { commentsData } from "screens/03-Reviews/lib/comments.data";
import { CommentLayer } from "screens/03-Reviews/ui/CommentLayer";

import { useTranslation } from "shared/lib/i18n";

import { ContentHeader } from "shared/ui/components/ContentHeader";
import { ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";
import { Reply } from "shared/ui/components/Reply";


import css from "./Buys.module.scss";

type TabId = (typeof tabs)[number]["id"];

interface Prop {
   className?: string;
}

export const Buys: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();
   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);

   const totalPages = 10;
   const resultsCount = 158;

   const headerTabs: ContentHeaderTab<TabId>[] = tabs.map((tab) => ({
      id: tab.id,
      label: t.groupBuys.tabs[tab.translationKey],
   }));

   return (
      <div className={clsx(css.buys, className)}>
         <ContentHeader
            title="OpenAI"
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={headerTabs}
            activeTab={activeTab}
            actionsVariant="group"
            onTabChange={setActiveTab}
         />

         <div className={css.buys_list}>
            <div className={css.buys_list_inner}>
               <GroupBuyCard item={card} withBackground={false} />

               <Reply placeholder={t.common.replyPlaceholder} buttonText={t.common.buttonText}/>

               <div className={css.buys_data_list}>
                  <h6>{t.common.participants}</h6>

                  {commentsData.commentsData.reviews.map((item, index) => (
                     <React.Fragment key={item.id}>
                        <CommentLayer data={item} withBackground={false} />

                        {index < commentsData.commentsData.reviews.length - 1 && (
                           <div className={css.horizontal_divider} />
                        )}
                     </React.Fragment>
                  ))}
               </div>
            </div>

            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onChange={setCurrentPage}
            />
         </div>
      </div>
   );
};
