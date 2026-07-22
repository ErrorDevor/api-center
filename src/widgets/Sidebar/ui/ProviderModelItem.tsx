import React from "react";

import type { ProviderModel } from "../lib/sidebar.data";
import clsx from "clsx";

import Image from "shared/ui/base/Image";
import { DropdownArrowIcon } from "shared/ui/icons";

import css from "../Sidebar.module.scss";

interface Props {
   model: ProviderModel;
   active: boolean;
   onClick: () => void;
}

export const ProviderModelItem: React.FC<Props> = ({ model, active, onClick }) => {
   return (
      <button
         type="button"
         className={clsx(css.model_item, active && css.model_item_active)}
         onClick={onClick}
      >
         <span className={css.model_content}>
            <span className={css.model_name}>{model.name}</span>

            <span className={css.model_count}>({model.count})</span>
         </span>

         {model.badge === "new" && (
            <span className={clsx(css.model_badge, css.model_badge_new)}>New</span>
         )}

         {model.badge === "top" && (
            <span className={clsx(css.model_badge, css.model_badge_top)}>
               <span>Top</span>

               <Image.Default src="/icons/fire.svg" className={css.model_badge_icon} />
            </span>
         )}

         {active && <DropdownArrowIcon className={css.model_arrow} />}
      </button>
   );
};
