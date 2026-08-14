"use client";

import React from "react";

import clsx from "clsx";

import { RatingCategories, RatingExplore, RatingTable } from "./ui";

import css from "./RatingScreen.module.scss";

interface Prop {
   className?: string;
}

export const RatingScreen: React.FC<Prop> = ({ className }) => {
   return (
      <div className={clsx(css.rating, className)}>
         <div className={css.rating_content}>
            <RatingCategories />
            <RatingTable />
            <RatingExplore />
         </div>
      </div>
   );
};
