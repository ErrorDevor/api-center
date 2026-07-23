import React from "react";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";

import css from "./Pagination.module.scss";

interface Prop {
   currentPage: number;
   totalPages: number;
   onChange: (page: number) => void;
}

export const Pagination: React.FC<Prop> = ({ currentPage, totalPages, onChange }) => {
   const handlePrevious = () => {
      onChange(Math.max(1, currentPage - 1));
   };

   const handleNext = () => {
      onChange(Math.min(totalPages, currentPage + 1));
   };

   const { t } = useTranslation();

   return (
      <div className={css.pagination}>
         <button
            type="button"
            className={clsx(
               css.pagination_button,
               currentPage === 1 && css.pagination_button_disabled
            )}
            disabled={currentPage === 1}
            onClick={handlePrevious}
         >
            <ArrowIcon />
            {t.pagination.previous} 
         </button>

         <span className={css.pagination_info}>
            {t.pagination.page} <strong>{currentPage}</strong> {t.pagination.of}  <strong>{totalPages}</strong>
         </span>

         <button
            type="button"
            className={clsx(
               css.pagination_button,
               currentPage === totalPages && css.pagination_button_disabled
            )}
            disabled={currentPage === totalPages}
            onClick={handleNext}
         >
            {t.pagination.next} 
            <ArrowIcon right />
         </button>
      </div>
   );
};

interface ArrowIconProp {
   right?: boolean;
}

const ArrowIcon: React.FC<ArrowIconProp> = ({ right }) => {
   return (
      <svg
         className={clsx(right && css.pagination_arrow_right)}
         width="14"
         height="14"
         viewBox="0 0 14 14"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
      >
         <path
            d="M5.25 2.91663L8.75 6.99996L5.25 11.0833"
            stroke="#1E1E1E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
};
