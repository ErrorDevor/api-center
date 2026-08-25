import React from "react";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { PlusIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { FilterDropdown } from "shared/ui/ui-kit/FilterDropdown";
import {
   SortDropdown,
   type SortDropdownOption,
   type SortValue,
} from "shared/ui/ui-kit/SortDropdown";

import css from "./ContentActions.module.scss";

interface Prop<T extends string = SortValue> {
   className?: string;
   variant?: "api" | "group";
   // Omit all three to get SortDropdown's own uncontrolled default options
   // (today's behavior everywhere except Content — see ContentActions'
   // GroupBuys/Reviews callers). Pass all three to drive a real sort from
   // the caller, same convention SortDropdown itself uses.
   sortOptions?: SortDropdownOption<T>[];
   sortValue?: T;
   onSortChange?: (value: T) => void;
}

export const ContentActions = <T extends string = SortValue>({
   className,
   variant = "api",
   sortOptions,
   sortValue,
   onSortChange,
}: Prop<T>) => {
   const { t } = useTranslation();

   return (
      <div className={clsx(css.content_actions, className)}>
         <FilterDropdown name={t.common.filter} variant={variant} />

         <SortDropdown
            name={t.content.actions.tableView}
            options={sortOptions}
            value={sortValue}
            onChange={onSortChange}
         />

         {variant !== "api" && (
            <Button variant="grey" className={clsx(css.content_action_button, css.create_button)}>
               <PlusIcon />
               {t.common.newPost}
            </Button>
         )}
      </div>
   );
};
