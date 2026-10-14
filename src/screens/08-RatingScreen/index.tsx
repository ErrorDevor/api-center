"use client";

import React from "react";

import clsx from "clsx";

import { RANKING_CATEGORIES } from "shared/lib/rankings/categories";
import type { RankingCategory } from "shared/lib/rankings/categories";
import { ContentHeader } from "shared/ui/components/ContentHeader";

import { RatingAbout, RatingCategories, RatingExplore, RatingTable } from "./ui";

import css from "./RatingScreen.module.scss";

interface Prop {
   className?: string;
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
}

export const RatingScreen: React.FC<Prop> = ({ className, selectedVendorId, onSelectVendor }) => {
   const [activeCategoryId, setActiveCategoryId] = React.useState<RankingCategory["id"]>(
      RANKING_CATEGORIES[0].id
   );

   return (
      <div className={clsx(css.rating, className)}>
         <ContentHeader
            variant="simple"
            className={css.rating_header}
            selectedVendorId={selectedVendorId}
            onSelectVendor={onSelectVendor}
         />

         <div className={css.rating_content}>
            <RatingCategories onSelectCategory={setActiveCategoryId} />
            <RatingTable activeCategoryId={activeCategoryId} onCategoryChange={setActiveCategoryId} />
            <RatingExplore />
            <RatingAbout />
         </div>
      </div>
   );
};
