"use client";

import React from "react";

import { useAuth } from "shared/lib/auth";
import { useGatewayPricing } from "shared/lib/gatewayPricing/useGatewayPricing";
import { useTranslation } from "shared/lib/i18n";
import { useProviderCommentSummary } from "shared/lib/providerComments/useProviderCommentSummary";
import { getVendorIcon, getVendorId } from "shared/lib/providers/vendors";
import Image from "shared/ui/base/Image";
import { ModelIcon } from "shared/ui/icons";

// Deliberately reuses ModelRow's styles and markup so the pinned row is
// visually identical to the reseller rows around it.
import css from "../ModelRow/ModelRow.module.scss";

const CABINET_URL = "https://bestaiprice.com/gateway/keys";
const PROVIDER_DOMAIN = "bestaiprice.com";
const PROVIDER_NAME = "BestAIPrice";

interface Prop {
   canonicalModelId: string;
   modelName: string;
   description?: string;
}

// The pinned BestAIPrice row: looks like any other row, but a click
// anywhere on it goes to signup (or the keys page when signed in).
export const BestAiPriceRow: React.FC<Prop> = ({ canonicalModelId, modelName, description }) => {
   const { t } = useTranslation();
   const { status } = useAuth();
   const { getPricingForModel } = useGatewayPricing();
   const { summary } = useProviderCommentSummary(PROVIDER_DOMAIN);

   const pricing = getPricingForModel(canonicalModelId);

   // No row while pricing is loading (undefined) or the model isn't offered (null).
   if (!pricing) {
      return null;
   }

   const isAuthenticated = status === "authenticated";
   const href = isAuthenticated
      ? CABINET_URL
      : `/signup?model=${encodeURIComponent(canonicalModelId)}`;

   const open = () => {
      // Wait for the auth check so a click can't race it.
      if (status === "loading") {
         return;
      }

      window.location.assign(href);
   };

   const vendorIcon = getVendorIcon(getVendorId(canonicalModelId));
   const reviewsCount = summary?.totalComments ?? 0;
   const reportsCount = summary?.negativeCount ?? 0;

   return (
      <article
         className={css.table_row}
         role="link"
         tabIndex={0}
         style={{ cursor: "pointer" }}
         onClick={open}
         onKeyDown={(event) => {
            if (event.key === "Enter") {
               open();
            }
         }}
      >
         <div className={css.table_cell}>
            <div className={css.model}>
               <div className={css.model_icon}>
                  {vendorIcon ? (
                     <Image.Default src={vendorIcon} alt="" className={css.model_icon_image} />
                  ) : (
                     <ModelIcon />
                  )}
               </div>

               <div className={css.model_info}>
                  <strong>{modelName.replace(/\s*\([^)]*\)\s*$/, "")}</strong>
                  <span>{description || t.content.table.descriptionUnavailable}</span>
               </div>
            </div>
         </div>

         <div className={css.table_cell}>
            <div className={css.prices}>
               {pricing.nativePriceUsd !== null ? (
                  <div className={css.price}>
                     <span className={css.mobile_label}>{t.common.price}:</span>
                     <span className={css.desktop_label}>{t.common.price}:</span>
                     <span className={css.mobile_dots} />

                     <div className={css.price_value}>
                        <Image.Default src="/icons/energy.svg" alt="" />
                        <strong>
                           ${pricing.nativePriceUsd}
                           <small>/{pricing.nativePriceUnit}</small>
                        </strong>
                     </div>
                  </div>
               ) : (
                  <>
                     <div className={css.price}>
                        <span className={css.mobile_label}>{t.common.input}:</span>
                        <span className={css.desktop_label}>{t.common.input}:</span>
                        <span className={css.mobile_dots} />

                        <div className={css.price_value}>
                           <Image.Default src="/icons/energy.svg" alt="" />
                           <strong>
                              ${pricing.inputPrice}
                              <small>/1M</small>
                           </strong>
                        </div>
                     </div>

                     <div className={css.price_divider} />

                     <div className={css.price}>
                        <span className={css.mobile_label}>{t.common.output}:</span>
                        <span className={css.desktop_label}>{t.common.output}:</span>
                        <span className={css.mobile_dots} />

                        <div className={css.price_value}>
                           <Image.Default src="/icons/energy.svg" alt="" />
                           <strong>
                              ${pricing.outputPrice}
                              <small>/1M</small>
                           </strong>
                        </div>
                     </div>
                  </>
               )}
            </div>
         </div>

         <div className={css.table_cell}>
            <span className={css.mobile_label}>{t.content.table.tags}</span>
            <span className={css.mobile_dots} />

            <span className={css.payment_value}>
               <Image.Default src="/icons/info.svg" alt="" className={css.payment_info_icon} />
               <span className={css.payment_value_text}>{t.content.bestAiPrice.usdtPayment}</span>
            </span>
         </div>

         <div className={css.table_cell}>
            <span className={css.mobile_label}>{t.content.table.provider}</span>
            <span className={css.mobile_dots} />

            <div className={css.provider_wrapper}>
               <span className={css.provider}>
                  <Image.Default src="/icons/info.svg" alt="" />
                  <span>{PROVIDER_NAME}</span>
               </span>
            </div>
         </div>

         <div className={css.table_cell}>
            <span className={css.mobile_label}>{t.content.table.reviews}</span>
            <span className={css.mobile_dots} />

            <div className={css.reviews}>
               <span>{reviewsCount}</span>

               <div className={css.reports}>
                  <div className={css.reports_inner}>{reportsCount}</div>
               </div>
            </div>
         </div>
      </article>
   );
};
