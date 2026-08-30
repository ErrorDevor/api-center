import React from "react";

import type { ProviderItem as ProviderItemType, ProviderModel } from "../lib/sidebar.types";
import clsx from "clsx";

import Accordion from "shared/ui/base/Accordion";
import Image from "shared/ui/base/Image";
import { DropdownArrowIcon } from "shared/ui/icons";

import { ProviderModelItem } from "./ProviderModelItem";

import css from "../Sidebar.module.scss";

interface Props {
   provider: ProviderItemType;
   activeProviderId?: string;
   activeModelId?: string;
   initialOpen?: boolean;
   onProviderClick: (providerId: string) => void;
   onModelClick: (provider: ProviderItemType, model: ProviderModel) => void;
}

export const ProviderAccordion: React.FC<Props> = ({
   provider,
   activeProviderId,
   activeModelId,
   initialOpen = false,
   onProviderClick,
   onModelClick,
}) => {
   return (
      <Accordion smooth initialOpen={initialOpen}>
         {({ active }) => (
            <div className={css.provider_accordion}>
               <Accordion.Button>
                  <button
                     type="button"
                     className={clsx(
                        css.provider_item,
                        active && css.provider_item_active,
                        activeProviderId === provider.id && css.provider_item_selected
                     )}
                     // onClick={() => onProviderClick(provider.id)}
                  >
                     <span className={css.provider_main}>
                        <Image.Default src={provider.icon} className={css.provider_icon} />

                        <span className={css.provider_name}>{provider.name}</span>

                        <span className={css.provider_count}>{provider.count}</span>
                     </span>

                     <DropdownArrowIcon
                        className={clsx(css.provider_arrow, active && css.provider_arrow_opened)}
                     />
                  </button>
               </Accordion.Button>

               <Accordion.Content>
                  <div className={css.models}>
                     {provider.models?.map((model) => (
                        <ProviderModelItem
                           key={model.id}
                           model={model}
                           active={activeModelId === model.id}
                           onClick={() => onModelClick(provider, model)}
                        />
                     ))}
                  </div>
               </Accordion.Content>
            </div>
         )}
      </Accordion>
   );
};
