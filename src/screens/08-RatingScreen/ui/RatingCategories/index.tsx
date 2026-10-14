import React from "react";

import { ratingCategories } from "../../lib/rating.data";
import type { RatingCategoryIcon } from "../../lib/rating.type";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";

import css from "./RatingCategories.module.scss";

interface Prop {
   className?: string;
}

export const RatingCategories: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();

   const renderIcon = (icon: RatingCategoryIcon) => {
      switch (icon) {
         case "code":
            return <Image.Default src="/icons/rating/code.svg" alt="" />;

         case "text":
            return <Image.Default src="/icons/rating/text.svg" alt="" />;

         case "research":
            return <Image.Default src="/icons/rating/research.svg" alt="" />;

         case "image":
            return <Image.Default src="/icons/rating/image.svg" alt="" />;

         default:
            return null;
      }
   };

   return (
      <section className={clsx(css.rating_categories, className)}>
         <div className={css.rating_categories_list}>
            {ratingCategories.map((item) => {
               const translation = t.rating.categories[item.translationKey];

               return (
                  <article key={item.id} className={css.rating_category}>
                     <div
                        className={clsx(
                           css.rating_category_icon,
                           css[`rating_category_icon_${item.tone}`]
                        )}
                     >
                        {renderIcon(item.icon)}
                     </div>

                     <div className={css.rating_category_content}>
                        <h3>{translation.title}</h3>
                        <p>{translation.description}</p>
                     </div>
                  </article>
               );
            })}
         </div>
      </section>
   );
};
