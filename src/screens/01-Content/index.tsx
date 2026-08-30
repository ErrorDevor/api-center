"use client";

import React from "react";

import {
   DEFAULT_SORT,
   MODELS_SORT_PRESETS,
   type ModelsSortValue,
   type SortState,
   sortStateToValue,
   tabs,
} from "./lib/content.data";
import { toModelItems } from "./lib/providers-to-models";
import { ModelsTable } from "./ui/ModelsTable";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { type ModelContentType, modelMatchesContentType } from "shared/lib/models/modelType";
import { useModelCatalog } from "shared/lib/models/useModelCatalog";
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

   onSelectVendor?: (vendorId: string | undefined) => void;
   onSelectModel?: (modelId: string | undefined) => void;
   onSelectModelType?: (modelTypeId: string | undefined) => void;
}

export const Content: React.FC<Prop> = ({
   className,
   selectedVendorId,
   selectedModelId,
   selectedModelType,
   onSelectVendor,
   onSelectModel,
   onSelectModelType,
}) => {
   const { t, locale } = useTranslation();
   const { records } = useProviderRecords();
   const { entries: modelCatalog } = useModelCatalog();
   const { entries: vendorDescriptions } = useVendorDescriptions();

   const models = React.useMemo(() => toModelItems(records, modelCatalog), [records, modelCatalog]);

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

      return result;
   }, [models, selectedVendorId, selectedModelId, selectedModelType]);

   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
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
   const isMainListing = !selectedVendorId && !selectedModelId;
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedVendorId, selectedModelId]);

   const sortOptions: SortDropdownOption<ModelsSortValue>[] = [
      { value: "name_asc", label: t.content.actions.sort.nameAsc },
      { value: "price_asc", label: t.content.actions.sort.priceAsc },
      { value: "price_desc", label: t.content.actions.sort.priceDesc },
      { value: "popular", label: t.sortDropdown.popular },
   ];

   const handleSortValueChange = (value: ModelsSortValue) => {
      setSort(MODELS_SORT_PRESETS[value]);
   };

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
               <ModelsTable models={filteredModels} sort={sort} onSortChange={setSort} />
            </div>
         </div>
      </div>
   );
};
