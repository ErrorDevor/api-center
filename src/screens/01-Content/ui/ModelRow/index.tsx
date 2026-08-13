"use client";

import React from "react";

import type { ModelItem } from "screens/01-Content/lib/content.data";
import { pricesDetails, providerDetails } from "screens/01-Content/lib/provider.data";

import { useTranslation } from "shared/lib/i18n";
import { getVendorIcon, getVendorId } from "shared/lib/providers/vendors";
import Image from "shared/ui/base/Image";
import { PricesTooltip, type PricesTooltipPosition } from "shared/ui/components/PricesTooltip";
import {
   ProviderTooltip,
   type ProviderTooltipPosition,
} from "shared/ui/components/ProviderTooltip";
import { DropdownArrowIcon, ModelIcon } from "shared/ui/icons";

import css from "./ModelRow.module.scss";

const PROVIDER_TOOLTIP_WIDTH = 243;
const PROVIDER_TOOLTIP_HEIGHT = 195;

const PRICES_TOOLTIP_WIDTH = 243;
const PRICES_TOOLTIP_HEIGHT = 352;

const TOOLTIP_GAP = 12;
const VIEWPORT_PADDING = 8;
const CLOSE_DELAY = 120;

// Hidden per product request: keep the tooltip and its data/handlers intact
// (not deleted) so it can be turned back on later — just never render it.
const SHOW_PRICES_TOOLTIP = false;

interface Prop {
   model: ModelItem;
}

interface TooltipPosition {
   left: number;
   top: number;
}

