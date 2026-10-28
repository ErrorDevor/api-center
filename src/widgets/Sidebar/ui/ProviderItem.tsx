import React from "react";

import type { ProviderItem as ProviderItemType, ProviderModel } from "../lib/sidebar.types";
import clsx from "clsx";

import Image from "shared/ui/base/Image";
import { handlePlainClick } from "shared/lib/links/plainClick";
import { NextLink } from "shared/ui/base/NextLink";

import { getCatalogHref } from "../lib/catalog-href";

import css from "../Sidebar.module.scss";

interface Props {
   provider: ProviderItemType;
   active: boolean;
   onClick: () => void;
}

export const ProviderItem: React.FC<Props> = ({ provider, active, onClick }) => {
   return (
      <NextLink
         href={getCatalogHref(provider.id)}
         className={clsx(css.provider_item, active && css.provider_item_selected)}
         onClick={handlePlainClick(onClick)}
      >
         <span className={css.provider_main}>
            <Image.Default src={provider.icon} className={css.provider_icon} />

            <span className={css.provider_name}>{provider.name}</span>

            <span className={css.provider_count}>{provider.count}</span>
         </span>
      </NextLink>
   );
};
