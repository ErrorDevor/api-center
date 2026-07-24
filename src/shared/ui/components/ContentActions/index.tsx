import React from "react";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { FilterIcon, PlusIcon, Sort2Icon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./ContentActions.module.scss";

interface Prop {
   className?: string;
   variant?: "api" | "group";
}

export const ContentActions: React.FC<Prop> = ({ className, variant = "api" }) => {
   const { t } = useTranslation();

   return (
      <div className={clsx(css.content_actions, className)}>
         <Button variant="grey" className={css.content_action_button}>
            <FilterIcon />
            {t.common.filter}
         </Button>

         <Button variant="grey" className={css.content_action_button}>
            <Sort2Icon />
            {t.content.actions.tableView}
         </Button>

         {variant !== "api" && (
            <Button variant="black" className={clsx(css.content_action_button, css.create_button)}>
               <PlusIcon />
               {t.common.create}
            </Button>
         )}
      </div>
   );
};