export const ModelRow: React.FC<Prop> = ({ model }) => {
   const { t } = useTranslation();

   const providerTooltipId = React.useId();
   const pricesTooltipId = React.useId();
   // Real reseller names from providers.json won't match a dictionary key,
   // so every provider falls back to the same placeholder tooltip content
   // (see provider.data.ts) instead of the tooltip silently never opening.
   const provider = providerDetails[model.provider] ?? providerDetails.OpenRouter;
   const prices = pricesDetails[model.provider] ?? pricesDetails.OpenRouter;
   const providerRef = React.useRef<HTMLAnchorElement>(null);
   const pricesRef = React.useRef<HTMLButtonElement>(null);

   const providerCloseTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

   const pricesCloseTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

   const [isProviderTooltipOpen, setIsProviderTooltipOpen] = React.useState(false);

   const [providerTooltipPosition, setProviderTooltipPosition] =
      React.useState<ProviderTooltipPosition>({
         left: 0,
         top: 0,
      });

   const [isPricesTooltipOpen, setIsPricesTooltipOpen] = React.useState(false);

   const [pricesTooltipPosition, setPricesTooltipPosition] = React.useState<PricesTooltipPosition>({
      left: 0,
      top: 0,
   });

   const calculateTooltipPosition = React.useCallback(
      (element: HTMLElement, tooltipWidth: number, tooltipHeight: number): TooltipPosition => {
         const rect = element.getBoundingClientRect();

         const leftPosition = rect.left - tooltipWidth - TOOLTIP_GAP;
         const rightPosition = rect.right + TOOLTIP_GAP;

         const maxLeft = Math.max(
            VIEWPORT_PADDING,
            window.innerWidth - tooltipWidth - VIEWPORT_PADDING
         );

         const left =
            leftPosition >= VIEWPORT_PADDING ? leftPosition : Math.min(rightPosition, maxLeft);

         const desiredTop = rect.top + rect.height / 2 - tooltipHeight / 2;

         const maxTop = Math.max(
            VIEWPORT_PADDING,
            window.innerHeight - tooltipHeight - VIEWPORT_PADDING
         );

         const top = Math.min(Math.max(VIEWPORT_PADDING, desiredTop), maxTop);

         return {
            left,
            top,
         };
      },
      []
   );

   const clearProviderCloseTimeout = React.useCallback(() => {
      if (!providerCloseTimeoutRef.current) {
         return;
      }

      clearTimeout(providerCloseTimeoutRef.current);
      providerCloseTimeoutRef.current = null;
   }, []);

   const updateProviderTooltipPosition = React.useCallback(() => {
      const element = providerRef.current;

      if (!element) {
         return;
      }

      setProviderTooltipPosition(
         calculateTooltipPosition(element, PROVIDER_TOOLTIP_WIDTH, PROVIDER_TOOLTIP_HEIGHT)
      );
   }, [calculateTooltipPosition]);

   const openProviderTooltip = React.useCallback(() => {
      if (!provider) {
         return;
      }

      clearProviderCloseTimeout();
      updateProviderTooltipPosition();
      setIsProviderTooltipOpen(true);
   }, [clearProviderCloseTimeout, provider, updateProviderTooltipPosition]);

   const closeProviderTooltip = React.useCallback(() => {
      clearProviderCloseTimeout();

      providerCloseTimeoutRef.current = setTimeout(() => {
         setIsProviderTooltipOpen(false);
      }, CLOSE_DELAY);
   }, [clearProviderCloseTimeout]);

   const clearPricesCloseTimeout = React.useCallback(() => {
      if (!pricesCloseTimeoutRef.current) {
         return;
      }

      clearTimeout(pricesCloseTimeoutRef.current);
      pricesCloseTimeoutRef.current = null;
   }, []);

   const updatePricesTooltipPosition = React.useCallback(() => {
      const element = pricesRef.current;

      if (!element) {
         return;
      }

      setPricesTooltipPosition(
         calculateTooltipPosition(element, PRICES_TOOLTIP_WIDTH, PRICES_TOOLTIP_HEIGHT)
      );
   }, [calculateTooltipPosition]);

   const openPricesTooltip = React.useCallback(() => {
      if (!prices || !SHOW_PRICES_TOOLTIP) {
         return;
      }

      clearPricesCloseTimeout();
      updatePricesTooltipPosition();
      setIsPricesTooltipOpen(true);
   }, [clearPricesCloseTimeout, prices, updatePricesTooltipPosition]);

   const closePricesTooltip = React.useCallback(() => {
      clearPricesCloseTimeout();

      pricesCloseTimeoutRef.current = setTimeout(() => {
         setIsPricesTooltipOpen(false);
      }, CLOSE_DELAY);
   }, [clearPricesCloseTimeout]);

   const handlePricesPointerEnter = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType !== "mouse") {
         return;
      }

      openPricesTooltip();
   };

   const handlePricesPointerLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType !== "mouse") {
         return;
      }

      closePricesTooltip();
   };

   const handlePricesClick = () => {
      if (!prices || !SHOW_PRICES_TOOLTIP) {
         return;
      }

      clearPricesCloseTimeout();

      if (isPricesTooltipOpen) {
         setIsPricesTooltipOpen(false);
         return;
      }

      updatePricesTooltipPosition();
      setIsPricesTooltipOpen(true);
   };
   React.useEffect(() => {
      if (!isProviderTooltipOpen) {
         return;
      }

      const handlePositionChange = () => {
         updateProviderTooltipPosition();
      };

      window.addEventListener("resize", handlePositionChange);
      window.addEventListener("scroll", handlePositionChange, true);

      return () => {
         window.removeEventListener("resize", handlePositionChange);
         window.removeEventListener("scroll", handlePositionChange, true);
      };
   }, [isProviderTooltipOpen, updateProviderTooltipPosition]);

   React.useEffect(() => {
      if (!isPricesTooltipOpen) {
         return;
      }

      const handlePositionChange = () => {
         updatePricesTooltipPosition();
      };

      window.addEventListener("resize", handlePositionChange);
      window.addEventListener("scroll", handlePositionChange, true);

      return () => {
         window.removeEventListener("resize", handlePositionChange);
         window.removeEventListener("scroll", handlePositionChange, true);
      };
   }, [isPricesTooltipOpen, updatePricesTooltipPosition]);

   React.useEffect(() => {
      return () => {
         clearProviderCloseTimeout();
         clearPricesCloseTimeout();
      };
   }, [clearPricesCloseTimeout, clearProviderCloseTimeout]);

   const modelTranslation = t.models.items[model.translationKey];
   const vendorIcon = getVendorIcon(getVendorId(model.canonicalModelId));
   const paymentMethodsText =
      model.paymentMethods.length > 0 ? model.paymentMethods.join(", ") : "-";

   return (
      <article className={css.table_row}>
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
                  <strong>{model.name}</strong>
                  <span>{modelTranslation.description}</span>
               </div>
            </div>
         </div>

         <div className={css.table_cell}>
            <div className={css.prices}>
               <div className={css.price}>
                  <span className={css.mobile_label}>{t.common.input}:</span>

                  <span className={css.desktop_label}>{t.common.input}:</span>

                  <span className={css.mobile_dots} />

                  <div className={css.price_value}>
                     <Image.Default src="/icons/energy.svg" alt="" />

                     <strong>
                        ${model.inputPrice}
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
                        ${model.outputPrice}
                        <small>/1M</small>
                     </strong>
                  </div>
               </div>
            </div>

            <span className={css.discount}>
               {t.models.discount.replace("{percent}", String(model.discountPercent))}
            </span>
         </div>

         <div className={css.table_cell}>
            <span className={css.mobile_label}>{t.content.table.tags}</span>

            <span className={css.mobile_dots} />

            <button
               ref={pricesRef}
               type="button"
               className={css.payment_value}
               aria-expanded={isPricesTooltipOpen}
               aria-describedby={prices && isPricesTooltipOpen ? pricesTooltipId : undefined}
               onPointerEnter={handlePricesPointerEnter}
               onPointerLeave={handlePricesPointerLeave}
               onBlur={closePricesTooltip}
               onClick={handlePricesClick}
            >
               <Image.Default src="/icons/info.svg" alt="" className={css.payment_info_icon} />

               <span className={css.payment_value_text}>{paymentMethodsText}</span>

               <DropdownArrowIcon className={css.payment_arrow} />
            </button>

            {/* Popup hidden per product request — see SHOW_PRICES_TOOLTIP above.
                Component, data and open/close logic stay in place, just not rendered. */}
            {SHOW_PRICES_TOOLTIP && prices && isPricesTooltipOpen && (
               <PricesTooltip
                  id={pricesTooltipId}
                  details={prices}
                  position={pricesTooltipPosition}
                  onMouseEnter={openPricesTooltip}
                  onMouseLeave={closePricesTooltip}
               />
            )}
         </div>

         <div className={css.table_cell}>
            <span className={css.mobile_label}>{t.content.table.provider}</span>

            <span className={css.mobile_dots} />

            <div className={css.provider_wrapper}>
               <a
                  ref={providerRef}
                  href={model.providerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={css.provider}
                  aria-describedby={
                     provider && isProviderTooltipOpen ? providerTooltipId : undefined
                  }
                  onMouseEnter={openProviderTooltip}
                  onMouseLeave={closeProviderTooltip}
                  onFocus={openProviderTooltip}
                  onBlur={closeProviderTooltip}
               >
                  <Image.Default src="/icons/info.svg" alt="" />
                  <span>{model.provider}</span>
               </a>

               {provider && isProviderTooltipOpen && (
                  <ProviderTooltip
                     id={providerTooltipId}
                     providerName={model.provider}
                     details={provider}
                     position={providerTooltipPosition}
                     onMouseEnter={openProviderTooltip}
                     onMouseLeave={closeProviderTooltip}
                  />
               )}
            </div>
         </div>

         <div className={css.table_cell}>
            <span className={css.mobile_label}>{t.content.table.reviews}</span>

            <span className={css.mobile_dots} />

            <div className={css.reviews}>
               <span>{model.reviews}</span>

               <div className={css.reports}>
                  <div className={css.reports_inner}>{model.reports}</div>
               </div>
            </div>
         </div>
      </article>
   );
};
