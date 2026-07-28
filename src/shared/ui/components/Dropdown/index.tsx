"use client";

import React from "react";

import clsx from "clsx";

import { DropdownArrowIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { useClickOutside } from "shared/utils/hooks/useClickOutside";

import css from "./Dropdown.module.scss";

export interface DropdownItem<T = string> {
   value: T;
   label: string;
}

interface Props<T = string> {
   className?: string;
   items: DropdownItem<T>[];
   value: T;
   onChange: (value: T) => void;
   ariaLabel?: string;
}

export const Dropdown = <T extends string>({
   className,
   items,
   value,
   onChange,
   ariaLabel,
}: Props<T>) => {
   const [isOpen, setIsOpen] = React.useState(false);
   const rootRef = useClickOutside<HTMLDivElement>(() => {
      setIsOpen(false);
   });
   const currentItem = items.find((item) => item.value === value) ?? items[0];

   return (
      <div ref={rootRef} className={clsx(css.dropdown, className)}>
         <Button
            variant="grey"
            className={clsx(css.dropdown_button, isOpen && css.dropdown_button_opened)}
            classNameContent={css.dropdown_button_content}
            aria-label={ariaLabel}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            onClick={() => setIsOpen((current) => !current)}
         >
            {currentItem.label}

            <DropdownArrowIcon />
         </Button>

         {isOpen && (
            <div className={css.dropdown_list} role="listbox" aria-label={ariaLabel}>
               {items.map((item) => {
                  const isActive = item.value === value;

                  return (
                     <button
                        key={String(item.value)}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={clsx(
                           css.dropdown_option,
                           isActive && css.dropdown_option_active
                        )}
                        onClick={() => {
                           onChange(item.value);
                           setIsOpen(false);
                        }}
                     >
                        <span>{item.label}</span>
                     </button>
                  );
               })}
            </div>
         )}
      </div>
   );
};
