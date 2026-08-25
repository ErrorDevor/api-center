"use client";

import React from "react";

import clsx from "clsx";

import { MobileSidebar } from "widgets/Sidebar/ui/MobileSidebar";

import Image from "shared/ui/base/Image";
import { NextLink } from "shared/ui/base/NextLink";
import { ContentActions } from "shared/ui/components/ContentActions";
import { BurgerButton } from "shared/ui/ui-kit/BurgerButton";
import { Button } from "shared/ui/ui-kit/Button";
import type { SortDropdownOption, SortValue } from "shared/ui/ui-kit/SortDropdown";

import css from "./ContentHeader.module.scss";

export interface ContentHeaderTab<T extends string> {
   id: T;
   label: string;
}

interface Props<T extends string, TSort extends string = SortValue> {
   className?: string;
   variant?: "main" | "simple";
   title?: string;
   resultsCount?: number;
   resultsLabel?: string;
   tabs?: readonly ContentHeaderTab<T>[];
   activeTab?: T;
   actionsVariant?: "group";
   onTabChange?: (tabId: T) => void;
   // Forwarded to the desktop "Сортировка" dropdown rendered in here (see
   // ContentActions' own sortOptions/sortValue/onSortChange) — this is the
   // instance actually visible above screenMD; the mobile one lives directly
   // on the page (e.g. Content's own <ContentActions>, hidden here).
   sortOptions?: SortDropdownOption<TSort>[];
   sortValue?: TSort;
   onSortChange?: (value: TSort) => void;
}

export const ContentHeader = <T extends string, TSort extends string = SortValue>({
   className,
   variant = "main",
   title,
   resultsCount,
   resultsLabel,
   tabs,
   activeTab,
   actionsVariant,
   onTabChange,
   sortOptions,
   sortValue,
   onSortChange,
}: Props<T, TSort>) => {
   const [isMobileSidebarOpened, setIsMobileSidebarOpened] = React.useState(false);

   const handleOpenMobileSidebar = () => {
      setIsMobileSidebarOpened(true);
   };

   const handleCloseMobileSidebar = React.useCallback(() => {
      setIsMobileSidebarOpened(false);
   }, []);

   if (variant === "simple") {
      return (
         <>
            <div className={clsx(css.content_header, css.content_header_simple, className)}>
               <NextLink href="/" className={css.content_header_logo}>
                  <Image.Default src="/images/Logo.svg" alt="" />
                  Best Api Price
               </NextLink>

               <BurgerButton onClick={handleOpenMobileSidebar} />
            </div>

            <MobileSidebar opened={isMobileSidebarOpened} onClose={handleCloseMobileSidebar} />
         </>
      );
   }

   return (
      <>
         <div className={clsx(css.content_header, className)}>
            <div className={css.content_header_title}>
               <h2>{title}</h2>

               {resultsCount !== undefined && resultsLabel && (
                  <span>
                     (<strong>{resultsCount}</strong> {resultsLabel})
                  </span>
               )}
            </div>

            <BurgerButton onClick={handleOpenMobileSidebar} />

            <div className={css.content_header_divider} />

            <div className={css.content_header_navigation}>
               {tabs?.map((tab) => {
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
                        onClick={() => onTabChange?.(tab.id)}
                     >
                        {tab.label}
                     </Button>
                  );
               })}
            </div>

            <ContentActions
               variant={actionsVariant}
               className={css.content_header_actions}
               sortOptions={sortOptions}
               sortValue={sortValue}
               onSortChange={onSortChange}
            />
         </div>

         <MobileSidebar opened={isMobileSidebarOpened} onClose={handleCloseMobileSidebar} />
      </>
   );
};
