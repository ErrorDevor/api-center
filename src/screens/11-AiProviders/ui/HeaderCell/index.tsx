"use client";

import React from "react";

import { SortKey, SortState } from "screens/11-AiProviders/lib/types";

import { SortIcon } from "shared/ui/icons";

import css from "./HeaderCell.module.scss";

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

export const HeaderCell: React.FC<HeaderCellProps> = ({
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
