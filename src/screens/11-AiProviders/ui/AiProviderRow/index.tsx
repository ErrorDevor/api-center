"use client";

import React from "react";

import clsx from "clsx";
import { Provider } from "screens/11-AiProviders/lib/data";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";

import css from "./AiProviderRow.module.scss";

interface AiProviderRowProps {
   provider: Provider;
   selected?: boolean;
   workingLabel: string;
   notWorkingLabel: string;
   verifiedLabel: string;
   onSelect?: (vendorId: string | undefined) => void;
}

export const AiProviderRow: React.FC<AiProviderRowProps> = ({
   provider,
   selected,
   workingLabel,
   notWorkingLabel,
   verifiedLabel,
   onSelect,
}) => {
   const { t } = useTranslation();

   const visibleModels = provider.models.slice(0, 5);
   const hiddenModelsCount = Math.max(0, provider.models.length - visibleModels.length);

   const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onSelect) {
         return;
      }

      if (event.key === "Enter" || event.key === " ") {
         event.preventDefault();
         onSelect(provider.id);
      }
   };

   return (
      <div
         className={clsx(css.provider_row, selected && css.provider_row_selected)}
         role={onSelect ? "button" : undefined}
         tabIndex={onSelect ? 0 : undefined}
         onClick={() => onSelect?.(provider.id)}
         onKeyDown={handleKeyDown}
      >
         <div className={css.provider_cell}>
            <span className={css.mobile_label}>{t.aiProviders.name}</span>

            <span className={css.mobile_dots} />

            <div className={css.provider_info}>
               <div className={css.provider_info_heading}>
                  {provider.verified && (
                     <Image.Default src="/icons/verify-green.svg" alt={verifiedLabel} />
                  )}

                  <span className={css.provider_name}>{provider.name}</span>

                  <span className={css.provider_age}>{provider.age}</span>
               </div>

               <p className={css.provider_description}>{provider.description}</p>
            </div>
         </div>

         <div className={css.provider_age_mobile}>
            <span className={css.mobile_label}>{t.aiProviders.age}</span>

            <span className={css.mobile_dots} />

            <span className={css.provider_age_mobile_value}>{provider.age}</span>
         </div>

         <div className={css.provider_cell}>
            <span className={css.mobile_label}>{t.aiProviders.models}</span>

            <span className={css.mobile_dots} />

            {provider.models.length > 0 && (
               <div className={css.provider_models}>
                  {visibleModels.map((model) => (
                     <div key={model.id} className={css.provider_model_icon}>
                        <Image.Default src={model.icon} alt={model.name} title={model.name} />
                     </div>
                  ))}

                  {hiddenModelsCount > 0 && (
                     <span className={css.provider_models_more}>+{hiddenModelsCount}</span>
                  )}
               </div>
            )}
         </div>

         <div className={css.provider_cell}>
            <span className={css.mobile_label}>{t.aiProviders.paymentMethod}</span>

            <span className={css.mobile_dots} />

            <span className={css.provider_payment}>{provider.paymentMethods.join(", ")}</span>
         </div>

         <div className={css.provider_cell}>
            <span className={css.mobile_label}>{t.aiProviders.status}</span>

            <span className={css.mobile_dots} />

            <span
               className={clsx(
                  css.provider_status,
                  provider.status === "working"
                     ? css.provider_status_working
                     : css.provider_status_not_working
               )}
            >
               {provider.status === "working" ? workingLabel : notWorkingLabel}
            </span>
         </div>

         <div className={css.provider_cell}>
            <span className={css.mobile_label}>{t.aiProviders.reviews}</span>

            <span className={css.mobile_dots} />

            <a
               className={css.reviews}
               onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
               }}
            >
               <span>123</span>

               <div className={css.reports}>
                  <div className={css.reports_inner}>12</div>
               </div>
            </a>
         </div>
      </div>
   );
};
