"use client";

import React from "react";

import clsx from "clsx";
import type { ModelItem } from "screens/01-Content/lib/content.data";

import { useIsMobile } from "shared/lib/hooks/useIsMobile";
import { useTranslation } from "shared/lib/i18n";
import { Pagination } from "shared/ui/components/Pagination";
import { DropdownArrowIcon, SortIcon } from "shared/ui/icons";

import { ModelRow } from "../ModelRow";

import css from "./ModelsTable.module.scss";

const INITIAL_COLUMN_WIDTHS = [27, 30, 20, 13, 10];
const MIN_COLUMN_WIDTHS = [20, 22, 7, 9, 7];

const MOBILE_VISIBLE_COUNT = 3;
const MOBILE_VISIBLE_STEP = 3;

// Desktop pagination (the Pagination control is CSS-hidden on mobile,
// which keeps its own separate "show more" reveal below).
const PAGE_SIZE = 20;

type SortKey = "name" | "price" | "reviews";
type SortDirection = "asc" | "desc";

interface SortState {
   key: SortKey;
   direction: SortDirection;
}

interface Props {
   models: ModelItem[];
}

export const ModelsTable: React.FC<Props> = ({ models }) => {
   const { t } = useTranslation();

   const tableRef = React.useRef<HTMLDivElement>(null);
   const bodyScrollRef = React.useRef<HTMLDivElement>(null);

   const [columnWidths, setColumnWidths] = React.useState(INITIAL_COLUMN_WIDTHS);
   const [scrollbarWidth, setScrollbarWidth] = React.useState(0);
   const [sort, setSort] = React.useState<SortState>({
      key: "name",
      direction: "asc",
   });
   const [currentPage, setCurrentPage] = React.useState(1);

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
      return [...models].sort((firstModel, secondModel) => {
         let result = 0;

         switch (sort.key) {
            case "name":
               result = firstModel.name.localeCompare(secondModel.name);
               break;

            case "price":
               result = firstModel.inputPrice - secondModel.inputPrice;

               if (result === 0) {
                  result = firstModel.outputPrice - secondModel.outputPrice;
               }

               break;

            case "reviews":
               result = firstModel.reviews - secondModel.reviews;
               break;
         }

         return sort.direction === "asc" ? result : -result;
      });
   }, [models, sort]);

   // A new/re-sorted/re-filtered list makes the previous page number
   // meaningless (or out of range) — jump back to page 1.
   React.useEffect(() => {
      setCurrentPage(1);
   }, [models, sort]);

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
      "--scrollbar-width": `${scrollbarWidth}px`,
   } as React.CSSProperties;

   const isMobile = useIsMobile();

   const [visibleCount, setVisibleCount] = React.useState(MOBILE_VISIBLE_COUNT);

   React.useEffect(() => {
      setVisibleCount(isMobile ? MOBILE_VISIBLE_COUNT : sortedModels.length);
   }, [isMobile, sortedModels.length]);

   const totalPages = Math.max(1, Math.ceil(sortedModels.length / PAGE_SIZE));

   const visibleModels = isMobile
      ? sortedModels.slice(0, visibleCount)
      : sortedModels.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

   const hasMore = isMobile && visibleCount < sortedModels.length;

   const handleShowMore = () => {
      setVisibleCount((current) => Math.min(current + MOBILE_VISIBLE_STEP, sortedModels.length));
   };

   return (
      <>
         <div className={css.table_scroll}>
            <div ref={tableRef} className={css.table} style={tableStyle}>
               <div className={css.table_header_wrapper}>
                  <div className={css.table_header}>
                     <HeaderCell
                        columnIndex={0}
                        sortKey="name"
                        sort={sort}
                        sortLabel={t.content.table.modelName}
                        resizeLabel={t.content.table.resizeColumn}
                        onSort={handleSort}
                        onResizeStart={handleResizeStart}
                     >
                        {t.content.table.modelName}
                     </HeaderCell>

                     <HeaderCell
                        columnIndex={1}
                        sortKey="price"
                        sort={sort}
                        sortLabel={t.content.table.price}
                        resizeLabel={t.content.table.resizeColumn}
                        onSort={handleSort}
                        onResizeStart={handleResizeStart}
                     >
                        {t.content.table.price}
                     </HeaderCell>

                     <HeaderCell
                        columnIndex={2}
                        resizeLabel={t.content.table.resizeColumn}
                        onResizeStart={handleResizeStart}
                     >
                        {t.content.table.tags}
                     </HeaderCell>

                     <HeaderCell
                        columnIndex={3}
                        resizeLabel={t.content.table.resizeColumn}
                        onResizeStart={handleResizeStart}
                     >
                        {t.content.table.provider}
                     </HeaderCell>

                     <HeaderCell
                        sortKey="reviews"
                        sort={sort}
                        sortLabel={t.content.table.reviews}
                        onSort={handleSort}
                     >
                        {t.content.table.reviews}
                     </HeaderCell>
                  </div>
               </div>

               <div ref={bodyScrollRef} className={css.table_body_scroll}>
                  <div className={css.table_body}>
                     {visibleModels.length === 0 ? (
                        <div className={css.empty_state}>{t.content.table.emptyState}</div>
                     ) : (
                        visibleModels.map((model: ModelItem) => (
                           <ModelRow key={model.id} model={model} />
                        ))
                     )}
                  </div>

                  {hasMore && (
                     <button type="button" className={css.show_more} onClick={handleShowMore}>
                        <DropdownArrowIcon className={css.show_more_icon} />
                        {t.sidebar.showMore}
                     </button>
                  )}
               </div>
            </div>
         </div>

         <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      </>
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
