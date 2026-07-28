"use client";

import React from "react";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { MacKeyIcon, SearchIcon } from "shared/ui/icons";

import css from "./Search.module.scss";

interface Prop extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
   className?: string;
   inputClassName?: string;
   withInfo?: boolean;
}

export const Search = React.forwardRef<HTMLInputElement, Prop>(
   (
      { className, inputClassName, placeholder, withInfo = true, type = "search", ...inputProps },
      ref
   ) => {
      const { t } = useTranslation();

      const resolvedPlaceholder = placeholder ?? t.header.searchPlaceholder;

      return (
         <div className={clsx(css.search, className)}>
            <SearchIcon />

            <input
               ref={ref}
               type={type}
               placeholder={resolvedPlaceholder}
               className={clsx(css.input, inputClassName)}
               {...inputProps}
            />

            {withInfo && (
               <div className={css.search_info} aria-hidden="true">
                  <MacKeyIcon /> + K
               </div>
            )}
         </div>
      );
   }
);

Search.displayName = "Search";
