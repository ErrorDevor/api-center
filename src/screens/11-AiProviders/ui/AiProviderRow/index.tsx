"use client";

import React from "react";

import { useRouter } from "next/navigation";

import clsx from "clsx";
import { Provider } from "screens/11-AiProviders/lib/data";

import { useTranslation } from "shared/lib/i18n";
import { daysToProviderAge, formatProviderAge } from "shared/lib/i18n/formatters";
import { useProviderCommentSummary } from "shared/lib/providerComments/useProviderCommentSummary";
import { useProviderDescriptions } from "shared/lib/providerDescriptions/useProviderDescriptions";
import Image from "shared/ui/base/Image";

import css from "./AiProviderRow.module.scss";

interface AiProviderRowProps {
   provider: Provider;
   workingLabel: string;
   notWorkingLabel: string;
   verifiedLabel: string;
}

export const AiProviderRow: React.FC<AiProviderRowProps> = ({
   provider,
   workingLabel,
   notWorkingLabel,
   verifiedLabel,
}) => {
   const { t, locale } = useTranslation();
   const router = useRouter();
   const { entries: providerDescriptions } = useProviderDescriptions();
   const { summary: commentSummary } = useProviderCommentSummary(provider.id);

   const reviewsHref = `/reviews?provider=${encodeURIComponent(provider.id)}`;
   const reviewsCount = commentSummary?.totalComments ?? provider.reviews.positive;
   const reportsCount = commentSummary?.negativeCount ?? provider.reviews.negative;

   const descriptionEntry = providerDescriptions.find(
      (entry) => entry.providerDomain === provider.id
   );
   const description = descriptionEntry
      ? locale === "ru"
         ? descriptionEntry.descriptionRu
         : descriptionEntry.descriptionEn
      : t.providers.items.generic.description.replace("{provider}", provider.name);

   const age =
      provider.domainAgeDays != null
         ? formatProviderAge(daysToProviderAge(provider.domainAgeDays), locale)
         : null;

   const uniqueIconModels = React.useMemo(() => {
      const seenIcons = new Set<string>();

      return provider.models.filter((model) => {
         if (!model.icon || seenIcons.has(model.icon)) {
            return false;
         }

         seenIcons.add(model.icon);

         return true;
      });
   }, [provider.models]);

   const visibleModels = uniqueIconModels.slice(0, 5);
   const hiddenModelsCount = Math.max(0, provider.models.length - visibleModels.length);

   const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
         event.preventDefault();
         router.push(reviewsHref);
      }
   };

   return (
      <div
         className={css.provider_row}
         role="button"
         tabIndex={0}
         onClick={() => router.push(reviewsHref)}
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

                  {age && <span className={css.provider_age}>{age}</span>}
               </div>

               <p className={css.provider_description}>{description}</p>
            </div>
         </div>

         {age && (
            <div className={css.provider_age_mobile}>
               <span className={css.mobile_label}>{t.aiProviders.age}</span>

               <span className={css.mobile_dots} />

               <span className={css.provider_age_mobile_value}>{age}</span>
            </div>
         )}

         <div className={css.provider_cell}>
            <span className={css.mobile_label}>{t.aiProviders.models}</span>

            <span className={css.mobile_dots} />

            {provider.models.length > 0 && (
               <div className={css.provider_models}>
                  {visibleModels.map(
                     (model) =>
                        model.icon && (
                           <div key={model.id} className={css.provider_model_icon}>
                              <Image.Default src={model.icon} alt={model.name} title={model.name} />
                           </div>
                        )
                  )}

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
               href={reviewsHref}
               className={css.reviews}
               onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  router.push(reviewsHref);
               }}
            >
               <span>{reviewsCount}</span>

               <div className={css.reports}>
                  <div className={css.reports_inner}>{reportsCount}</div>
               </div>
            </a>
         </div>
      </div>
   );
};
