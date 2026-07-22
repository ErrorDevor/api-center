import React from "react";

import type { ModelItem } from "screens/01-Content/lib/content.data";

import Image from "shared/ui/base/Image";
import { ModelIcon } from "shared/ui/icons";

import css from "./ModelRow.module.scss";

interface Prop {
   model: ModelItem;
}

export const ModelRow: React.FC<Prop> = ({ model }) => {
   return (
      <div className={css.table_row}>
         <div className={css.table_cell}>
            <div className={css.model}>
               <div className={css.model_icon}>
                  <ModelIcon />
               </div>

               <div className={css.model_info}>
                  <strong>{model.name}</strong>
                  <span>{model.description}</span>
               </div>
            </div>
         </div>

         <div className={css.table_cell}>
            <div className={css.prices}>
               <div className={css.price}>
                  <span>Input:</span>&nbsp;
                  <Image.Default src="/icons/energy.svg" />
                  &nbsp;
                  <strong>
                     ${model.inputPrice}
                     <small>/1M</small>
                  </strong>
               </div>

               <div className={css.price_divider} />

               <div className={css.price}>
                  <span>Output:</span>&nbsp; <Image.Default src="/icons/energy.svg" />
                  &nbsp;
                  <strong>
                     ${model.outputPrice}
                     <small>/1M</small>
                  </strong>
               </div>
            </div>

            <span className={css.discount}>{model.discount}</span>
         </div>

         <div className={css.table_cell}>
            <div className={css.tags}>
               {model.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
               ))}
            </div>
         </div>

         <div className={css.table_cell}>
            <a href="#" className={css.provider} onClick={(event) => event.preventDefault()}>
               <Image.Default src="/icons/info.svg" />
               {model.provider}
            </a>
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
