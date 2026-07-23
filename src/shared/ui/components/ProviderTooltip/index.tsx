"use client";

import React from "react";
import { createPortal } from "react-dom";

import clsx from "clsx";
import type { ProviderDetails } from "screens/01-Content/lib/provider.data";

import { useTranslation } from "shared/lib/i18n";
import { formatProviderAge } from "shared/lib/i18n/formatters";
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
   onMouseEnter?: () => void;
   onMouseLeave?: () => void;
}

export const ProviderTooltip: React.FC<Props> = ({
   providerName,
   details,
   id,
   position,
   className,
   onMouseEnter,
   onMouseLeave,
}) => {
   const [mounted, setMounted] = React.useState(false);
   const { locale, t } = useTranslation();

   const providerTranslation = t.providers.items[details.translationKey];

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
               <strong>{providerName}</strong> — {providerTranslation.description}
            </p>

            <div className={css.provider_modal_divider} />

            <div className={clsx(css.provider_modal_row)}>
               <span>{t.providers.age}:</span>
               <strong>{formatProviderAge(details.age.years, details.age.months, locale)}</strong>
            </div>

            <div className={css.provider_modal_row}>
               <span>{t.providers.reviews}:</span>

               <div className={css.provider_modal_reviews}>
                  <strong>{details.positiveReviews}</strong>

                  <div className={css.reports}>
                     <div className={css.reports_inner}>{details.negativeReviews}</div>
                  </div>
               </div>
            </div>
         </div>
      </div>,
      document.body
   );
};
