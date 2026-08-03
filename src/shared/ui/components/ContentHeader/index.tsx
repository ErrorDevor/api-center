import React from "react";

import clsx from "clsx";

import { ContentActions } from "shared/ui/components/ContentActions";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./ContentHeader.module.scss";

export interface ContentHeaderTab<T extends string> {
   id: T;
   label: string;
}

interface Prop<T extends string> {
   className?: string;
   title: string;
   resultsCount: number;
   resultsLabel: string;
   tabs: readonly ContentHeaderTab<T>[];
   activeTab: T;
   actionsVariant?: "group";
   onTabChange: (tabId: T) => void;
}

export const ContentHeader = <T extends string>({
   className,
   title,
   resultsCount,
   resultsLabel,
   tabs,
   activeTab,
   actionsVariant,
   onTabChange,
}: Prop<T>) => {
   return (
      <div className={clsx(css.content_header, className)}>
         <div className={css.content_header_title}>
            <h2>{title}</h2>

            <span>
               (<strong>{resultsCount}</strong> {resultsLabel})
            </span>
         </div>

         <div className={css.content_header_divider} />

         <div className={css.content_header_navigation}>
            {tabs.map((tab) => {
               const isActive = activeTab === tab.id;

               return (
                  <Button
                     key={tab.id}
                     variant="grey"
                     className={clsx(
                        css.content_header_button,
                        isActive && css.content_header_button_active
                     )}
                     active={isActive}
                     onClick={() => onTabChange(tab.id)}
                  >
                     {tab.label}
                  </Button>
               );
            })}
         </div>

         <ContentActions variant={actionsVariant} />
      </div>
   );
};
