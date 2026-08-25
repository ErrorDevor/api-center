"use client";

import React from "react";
import { createPortal } from "react-dom";

import clsx from "clsx";
import type { ProviderDetails } from "screens/01-Content/lib/provider.data";

import { useTranslation } from "shared/lib/i18n";
import { formatProviderAge } from "shared/lib/i18n/formatters";
import type { ProviderAge } from "shared/lib/i18n/formatters";
import Image from "shared/ui/base/Image";

import css from "./ProviderTooltip.module.scss";

export interface ProviderTooltipPosition {
   left: number;
   top: number;
}

interface Props {
   providerName: string;
   details: ProviderDetails;
   id: string;
   position: ProviderTooltipPosition;
   className?: string;
   // Real, per-provider description sourced from provider_descriptions.json
   // (see ModelRow's useProviderDescriptions wiring). Falls back to the
   // generic stub translation when no feed entry matches yet.
   description?: string;
   // Real per-provider counts from useProviderCommentSummary (see ModelRow).
   // Fall back to details.positiveReviews/negativeReviews (the static stub)
   // while the summary is still loading or failed to load.
   reviewsCount?: number;
   reportsCount?: number;
   // Real domain age from providers.json's domain_age_days (see ModelRow's
   // daysToProviderAge). Falls back to details.age (the static stub) when
   // the backend hasn't backfilled it for this record yet.
   age?: ProviderAge;
   onMouseEnter?: () => void;
   onMouseLeave?: () => void;
}

export const ProviderTooltip: React.FC<Props> = ({
   providerName,
   details,
   id,
   position,
   className,
   description,
   reviewsCount,
   reportsCount,
   age,
   onMouseEnter,
   onMouseLeave,
}) => {
   const [mounted, setMounted] = React.useState(false);
   const { locale, t } = useTranslation();

   const providerTranslation = t.providers.items[details.translationKey];
   const resolvedDescription =
      description ?? providerTranslation.description.replace("{provider}", providerName);

   // The description already opens with the provider/product name (real
   // feed entries: "OneHop – ...", stub fallback: "AlLink is a..."), so
   // prepending providerName again read as the name twice in a row (see
   // the header right above). Bold that leading name instead of repeating
   // it — the whole name, not just its first word (e.g. "AI/ML API"). Falls
   // back to bolding just the first word when the description doesn't
   // actually start with providerName (a feed entry can phrase it
   // differently), so something still reads as highlighted.
   const boldedName = resolvedDescription.startsWith(providerName)
      ? providerName
      : resolvedDescription.split(" ")[0];
   const restOfDescription = resolvedDescription.slice(boldedName.length);

   React.useEffect(() => {
      setMounted(true);

      return () => {
         setMounted(false);
      };
   }, []);

   if (!mounted) {
      return null;
   }

   return createPortal(
      <div
         id={id}
         role="tooltip"
         className={clsx(css.provider_modal, className)}
         style={{
            left: position.left,
            top: position.top,
         }}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
      >
         <div className={css.provider_modal_header}>
            <span className={css.provider_modal_name}>{providerName}</span>

            <Image.Default src="/icons/verified.svg" className={css.provider_modal_verified} />
         </div>

         <div className={css.provider_modal_body}>
            <p className={css.provider_modal_description}>
               <strong>{boldedName}</strong>
               {restOfDescription}
            </p>

            <div className={css.provider_modal_divider} />

            <div className={css.provider_modal_row}>
               <span>{t.providers.age}:</span>

               <strong>{formatProviderAge(age ?? details.age, locale)}</strong>
            </div>

            <div className={css.provider_modal_row}>
               <span>{t.providers.reviews}:</span>

               <div className={css.provider_modal_reviews}>
                  <strong>{reviewsCount ?? details.positiveReviews}</strong>

                  <div className={css.reports}>
                     <div className={css.reports_inner}>
                        {reportsCount ?? details.negativeReviews}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>,
      document.body
   );
};
