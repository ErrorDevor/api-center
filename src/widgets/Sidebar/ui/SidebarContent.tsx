"use client";

import React from "react";

import { modelType, providers } from "../lib/sidebar.data";
import type {
   ProviderItem as ProviderItemType,
   ProviderModel,
   SidebarMode,
} from "../lib/sidebar.types";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { DropdownArrowIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import { ProviderAccordion } from "./ProviderAccordion";
import { ProviderItem } from "./ProviderItem";
import { SidebarList } from "./SidebarList";
import { SidebarSwitcher } from "./SidebarSwitcher";

import css from "../Sidebar.module.scss";

interface Props {
   className?: string;
}

export const SidebarContent: React.FC<Props> = ({ className }) => {
   const { t } = useTranslation();

   const [activeProviderId, setActiveProviderId] = React.useState("openai");
   const [activeModelId, setActiveModelId] = React.useState("gpt-5-6-terra");
   const [activeModelType, setActiveModelType] = React.useState(modelType[0].id);
   const [showAll, setShowAll] = React.useState(false);

   const visibleProviders = showAll ? providers : providers.slice(0, 8);

   const handleProviderClick = (providerId: string) => {
      setActiveProviderId(providerId);
   };

   const handleModelClick = (provider: ProviderItemType, model: ProviderModel) => {
      setActiveProviderId(provider.id);
      setActiveModelId(model.id);
   };

   return (
      <div className={clsx(css.sidebar_inner, className)}>
         <div className={css.sidebar_top}>
            <SidebarSwitcher />
         </div>

         <div className={css.sidebar_content}>
            <span className={css.sidebar_label}>{t.common.provider}</span>

            <div className={css.providers}>
               {visibleProviders.map((provider) => {
                  const hasModels = Boolean(provider.models?.length);

                  if (hasModels) {
                     return (
                        <ProviderAccordion
                           key={provider.id}
                           provider={provider}
                           activeProviderId={activeProviderId}
                           activeModelId={activeModelId}
                           onProviderClick={handleProviderClick}
                           onModelClick={handleModelClick}
                        />
                     );
                  }

                  return (
                     <ProviderItem
                        key={provider.id}
                        provider={provider}
                        active={activeProviderId === provider.id}
                        onClick={() => handleProviderClick(provider.id)}
                     />
                  );
               })}

               <button
                  type="button"
                  className={css.show_more}
                  onClick={() => setShowAll((current) => !current)}
               >
                  <DropdownArrowIcon
                     className={clsx(css.show_more_icon, showAll && css.show_more_icon_opened)}
                  />

                  {showAll ? t.sidebar.showLess : t.sidebar.showMore}
               </button>
            </div>

            <SidebarList
               title={t.sidebar.modelTypeTitle}
               list={modelType}
               activeId={activeModelType}
               onChange={setActiveModelType}
            />

            <div className={css.sidebar_forum}>
               <h6>{t.sidebar.forum}</h6>

               <Button variant="grey" className={css.sidebar_forum_button}>
                  {t.sidebar.discussions}
               </Button>
            </div>
         </div>
      </div>
   );
};
