"use client";

import React from "react";

import type { ModelItem } from "screens/01-Content/lib/content.data";
import { providerDetails } from "screens/01-Content/lib/provider.data";
import type { ProviderName } from "screens/01-Content/lib/provider.data";
import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import {
   ProviderTooltip,
   type ProviderTooltipPosition,
} from "shared/ui/components/ProviderTooltip";
import { ModelIcon } from "shared/ui/icons";

import css from "./ModelRow.module.scss";

const TOOLTIP_WIDTH = 243;
const TOOLTIP_HEIGHT = 195;
const TOOLTIP_GAP = 12;
const VIEWPORT_PADDING = 8;
const CLOSE_DELAY = 120;

interface Prop {
   model: ModelItem;
}

export const ModelRow: React.FC<Prop> = ({ model }) => {
   const { t } = useTranslation();

   const tooltipId = React.useId();
   const provider = providerDetails[model.provider];

   const providerRef = React.useRef<HTMLAnchorElement>(null);
   const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

   const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
   const [tooltipPosition, setTooltipPosition] = React.useState<ProviderTooltipPosition>({
      left: 0,
      top: 0,
   });

   const clearCloseTimeout = React.useCallback(() => {
      if (!closeTimeoutRef.current) {
         return;
      }

      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
   }, []);

   const updateTooltipPosition = React.useCallback(() => {
      const providerElement = providerRef.current;

      if (!providerElement) {
         return;
      }

      const rect = providerElement.getBoundingClientRect();

      const desiredLeft = rect.left - TOOLTIP_WIDTH - TOOLTIP_GAP;
      const desiredTop = rect.top + rect.height / 2 - TOOLTIP_HEIGHT / 2;

      const left = Math.max(VIEWPORT_PADDING, desiredLeft);
      const top = Math.min(
         Math.max(VIEWPORT_PADDING, desiredTop),
         window.innerHeight - TOOLTIP_HEIGHT - VIEWPORT_PADDING
      );

      setTooltipPosition({
         left,
         top,
      });
   }, []);

   const openTooltip = React.useCallback(() => {
      if (!provider) {
         return;
      }

      clearCloseTimeout();
      updateTooltipPosition();
      setIsTooltipOpen(true);
   }, [clearCloseTimeout, provider, updateTooltipPosition]);

   const closeTooltip = React.useCallback(() => {
      clearCloseTimeout();

      closeTimeoutRef.current = setTimeout(() => {
         setIsTooltipOpen(false);
      }, CLOSE_DELAY);
   }, [clearCloseTimeout]);

   React.useEffect(() => {
      if (!isTooltipOpen) {
         return;
      }

      const handlePositionChange = () => {
         updateTooltipPosition();
      };

      window.addEventListener("resize", handlePositionChange);
      window.addEventListener("scroll", handlePositionChange, true);

      return () => {
         window.removeEventListener("resize", handlePositionChange);
         window.removeEventListener("scroll", handlePositionChange, true);
      };
   }, [isTooltipOpen, updateTooltipPosition]);

   React.useEffect(() => {
      return () => {
         clearCloseTimeout();
      };
   }, [clearCloseTimeout]);

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
                  <span>{t.common.input}:</span>&nbsp;
                  <Image.Default src="/icons/energy.svg" />
                  &nbsp;
                  <strong>
                     ${model.inputPrice}
                     <small>/1M</small>
                  </strong>
               </div>

               <div className={css.price_divider} />

               <div className={css.price}>
                  <span>{t.common.output}:</span>&nbsp;
                  <Image.Default src="/icons/energy.svg" />
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
            <div className={css.tags}>
               {model.tags.map((tag) => (
                  <span key={tag}>{t.tags[tag]}</span>
               ))}
            </div>
         </div>

         <div className={css.table_cell}>
            <div className={css.provider_wrapper}>
               <a
                  ref={providerRef}
                  className={css.provider}
                  aria-describedby={provider && isTooltipOpen ? tooltipId : undefined}
                  onMouseEnter={openTooltip}
                  onMouseLeave={closeTooltip}
                  onFocus={openTooltip}
                  onBlur={closeTooltip}
                  onClick={(event) => event.preventDefault()}
               >
                  <Image.Default src="/icons/info.svg" />
                  {model.provider}
               </a>

               {provider && isTooltipOpen && (
                  <ProviderTooltip
                     id={tooltipId}
                     providerName={model.provider}
                     details={provider}
                     position={tooltipPosition}
                     onMouseEnter={openTooltip}
                     onMouseLeave={closeTooltip}
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
