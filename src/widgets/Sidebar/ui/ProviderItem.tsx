import React from "react";

import type { ProviderItem as ProviderItemType } from "../lib/sidebar.data";
import clsx from "clsx";

import Image from "shared/ui/base/Image";

import css from "../Sidebar.module.scss";

interface Props {
   provider: ProviderItemType;
   active: boolean;
   onClick: () => void;
}

export const ProviderItem: React.FC<Props> = ({ provider, active, onClick }) => {
   return (
      <button
         type="button"
         className={clsx(css.provider_item, active && css.provider_item_selected)}
         onClick={onClick}
      >
         <span className={css.provider_main}>
            <Image.Default src={provider.icon} className={css.provider_icon} />

            <span className={css.provider_name}>{provider.name}</span>

            <span className={css.provider_count}>{provider.count}</span>
         </span>
      </button>
   );
};
