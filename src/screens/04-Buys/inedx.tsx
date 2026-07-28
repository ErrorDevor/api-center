"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { card, tabs } from "./lib/buys.data";
import clsx from "clsx";
import { GroupBuyCard } from "screens/02-GroupBuys/ui/GroupBuyCard";
import { commentsData } from "screens/03-Reviews/lib/comments.data";
import { CommentLayer } from "screens/03-Reviews/ui/CommentLayer";

import { useTranslation } from "shared/lib/i18n";
import { ContentActions } from "shared/ui/components/ContentActions";
import { Pagination } from "shared/ui/components/Pagination";
import { Reply } from "shared/ui/components/Reply";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./Buys.module.scss";

type TabId = (typeof tabs)[number]["id"];

interface Prop {
   className?: string;
}

export const Buys: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();
   const router = useRouter();
   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);

   const totalPages = 10;
   const resultsCount = 158;

   return (
      <div className={clsx(css.buys, className)}>
         <div className={css.buys_top}>
            <div className={css.buys_title}>
               <h2>OpenAI</h2>

               <span>
                  (<strong>{resultsCount}</strong> {t.content.results})
               </span>
            </div>

            <div className={css.divider} />

            <div className={css.buys_buttons_nav}>
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

         <div className={css.buys_list}>
            <div className={css.buys_list_inner}>
               <GroupBuyCard item={card} withBackground={false} />

               <Reply />

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
