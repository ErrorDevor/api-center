"use client";

import React from "react";

import clsx from "clsx";

import { RANKING_CATEGORIES } from "shared/lib/rankings/categories";
import type { RankingCategoryId } from "shared/lib/rankings/types";
import { ContentHeader } from "shared/ui/components/ContentHeader";

import { RatingAbout, RatingCategories, RatingExplore, RatingTable } from "./ui";

import css from "./RatingScreen.module.scss";

interface Prop {
   className?: string;
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
}

export const RatingScreen: React.FC<Prop> = ({ className, selectedVendorId, onSelectVendor }) => {
   const [activeCategoryId, setActiveCategoryId] = React.useState<RankingCategoryId>(
      RANKING_CATEGORIES[0].id
   );

   // The category cards jump to the matching leaderboard tab.
   const handleSelectCategory = (categoryId: RankingCategoryId) => {
      setActiveCategoryId(categoryId);

      requestAnimationFrame(() => {
         document
            .getElementById("rating-table")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
   };

   return (
      <div className={clsx(css.rating, className)}>
         <ContentHeader
            variant="simple"
            className={css.rating_header}
            selectedVendorId={selectedVendorId}
            onSelectVendor={onSelectVendor}
         />

         <div className={css.rating_content}>
            <RatingCategories onSelectCategory={handleSelectCategory} />
            <RatingTable
               activeCategoryId={activeCategoryId}
               onCategoryChange={setActiveCategoryId}
            />
            <RatingExplore />
            <RatingAbout />
         </div>
      </div>
   );
};
