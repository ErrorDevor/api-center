"use client";

import React from "react";

import type { ModelItem } from "screens/01-Content/lib/content.data";
import { pricesDetails, providerDetails } from "screens/01-Content/lib/provider.data";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { PricesTooltip, type PricesTooltipPosition } from "shared/ui/components/PricesTooltip";
import {
   ProviderTooltip,
   type ProviderTooltipPosition,
} from "shared/ui/components/ProviderTooltip";
import { ModelIcon } from "shared/ui/icons";

import css from "./ModelRow.module.scss";

const PROVIDER_TOOLTIP_WIDTH = 243;
const PROVIDER_TOOLTIP_HEIGHT = 195;

const PRICES_TOOLTIP_WIDTH = 243;
const PRICES_TOOLTIP_HEIGHT = 352;

const TOOLTIP_GAP = 12;
const VIEWPORT_PADDING = 8;
const CLOSE_DELAY = 120;

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

   const provider = providerDetails[model.provider];
   const prices = pricesDetails[model.provider];

   const providerRef = React.useRef<HTMLAnchorElement>(null);
   const pricesRef = React.useRef<HTMLAnchorElement>(null);

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
      if (!prices) {
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

   return (
      <div className={css.table_row}>
         <div className={css.table_cell}>
            <div className={css.model}>
               <div className={css.model_icon}>
                  <ModelIcon />
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
                  <span>{t.common.input}:</span>
                  &nbsp;
                  <Image.Default src="/icons/energy.svg" alt="" />
                  &nbsp;
                  <strong>
                     ${model.inputPrice}
                     <small>/1M</small>
                  </strong>
               </div>

               <div className={css.price_divider} />

               <div className={css.price}>
                  <span>{t.common.output}:</span>
                  &nbsp;
                  <Image.Default src="/icons/energy.svg" alt="" />
                  &nbsp;
                  <strong>
                     ${model.outputPrice}
                     <small>/1M</small>
                  </strong>
               </div>
            </div>

            <span className={css.discount}>
               {t.models.discount.replace("{percent}", String(model.discountPercent))}
            </span>
         </div>

         <div className={css.table_cell}>
            <a
               ref={pricesRef}
               href="#prices"
               className={css.we_chat}
               aria-describedby={prices && isPricesTooltipOpen ? pricesTooltipId : undefined}
               onMouseEnter={openPricesTooltip}
               onMouseLeave={closePricesTooltip}
               onFocus={openPricesTooltip}
               onBlur={closePricesTooltip}
               onClick={(event) => event.preventDefault()}
            >
               <Image.Default src="/icons/info.svg" alt="" />
            </a>

            <p>{model.weChat}</p>

            {prices && isPricesTooltipOpen && (
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
            <div className={css.provider_wrapper}>
               <a
                  ref={providerRef}
                  href="#provider"
                  className={css.provider}
                  aria-describedby={
                     provider && isProviderTooltipOpen ? providerTooltipId : undefined
                  }
                  onMouseEnter={openProviderTooltip}
                  onMouseLeave={closeProviderTooltip}
                  onFocus={openProviderTooltip}
                  onBlur={closeProviderTooltip}
                  onClick={(event) => event.preventDefault()}
               >
                  <Image.Default src="/icons/info.svg" alt="" />

                  {model.provider}
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
            <div className={css.reviews}>
               <span>{model.reviews}</span>

               <div className={css.reports}>
                  <div className={css.reports_inner}>{model.reports}</div>
               </div>
            </div>
         </div>
      </div>
   );
};
