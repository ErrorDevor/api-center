"use client";

import React from "react";
import { createPortal } from "react-dom";

import clsx from "clsx";

import css from "./DiscountTooltip.module.scss";

export interface DiscountTooltipPosition {
   left: number;
   top: number;
}

interface Props {
   id: string;
   text: string;
   position: DiscountTooltipPosition;
   className?: string;
}

// Portal + fixed positioning (same approach as ProviderTooltip/PricesTooltip)
// so the bubble escapes the table's `overflow: hidden` instead of getting
// clipped when the discount badge sits near the table's edge.
export const DiscountTooltip: React.FC<Props> = ({ id, text, position, className }) => {
   const [mounted, setMounted] = React.useState(false);

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
         className={clsx(css.discount_modal, className)}
         style={{
            left: position.left,
            top: position.top,
         }}
      >
         {text}
      </div>,
      document.body
   );
};
