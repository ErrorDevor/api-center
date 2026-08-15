"use client";

import React from "react";

import { ratingModels, ratingTabs } from "../../lib/rating.data";
import type { RatingModel, RatingTabId } from "../../lib/rating.type";
import clsx from "clsx";

import { useIsMobile } from "shared/lib/hooks/useIsMobile";
import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { Pagination } from "shared/ui/components/Pagination";
import { DropdownArrowIcon, SortIcon } from "shared/ui/icons";

import { RatingRow } from "../RatingRow";

import css from "./RatingTable.module.scss";

const INITIAL_COLUMN_WIDTHS = [7, 28, 13, 13, 13, 13, 13];
const MIN_COLUMN_WIDTHS = [5, 20, 8, 8, 8, 8, 8];

const MOBILE_VISIBLE_COUNT = 3;
const MOBILE_VISIBLE_STEP = 3;

const PAGE_SIZE = 10;

type SortKey = "tts";
type SortDirection = "asc" | "desc";

interface SortState {
   key: SortKey;
   direction: SortDirection;
}

interface Prop {
   className?: string;
}

export const RatingTable: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();
   const tableRef = React.useRef<HTMLDivElement>(null);
   const bodyScrollRef = React.useRef<HTMLDivElement>(null);

   const [activeTab, setActiveTab] = React.useState<RatingTabId>(ratingTabs[0].id);
   const [columnWidths, setColumnWidths] = React.useState(INITIAL_COLUMN_WIDTHS);
   const [scrollbarWidth, setScrollbarWidth] = React.useState(0);

   const [sort, setSort] = React.useState<SortState>({
      key: "tts",
      direction: "asc",
   });

   const [currentPage, setCurrentPage] = React.useState(1);

   const isMobile = useIsMobile();

   const [visibleCount, setVisibleCount] = React.useState(MOBILE_VISIBLE_COUNT);

   React.useLayoutEffect(() => {
      const scrollElement = bodyScrollRef.current;

      if (!scrollElement) {
         return;
      }

      const updateScrollbarWidth = () => {
         const width = scrollElement.offsetWidth - scrollElement.clientWidth;

         setScrollbarWidth(width);
      };

      updateScrollbarWidth();

      const resizeObserver = new ResizeObserver(updateScrollbarWidth);

      resizeObserver.observe(scrollElement);

      return () => {
         resizeObserver.disconnect();
      };
   }, []);

   const sortedModels = React.useMemo(() => {
      return [...ratingModels].sort((firstModel, secondModel) => {
         const result = firstModel.tts - secondModel.tts;

         return sort.direction === "asc" ? result : -result;
      });
   }, [sort]);

   React.useEffect(() => {
      setCurrentPage(1);
   }, [activeTab, sort]);

   React.useEffect(() => {
      setVisibleCount(isMobile ? MOBILE_VISIBLE_COUNT : sortedModels.length);
   }, [isMobile, activeTab, sortedModels.length]);

   const handleTabChange = (tabId: RatingTabId) => {
      setActiveTab(tabId);
      setCurrentPage(1);
   };

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
   };

   const handleResizeStart = (
      event: React.PointerEvent<HTMLButtonElement>,
      columnIndex: number
   ) => {
      event.preventDefault();
      event.stopPropagation();

      const tableWidth = bodyScrollRef.current?.clientWidth;

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

   const tableStyle = {
      "--column-1": `${columnWidths[0]}%`,
      "--column-2": `${columnWidths[1]}%`,
      "--column-3": `${columnWidths[2]}%`,
      "--column-4": `${columnWidths[3]}%`,
      "--column-5": `${columnWidths[4]}%`,
      "--column-6": `${columnWidths[5]}%`,
      "--column-7": `${columnWidths[6]}%`,
      "--scrollbar-width": `${scrollbarWidth}px`,
   } as React.CSSProperties;

   const totalPages = Math.max(1, Math.ceil(sortedModels.length / PAGE_SIZE));

   const visibleModels = isMobile
      ? sortedModels.slice(0, visibleCount)
      : sortedModels.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

   const hasMore = isMobile && visibleCount < sortedModels.length;

   const handleShowMore = () => {
      setVisibleCount((current) => Math.min(current + MOBILE_VISIBLE_STEP, sortedModels.length));
   };

   return (
      <section className={clsx(css.rating_table, className)}>
         <h3 className={css.rating_table_title}>{t.rating.title}</h3>

         <div className={css.rating_table_tabs}>
            {ratingTabs.map((tab) => {
               const isActive = activeTab === tab.id;

               return (
                  <button
                     key={tab.id}
                     type="button"
                     className={clsx(css.rating_table_tab, isActive && css.rating_table_tab_active)}
                     onClick={() => handleTabChange(tab.id)}
                  >
                     <Image.Default
                        className={clsx(
                           css.rating_table_tab_icon,
                           isActive && css.rating_table_tab_icon_active
                        )}
                        src={tab.icon}
                     />

                     <span>
                        {t.rating.tabs[tab.translationKey]} ({tab.count})
                     </span>
                  </button>
               );
            })}
         </div>

         <div className={css.table_scroll}>
            <div ref={tableRef} className={css.table} style={tableStyle}>
               <div className={css.table_header_wrapper}>
                  <div className={css.table_header}>
                     <HeaderCell
                        columnIndex={0}
                        resizeLabel={t.rating.table.resizeColumn}
                        onResizeStart={handleResizeStart}
                     >
                        {t.rating.table.rating}
                     </HeaderCell>

                     <HeaderCell
                        columnIndex={1}
                        resizeLabel={t.rating.table.resizeColumn}
                        onResizeStart={handleResizeStart}
                     >
                        {t.rating.table.modelName}
                     </HeaderCell>

                     <HeaderCell
                        columnIndex={2}
                        sortKey="tts"
                        sort={sort}
                        sortLabel={t.rating.table.sortTts}
                        resizeLabel={t.rating.table.resizeColumn}
                        onSort={handleSort}
                        onResizeStart={handleResizeStart}
                     >
                        {t.rating.table.tts}{" "}
                        <button type="button" className={css.use_info}>
                           <Image.Default src="/icons/rating/use-info.svg" />
                        </button>
                     </HeaderCell>

                     <HeaderCell
                        columnIndex={3}
                        resizeLabel={t.rating.table.resizeColumn}
                        onResizeStart={handleResizeStart}
                     >
                        {t.rating.table.speed}{" "}
                        <button type="button" className={css.use_info}>
                           <Image.Default src="/icons/rating/use-info.svg" />
                        </button>
                     </HeaderCell>

                     <HeaderCell
                        columnIndex={4}
                        resizeLabel={t.rating.table.resizeColumn}
                        onResizeStart={handleResizeStart}
                     >
                        {t.rating.table.latency}{" "}
                        <button type="button" className={css.use_info}>
                           <Image.Default src="/icons/rating/use-info.svg" />
                        </button>
                     </HeaderCell>

                     <HeaderCell
                        columnIndex={5}
                        resizeLabel={t.rating.table.resizeColumn}
                        onResizeStart={handleResizeStart}
                     >
                        {t.rating.table.pricePerMillion}
                     </HeaderCell>

                     <HeaderCell>{t.rating.table.license}</HeaderCell>
                  </div>
               </div>

               <div ref={bodyScrollRef} className={css.table_body_scroll}>
                  <div className={css.table_body}>
                     {visibleModels.map((model: RatingModel) => (
                        <RatingRow key={model.id} model={model} />
                     ))}
                  </div>

                  {hasMore && (
                     <button type="button" className={css.show_more} onClick={handleShowMore}>
                        <DropdownArrowIcon className={css.show_more_icon} />
                        Показать ещё
                     </button>
                  )}
               </div>
            </div>
         </div>

         <Pagination
            className={css.rating_table_pagination}
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
         />
      </section>
   );
};

