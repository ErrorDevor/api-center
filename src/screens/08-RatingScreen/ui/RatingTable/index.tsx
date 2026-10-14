"use client";

import React from "react";

import clsx from "clsx";

import { useIsMobile } from "shared/lib/hooks/useIsMobile";
import { useTranslation } from "shared/lib/i18n";
import { RANKING_CATEGORIES } from "shared/lib/rankings/categories";
import type { RankingCategory } from "shared/lib/rankings/categories";
import type { RankingEntry } from "shared/lib/rankings/types";
import { useRankings } from "shared/lib/rankings/useRankings";
import { Pagination } from "shared/ui/components/Pagination";
import { DropdownArrowIcon, SortIcon } from "shared/ui/icons";

import { RatingRow } from "../RatingRow";

import css from "./RatingTable.module.scss";

// Column widths are percentages of the table width. Rank / model / license
// are fixed; the category's metric columns split what's left evenly. The
// resulting llm layout ([8, 20, 9×7, 9]) matches the original hand-tuned
// one.
const RANK_WIDTH = 8;
const MODEL_WIDTH = 20;
const LICENSE_WIDTH = 9;

const buildColumnWidths = (metricCount: number): number[] => {
   const remaining = 100 - RANK_WIDTH - MODEL_WIDTH - LICENSE_WIDTH;
   const metricWidth = remaining / Math.max(metricCount, 1);

   return [
      RANK_WIDTH,
      MODEL_WIDTH,
      ...Array<number>(metricCount).fill(metricWidth),
      LICENSE_WIDTH,
   ];
};

const buildMinColumnWidths = (metricCount: number): number[] => [
   6,
   14,
   ...Array<number>(metricCount).fill(6),
   6,
];

const MOBILE_VISIBLE_COUNT = 3;
const MOBILE_VISIBLE_STEP = 3;

const PAGE_SIZE = 10;

type SortKey = "rank";
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

   const [activeCategoryId, setActiveCategoryId] = React.useState(
      RANKING_CATEGORIES[0].id
   );

   const category: RankingCategory =
      RANKING_CATEGORIES.find((item) => item.id === activeCategoryId) ??
      RANKING_CATEGORIES[0];

   const { columns } = category;
   const metricCount = columns.length;
   // rank + model + metrics + license
   const columnCount = metricCount + 3;

   const { entries, isLoading } = useRankings(category);

   const tableRef = React.useRef<HTMLDivElement>(null);
   const bodyScrollRef = React.useRef<HTMLDivElement>(null);

   const rankedEntries = React.useMemo(
      () =>
         entries.filter(
            (entry): entry is RankingEntry & { rank: number } => entry.rank !== null
         ),
      [entries]
   );

   const [columnWidths, setColumnWidths] = React.useState(() =>
      buildColumnWidths(metricCount)
   );
   const [scrollbarWidth, setScrollbarWidth] = React.useState(0);

   const [sort, setSort] = React.useState<SortState>({
      key: "rank",
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

   // Reset the hand-resizable widths whenever the column set changes.
   React.useEffect(() => {
      setColumnWidths(buildColumnWidths(metricCount));
   }, [metricCount]);

   const sortedEntries = React.useMemo(() => {
      return [...rankedEntries].sort((firstEntry, secondEntry) => {
         const result = firstEntry.rank - secondEntry.rank;

         return sort.direction === "asc" ? result : -result;
      });
   }, [rankedEntries, sort]);

   React.useEffect(() => {
      setCurrentPage(1);
   }, [activeCategoryId, sort]);

   React.useEffect(() => {
      setVisibleCount(isMobile ? MOBILE_VISIBLE_COUNT : sortedEntries.length);
   }, [isMobile, activeCategoryId, sortedEntries.length]);

   const handleCategoryChange = (categoryId: RankingCategory["id"]) => {
      setActiveCategoryId(categoryId);
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

      const minWidths = buildMinColumnWidths(metricCount);

      const startX = event.clientX;
      const startCurrentWidth = columnWidths[columnIndex];
      const startNextWidth = columnWidths[columnIndex + 1];
      const columnsTotalWidth = startCurrentWidth + startNextWidth;

      const handlePointerMove = (pointerEvent: PointerEvent) => {
         const deltaPixels = pointerEvent.clientX - startX;
         const deltaPercent = (deltaPixels / tableWidth) * 100;

         let currentWidth = startCurrentWidth + deltaPercent;
         let nextWidth = startNextWidth - deltaPercent;

         const currentMinWidth = minWidths[columnIndex];
         const nextMinWidth = minWidths[columnIndex + 1];

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

   const tableMinWidthRem = Math.min(120, Math.max(72, columnCount * 12));

   const tableStyle = {
      "--grid-columns": columnWidths.map((width) => `${width}%`).join(" "),
      "--table-min-width": `${tableMinWidthRem}rem`,
      "--scrollbar-width": `${scrollbarWidth}px`,
   } as React.CSSProperties;

   const totalPages = Math.max(1, Math.ceil(sortedEntries.length / PAGE_SIZE));

   const visibleEntries = isMobile
      ? sortedEntries.slice(0, visibleCount)
      : sortedEntries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

   const hasMore = isMobile && visibleCount < sortedEntries.length;

   const handleShowMore = () => {
      setVisibleCount((current) =>
         Math.min(current + MOBILE_VISIBLE_STEP, sortedEntries.length)
      );
   };

   return (
      <section className={clsx(css.rating_table, className)}>
         <h3 className={css.rating_table_title}>{t.rating.title}</h3>

         <div className={css.rating_table_tabs}>
            {RANKING_CATEGORIES.map((rankingCategory) => {
               const isActive = activeCategoryId === rankingCategory.id;

               return (
                  <button
                     key={rankingCategory.id}
                     type="button"
                     className={clsx(css.rating_table_tab, isActive && css.rating_table_tab_active)}
                     onClick={() => handleCategoryChange(rankingCategory.id)}
                  >
                     <span
                        className={css.rating_table_tab_icon}
                        style={
                           { "--tab-icon": `url(${rankingCategory.icon})` } as React.CSSProperties
                        }
                     />

                     <span>{t.rating.categoryTabs[rankingCategory.labelKey]}</span>
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
                        sortKey="rank"
                        sort={sort}
                        sortLabel={t.rating.table.sortRating}
                        resizeLabel={t.rating.table.resizeColumn}
                        onSort={handleSort}
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

                     {columns.map((column, index) => (
                        <HeaderCell
                           key={column.key}
                           columnIndex={index + 2}
                           resizeLabel={t.rating.table.resizeColumn}
                           onResizeStart={handleResizeStart}
                        >
                           {t.rating.table[column.labelKey]}
                        </HeaderCell>
                     ))}

                     <HeaderCell>{t.rating.table.license}</HeaderCell>
                  </div>
               </div>

               <div ref={bodyScrollRef} className={css.table_body_scroll}>
                  <div className={css.table_body}>
                     {isLoading && sortedEntries.length === 0 ? (
                        <div className={css.table_status}>{t.rating.table.loading}</div>
                     ) : sortedEntries.length === 0 ? (
                        <div className={css.table_status}>{t.rating.table.emptyState}</div>
                     ) : (
                        visibleEntries.map((entry) => (
                           <RatingRow key={entry.rank} entry={entry} columns={columns} />
                        ))
                     )}
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
