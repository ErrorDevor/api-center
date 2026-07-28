"use client";

import React from "react";
import { createPortal } from "react-dom";

import clsx from "clsx";
import type { PricesDetails } from "screens/01-Content/lib/provider.data";

import { useTranslation } from "shared/lib/i18n";

import css from "./PricesTooltip.module.scss";

export interface PricesTooltipPosition {
   left: number;
   top: number;
}

interface Props {
   details: PricesDetails;
   id: string;
   position: PricesTooltipPosition;
   className?: string;
   onMouseEnter?: () => void;
   onMouseLeave?: () => void;
}

export const PricesTooltip: React.FC<Props> = ({
   details,
   id,
   position,
   className,
   onMouseEnter,
   onMouseLeave,
}) => {
   const { t } = useTranslation();

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
         className={clsx(css.prices_modal, className)}
         style={{
            left: position.left,
            top: position.top,
         }}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
      >
         <div className={css.prices_modal_header}>
            <span className={css.prices_modal_name}>{t.pricesTooltip.title}</span>
         </div>

         <div className={css.prices_modal_body}>
            <div className={css.prices_modal_scroll}>
               <div className={css.prices_modal_groups}>
                  {details.groups.map((group) => (
                     <section key={group.id} className={css.prices_modal_group}>
                        <h3 className={css.prices_modal_group_title}>
                           {t.pricesTooltip.groups[group.translationKey]}
                        </h3>

                        <div className={css.prices_modal_list}>
                           {group.items.map((item) => (
                              <div key={item.id} className={css.prices_modal_item}>
                                 <span
                                    className={clsx(
                                       css.prices_modal_item_name,
                                       item.emphasized && css.prices_modal_item_name_emphasized
                                    )}
                                 >
                                    {t.pricesTooltip.options[item.translationKey]}
                                 </span>

                                 <span className={css.prices_modal_item_price}>{item.price}</span>
                              </div>
                           ))}
                        </div>
                     </section>
                  ))}
               </div>
            </div>
         </div>
      </div>,
      document.body
   );
};
