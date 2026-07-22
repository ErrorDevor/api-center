import React from "react";

import clsx from "clsx";

import { FilterIcon, PlusIcon, TableIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./ContentActions.module.scss";

interface Prop {
   className?: string;
   variant?: "api" | "group";
}

export const ContentActions: React.FC<Prop> = ({ className, variant = "api" }) => {
   return (
      <div className={clsx(css.content_actions, className)}>
         <Button variant="grey" className={css.content_action_button}>
            <FilterIcon />
            Filter
         </Button>

         <Button variant="grey" className={css.content_action_button}>
            <TableIcon />
            Table View
         </Button>

         {variant !== "api" && (
            <Button variant="black" className={css.content_action_button}>
               <PlusIcon />
               Create
            </Button>
         )}
      </div>
   );
};
