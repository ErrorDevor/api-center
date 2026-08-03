import React from "react";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import {  PlusIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { FilterDropdown } from "shared/ui/ui-kit/FilterDropdown";
import { SortDropdown } from "shared/ui/ui-kit/SortDropdown";

import css from "./ContentActions.module.scss";

interface Prop {
   className?: string;
   variant?: "api" | "group";
}

export const ContentActions: React.FC<Prop> = ({ className, variant = "api" }) => {
   const { t } = useTranslation();

   return (
      <div className={clsx(css.content_actions, className)}>
         <FilterDropdown name={t.common.filter} variant={variant} />

         <SortDropdown name={t.content.actions.tableView} />

         {variant !== "api" && (
            <Button variant="black" className={clsx(css.content_action_button, css.create_button)}>
               <PlusIcon />
               {t.common.newPost}
            </Button>
         )}
      </div>
   );
};
