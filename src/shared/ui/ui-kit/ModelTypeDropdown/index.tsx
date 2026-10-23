"use client";

import React from "react";

import { clsx } from "clsx";

import { Modal } from "shared/ui/base/Modal";
import { FilterIcon } from "shared/ui/icons";

import { Button } from "../Button";
import { Checkbox } from "../Checkbox";

import css from "./ModelTypeDropdown.module.scss";

export interface ModelTypeDropdownOption {
   value: string;
   label: string;
   count: number;
}

interface Prop {
   className?: string;
   name: string;
   options: ModelTypeDropdownOption[];
   // The option's `value` that is currently applied.
   value: string;
   onChange: (value: string) => void;
}

// Same button + dropdown shape as SortDropdown / the group-buys
// FilterDropdown, single-select like the Sidebar's "Model Type" list it
// mirrors (both drive the same `?type=` param).
export const ModelTypeDropdown: React.FC<Prop> = ({
   className,
   name,
   options,
   value,
   onChange,
}) => {
   const buttonRef = React.useRef<HTMLButtonElement>(null);
   const [isOpen, setIsOpen] = React.useState(false);

   const handleSelect = (nextValue: string) => {
      onChange(nextValue);
      setIsOpen(false);
   };

   return (
      <>
         <Button
            ref={buttonRef}
            type="button"
            variant="grey"
            className={clsx(css.type_button, className)}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
         >
            <FilterIcon />
            {name}
         </Button>

         <Modal
            isOpen={isOpen}
            variant="dropdown"
            mobileVariant="bottom-sheet"
            anchorRef={buttonRef}
            placement="bottom-end"
            gap={8}
            contentClassName={css.type_dropdown}
            ariaLabel={name}
            onClose={() => setIsOpen(false)}
         >
            <ul className={css.type_list} role="menu">
               {options.map((option) => (
                  <li key={option.value} className={css.type_list_item} role="none">
                     <Checkbox
                        variant="radio"
                        name="model-type"
                        value={option.value}
                        checked={value === option.value}
                        label={
                           <span className={css.type_label}>
                              {option.label}

                              <span className={css.type_count}>{option.count}</span>
                           </span>
                        }
                        className={css.type_option}
                        onChange={() => handleSelect(option.value)}
                     />
                  </li>
               ))}
            </ul>
         </Modal>
      </>
   );
};
