import React from "react";

import { FilterIcon, TableIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./ContentActions.module.scss";

export const ContentActions: React.FC = () => {
   return (
      <div className={css.content_actions}>
         <Button variant="grey" className={css.content_action_button}>
            <FilterIcon />
            Filter
         </Button>

         <Button variant="grey" className={css.content_action_button}>
            <TableIcon />
            Table View
         </Button>
      </div>
   );
};
