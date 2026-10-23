"use client";

import React from "react";

import { useRouter } from "next/navigation";

import type { ModelItem } from "../../lib/content.data";
import { computeGatewayDiscountPercent } from "../../lib/providers-to-models";

import { useAuth } from "shared/lib/auth";
import { CABINET_URL } from "shared/lib/gatewayPricing/cabinet";
import { useGatewayPricing } from "shared/lib/gatewayPricing/useGatewayPricing";
import { useTranslation } from "shared/lib/i18n";
import { useProviderCommentSummary } from "shared/lib/providerComments/useProviderCommentSummary";
import { getVendorIcon, getVendorId } from "shared/lib/providers/vendors";
import Image from "shared/ui/base/Image";
import {
   DiscountTooltip,
   type DiscountTooltipPosition,
} from "shared/ui/components/DiscountTooltip";
import { ModelIcon } from "shared/ui/icons";

// Deliberately reuses ModelRow's styles and markup so the pinned row is
// visually identical to the reseller rows around it.
import css from "../ModelRow/ModelRow.module.scss";

const PROVIDER_DOMAIN = "bestaiprice.com";
const PROVIDER_NAME = "BestAIPrice";

const DISCOUNT_TOOLTIP_WIDTH = 200;
const DISCOUNT_TOOLTIP_HEIGHT = 70;
const TOOLTIP_GAP = 12;
const VIEWPORT_PADDING = 8;

interface Prop {
   canonicalModelId: string;
   modelName: string;
   description?: string;
   // Source of the official prices the discount is computed against.
   model: ModelItem;
}

// The pinned BestAIPrice row: looks like any other row, but a click
// anywhere on it goes to signup (or the keys page when signed in).
export const BestAiPriceRow: React.FC<Prop> = ({
   canonicalModelId,
   modelName,
   description,
   model,
}) => {
   const { t } = useTranslation();
   const router = useRouter();
   const { status } = useAuth();
   const { getPricingForModel } = useGatewayPricing();
   const { summary } = useProviderCommentSummary(PROVIDER_DOMAIN);

   const pricing = getPricingForModel(canonicalModelId);

   const reviewsHref = `/reviews?provider=${encodeURIComponent(PROVIDER_DOMAIN)}`;
   const discountId = React.useId();
   const discountRef = React.useRef<HTMLSpanElement>(null);
   const [isDiscountOpen, setIsDiscountOpen] = React.useState(false);
   const [discountPosition, setDiscountPosition] = React.useState<DiscountTooltipPosition>({
      left: 0,
      top: 0,
   });

   const updateDiscountPosition = React.useCallback(() => {
      const element = discountRef.current;

      if (!element) {
         return;
      }

      const rect = element.getBoundingClientRect();
      const leftPosition = rect.left - DISCOUNT_TOOLTIP_WIDTH - TOOLTIP_GAP;
      const maxLeft = Math.max(
         VIEWPORT_PADDING,
         window.innerWidth - DISCOUNT_TOOLTIP_WIDTH - VIEWPORT_PADDING
      );
      const desiredTop = rect.top + rect.height / 2 - DISCOUNT_TOOLTIP_HEIGHT / 2;
      const maxTop = Math.max(
         VIEWPORT_PADDING,
         window.innerHeight - DISCOUNT_TOOLTIP_HEIGHT - VIEWPORT_PADDING
      );

      setDiscountPosition({
         left:
            leftPosition >= VIEWPORT_PADDING
               ? leftPosition
               : Math.min(rect.right + TOOLTIP_GAP, maxLeft),
         top: Math.min(Math.max(VIEWPORT_PADDING, desiredTop), maxTop),
      });
   }, []);

   React.useEffect(() => {
      if (!isDiscountOpen) {
         return;
      }

      window.addEventListener("resize", updateDiscountPosition);
      window.addEventListener("scroll", updateDiscountPosition, true);

      return () => {
         window.removeEventListener("resize", updateDiscountPosition);
         window.removeEventListener("scroll", updateDiscountPosition, true);
      };
   }, [isDiscountOpen, updateDiscountPosition]);

   // No row while pricing is loading (undefined) or the model isn't offered (null).
   if (!pricing) {
      return null;
   }

   const isAuthenticated = status === "authenticated";
   const href = isAuthenticated
      ? CABINET_URL
      : `/register?model=${encodeURIComponent(canonicalModelId)}`;

   const open = () => {
      // Wait for the auth check so a click can't race it.
      if (status === "loading") {
         return;
      }

      window.location.assign(href);
   };

   const discountPercent = computeGatewayDiscountPercent(pricing, model);

   const openDiscount = () => {
      updateDiscountPosition();
      setIsDiscountOpen(true);
   };

   const closeDiscount = () => setIsDiscountOpen(false);

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

            {discountPercent !== null && (
               <>
                  <span
                     ref={discountRef}
                     className={css.discount}
                     tabIndex={0}
                     aria-describedby={isDiscountOpen ? discountId : undefined}
                     onMouseEnter={openDiscount}
                     onMouseLeave={closeDiscount}
                     onFocus={openDiscount}
                     onBlur={closeDiscount}
                  >
                     <span className={css.discount_text}>
                        {t.models.discount.replace("{percent}", String(discountPercent))}
                     </span>
                  </span>

                  {isDiscountOpen && (
                     <DiscountTooltip
                        id={discountId}
                        text={t.models.discountTooltip}
                        position={discountPosition}
                     />
                  )}
               </>
            )}
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
               {/* The row itself goes to signup/keys, but the provider name
                   opens the provider's own /reviews page like every other
                   reseller row does. */}
               <a
                  href={reviewsHref}
                  className={css.provider}
                  onClick={(event) => {
                     event.preventDefault();
                     event.stopPropagation();
                     router.push(reviewsHref);
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
               >
                  <Image.Default src="/icons/info.svg" alt="" />
                  <span>{PROVIDER_NAME}</span>
               </a>
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
