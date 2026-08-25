"use client";

import React from "react";

import { modelType } from "../lib/sidebar.data";
import { toSidebarProviders } from "../lib/providers-to-sidebar";
import type {
   ProviderItem as ProviderItemType,
   ProviderModel,
   SidebarMode,
} from "../lib/sidebar.types";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { useProviderRecords } from "shared/lib/providers/useProviderRecords";
import { DropdownArrowIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import { ProviderAccordion } from "./ProviderAccordion";
import { ProviderItem } from "./ProviderItem";
import { SidebarList } from "./SidebarList";
import { SidebarSwitcher } from "./SidebarSwitcher";

import css from "../Sidebar.module.scss";

const VISIBLE_PROVIDERS_COUNT = 8;

interface Props {
   className?: string;
   // When the caller passes onSelectVendor, the active provider/model is
   // controlled by it (e.g. /home mirrors the selection into the URL, so
   // that must stay the source of truth for what's highlighted here too).
   // Callers that don't care about the selection (other pages, the mobile
   // sidebar) get the old self-contained click-to-highlight behavior.
   activeVendorId?: string;
   activeModelId?: string;
   // Notified on every explicit user click so a page (e.g. /home) can filter
   // its model table accordingly. Not called by internal-only state changes.
   onSelectVendor?: (vendorId: string | undefined) => void;
   onSelectModel?: (canonicalModelId: string | undefined) => void;
}

export const SidebarContent: React.FC<Props> = ({
   className,
   activeVendorId,
   activeModelId,
   onSelectVendor,
   onSelectModel,
}) => {
   const { t } = useTranslation();
   const { records } = useProviderRecords();

   const providers = React.useMemo(() => toSidebarProviders(records), [records]);

   const isControlled = onSelectVendor !== undefined;

   const [uncontrolledProviderId, setUncontrolledProviderId] = React.useState<string | undefined>(
      undefined
   );
   const [uncontrolledModelId, setUncontrolledModelId] = React.useState<string | undefined>(
      undefined
   );
   const [activeModelType, setActiveModelType] = React.useState(modelType[0].id);
   const [showAll, setShowAll] = React.useState(false);

   const activeProviderId = isControlled ? activeVendorId : uncontrolledProviderId;
   const activeModel = isControlled ? activeModelId : uncontrolledModelId;

   const visibleProviders =
      showAll || providers.length <= VISIBLE_PROVIDERS_COUNT
         ? providers
         : providers.slice(0, VISIBLE_PROVIDERS_COUNT);

   // Clicking the already-active provider/model clears the selection (shows
   // everything again) instead of being a dead click.
   const handleProviderClick = (providerId: string) => {
      const isDeselecting = activeProviderId === providerId && activeModel === undefined;
      const nextProviderId = isDeselecting ? undefined : providerId;

      if (!isControlled) {
         setUncontrolledProviderId(nextProviderId);
         setUncontrolledModelId(undefined);
      }

      onSelectVendor?.(nextProviderId);
      onSelectModel?.(undefined);
   };

   const handleModelClick = (provider: ProviderItemType, model: ProviderModel) => {
      const isDeselecting = activeModel === model.id;
      const nextModelId = isDeselecting ? undefined : model.id;

      if (!isControlled) {
         setUncontrolledProviderId(provider.id);
         setUncontrolledModelId(nextModelId);
      }

      onSelectVendor?.(provider.id);
      onSelectModel?.(nextModelId);
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
                           activeModelId={activeModel}
                           initialOpen={activeProviderId === provider.id}
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

               {providers.length > VISIBLE_PROVIDERS_COUNT && (
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
               )}
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
