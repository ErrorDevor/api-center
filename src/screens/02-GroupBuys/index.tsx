"use client";

import React from "react";

import { type GroupBuyItem, type GroupBuysTabId, groupBuys, tabs } from "./lib/groupBuys.data";
import { GroupBuysList } from "./ui/GroupBuysList";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { matchesPaymentIds } from "shared/lib/payments/matchPaymentIds";
import { useProviderPopularity } from "shared/lib/providers/popularity/useProviderPopularity";
import { getVendorDisplayName } from "shared/lib/providers/vendors";
import { ContentActions } from "shared/ui/components/ContentActions";
import { ContentHeader } from "shared/ui/components/ContentHeader";
import { ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { FeatureTestingModal } from "shared/ui/components/FeatureTestingModal";
import type { FilterTypeValue } from "shared/ui/components/FilterType";
import { Pagination } from "shared/ui/components/Pagination";
import { Button } from "shared/ui/ui-kit/Button";
import type { FilterDropdownConfig } from "shared/ui/ui-kit/FilterDropdown";

import css from "./GroupBuysContent.module.scss";

interface Props {
   className?: string;
   // Set by the Sidebar's provider selection (see /group-buys page), same
   // as Content's selectedVendorId. undefined means "show every offer".
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
   isProVersion?: boolean;
}

type TabId = (typeof tabs)[number]["id"];

// GroupBuys only needs the two meaningful orderings — the sentiment
// options SortDropdown defaults to don't apply to bundles. "newest" keeps
// the feed's own order; "popular" ranks by the vendors each bundle
// unlocks (see the popularity API).
type GroupBuysSort = "newest" | "popular";

export const GroupBuysContent: React.FC<Props> = ({
   className,
   selectedVendorId,
   onSelectVendor,
   isProVersion = false,
}) => {
   const { t } = useTranslation();
   const { getClickCount, version: popularityVersion } = useProviderPopularity();

   const [activeTab, setActiveTab] = React.useState<GroupBuysTabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);
   const [sort, setSort] = React.useState<GroupBuysSort>("newest");

   // The "Фильтр" dropdown: service (vendor), price per seat, seat
   // availability and payment method — ANDed with the Sidebar's vendor.
   const [filterValue, setFilterValue] = React.useState<FilterTypeValue | null>(null);

   const priceCeiling = React.useMemo(
      () => Math.max(1, Math.ceil(Math.max(0, ...groupBuys.map((item) => item.price)))),
      []
   );

   const defaultFilterValue = React.useMemo<FilterTypeValue>(
      () => ({ types: [], minPrice: 0, maxPrice: priceCeiling, isActive: false, paymentIds: [] }),
      [priceCeiling]
   );
   const currentFilterValue = filterValue ?? defaultFilterValue;

   const matchesFilter = React.useCallback((item: GroupBuyItem, value: FilterTypeValue) => {
      const vendors = value.types.map((id) => id.replace(/^service-/, ""));

      if (vendors.length > 0 && !item.vendorIds.some((id) => vendors.includes(id))) {
         return false;
      }

      if (item.price < value.minPrice || item.price > value.maxPrice) {
         return false;
      }

      if (value.isActive && item.takenPersons >= item.totalPersons) {
         return false;
      }

      return (
         value.paymentIds.length === 0 || matchesPaymentIds([item.paymentMethod], value.paymentIds)
      );
   }, []);

   const vendorFiltered = React.useMemo(
      () =>
         selectedVendorId
            ? groupBuys.filter((item) => item.vendorIds.includes(selectedVendorId))
            : groupBuys,
      [selectedVendorId]
   );

   const filteredGroupBuys = React.useMemo(
      () => vendorFiltered.filter((item) => matchesFilter(item, currentFilterValue)),
      [vendorFiltered, matchesFilter, currentFilterValue]
   );

   const filterConfig = React.useMemo<FilterDropdownConfig>(() => {
      const counts = new Map<string, number>();

      for (const item of groupBuys) {
         for (const vendorId of item.vendorIds) {
            counts.set(vendorId, (counts.get(vendorId) ?? 0) + 1);
         }
      }

      return {
         title: t.filterDropdown.title,
         searchPlaceholder: t.filterDropdown.groupBuysSearch,
         priceLabel: t.filterDropdown.price,
         priceMax: priceCeiling,
         priceStep: 1,
         showStatus: true,
         data: [
            {
               id: "service",
               name: t.filterDropdown.service,
               type: [...counts].map(([vendorId, count]) => ({
                  id: vendorId,
                  name: getVendorDisplayName(vendorId),
                  count,
               })),
            },
         ],
         value: currentFilterValue,
         getResultCount: (value) =>
            vendorFiltered.filter((item) => matchesFilter(item, value)).length,
         onApply: setFilterValue,
         isActive:
            filterValue !== null &&
            (filterValue.types.length > 0 ||
               filterValue.minPrice > 0 ||
               filterValue.maxPrice < priceCeiling ||
               filterValue.isActive ||
               filterValue.paymentIds.length > 0),
      };
   }, [t, priceCeiling, currentFilterValue, filterValue, vendorFiltered, matchesFilter]);

   const orderedGroupBuys = React.useMemo(() => {
      if (sort !== "popular") {
         return filteredGroupBuys;
      }

      // A bundle's popularity is the total click-through across every vendor
      // it grants — a multi-vendor gateway offer outranks a single-vendor
      // one when those vendors are the ones being clicked.
      const popularityOf = (vendorIds: string[]) =>
         vendorIds.reduce((sum, vendorId) => sum + getClickCount(vendorId), 0);

      return [...filteredGroupBuys].sort(
         (first, second) => popularityOf(second.vendorIds) - popularityOf(first.vendorIds)
      );
   }, [filteredGroupBuys, sort, popularityVersion, getClickCount]);

   const sortOptions = [
      { value: "newest" as GroupBuysSort, label: t.sortDropdown.newest },
      { value: "popular" as GroupBuysSort, label: t.sortDropdown.popular },
   ];

   const handleSortChange = (value: GroupBuysSort) => {
      setSort(value);
      setCurrentPage(1);
   };

   const resultsCount = filteredGroupBuys.length;
   const totalPages = 10;
   const title = selectedVendorId
      ? getVendorDisplayName(selectedVendorId)
      : t.groupBuys.catalogTitle;

   const headerTabs: ContentHeaderTab<TabId>[] = tabs.map((tab) => ({
      id: tab.id,
      label: t.groupBuys.tabs[tab.translationKey],
   }));

   return (
      <div className={clsx(css.content, className)}>
         <ContentHeader
            title={title}
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={headerTabs}
            activeTab={activeTab}
            actionsVariant="group-buys"
            onTabChange={setActiveTab}
            sortOptions={sortOptions}
            sortValue={sort}
            onSortChange={handleSortChange}
            filter={filterConfig}
            selectedVendorId={selectedVendorId}
            onSelectVendor={onSelectVendor}
         />

         <ContentActions
            variant="group-buys"
            className={css.content_actions}
            sortOptions={sortOptions}
            sortValue={sort}
            onSortChange={handleSortChange}
            filter={filterConfig}
         />

         <div className={css.content_scroll}>
            <div className={css.content_list}>
               <GroupBuysList items={orderedGroupBuys} />

               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={setCurrentPage}
               />
            </div>
         </div>

         {isProVersion && (
            <>
               <div className={css.content_lock} />

               <FeatureTestingModal />
            </>
         )}
      </div>
   );
};
