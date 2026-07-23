"use client";

import React from "react";

import { tabs } from "./lib/content.data";
import { ContentActions } from "./ui/ContentActions";
import { ModelsTable } from "./ui/ModelsTable";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { Pagination } from "shared/ui/components/Pagination";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./Content.module.scss";

type TabId = (typeof tabs)[number]["id"];

interface Prop {
   className?: string;
}

export const Content: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();

   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);

   const totalPages = 10;
   const resultsCount = 158;

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
                        {t.content.tabs[tab.translationKey]}
                     </Button>
                  );
               })}
            </div>

            <ContentActions />
         </div>

         <div className={css.content_list}>
            <ModelsTable />

            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onChange={setCurrentPage}
            />
         </div>
      </div>
   );
};
