"use client";

import React from "react";

import { collapseToCheapest } from "./lib/collapseToCheapest";
import {
   DEFAULT_SORT,
   MODELS_SORT_PRESETS,
   type ModelItem,
   type ModelsSortValue,
   type SortState,
   TAB_PAYMENT_METHOD_MARKERS,
   sortStateToValue,
   tabs,
} from "./lib/content.data";
import { filterModelsByQuery } from "./lib/matchModelQuery";
import { toModelItems } from "./lib/providers-to-models";
import { usePinnedModels } from "./lib/usePinnedModels";
import { ModelsTable } from "./ui/ModelsTable";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import type { ModelContentType } from "shared/lib/models/modelType";
import { useModelContentTypes } from "shared/lib/models/useModelCapabilities";
import { useModelCatalog } from "shared/lib/models/useModelCatalog";
import { matchesPaymentIds } from "shared/lib/payments/matchPaymentIds";
import { useProviderRecords } from "shared/lib/providers/useProviderRecords";
import { getVendorDisplayName, getVendorId } from "shared/lib/providers/vendors";
import { GENERIC_VENDOR_SLUG } from "shared/lib/vendorDescriptions/types";
import { useVendorDescriptions } from "shared/lib/vendorDescriptions/useVendorDescriptions";
import { ContentActions } from "shared/ui/components/ContentActions";
import { ContentHeader } from "shared/ui/components/ContentHeader";
import { ContentHeaderTab } from "shared/ui/components/ContentHeader";
import type { FilterTypeData, FilterTypeValue } from "shared/ui/components/FilterType";
import { Button } from "shared/ui/ui-kit/Button";
import type { FilterDropdownConfig } from "shared/ui/ui-kit/FilterDropdown";
import type { SortDropdownOption } from "shared/ui/ui-kit/SortDropdown";

import css from "./Content.module.scss";

type TabId = (typeof tabs)[number]["id"];

// Same order as the Sidebar's "Model Type" list.
const MODEL_TYPE_DROPDOWN_ORDER: ModelContentType[] = [
   "coding",
   "text",
   "chat",
   "images",
   "search",
   "audioVideo",
];

interface Prop {
   className?: string;
   // Set by the Sidebar's vendor/model selection (see /home page). Both
   // undefined means "show everything".
   selectedVendorId?: string;
   selectedModelId?: string;
   // Set by the Sidebar's "Model Type" filter — ANDed with the vendor/model
   // selection above rather than replacing it.
   selectedModelType?: string;
   // Free-text query from the header search box (the `?q=` param — see
   // shared/ui/components/CatalogSearch). ANDed with the type filter above;
   // arriving here it has already cleared any vendor/model path drill-in.
   selectedSearchQuery?: string;

   onSelectVendor?: (vendorId: string | undefined) => void;
   onSelectModel?: (modelId: string | undefined) => void;
   onSelectModelType?: (modelTypeId: string | undefined) => void;
}

