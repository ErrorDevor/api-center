import React from "react";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { PlusIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { FilterDropdown, type FilterDropdownConfig } from "shared/ui/ui-kit/FilterDropdown";
import {
   SortDropdown,
   type SortDropdownOption,
   type SortValue,
} from "shared/ui/ui-kit/SortDropdown";

import css from "./ContentActions.module.scss";

interface Prop<T extends string = SortValue> {
   className?: string;
   variant?: "api" | "group" | "group-buys" | "forum";
   // Omit all three to get SortDropdown's own uncontrolled default options
   // (today's behavior everywhere except Content — see ContentActions'
   // GroupBuys/Reviews callers). Pass all three to drive a real sort from
   // the caller, same convention SortDropdown itself uses.
   sortOptions?: SortDropdownOption<T>[];
   sortValue?: T;
   onSortChange?: (value: T) => void;
   // Wires up the variant's own create button ("New topic" for "group",
   // "Create" for "forum"). Left undefined everywhere it isn't backed by a
   // real action yet, in which case the button stays inert as before.
   onCreate?: () => void;
   // The catalog's real filter ("api" variant). Omit to hide it.
   filter?: FilterDropdownConfig;
}

export const ContentActions = <T extends string = SortValue>({
   className,
   variant = "api",
   sortOptions,
   sortValue,
   onSortChange,
   onCreate,
   filter,
}: Prop<T>) => {
   const { t } = useTranslation();

   return (
      <div className={clsx(css.content_actions, className)}>
         {/* A real filter when the page supplies one; group-buys otherwise
             keeps its visual-only one. */}
         {(filter || variant === "group-buys") && (
            <FilterDropdown name={t.common.filter} variant={variant} config={filter} />
         )}

         <SortDropdown
            name={t.content.actions.tableView}
            options={sortOptions}
            value={sortValue}
            onChange={onSortChange}
         />

         {(variant === "group" || variant === "group-buys") && (
            <Button
               variant="grey"
               className={clsx(css.content_action_button, css.create_button)}
               onClick={onCreate}
            >
               <PlusIcon />
               {t.common.newPost}
            </Button>
         )}

         {variant === "forum" && (
            <Button
               variant="black"
               className={clsx(css.content_action_button, css.new_button)}
               onClick={onCreate}
            >
               <PlusIcon />
               {t.common.create}
            </Button>
         )}
      </div>
   );
};
