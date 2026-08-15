import React from "react";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";

import css from "./RatingAbout.module.scss";

interface Prop {
   className?: string;
}

export const RatingAbout: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();

   return (
      <section className={clsx(css.rating_about, className)}>
         <div className={css.rating_about_content}>
            <article className={css.rating_about_block}>
               <h2>{t.rating.about.overview.title}</h2>

               <p>{t.rating.about.overview.description}</p>
            </article>

            <article className={css.rating_about_block}>
               <h2>{t.rating.about.providers.title}</h2>

               <div className={css.rating_about_text}>
                  <p>{t.rating.about.providers.intro}</p>

                  <ul>
                     <li>{t.rating.about.providers.google}</li>
                     <li>{t.rating.about.providers.alternatives}</li>
                  </ul>

                  <p>{t.rating.about.providers.outro}</p>
               </div>
            </article>

            <article className={css.rating_about_block}>
               <h2>{t.rating.about.categories.title}</h2>

               <div className={css.rating_about_text}>
                  <p>{t.rating.about.categories.intro}</p>

                  <ul>
                     <li>{t.rating.about.categories.programming}</li>
                     <li>{t.rating.about.categories.writing}</li>
                     <li>{t.rating.about.categories.research}</li>
                     <li>{t.rating.about.categories.media}</li>
                  </ul>
               </div>
            </article>

            <article className={css.rating_about_block}>
               <h2>{t.rating.about.metrics.title}</h2>

               <div className={css.rating_about_text}>
                  <p>{t.rating.about.metrics.intro}</p>

                  <ul>
                     <li>{t.rating.about.metrics.ranking}</li>
                     <li>{t.rating.about.metrics.model}</li>
                     <li>{t.rating.about.metrics.tts}</li>
                     <li>{t.rating.about.metrics.latency}</li>
                     <li>{t.rating.about.metrics.price}</li>
                     <li>{t.rating.about.metrics.license}</li>
                  </ul>
               </div>
            </article>
         </div>
      </section>
   );
};