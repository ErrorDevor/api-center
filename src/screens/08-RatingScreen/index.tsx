"use client";

import React from "react";

import clsx from "clsx";

import { ContentHeader } from "shared/ui/components/ContentHeader";

import { RatingAbout, RatingCategories, RatingExplore, RatingTable } from "./ui";

import css from "./RatingScreen.module.scss";

interface Prop {
   className?: string;
}

export const RatingScreen: React.FC<Prop> = ({ className }) => {
   return (
      <div className={clsx(css.rating, className)}>
         <ContentHeader variant="simple" className={css.rating_header}/>

         <div className={css.rating_content}>
            <RatingCategories />
            <RatingTable />
            <RatingExplore />
            <RatingAbout />
         </div>
      </div>
   );
};
