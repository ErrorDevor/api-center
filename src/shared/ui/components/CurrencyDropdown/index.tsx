"use client";

import React from "react";

import clsx from "clsx";

import { DropdownArrowIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { useClickOutside } from "shared/utils/hooks/useClickOutside";

import css from "./CurrencyDropdown.module.scss";

const currencyOptions = [
   {
      value: "usd",
      symbol: "$",
   },
   {
      value: "rub",
      symbol: "₽",
   },
   {
      value: "eur",
      symbol: "€",
   },
] as const;

type Currency = (typeof currencyOptions)[number]["value"];

interface Props {
   className?: string;
}

export const CurrencyDropdown: React.FC<Props> = ({ className }) => {
   const [isOpen, setIsOpen] = React.useState(false);
   const [currency, setCurrency] = React.useState<Currency>("usd");

   const rootRef = useClickOutside<HTMLDivElement>(() => {
      setIsOpen(false);
   });

   const currentCurrency =
      currencyOptions.find((option) => option.value === currency) ??
      currencyOptions[0];

   return (
      <div ref={rootRef} className={clsx(css.currency, className)}>
         <Button
            variant="grey"
            className={clsx(
               css.currency_button,
               isOpen && css.currency_button_opened
            )}
            aria-label="Currency"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            onClick={() => setIsOpen((current) => !current)}
         >
            {currentCurrency.symbol}

            <DropdownArrowIcon />
         </Button>

         {isOpen && (
            <div
               className={css.currency_dropdown}
               role="listbox"
               aria-label="Currency"
            >
               {currencyOptions.map((option) => {
                  const isActive = option.value === currency;

                  return (
                     <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={clsx(
                           css.currency_option,
                           isActive && css.currency_option_active
                        )}
                        onClick={() => {
                           setCurrency(option.value);
                           setIsOpen(false);
                        }}
                     >
                        <span>{option.symbol}</span>
                     </button>
                  );
               })}
            </div>
         )}
      </div>
   );
};