export const Content: React.FC<Prop> = ({
   className,
   selectedVendorId,
   selectedModelId,
   selectedModelType,
   selectedSearchQuery,
   onSelectVendor,
   onSelectModel,
   onSelectModelType,
}) => {
   const { t, locale } = useTranslation();
   const { records } = useProviderRecords();
   const { entries: modelCatalog } = useModelCatalog();
   const { entries: vendorDescriptions } = useVendorDescriptions();
   const { getContentTypes } = useModelContentTypes();

   const models = React.useMemo(() => toModelItems(records, modelCatalog), [records, modelCatalog]);

   // A search behaves like drilling in: results stay per-reseller (not
   // collapsed) and default to cheapest-first, so a "sonnet" query is a
   // price comparison across every provider carrying it.
   const isSearching = Boolean(selectedSearchQuery?.trim());

   // The unfiltered "all providers" listing (главная) collapses to one row
   // per model (cheapest per-token offer); a specific vendor/model — or an
   // active search — still shows every reseller's row. A Model-Type filter
   // alone doesn't count as drilling in — same rule as defaultSort below.
   const isMainListing = !selectedVendorId && !selectedModelId && !isSearching;

   const pinnedModels = usePinnedModels(models, selectedVendorId, selectedModelId);

   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);

   // The "Фильтр" dropdown (same UI as group-buys): model types, input-price
   // range and payment methods. ANDed with the Sidebar's vendor/type
   // selection and the header tabs.
   const [catalogFilter, setCatalogFilter] = React.useState<FilterTypeValue | null>(null);

   const priceCeiling = React.useMemo(() => {
      const prices = models.map((model) => model.inputPrice ?? model.nativePriceUsd ?? 0);

      return Math.max(1, Math.ceil(Math.max(0, ...prices)));
   }, [models]);
   const priceStep = priceCeiling > 50 ? 1 : priceCeiling > 10 ? 0.5 : 0.1;

   const defaultFilterValue = React.useMemo<FilterTypeValue>(
      () => ({ types: [], minPrice: 0, maxPrice: priceCeiling, isActive: false, paymentIds: [] }),
      [priceCeiling]
   );
   const filterValue = catalogFilter ?? defaultFilterValue;

   const matchesCatalogFilter = React.useCallback(
      (model: ModelItem, value: FilterTypeValue): boolean => {
         const types = value.types.map((id) => id.replace(/^type-/, ""));

         if (
            types.length > 0 &&
            !getContentTypes(model.canonicalModelId).some((type) => types.includes(type))
         ) {
            return false;
         }

         const isPriceFiltered = value.minPrice > 0 || value.maxPrice < priceCeiling;
         const price = model.inputPrice ?? model.nativePriceUsd;

         if (
            isPriceFiltered &&
            (price === null || price < value.minPrice || price > value.maxPrice)
         ) {
            return false;
         }

         return (
            value.paymentIds.length === 0 ||
            matchesPaymentIds(model.paymentMethods, value.paymentIds)
         );
      },
      [getContentTypes, priceCeiling]
   );

   const filterGroups = React.useMemo<FilterTypeData>(() => {
      const counts = new Map<string, number>();

      for (const record of records) {
         for (const contentType of getContentTypes(record.canonicalModelId)) {
            counts.set(contentType, (counts.get(contentType) ?? 0) + 1);
         }
      }

      return [
         {
            id: "type",
            name: t.sidebar.modelTypeTitle,
            type: MODEL_TYPE_DROPDOWN_ORDER.map((contentType) => ({
               id: contentType,
               name: t.sidebar.modelTypes[contentType],
               count: counts.get(contentType) ?? 0,
            })),
         },
      ];
   }, [records, getContentTypes, t]);

   const isFilterActive =
      catalogFilter !== null &&
      (catalogFilter.types.length > 0 ||
         catalogFilter.minPrice > 0 ||
         catalogFilter.maxPrice < priceCeiling ||
         catalogFilter.paymentIds.length > 0);

   // Everything but the dropdown filter and the main-listing collapse.
   const baseFilteredModels = React.useMemo(() => {
      let result = models;

      if (selectedModelId) {
         result = result.filter((model) => model.canonicalModelId === selectedModelId);
      } else if (selectedVendorId) {
         result = result.filter(
            (model) => getVendorId(model.canonicalModelId) === selectedVendorId
         );
      }

      if (selectedModelType) {
         result = result.filter((model) =>
            getContentTypes(model.canonicalModelId).includes(selectedModelType as ModelContentType)
         );
      }

      if (selectedSearchQuery) {
         result = filterModelsByQuery(result, selectedSearchQuery);
      }

      // Each header tab ("Crypto" / "Payment to account" / "Free test")
      // narrows to listings whose payment_methods carry one of the tab's
      // markers — see TAB_PAYMENT_METHOD_MARKERS for the mapping and its
      // caveats (notably "Crypto" being a no-op until the feed stops
      // tagging every record with it).
      const tabMarkers = TAB_PAYMENT_METHOD_MARKERS[activeTab];

      if (tabMarkers) {
         result = result.filter((model) =>
            model.paymentMethods.some((method) => tabMarkers.includes(method))
         );
      }

      return result;
   }, [
      models,
      selectedVendorId,
      selectedModelId,
      selectedModelType,
      selectedSearchQuery,
      activeTab,
      getContentTypes,
   ]);

   // A vendor family page (e.g. Claude): not a single model, not a search.
   const isVendorFamilyListing = Boolean(selectedVendorId) && !selectedModelId && !isSearching;

   // The главная and a family page break up runs of the same provider (see
   // diversifyProviders); a model page / search keeps its plain sort order.
   const shouldLimitProviderRuns = isMainListing || isVendorFamilyListing;

   const arrangeListing = React.useCallback(
      (items: ModelItem[]) => (isMainListing ? collapseToCheapest(items) : items),
      [isMainListing]
   );

   const filteredModels = React.useMemo(
      () =>
         arrangeListing(
            isFilterActive
               ? baseFilteredModels.filter((model) => matchesCatalogFilter(model, filterValue))
               : baseFilteredModels
         ),
      [baseFilteredModels, isFilterActive, matchesCatalogFilter, filterValue, arrangeListing]
   );

   // The "Show (N)" count: listings the table would show with the dropdown's
   // pending selection, everything else (vendor, tab, search) unchanged.
   const getFilterResultCount = (value: FilterTypeValue) =>
      arrangeListing(baseFilteredModels.filter((model) => matchesCatalogFilter(model, value)))
         .length;

   const filterConfig: FilterDropdownConfig = {
      title: t.sidebar.modelTypeTitle,
      searchPlaceholder: t.filterDropdown.catalogSearch,
      priceLabel: t.filterDropdown.catalogPrice,
      priceMax: priceCeiling,
      priceStep,
      showSearch: false,
      showPayment: false,
      data: filterGroups,
      value: filterValue,
      getResultCount: getFilterResultCount,
      onApply: setCatalogFilter,
      isActive: isFilterActive,
   };

   const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);
   const descriptionRef = React.useRef<HTMLParagraphElement>(null);
   const [isDescriptionOverflowing, setIsDescriptionOverflowing] = React.useState(false);
   const [descriptionHeight, setDescriptionHeight] = React.useState(0);

   // Drives both the "Сортировка" dropdown (ContentActions, below) and the
   // table's own per-column sort icons (ModelsTable) — one state so picking
   // an option in either place is reflected in the other.
   // The unfiltered "all providers" listing (главная) defaults to
   // alphabetical, same as always. Everywhere else — a specific vendor or
   // model's offers — defaults to cheapest-first instead, since that's the
   // comparison you're actually there to make.
   const defaultSort = isMainListing ? DEFAULT_SORT : MODELS_SORT_PRESETS.price_asc;

   const [sort, setSort] = React.useState<SortState>(defaultSort);

   // selectedVendorId/selectedModelId change via client-side navigation
   // without remounting this component, so the lazy initial state above
   // only covers the first render — re-apply the context's default sort
   // whenever which listing we're on changes.
   React.useEffect(() => {
      setSort(defaultSort);
      // Only the listing identity should trigger a reset, not every
      // defaultSort object re-creation (a new object each render since it's
      // not memoized) or this would fight the user's own dropdown clicks.
      // isSearching is a boolean that only flips on the empty↔non-empty edge,
      // so it resets when a search starts/ends but not on every keystroke.
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedVendorId, selectedModelId, isSearching]);

   const sortOptions: SortDropdownOption<ModelsSortValue>[] = [
      { value: "name_asc", label: t.content.actions.sort.nameAsc },
      { value: "price_asc", label: t.content.actions.sort.priceAsc },
      { value: "price_desc", label: t.content.actions.sort.priceDesc },
      { value: "newest", label: t.content.actions.sort.newest },
      { value: "popular", label: t.sortDropdown.popular },
   ];

   const handleSortValueChange = (value: ModelsSortValue) => {
      setSort(MODELS_SORT_PRESETS[value]);
   };

   // A pinned BestAIPrice row only belongs above results it matches: with no
   // matches (or a search/filter that excludes its model) it would sit over
   // the "No models found" message.
   const visiblePinnedModels = React.useMemo(() => {
      const visibleModelIds = new Set(filteredModels.map((model) => model.canonicalModelId));

      return pinnedModels.filter(({ id }) => visibleModelIds.has(id));
   }, [pinnedModels, filteredModels]);

   const resultsCount = filteredModels.length;
   const catalogTitle = selectedVendorId
      ? getVendorDisplayName(selectedVendorId)
      : t.content.catalogTitle;

   // Below the fold, the description block used to always say "GPT-5.6
   // Terra" no matter what — now it's generic by default and names the
   // selected vendor, same as the header title above. Text is sourced from
   // api_descriptions.json (see useVendorDescriptions) — a per-vendor,
   // already-localized title/blurb pair, keyed by vendor_slug — falling
   // back to the templated i18n strings while that feed is loading/missing
   // a matching entry (e.g. a vendor not yet in the feed).
   const vendorDescriptionEntry =
      vendorDescriptions.find(
         (entry) => entry.vendorSlug === (selectedVendorId ?? GENERIC_VENDOR_SLUG)
      ) ?? vendorDescriptions.find((entry) => entry.vendorSlug === GENERIC_VENDOR_SLUG);

   const descriptionProvider = selectedVendorId
      ? getVendorDisplayName(selectedVendorId)
      : t.content.modelDescription.defaultProvider;
   const descriptionTitle = vendorDescriptionEntry
      ? locale === "ru"
         ? vendorDescriptionEntry.titleRu
         : vendorDescriptionEntry.titleEn
      : t.content.modelDescription.title.replace("{provider}", descriptionProvider);
   const descriptionText = vendorDescriptionEntry
      ? locale === "ru"
         ? vendorDescriptionEntry.descriptionRu
         : vendorDescriptionEntry.descriptionEn
      : t.content.modelDescription.text.replace("{provider}", descriptionProvider);

   const headerTabs: ContentHeaderTab<TabId>[] = tabs.map((tab) => ({
      id: tab.id,
      label: t.content.tabs[tab.translationKey],
   }));

   React.useLayoutEffect(() => {
      const descriptionElement = descriptionRef.current;

      if (!descriptionElement) {
         return;
      }

      const updateDescriptionSize = () => {
         const styles = window.getComputedStyle(descriptionElement);
         const lineHeight = Number.parseFloat(styles.lineHeight);
         const collapsedHeight = lineHeight * 3;
         const fullHeight = descriptionElement.scrollHeight;

         setDescriptionHeight(fullHeight);
         setIsDescriptionOverflowing(fullHeight > collapsedHeight + 1);
      };

      updateDescriptionSize();

      const resizeObserver = new ResizeObserver(updateDescriptionSize);

      resizeObserver.observe(descriptionElement);

      return () => {
         resizeObserver.disconnect();
      };
   }, [descriptionText]);

   const handleDescriptionToggle = () => {
      setIsDescriptionExpanded((currentValue) => !currentValue);
   };

   return (
      <div className={clsx(css.content, className)}>
         <ContentHeader
            title={catalogTitle}
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={headerTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            sortOptions={sortOptions}
            sortValue={sortStateToValue(sort)}
            onSortChange={handleSortValueChange}
            filter={filterConfig}
            selectedVendorId={selectedVendorId}
            selectedModelId={selectedModelId}
            selectedModelType={selectedModelType}
            onSelectVendor={onSelectVendor}
            onSelectModel={onSelectModel}
            onSelectModelType={onSelectModelType}
         />

         <div className={css.content_scroll}>
            <div className={css.content_main}>
               <div className={css.content_main_inner}>
                  <h4>{descriptionTitle}</h4>

                  <div
                     className={clsx(
                        css.content_description,
                        isDescriptionExpanded && css.content_description_expanded
                     )}
                     style={
                        {
                           "--description-expanded-height": `${descriptionHeight}px`,
                        } as React.CSSProperties
                     }
                  >
                     <p ref={descriptionRef} className={css.content_description_text}>
                        {descriptionText}
                     </p>

                     {isDescriptionOverflowing && !isDescriptionExpanded && (
                        <button
                           type="button"
                           className={clsx(
                              css.content_description_button,
                              css.content_description_button_more
                           )}
                           aria-expanded={false}
                           onClick={handleDescriptionToggle}
                        >
                           ... {t.content.modelDescription.readMore}
                        </button>
                     )}
                  </div>

                  {isDescriptionOverflowing && isDescriptionExpanded && (
                     <button
                        type="button"
                        className={clsx(
                           css.content_description_button,
                           css.content_description_button_less
                        )}
                        aria-expanded
                        onClick={handleDescriptionToggle}
                     >
                        {t.content.modelDescription.showLess}
                     </button>
                  )}
               </div>
            </div>

            <ContentActions
               variant="api"
               className={css.content_actions}
               sortOptions={sortOptions}
               sortValue={sortStateToValue(sort)}
               onSortChange={handleSortValueChange}
               filter={filterConfig}
            />

            <div className={css.content_list}>
               <ModelsTable
                  models={filteredModels}
                  sort={sort}
                  onSortChange={setSort}
                  pinnedModels={visiblePinnedModels}
                  limitProviderRuns={shouldLimitProviderRuns}
               />
            </div>
         </div>
      </div>
   );
};
