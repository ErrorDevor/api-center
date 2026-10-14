import React from "react";

import { ratingCategories } from "../../lib/rating.data";
import type { RatingCategoryIcon } from "../../lib/rating.type";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import type { RankingCategory } from "shared/lib/rankings/categories";
import Image from "shared/ui/base/Image";

import css from "./RatingCategories.module.scss";

// Which leaderboard tab each card opens. The text-oriented cards all map to
// the LLM tab; images has its own.
const CARD_TARGET_CATEGORY: Record<string, RankingCategory["id"]> = {
   programming: "llm",
   texts: "llm",
   research: "llm",
   images: "image-generation",
};

interface Prop {
   className?: string;
   onSelectCategory?: (categoryId: RankingCategory["id"]) => void;
}

export const RatingCategories: React.FC<Prop> = ({ className, onSelectCategory }) => {
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

   const handleSelect = (cardId: string) => {
      const target = CARD_TARGET_CATEGORY[cardId];

      if (!target) {
         return;
      }

      onSelectCategory?.(target);
      document
         .getElementById("rating-table")
         ?.scrollIntoView({ behavior: "smooth", block: "start" });
   };

   return (
      <section className={clsx(css.rating_categories, className)}>
         <div className={css.rating_categories_list}>
            {ratingCategories.map((item) => {
               const translation = t.rating.categories[item.translationKey];

               return (
                  <article
                     key={item.id}
                     className={css.rating_category}
                     role="button"
                     tabIndex={0}
                     onClick={() => handleSelect(item.id)}
                     onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                           event.preventDefault();
                           handleSelect(item.id);
                        }
                     }}
                  >
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
