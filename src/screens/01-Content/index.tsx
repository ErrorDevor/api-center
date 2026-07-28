"use client";

import React from "react";

import { tabs } from "./lib/content.data";
import { ModelsTable } from "./ui/ModelsTable";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { ContentActions } from "shared/ui/components/ContentActions";
import { Pagination } from "shared/ui/components/Pagination";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./Content.module.scss";

type TabId = (typeof tabs)[number]["id"];

interface Prop {
   className?: string;
}

export const Content: React.FC<Prop> = ({ className }) => {
   const { t } = useTranslation();

   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);
   const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);
   const descriptionRef = React.useRef<HTMLParagraphElement>(null);
   const [isDescriptionOverflowing, setIsDescriptionOverflowing] = React.useState(false);
   const [descriptionHeight, setDescriptionHeight] = React.useState(0);

   const totalPages = 10;
   const resultsCount = 158;

   const descriptionTranslation = t.content.modelDescription;

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
         <div className={css.content_top}>
            <div className={css.content_title}>
               <h2>OpenAI</h2>

               <span>
                  (<strong>{resultsCount}</strong> {t.content.results})
               </span>
            </div>

            <div className={css.divider} />

            <div className={css.content_buttons_nav}>
               {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                     <Button
                        key={tab.id}
                        variant="grey"
                        className={clsx(css.button_nav, isActive && css.button_nav_active)}
                        active={isActive}
                        onClick={() => setActiveTab(tab.id)}
                     >
                        {t.content.tabs[tab.translationKey]}
                     </Button>
                  );
               })}
            </div>

            <ContentActions />
         </div>

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

            <div className={css.content_list}>
               <ModelsTable />

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
