"use client";

import React from "react";

import { tabs } from "./lib/content.data";
import { toModelItems } from "./lib/providers-to-models";
import { ModelsTable } from "./ui/ModelsTable";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { useProviderRecords } from "shared/lib/providers/useProviderRecords";
import { getVendorDisplayName, getVendorId } from "shared/lib/providers/vendors";
import { ContentActions } from "shared/ui/components/ContentActions";
import { ContentHeader } from "shared/ui/components/ContentHeader";
import { ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./Content.module.scss";

type TabId = (typeof tabs)[number]["id"];

interface Prop {
   className?: string;
   // Set by the Sidebar's vendor/model selection (see /home page). Both
   // undefined means "show everything".
   selectedVendorId?: string;
   selectedModelId?: string;
}

export const Content: React.FC<Prop> = ({ className, selectedVendorId, selectedModelId }) => {
   const { t } = useTranslation();
   const { records } = useProviderRecords();

   const models = React.useMemo(() => toModelItems(records), [records]);

   const filteredModels = React.useMemo(() => {
      if (selectedModelId) {
         return models.filter((model) => model.canonicalModelId === selectedModelId);
      }

      if (selectedVendorId) {
         return models.filter((model) => getVendorId(model.canonicalModelId) === selectedVendorId);
      }

      return models;
   }, [models, selectedVendorId, selectedModelId]);

   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);
   const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);
   const descriptionRef = React.useRef<HTMLParagraphElement>(null);
   const [isDescriptionOverflowing, setIsDescriptionOverflowing] = React.useState(false);
   const [descriptionHeight, setDescriptionHeight] = React.useState(0);

   const totalPages = 10;
   const resultsCount = filteredModels.length;
   const catalogTitle = selectedVendorId
      ? getVendorDisplayName(selectedVendorId)
      : t.content.catalogTitle;

   const descriptionTranslation = t.content.modelDescription;

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
   }, [descriptionTranslation.text]);

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
         />

         <div className={css.content_scroll}>
            <div className={css.content_main}>
               <div className={css.content_main_inner}>
                  <h4>{descriptionTranslation.title}</h4>

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
                        {descriptionTranslation.text}
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
                           ... {descriptionTranslation.readMore}
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
                        {descriptionTranslation.showLess}
                     </button>
                  )}
               </div>
            </div>

            <ContentActions variant="api" className={css.content_actions} />

            <div className={css.content_list}>
               <ModelsTable models={filteredModels} />

               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={setCurrentPage}
               />
            </div>
         </div>
      </div>
   );
};
