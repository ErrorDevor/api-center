"use client";

import React from "react";

import { GroupBuysList } from "./ui/GroupBuysList";
import clsx from "clsx";
import { ContentActions } from "screens/01-Content/ui/ContentActions";

import { Pagination } from "shared/ui/components/Pagination";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./GroupBuysContent.module.scss";

const tabs = ["Group Buys", "API", "Video"];

interface Props {
   className?: string;
}

export const GroupBuysContent: React.FC<Props> = ({ className }) => {
   const [activeTab, setActiveTab] = React.useState(tabs[0]);
   const [currentPage, setCurrentPage] = React.useState(1);

   return (
      <div className={clsx(css.content, className)}>
         <div className={css.content_top}>
            <div className={css.content_title}>
               <h2>OpenAI</h2>

               <span>
                  (<strong>158</strong> results)
               </span>
            </div>

            <div className={css.divider} />

            <div className={css.content_buttons_nav}>
               {tabs.map((tab) => (
                  <Button
                     key={tab}
                     variant="grey"
                     className={clsx(css.button_nav, activeTab === tab && css.button_nav_active)}
                     active={activeTab === tab}
                     onClick={() => setActiveTab(tab)}
                  >
                     {tab}
                  </Button>
               ))}
            </div>

            <ContentActions variant="group" />
         </div>

         <div className={css.content_list}>
            <GroupBuysList />

            <Pagination currentPage={currentPage} totalPages={10} onChange={setCurrentPage} />
         </div>
      </div>
   );
};
