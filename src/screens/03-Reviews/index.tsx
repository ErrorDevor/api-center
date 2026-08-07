"use client";

import React from "react";

import { tabs } from "./lib/comments.data";
import { commentsData } from "./lib/comments.data";
import { CommentCard } from "./ui/CommentCard";
import { CommentLayer } from "./ui/CommentLayer";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { ContentActions } from "shared/ui/components/ContentActions";
import { ContentHeader } from "shared/ui/components/ContentHeader";
import { ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";
import { PlusIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { SortDropdown } from "shared/ui/ui-kit/SortDropdown";

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

   const headerTabs: ContentHeaderTab<TabId>[] = tabs.map((tab) => ({
      id: tab.id,
      label: t.groupBuys.tabs[tab.translationKey],
   }));

   return (
      <div className={clsx(css.comments, className)}>
         <ContentHeader
            title="OpenAI"
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={headerTabs}
            activeTab={activeTab}
            actionsVariant="group"
            onTabChange={setActiveTab}
         />

         <ContentActions variant="api" className={css.comments_actions} />

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
                  <CommentLayer key={item.id} data={item} className={css.comments_padding}/>
               ))}
            </div>

            <Pagination className={css.comments_pag}
               currentPage={currentPage}
               totalPages={totalPages}
               onChange={setCurrentPage}
            />
         </div>
      </div>
   );
};
