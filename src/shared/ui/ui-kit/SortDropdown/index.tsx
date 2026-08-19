"use client";

import React from "react";

import { clsx } from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { Modal } from "shared/ui/base/Modal";
import { Sort2Icon } from "shared/ui/icons";

import { Button } from "../Button";
import { Checkbox } from "../Checkbox";

import css from "./SortDropdown.module.scss";

export type SortValue = "newest" | "popular" | "positive" | "negative";

export interface SortDropdownOption<T extends string> {
   value: T;
   label: string;
}

interface Prop<T extends string> {
   className?: string;
   name: string;
   // Uncontrolled + the 4 default options when omitted (today's behavior,
   // used by ContentActions). Pass all three to drive a different option
   // set from outside — see Comments' sort/sentiment controls.
   options?: SortDropdownOption<T>[];
   value?: T;
   onChange?: (value: T) => void;
}

export const SortDropdown = <T extends string = SortValue>({
   className,
   name,
   options,
   value,
   onChange,
}: Prop<T>) => {
   const buttonRef = React.useRef<HTMLButtonElement>(null);

   const [isOpen, setIsOpen] = React.useState(false);

   const { t } = useTranslation();

   const defaultOptions: SortDropdownOption<T>[] = [
      { value: "newest" as T, label: t.sortDropdown.newest },
      { value: "popular" as T, label: t.sortDropdown.popular },
      { value: "positive" as T, label: t.sortDropdown.positive },
      { value: "negative" as T, label: t.sortDropdown.negative },
   ];

   const resolvedOptions = options ?? defaultOptions;

   const [internalSort, setInternalSort] = React.useState<T>(
      (resolvedOptions[0]?.value ?? "newest") as T
   );

   const currentValue = value ?? internalSort;

   const handleSelect = (nextValue: T) => {
      if (onChange) {
         onChange(nextValue);
      } else {
         setInternalSort(nextValue);
      }

      setIsOpen(false);
   };

   return (
      <>
         <Button
            ref={buttonRef}
            type="button"
            variant="grey"
            className={clsx(css.sort_button, className)}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
         >
            <Sort2Icon />
            {name}
         </Button>

         <Modal
            isOpen={isOpen}
            variant="dropdown"
            anchorRef={buttonRef}
            placement="bottom-end"
            gap={8}
            contentClassName={css.sort_dropdown}
            ariaLabel={name}
            onClose={() => setIsOpen(false)}
         >
            <ul className={css.sort_list} role="menu">
               {resolvedOptions.map((option) => (
                  <li key={option.value} className={css.sort_list_item} role="none">
                     <Checkbox
                        variant="radio"
                        name="sort"
                        value={option.value}
                        checked={currentValue === option.value}
                        label={option.label}
                        className={css.sort_option}
                        onChange={() => handleSelect(option.value)}
                     />
                  </li>
               ))}
            </ul>
         </Modal>
      </>
   );
};
