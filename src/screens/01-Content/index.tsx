"use client";
import React from "react";

import { ContentActions } from "./ui/ContentActions";
import { ModelsTable } from "./ui/ModelsTable";
import { Pagination } from "./ui/Pagination";
import clsx from "clsx";

import { Button } from "shared/ui/ui-kit/Button";

import css from "./Content.module.scss";

const tabs = ["All Types", "Image", "New", "Search", "Audio & Video"];

interface Prop {
   className?: string;
}

export const Content: React.FC<Prop> = ({ className }) => {
   const [activeTab, setActiveTab] = React.useState(tabs[0]);
   const [currentPage, setCurrentPage] = React.useState(1);

   const totalPages = 10;

   return (
      <div className={clsx(css.content, className)}>
         <div className={css.content_top}>
            <div className={css.content_title}>
               <h2>OpenAI </h2>
               <span>
                  (<strong>158</strong>results)
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
