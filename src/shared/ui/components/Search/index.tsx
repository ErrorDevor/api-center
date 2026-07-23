"use client";

import React from "react";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { MacKeyIcon, SearchIcon } from "shared/ui/icons";

import css from "./Search.module.scss";

interface Prop {
   className?: string;
   placeholder?: string;
   withInfo?: boolean;
}

export const Search: React.FC<Prop> = ({ className, placeholder, withInfo = true }) => {
   const { t } = useTranslation();

   const resolvedPlaceholder = placeholder ?? t.header.searchPlaceholder;

   return (
      <div className={clsx(css.search, className)}>
         <SearchIcon />

         <input type="text" placeholder={resolvedPlaceholder} className={css.input} />

         {withInfo && (
            <div className={css.search_info}>
               <MacKeyIcon /> + K
            </div>
         )}
      </div>
   );
};
