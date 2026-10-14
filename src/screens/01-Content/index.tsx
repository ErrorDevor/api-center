"use client";

import React from "react";

import {
   DEFAULT_SORT,
   MODELS_SORT_PRESETS,
   type ModelsSortValue,
   type SortState,
   TAB_PAYMENT_METHOD_MARKERS,
   sortStateToValue,
   tabs,
} from "./lib/content.data";
import { collapseToCheapest } from "./lib/collapseToCheapest";
import { filterModelsByQuery } from "./lib/matchModelQuery";
import { toModelItems } from "./lib/providers-to-models";
import { ModelsTable } from "./ui/ModelsTable";
import type { PinnedModel } from "./ui/ModelsTable";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { type ModelContentType, modelMatchesContentType } from "shared/lib/models/modelType";
import { useModelCatalog } from "shared/lib/models/useModelCatalog";
import { useGatewayPricing } from "shared/lib/gatewayPricing/useGatewayPricing";
import { useProviderRecords } from "shared/lib/providers/useProviderRecords";
import { getVendorDisplayName, getVendorId } from "shared/lib/providers/vendors";
import { GENERIC_VENDOR_SLUG } from "shared/lib/vendorDescriptions/types";
import { useVendorDescriptions } from "shared/lib/vendorDescriptions/useVendorDescriptions";
import { ContentActions } from "shared/ui/components/ContentActions";
import { ContentHeader } from "shared/ui/components/ContentHeader";
import { ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Button } from "shared/ui/ui-kit/Button";
import type { SortDropdownOption } from "shared/ui/ui-kit/SortDropdown";

import css from "./Content.module.scss";

type TabId = (typeof tabs)[number]["id"];

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

// Vendors whose top model is pinned as a BestAIPrice row on the main listing.
const MAIN_PAGE_PINNED_VENDORS = ["google", "openai", "anthropic"];

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

   const models = React.useMemo(() => toModelItems(records, modelCatalog), [records, modelCatalog]);
   const { entries: gatewayPricing } = useGatewayPricing();

   // A search behaves like drilling in: results stay per-reseller (not
   // collapsed) and default to cheapest-first, so a "sonnet" query is a
   // price comparison across every provider carrying it.
   const isSearching = Boolean(selectedSearchQuery?.trim());

   // The unfiltered "all providers" listing (главная) collapses to one row
   // per model (cheapest per-token offer); a specific vendor/model — or an
   // active search — still shows every reseller's row. A Model-Type filter
   // alone doesn't count as drilling in — same rule as defaultSort below.
   const isMainListing = !selectedVendorId && !selectedModelId && !isSearching;

   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);

   const filteredModels = React.useMemo(() => {
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
            modelMatchesContentType(model.canonicalModelId, selectedModelType as ModelContentType)
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

      if (isMainListing) {
         result = collapseToCheapest(result);
      }

      return result;
   }, [
      models,
      isMainListing,
      selectedVendorId,
      selectedModelId,
      selectedModelType,
      selectedSearchQuery,
      activeTab,
   ]);
   // BestAIPrice rows pinned above the reseller listing. A model page pins
   // that model; a vendor page its 3 most popular models; the main listing
   // the single most popular model of each flagship vendor. "Popular" =
   // offered by the most distinct resellers (the only per-model popularity
   // signal we have), among models the gateway actually prices.
   const pinnedModels = React.useMemo<PinnedModel[]>(() => {
      const toPinned = (canonicalModelId: string): PinnedModel | null => {
         const model = models.find((item) => item.canonicalModelId === canonicalModelId);

         return {
            canonicalModelId,
            name: model?.name ?? canonicalModelId,
            description: model?.description[locale],
         };
      };

      if (selectedModelId) {
         return [toPinned(selectedModelId)].filter((item): item is PinnedModel => item !== null);
      }

      // A search or model-type filter isn't a text-model price comparison.
      if (isSearching || selectedModelType) {
         return [];
      }

      const pricedIds = new Set(
         gatewayPricing
            .filter(
               (entry) =>
                  (entry.inputPrice !== null && entry.outputPrice !== null) ||
                  entry.nativePriceUsd !== null
            )
            .map((entry) => entry.canonicalModelId)
      );

      const resellersByModel = new Map<string, Set<string>>();

      for (const model of models) {
         if (!pricedIds.has(model.canonicalModelId)) {
            continue;
         }

         const resellers = resellersByModel.get(model.canonicalModelId) ?? new Set<string>();

         resellers.add(model.providerDomain);
         resellersByModel.set(model.canonicalModelId, resellers);
      }

      const topForVendor = (vendorId: string, limit: number): string[] =>
         [...resellersByModel.entries()]
            .filter(([canonicalModelId]) => getVendorId(canonicalModelId) === vendorId)
            .sort((first, second) => second[1].size - first[1].size)
            .slice(0, limit)
            .map(([canonicalModelId]) => canonicalModelId);

      const ids = selectedVendorId
         ? topForVendor(selectedVendorId, 3)
         : MAIN_PAGE_PINNED_VENDORS.flatMap((vendorId) => topForVendor(vendorId, 1));

      return ids.map(toPinned).filter((item): item is PinnedModel => item !== null);
   }, [models, gatewayPricing, locale, selectedModelId, selectedVendorId, selectedModelType, isSearching]);

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

   const resultsCount = filteredModels.length;
   const catalogTitle = selectedVendorId
      ? getVendorDisplayName(selectedVendorId)
      : t.content.catalogTitle;

   // Reflect the catalog in the browser tab. This screen is a client
   // component (selection lives in the URL, read on the page), so there's
   // no server generateMetadata to set the title from — same approach as
   // the reviews screen.
   React.useEffect(() => {
      const baseTitle = "BEST AI PRICE – Compare AI API Prices Across 100+ Providers";

      document.title =
         selectedVendorId || selectedModelId ? `${catalogTitle} – ${baseTitle}` : baseTitle;

      return () => {
         document.title = "APIcenter";
      };
   }, [catalogTitle, selectedVendorId, selectedModelId]);

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
            />

            <div className={css.content_list}>
               <ModelsTable
                  models={filteredModels}
                  sort={sort}
                  onSortChange={setSort}
                  pinnedModels={pinnedModels}
               />
            </div>
         </div>
      </div>
   );
};
