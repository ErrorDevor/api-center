"use client";

import React from "react";

import type { GroupBuyItem } from "../../lib/groupBuys.data";
import clsx from "clsx";

import { useIsMobile } from "shared/lib/hooks/useIsMobile";
import { useTranslation } from "shared/lib/i18n";
import { DropdownArrowIcon } from "shared/ui/icons";

import { GroupBuyCard } from "../GroupBuyCard";

import css from "./GroupBuysList.module.scss";

const MOBILE_VISIBLE_COUNT = 3;
const MOBILE_VISIBLE_STEP = 4;

interface Props {
   items: GroupBuyItem[];
}

export const GroupBuysList: React.FC<Props> = ({ items }) => {
   const { t } = useTranslation();
   const isMobile = useIsMobile();

   const [visibleCount, setVisibleCount] = React.useState(MOBILE_VISIBLE_COUNT);

   React.useEffect(() => {
      setVisibleCount(isMobile ? MOBILE_VISIBLE_COUNT : items.length);
   }, [isMobile, items.length]);

   const visibleItems = isMobile ? items.slice(0, visibleCount) : items;

   const hasMore = isMobile && visibleCount < items.length;

   const handleShowMore = () => {
      setVisibleCount((current) => Math.min(current + MOBILE_VISIBLE_STEP, items.length));
   };

   return (
      <>
         <div className={css.list}>
            {visibleItems.map((item) => (
               <GroupBuyCard key={item.id} item={item} />
            ))}
         </div>

         {hasMore && (
            <button type="button" className={css.show_more} onClick={handleShowMore}>
               <DropdownArrowIcon className={css.show_more_icon} />

               {t.sidebar.showMore}
            </button>
         )}
      </>
   );
};
