"use client";

import React from "react";

import clsx from "clsx";

import { useAuth } from "shared/lib/auth";
import { useGatewayPricing } from "shared/lib/gatewayPricing/useGatewayPricing";
import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./BestAiPriceRow.module.scss";

// Where an authenticated user manages their key/connection — not a route in
// this app, so a plain external link rather than client-side navigation.
const CABINET_URL = "https://bestaiprice.com/gateway/keys";
const DOCS_URL = "https://bestaiprice.com/docs";

interface Prop {
   canonicalModelId: string;
   modelName: string;
}

// The pinned "BestAIPrice" row — BestAIPrice's own gateway, always first
// and visually distinct from the ranked reseller rows below it (see
// ModelsTable, which renders this outside the sorted/paginated list so it
// never moves or disappears). Pricing comes live from useGatewayPricing,
// the same retail table the gateway bills from — nothing here computes or
// caches its own price.
export const BestAiPriceRow: React.FC<Prop> = ({ canonicalModelId, modelName }) => {
   const { t } = useTranslation();
   const { status } = useAuth();
   const { getPricingForModel } = useGatewayPricing();

   const pricing = getPricingForModel(canonicalModelId);

   // Treat "loading" like "unauthenticated" for the CTA destination (same
   // fail-open-to-logged-out convention AuthProvider itself uses) so the
   // link always points somewhere sensible even before the profile check
   // resolves; the button itself is disabled until status is known so a
   // click can't race the auth check.
   // The row is only for models the gateway supports: no row while pricing
   // is still loading (undefined) or when the model isn't offered (null).
   if (!pricing) {
      return null;
   }

   const isAuthenticated = status === "authenticated";
   const isAuthKnown = status !== "loading";

   const ctaHref = isAuthenticated
      ? CABINET_URL
      : `/signup?model=${encodeURIComponent(canonicalModelId)}`;

   const ctaLabel = isAuthenticated
      ? t.content.bestAiPrice.ctaAuthenticated
      : t.content.bestAiPrice.ctaUnauthenticated;

   return (
      <article className={clsx(css.row)}>
         <div className={css.cell}>
            <div className={css.brand} title={t.content.bestAiPrice.tagline}>
               <div className={css.brand_icon}>
                  <Image.Default src="/images/Logo.svg" alt="" className={css.brand_icon_image} />
               </div>

               <div className={css.brand_info}>
                  <strong>{t.content.bestAiPrice.badge}</strong>
                  <span>{modelName}</span>
               </div>
            </div>
         </div>

         <div className={css.cell}>
            <div className={css.prices}>
               {pricing.nativePriceUsd !== null ? (
                  <div className={css.price}>
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
                        <span>{t.common.input}:</span>
                        <div className={css.price_value}>
                           <Image.Default src="/icons/energy.svg" alt="" />
                           <strong>
                              ${pricing.inputPrice}
                              <small>/1M</small>
                           </strong>
                        </div>
                     </div>

                     <div className={css.price}>
                        <span>{t.common.output}:</span>
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

         <div className={css.cell}>
            <div className={css.badges}>
               <span className={css.badge}>{t.content.bestAiPrice.unifiedKey}</span>
               <span className={css.badge}>{t.content.bestAiPrice.autoFailover}</span>
               <span className={css.badge}>{t.content.bestAiPrice.usdtPayment}</span>
            </div>
         </div>

         <div className={css.cell}>
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className={css.docs}>
               <Image.Default src="/icons/info.svg" alt="" />
               <span>{t.content.bestAiPrice.docs}</span>
            </a>
         </div>

         <div className={clsx(css.cell, css.cell_cta)}>
            <Button
               as="a"
               href={ctaHref}
               variant="black"
               className={css.cta}
               aria-disabled={!isAuthKnown}
               onClick={(event) => {
                  if (!isAuthKnown) {
                     event.preventDefault();
                  }
               }}
               // Button's own class sets white-space: nowrap with no
               // min-width: 0, so as a flex item in this row's narrow last
               // column it refuses to shrink and overflows past the table
               // edge instead of wrapping — override inline since that
               // beats Button.module.scss's class on specificity, which a
               // same-specificity override from here can't reliably do.
               style={{
                  width: "100%",
                  minWidth: 0,
                  maxWidth: "100%",
                  whiteSpace: "normal",
                  textAlign: "center",
                  padding: "0.8rem 0.6rem",
                  fontSize: "1.2rem",
                  lineHeight: 1.3,
               }}
            >
               {ctaLabel}
            </Button>
         </div>
      </article>
   );
};
