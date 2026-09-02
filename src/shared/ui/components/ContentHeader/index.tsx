"use client";

import React from "react";

import { useRouter } from "next/navigation";

import clsx from "clsx";

import type { SidebarMode } from "widgets/Sidebar/lib/sidebar.types";
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
   actionsVariant?: "group" | "api" | "forum";
   onTabChange?: (tabId: T) => void;
   // Forwarded to the desktop "Сортировка" dropdown rendered in here (see
   // ContentActions' own sortOptions/sortValue/onSortChange) — this is the
   // instance actually visible above screenMD; the mobile one lives directly
   // on the page (e.g. Content's own <ContentActions>, hidden here).
   sortOptions?: SortDropdownOption<TSort>[];
   sortValue?: TSort;
   onSortChange?: (value: TSort) => void;
   selectedVendorId?: string;
   selectedModelId?: string;
   selectedModelType?: string;
   withTabs?: boolean;
   onSelectVendor?: (vendorId: string | undefined) => void;
   onSelectModel?: (modelId: string | undefined) => void;
   onSelectModelType?: (modelTypeId: string | undefined) => void;
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
   selectedVendorId,
   selectedModelId,
   selectedModelType,
   onSelectModelType,
   onSelectVendor,
   onSelectModel,
   withTabs = true,
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
                  <Image.Default src="/images/Logo.svg" alt="" className={css.main_logo} />
                  Best Ai Price
               </NextLink>

               <BurgerButton onClick={handleOpenMobileSidebar} />
            </div>

            <MobileSidebar
               opened={isMobileSidebarOpened}
               onClose={handleCloseMobileSidebar}
               activeVendorId={selectedVendorId}
               activeModelId={selectedModelId}
               activeModelTypeId={selectedModelType}
               onSelectVendor={onSelectVendor}
               onSelectModel={onSelectModel}
               onSelectModelType={onSelectModelType}
            />
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

            {withTabs && (
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
            )}

            <ContentActions
               variant={actionsVariant}
               className={css.content_header_actions}
               sortOptions={sortOptions}
               sortValue={sortValue}
               onSortChange={onSortChange}
            />
         </div>

         <MobileSidebar
            opened={isMobileSidebarOpened}
            onClose={handleCloseMobileSidebar}
            activeVendorId={selectedVendorId}
            activeModelId={selectedModelId}
            activeModelTypeId={selectedModelType}
            onSelectVendor={onSelectVendor}
            onSelectModel={onSelectModel}
            onSelectModelType={onSelectModelType}
         />
      </>
   );
};
