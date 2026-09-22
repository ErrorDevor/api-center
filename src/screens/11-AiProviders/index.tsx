"use client";

import React from "react";

import { PROVIDERS } from "./lib/data";
import { MobileSortValue, ProviderStatusFilter, SortKey, SortState } from "./lib/types";
import { AiProviderRow } from "./ui/AiProviderRow";
import { HeaderCell } from "./ui/HeaderCell";
import clsx from "clsx";

import { useIsMobile } from "shared/lib/hooks/useIsMobile";
import { useTranslation } from "shared/lib/i18n";
import { ContentHeader } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";
import { Search } from "shared/ui/components/Search";
import { FilterIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { ProvidersFilterDropdown } from "shared/ui/ui-kit/ProvidersFilterDropdown";
import { SortDropdown } from "shared/ui/ui-kit/SortDropdown";

import css from "./AiProvidersScreen.module.scss";

const INITIAL_COLUMN_WIDTHS = [43, 17, 19, 11, 10];
const MIN_COLUMN_WIDTHS = [28, 12, 14, 9, 8];

const PAGE_SIZE = 11;

interface Prop {
   className?: string;
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
}

export const AiProvidersScreen: React.FC<Prop> = ({
   className,
   selectedVendorId,
   onSelectVendor,
}) => {
   const { t } = useTranslation();
   const isMobile = useIsMobile();

   const buttonRef = React.useRef<HTMLButtonElement>(null);
   const tableRef = React.useRef<HTMLDivElement>(null);
   const [isOpen, setIsOpen] = React.useState(false);
   const [columnWidths, setColumnWidths] = React.useState<number[]>(INITIAL_COLUMN_WIDTHS);
   const [statusFilter, setStatusFilter] = React.useState<ProviderStatusFilter>("all");
   const [mobileSort, setMobileSort] = React.useState<MobileSortValue>("default");

   const [sort, setSort] = React.useState<SortState>({
      key: "name",
      direction: "asc",
   });

   const [currentPage, setCurrentPage] = React.useState(1);

   const sortOptions = React.useMemo(
      () => [
         {
            value: "default" as MobileSortValue,
            label: t.aiProviders.sort.default,
         },
         {
            value: "working" as MobileSortValue,
            label: t.aiProviders.sort.working,
         },
         {
            value: "not-working" as MobileSortValue,
            label: t.aiProviders.sort.notWorking,
         },
      ],
      [t]
   );

   const handleSort = (key: SortKey) => {
      setSort((currentSort) => {
         if (currentSort.key === key) {
            return {
               key,
               direction: currentSort.direction === "asc" ? "desc" : "asc",
            };
         }

         return {
            key,
            direction: "asc",
         };
      });

      setCurrentPage(1);
   };

   const filteredProviders = React.useMemo(() => {
      if (statusFilter === "all") {
         return PROVIDERS;
      }

      return PROVIDERS.filter((provider) => provider.status === statusFilter);
   }, [statusFilter]);

   const sortedProviders = React.useMemo(() => {
      return [...filteredProviders].sort((firstProvider, secondProvider) => {
         if (isMobile) {
            if (mobileSort === "working") {
               if (firstProvider.status === secondProvider.status) {
                  return 0;
               }

               return firstProvider.status === "working" ? -1 : 1;
            }

            if (mobileSort === "not-working") {
               if (firstProvider.status === secondProvider.status) {
                  return 0;
               }

               return firstProvider.status === "not-working" ? -1 : 1;
            }
         }

         let result = 0;

         if (sort.key === "name") {
            result = firstProvider.name.localeCompare(secondProvider.name);
         }

         if (sort.key === "status") {
            result = firstProvider.status.localeCompare(secondProvider.status);
         }

         return sort.direction === "asc" ? result : -result;
      });
   }, [filteredProviders, sort, mobileSort, isMobile]);

   const totalPages = Math.max(1, Math.ceil(sortedProviders.length / PAGE_SIZE));

   const visibleProviders = sortedProviders.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
   );

   const handleResizeStart = (
      event: React.PointerEvent<HTMLButtonElement>,
      columnIndex: number
   ) => {
      event.preventDefault();
      event.stopPropagation();

      const tableWidth = tableRef.current?.clientWidth;

      if (!tableWidth) {
         return;
      }

      const startX = event.clientX;

      const startCurrentWidth = columnWidths[columnIndex];

      const startNextWidth = columnWidths[columnIndex + 1];

      const columnsTotalWidth = startCurrentWidth + startNextWidth;

      const handlePointerMove = (pointerEvent: PointerEvent) => {
         const deltaPixels = pointerEvent.clientX - startX;

         const deltaPercent = (deltaPixels / tableWidth) * 100;

         let currentWidth = startCurrentWidth + deltaPercent;

         let nextWidth = startNextWidth - deltaPercent;

         const currentMinWidth = MIN_COLUMN_WIDTHS[columnIndex];

         const nextMinWidth = MIN_COLUMN_WIDTHS[columnIndex + 1];

         if (currentWidth < currentMinWidth) {
            currentWidth = currentMinWidth;
            nextWidth = columnsTotalWidth - currentMinWidth;
         }

         if (nextWidth < nextMinWidth) {
            nextWidth = nextMinWidth;
            currentWidth = columnsTotalWidth - nextMinWidth;
         }

         setColumnWidths((currentWidths) => {
            const nextWidths = [...currentWidths];

            nextWidths[columnIndex] = currentWidth;

            nextWidths[columnIndex + 1] = nextWidth;

            return nextWidths;
         });
      };

      const handlePointerUp = () => {
         document.body.style.cursor = "";
         document.body.style.userSelect = "";

         window.removeEventListener("pointermove", handlePointerMove);

         window.removeEventListener("pointerup", handlePointerUp);
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      window.addEventListener("pointermove", handlePointerMove);

      window.addEventListener("pointerup", handlePointerUp);
   };

   const handleMobileSortChange = (nextSort: MobileSortValue) => {
      setMobileSort(nextSort);
      setCurrentPage(1);
   };

   const tableStyle = {
      "--grid-columns": columnWidths.map((width) => `${width}%`).join(" "),
      "--table-min-width": "82rem",
   } as React.CSSProperties;

   return (
      <>
         <div className={clsx(css.ai_providers, className)}>
            <ContentHeader
               variant="simple"
               className={css.ai_providers_header}
               selectedVendorId={selectedVendorId}
               onSelectVendor={onSelectVendor}
            />

            <div className={css.ai_providers_wrapper}>
               <div className={css.ai_providers_content}>
                  <div className={css.ai_providers_heading}>
                     <h3 className={css.ai_providers_heading_title}>{t.common.aiProviders}</h3>

                     <div className={css.ai_providers_heading_action}>
                        <Search
                           withInfo={false}
                           placeholder={t.common.providersSearch}
                           className={css.ai_providers_search}
                        />

                        <div className={css.mobile_ai_providers_heading_action}>
                           <Button
                              ref={buttonRef}
                              type="button"
                              variant="grey"
                              className={css.filter_button}
                              aria-expanded={isOpen}
                              onClick={() => setIsOpen((current) => !current)}
                           >
                              <FilterIcon />

                              {t.common.filter}
                           </Button>

                           <SortDropdown<MobileSortValue>
                              className={css.ai_providers_sort}
                              name={t.common.sort}
                              options={sortOptions}
                              value={mobileSort}
                              onChange={handleMobileSortChange}
                           />
                        </div>
                     </div>
                  </div>

                  <div className={css.table_scroll}>
                     <div ref={tableRef} className={css.table} style={tableStyle}>
                        <div className={css.table_header}>
                           <HeaderCell
                              columnIndex={0}
                              sortKey="name"
                              sort={sort}
                              sortLabel={t.aiProviders.sortByName}
                              resizeLabel={t.rating.table.resizeColumn}
                              onSort={handleSort}
                              onResizeStart={handleResizeStart}
                           >
                              {t.aiProviders.name}
                           </HeaderCell>

                           <HeaderCell
                              columnIndex={1}
                              resizeLabel={t.rating.table.resizeColumn}
                              onResizeStart={handleResizeStart}
                           >
                              {t.aiProviders.models}
                           </HeaderCell>

                           <HeaderCell
                              columnIndex={2}
                              resizeLabel={t.rating.table.resizeColumn}
                              onResizeStart={handleResizeStart}
                           >
                              {t.aiProviders.paymentMethod}
                           </HeaderCell>

                           <HeaderCell
                              columnIndex={3}
                              sortKey="status"
                              sort={sort}
                              sortLabel={t.aiProviders.sortByStatus}
                              resizeLabel={t.rating.table.resizeColumn}
                              onSort={handleSort}
                              onResizeStart={handleResizeStart}
                           >
                              {t.aiProviders.status}
                           </HeaderCell>

                           <HeaderCell>{t.aiProviders.reviews}</HeaderCell>
                        </div>

                        <div className={css.table_body}>
                           {visibleProviders.map((provider) => (
                              <AiProviderRow
                                 key={provider.id}
                                 provider={provider}
                                 selected={selectedVendorId === provider.id}
                                 workingLabel={t.aiProviders.working}
                                 notWorkingLabel={t.aiProviders.notWorking}
                                 verifiedLabel={t.aiProviders.verifiedProvider}
                                 onSelect={onSelectVendor}
                              />
                           ))}
                        </div>
                     </div>
                  </div>

                  <Pagination
                     className={css.ai_providers_pagination}
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onChange={setCurrentPage}
                  />
               </div>
            </div>
         </div>

         <ProvidersFilterDropdown
            isOpen={isOpen}
            anchorRef={buttonRef}
            value={statusFilter}
            onApply={(value) => {
               setStatusFilter(value);
               setCurrentPage(1);
            }}
            onClose={() => setIsOpen(false)}
         />
      </>
   );
};
