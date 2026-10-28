"use client";

import React from "react";

import { ratingExploreGroups } from "./lib/rating.data";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { RANKING_CATEGORIES } from "shared/lib/rankings/categories";
import type { RankingCategoryId } from "shared/lib/rankings/types";
import { RANKING_VIEWS } from "shared/lib/rankings/views";
import { ContentHeader } from "shared/ui/components/ContentHeader";

import { RatingAbout, RatingCategories, RatingExplore, RatingTable } from "./ui";

import css from "./RatingScreen.module.scss";

interface Prop {
   className?: string;
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
   // From ?category= / ?view= (read by the page, so the first render already
   // has them and the screen stays server-rendered).
   initialCategory?: string;
   initialView?: string;
}

export const RatingScreen: React.FC<Prop> = ({
   className,
   selectedVendorId,
   onSelectVendor,
   initialCategory,
   initialView: initialViewParam,
}) => {
   const { t } = useTranslation();

   // ?category=<tab> / ?view=<explore card> make every tab and card a real
   // link that opens the page already on that leaderboard.
   const initialViewId = initialViewParam ?? null;
   const initialView = initialViewId ? RANKING_VIEWS[initialViewId] : undefined;
   const initialCategoryId =
      initialView?.categoryId ??
      RANKING_CATEGORIES.find((category) => category.id === initialCategory)?.id;

   const [activeCategoryId, setActiveCategoryId] = React.useState<RankingCategoryId>(
      initialCategoryId ?? RANKING_CATEGORIES[0].id
   );

   // An "explore" card re-cuts a leaderboard (see RANKING_VIEWS); null shows
   // the plain leaderboard of the active tab.
   const [activeViewId, setActiveViewId] = React.useState<string | null>(initialView ? initialViewId : null);
   const activeView = activeViewId ? RANKING_VIEWS[activeViewId] : undefined;
   const activeItem = ratingExploreGroups
      .flatMap((group) => group.items)
      .find((item) => item.id === activeViewId);
   const viewTitle = activeItem
      ? t.rating.explore.items[activeItem.translationKey].title
      : undefined;

   const scrollToTable = () => {
      requestAnimationFrame(() => {
         document
            .getElementById("rating-table")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
   };

   const handleSelectExploreItem = (itemId: string) => {
      const view = RANKING_VIEWS[itemId];

      if (!view) {
         return;
      }

      setActiveViewId(itemId);
      setActiveCategoryId(view.categoryId);
      scrollToTable();
   };

   // The category cards jump to the matching leaderboard tab.
   const handleSelectCategory = (categoryId: RankingCategoryId) => {
      setActiveViewId(null);
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
               view={activeView}
               viewTitle={viewTitle}
               onClearView={() => setActiveViewId(null)}
            />
            <RatingExplore onSelectItem={handleSelectExploreItem} />
            <RatingAbout />
         </div>
      </div>
   );
};
