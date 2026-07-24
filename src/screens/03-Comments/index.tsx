"use client";

import React from "react";

import { tabs } from "./lib/comments.data";
import { commentsData } from "./lib/comments.data";
import { CommentCard } from "./ui/CommentCard";
import { CommentLayer } from "./ui/CommentLayer";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { ContentActions } from "shared/ui/components/ContentActions";
import { Pagination } from "shared/ui/components/Pagination";
import { Sort2Icon, ArrowIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./Comments.module.scss";

type TabId = (typeof tabs)[number]["id"];

interface Prop {
   className?: string;
}

export const Comments: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();

   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);

   const totalPages = 10;
   const resultsCount = 158;

   return (
      <div className={clsx(css.comments, className)}>
         <div className={css.comments_top}>
            <div className={css.comments_title}>
               <button className={css.back_button} type="button"><ArrowIcon/></button>
               <h2>OpenAI</h2>

               <span>
                  (<strong>{resultsCount}</strong> {t.content.results})
               </span>
            </div>

            <div className={css.divider} />

            <div className={css.comments_buttons_nav}>
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
                        {t.content.tabs[tab.translationKey]}
                     </Button>
                  );
               })}
            </div>

            <ContentActions variant="group" />
         </div>

         <div className={css.comments_list}>
            <CommentCard data={commentsData} />

            <div className={css.comments_data_list}>
               <div className={css.comments_data_list_title}>
                  <h6>{t.common.participants}</h6>

                  <Button variant="grey" className={css.sort_button}>
                     <Sort2Icon />
                     {t.common.sort}
                  </Button>
               </div>

               {commentsData.commentsData.reviews.map((item) => (
                  <CommentLayer key={item.id} data={item} />
               ))}
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
