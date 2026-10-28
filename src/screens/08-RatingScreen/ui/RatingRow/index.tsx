import React from "react";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import type { RankingColumn } from "shared/lib/rankings/categories";
import { formatMetric } from "shared/lib/rankings/format";
import type { RankingEntry } from "shared/lib/rankings/types";
import { getModelVendorIcon } from "shared/lib/rankings/vendor-icons";
import Image from "shared/ui/base/Image";
import { NextLink } from "shared/ui/base/NextLink";

import css from "./RatingRow.module.scss";

interface Prop {
   className?: string;
   entry: RankingEntry & { rank: number };
   columns: RankingColumn[];
   // Catalog page of the model, when it has one.
   modelHref?: string;
}

export const RatingRow: React.FC<Prop> = ({ className, entry, columns, modelHref }) => {
   const { t, locale } = useTranslation();

   const icon = getModelVendorIcon(entry.model);
   const isOpenLicense = entry.license === "open";

   return (
      <article className={clsx(css.rating_row, className)}>
         <div className={css.rating_row_cell}>
            <span className={css.rating_row_mobile_label}>{t.rating.table.rating}</span>

            <span className={css.rating_row_mobile_dots} />

            <span
               className={clsx(css.rating_row_rank, entry.rank === 1 && css.rating_row_rank_first)}
            >
               {entry.rank}
            </span>
         </div>

         <div className={css.rating_row_cell}>
            <span className={css.rating_row_mobile_label}>{t.rating.table.modelName}</span>

            <span className={css.rating_row_mobile_dots} />

            <div className={css.rating_row_model}>
               {icon ? (
                  <Image.Default
                     className={css.rating_row_model_icon}
                     src={icon}
                     alt=""
                  />
               ) : (
                  <span
                     className={clsx(
                        css.rating_row_model_icon,
                        css.rating_row_model_icon_placeholder,
                     )}
                     aria-hidden
                  >
                     {entry.model.trim().charAt(0).toUpperCase()}
                  </span>
               )}

               <div className={css.rating_row_model_content}>
                  {modelHref ? (
                     <NextLink href={modelHref} className={css.rating_row_model_link}>
                        <strong>{entry.model}</strong>
                     </NextLink>
                  ) : (
                     <strong>{entry.model}</strong>
                  )}
               </div>
            </div>
         </div>

         {columns.map((column) => (
            <div key={column.key} className={css.rating_row_cell}>
               <span className={css.rating_row_mobile_label}>
                  {t.rating.table[column.labelKey]}
               </span>

               <span className={css.rating_row_mobile_dots} />

               <span className={css.rating_row_value}>
                  {formatMetric(entry.metrics[column.key] ?? null, column.format, locale)}
               </span>
            </div>
         ))}

         <div className={css.rating_row_cell}>
            <span className={css.rating_row_mobile_label}>{t.rating.table.license}</span>

            <span className={css.rating_row_mobile_dots} />

            <Image.Default
               className={css.rating_row_license}
               src={isOpenLicense ? "/icons/rating/license-open.svg" : "/icons/rating/lock.svg"}
               alt={isOpenLicense ? t.rating.table.licenseOpen : t.rating.table.licenseClosed}
            />
         </div>
      </article>
   );
};
