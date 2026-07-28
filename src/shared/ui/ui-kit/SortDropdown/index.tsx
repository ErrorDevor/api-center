"use client";

import React from "react";

import { clsx } from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { Modal } from "shared/ui/base/Modal";
import { Sort2Icon } from "shared/ui/icons";

import { Button } from "../Button";
import { Checkbox } from "../Checkbox";

import css from "./SortDropdown.module.scss";

type SortValue = "newest" | "popular" | "positive" | "negative";

interface Prop {
   className?: string;
   name: string;
}

export const SortDropdown: React.FC<Prop> = ({ className, name }) => {
   const buttonRef = React.useRef<HTMLButtonElement>(null);

   const [isOpen, setIsOpen] = React.useState(false);
   const [sort, setSort] = React.useState<SortValue>("newest");

   const { t } = useTranslation();

   const options: Array<{
      value: SortValue;
      label: string;
   }> = [
      {
         value: "newest",
         label: t.sortDropdown.newest,
      },
      {
         value: "popular",
         label: t.sortDropdown.popular,
      },
      {
         value: "positive",
         label: t.sortDropdown.positive,
      },
      {
         value: "negative",
         label: t.sortDropdown.negative,
      },
   ];

   const handleSelect = (value: SortValue) => {
      setSort(value);
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
               {options.map((option) => (
                  <li key={option.value} className={css.sort_list_item} role="none">
                     <Checkbox
                        variant="radio"
                        name="sort"
                        value={option.value}
                        checked={sort === option.value}
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