interface HeaderCellProps {
   children: React.ReactNode;
   columnIndex?: number;
   sortKey?: SortKey;
   sort?: SortState;
   sortLabel?: string;
   resizeLabel?: string;
   onSort?: (key: SortKey) => void;
   onResizeStart?: (event: React.PointerEvent<HTMLButtonElement>, columnIndex: number) => void;
}

const HeaderCell: React.FC<HeaderCellProps> = ({
   children,
   columnIndex,
   sortKey,
   sort,
   sortLabel,
   resizeLabel,
   onSort,
   onResizeStart,
}) => {
   const isActiveSort = sortKey !== undefined && sort?.key === sortKey;

   return (
      <div className={css.table_header_cell}>
         <div className={css.table_header_content}>
            {sortKey && onSort && (
               <button
                  type="button"
                  className={css.table_sort}
                  aria-label={sortLabel}
                  aria-pressed={isActiveSort}
                  onClick={() => onSort(sortKey)}
               >
                  <SortIcon
                     className={css.table_sort_icon}
                     data-active={isActiveSort}
                     data-direction={isActiveSort ? sort?.direction : undefined}
                  />
               </button>
            )}

            <span>{children}</span>
         </div>

         {columnIndex !== undefined && onResizeStart && (
            <button
               type="button"
               className={css.table_resize}
               aria-label={resizeLabel}
               onPointerDown={(event) => onResizeStart(event, columnIndex)}
            >
               <span />
            </button>
         )}
      </div>
   );
};
