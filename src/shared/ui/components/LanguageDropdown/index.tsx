"use client";

import React from "react";

import clsx from "clsx";

import { localeOptions, useTranslation } from "shared/lib/i18n";
import { DropdownArrowIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { useClickOutside } from "shared/utils/hooks/useClickOutside";

import css from "./LanguageDropdown.module.scss";

interface Props {
   className?: string;
}

export const LanguageDropdown: React.FC<Props> = ({ className }) => {
   const [isOpen, setIsOpen] = React.useState(false);

   const { locale, setLocale, t } = useTranslation();

   const rootRef = useClickOutside<HTMLDivElement>(() => {
      setIsOpen(false);
   });

   const currentLanguage =
      localeOptions.find((option) => option.value === locale) ?? localeOptions[0];

   return (
      <div ref={rootRef} className={clsx(css.language, className)}>
         <Button
            variant="grey"
            className={clsx(css.language_button, isOpen && css.language_button_opened)}
            aria-label={t.header.language}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            onClick={() => setIsOpen((current) => !current)}
         >
            {currentLanguage.shortLabel}

            <DropdownArrowIcon />
         </Button>

         {isOpen && (
            <div className={css.language_dropdown} role="listbox" aria-label={t.header.language}>
               {localeOptions.map((option) => {
                  const isActive = option.value === locale;

                  return (
                     <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={clsx(
                           css.language_option,
                           isActive && css.language_option_active
                        )}
                        onClick={() => {
                           setLocale(option.value);
                           setIsOpen(false);
                        }}
                     >
                        <span>{option.shortLabel}</span>
                        {/* <span>{option.label}</span> */}
                     </button>
                  );
               })}
            </div>
         )}
      </div>
   );
};
