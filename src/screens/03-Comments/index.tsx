"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { tabs } from "./lib/comments.data";
import { commentsData } from "./lib/comments.data";
import { CommentCard } from "./ui/CommentCard";
import { CommentLayer } from "./ui/CommentLayer";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { ContentActions } from "shared/ui/components/ContentActions";
import { Pagination } from "shared/ui/components/Pagination";
import { ArrowIcon, PlusIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { SortDropdown } from "shared/ui/ui-kit/SortDropdown";

import css from "./Comments.module.scss";

type TabId = (typeof tabs)[number]["id"];

interface Prop {
   className?: string;
}

export const Comments: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();
   const router = useRouter();
   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);

   const totalPages = 10;
   const resultsCount = 158;

   return (
      <div className={clsx(css.comments, className)}>
         <div className={css.comments_top}>
            <div className={css.comments_title}>
               <button className={css.back_button} type="button" onClick={() => router.back()}>
                  <ArrowIcon />
               </button>

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
                        {t.groupBuys.tabs[tab.translationKey]}
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

                  <div className={css.buttons_block}>
                     <SortDropdown name={t.common.sort} />

                     <Button variant="black" className={css.feedback_button}>
                        <PlusIcon />
                        {t.common.feedback}
                     </Button>
                  </div>
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
