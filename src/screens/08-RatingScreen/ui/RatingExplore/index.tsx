import React from "react";

import { ratingExploreGroups } from "../../lib/rating.data";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";

import css from "./RatingExplore.module.scss";

interface Prop {
   className?: string;
}

export const RatingExplore: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();

   return (
      <section className={clsx(css.rating_explore, className)}>
         <div className={css.rating_explore_inner}>
            <div className={css.rating_explore_header}>
               <span className={css.rating_explore_badge}>{t.rating.explore.badge}</span>

               <h2>{t.rating.explore.title}</h2>

               <p>{t.rating.explore.description}</p>
            </div>

            <div className={css.rating_explore_content}>
               {ratingExploreGroups.map((group) => (
                  <div key={group.id} className={css.rating_explore_group}>
                     <h3>{t.rating.explore.groups[group.translationKey]}</h3>

                     <div className={css.rating_explore_list}>
                        {group.items.map((item) => {
                           const translation = t.rating.explore.items[item.translationKey];

                           return (
                              <article key={item.id} className={css.rating_explore_item}>
                                 <div className={css.rating_explore_icon}>
                                    <Image.Default src={item.icon} alt="" />
                                 </div>

                                 <div className={css.rating_explore_item_content}>
                                    <h4>{translation.title}</h4>
                                    <p>{translation.description}</p>
                                 </div>
                              </article>
                           );
                        })}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};
