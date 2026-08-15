import React from "react";

import type { RatingModel } from "../../lib/rating.type";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";

import css from "./RatingRow.module.scss";

interface Prop {
   className?: string;
   model: RatingModel;
}

export const RatingRow: React.FC<Prop> = ({ className, model }) => {
   const { t } = useTranslation();

   return (
      <article className={clsx(css.rating_row, className)}>
         <div className={css.rating_row_cell}>
            <span className={css.rating_row_mobile_label}>{t.rating.table.rating}</span>

            <span className={css.rating_row_mobile_dots} />

            <span
               className={clsx(css.rating_row_rank, model.rank === 1 && css.rating_row_rank_first)}
            >
               {model.rank}
            </span>
         </div>

         <div className={css.rating_row_cell}>
            <span className={css.rating_row_mobile_label}>{t.rating.table.modelName}</span>

            <span className={css.rating_row_mobile_dots} />

            <div className={css.rating_row_model}>
               <Image.Default className={css.rating_row_model_icon} src={model.icon} alt="" />

               <div className={css.rating_row_model_content}>
                  <strong>{model.name}</strong>
                  <span>{model.description}</span>
               </div>
            </div>
         </div>

         <div className={css.rating_row_cell}>
            <div className={css.rating_row_mobile_label_info}>
               <span>{t.rating.table.tts}</span>

               <Image.Default src="/icons/rating/use-info.svg" alt="" />
            </div>

            <span className={css.rating_row_mobile_dots} />

            <span className={css.rating_row_value}>{model.tts.toLocaleString("en-US")}</span>
         </div>

         <div className={css.rating_row_cell}>
            <div className={css.rating_row_mobile_label_info}>
               <span>{t.rating.table.speed}</span>

               <Image.Default src="/icons/rating/use-info.svg" alt="" />
            </div>

            <span className={css.rating_row_mobile_dots} />

            <span className={css.rating_row_value}>{model.speed} с/с</span>
         </div>

         <div className={css.rating_row_cell}>
            <div className={css.rating_row_mobile_label_info}>
               <span>{t.rating.table.latency}</span>

               <Image.Default src="/icons/rating/use-info.svg" alt="" />
            </div>

            <span className={css.rating_row_mobile_dots} />

            <span className={css.rating_row_value}>{model.latency} мс</span>
         </div>

         <div className={css.rating_row_cell}>
            <span className={css.rating_row_mobile_label}>{t.rating.table.pricePerMillion}</span>

            <span className={css.rating_row_mobile_dots} />

            <span className={css.rating_row_value}>$ {model.price.toFixed(3)}</span>
         </div>

         <div className={css.rating_row_cell}>
            <span className={css.rating_row_mobile_label}>{t.rating.table.license}</span>

            <span className={css.rating_row_mobile_dots} />

            {model.isLicensed && (
               <Image.Default
                  className={css.rating_row_license}
                  src="/icons/rating/lock.svg"
                  alt=""
               />
            )}
         </div>
      </article>
   );
};
