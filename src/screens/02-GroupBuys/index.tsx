"use client";

import React from "react";

import { type GroupBuysTabId, groupBuys, tabs } from "./lib/groupBuys.data";
import { GroupBuysList } from "./ui/GroupBuysList";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { getVendorDisplayName } from "shared/lib/providers/vendors";
import { ContentActions } from "shared/ui/components/ContentActions";
import { ContentHeader } from "shared/ui/components/ContentHeader";
import { ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { FeatureTestingModal } from "shared/ui/components/FeatureTestingModal";
import { Pagination } from "shared/ui/components/Pagination";
import { Button } from "shared/ui/ui-kit/Button";

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

export const GroupBuysContent: React.FC<Props> = ({
   className,
   selectedVendorId,
   onSelectVendor,
   isProVersion = false,
}) => {
   const { t } = useTranslation();

   const [activeTab, setActiveTab] = React.useState<GroupBuysTabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);

   const filteredGroupBuys = React.useMemo(() => {
      if (!selectedVendorId) {
         return groupBuys;
      }

      return groupBuys.filter((item) => item.vendorIds.includes(selectedVendorId));
   }, [selectedVendorId]);

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
            actionsVariant="group"
            onTabChange={setActiveTab}
            selectedVendorId={selectedVendorId}
            onSelectVendor={onSelectVendor}
         />

         <ContentActions variant="group" className={css.content_actions} />

         <div className={css.content_scroll}>
            <div className={css.content_list}>
               <GroupBuysList items={filteredGroupBuys} />

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
