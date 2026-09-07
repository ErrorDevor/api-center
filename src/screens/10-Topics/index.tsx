"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { topicsTabs } from "./lib/data";
import { forumTopicToTopicItem } from "./lib/topics.mapper";
import { CreateTopicModal } from "./ui/CreateTopicModal";
import { TopicsList } from "./ui/TopicsList";
import clsx from "clsx";

import { useAuth } from "shared/lib/auth";
import { createForumTopic, useForumTopics } from "shared/lib/forum";
import type { ForumTopicsSort } from "shared/lib/forum";
import { useTranslation } from "shared/lib/i18n";
import { ContentHeader, ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";

import css from "./TopicsScreen.module.scss";

type TabId = (typeof topicsTabs)[number]["id"];

interface Prop {
   className?: string;
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
}

export const TopicsScreen: React.FC<Prop> = ({ className, selectedVendorId, onSelectVendor }) => {
   const { t } = useTranslation();
   const router = useRouter();
   const { status } = useAuth();

   const [activeTab, setActiveTab] = React.useState<TabId>(topicsTabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);
   const [sort, setSort] = React.useState<ForumTopicsSort>("latest");
   const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
   const [isPublishing, setIsPublishing] = React.useState(false);
   const [publishFailed, setPublishFailed] = React.useState(false);

   const { result, isLoading, error, refetch } = useForumTopics(currentPage, sort);

   const topics = React.useMemo(
      () => (result?.topics ?? []).map(forumTopicToTopicItem),
      [result]
   );

   const totalPages = Math.max(1, result?.pagination.pages ?? 1);
   const resultsCount = result?.pagination.total ?? 0;

   const headerTabs: ContentHeaderTab<TabId>[] = topicsTabs.map((tab) => ({
      id: tab.id,
      label: t.forum.tabs[tab.translationKey],
   }));

   const sortOptions = [
      { value: "latest" as ForumTopicsSort, label: t.sortDropdown.newest },
      { value: "top_liked" as ForumTopicsSort, label: t.sortDropdown.popular },
      { value: "most_comments" as ForumTopicsSort, label: t.sortDropdown.mostComments },
   ];

   const requireAuth = React.useCallback(() => {
      router.push("/login");
   }, [router]);

   const handleSortChange = (nextSort: ForumTopicsSort) => {
      setSort(nextSort);
      setCurrentPage(1);
   };

   const handleTopicClick = (topicId: number) => {
      router.push(`/topic/${topicId}`);
   };

   const handleOpenCreateModal = () => {
      if (status !== "authenticated") {
         requireAuth();

         return;
      }

      setPublishFailed(false);
      setIsCreateModalOpen(true);
   };

   const handleCreateTopic = async (title: string, content: string) => {
      setIsPublishing(true);

      const createResult = await createForumTopic(title, content);

      setIsPublishing(false);

      if (!createResult.ok) {
         if (createResult.status === 401) {
            setIsCreateModalOpen(false);
            requireAuth();

            return;
         }

         setPublishFailed(true);

         return;
      }

      setIsCreateModalOpen(false);

      // A brand-new topic is the newest one, so it only shows up on page 1
      // of the default sort — jump there rather than refetching a page it
      // wouldn't appear on.
      if (currentPage === 1) {
         refetch();
      } else {
         setCurrentPage(1);
      }
   };

   return (
      <div className={clsx(css.topics, className)}>
         <ContentHeader
            title={t.forum.discussionsTitle}
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={headerTabs}
            activeTab={activeTab}
            actionsVariant="group"
            onTabChange={setActiveTab}
            sortOptions={sortOptions}
            sortValue={sort}
            onSortChange={handleSortChange}
            onCreate={handleOpenCreateModal}
            selectedVendorId={selectedVendorId}
            onSelectVendor={onSelectVendor}
            withTabs={false}
         />

         <div className={css.topics_list}>
            <div className={css.topics_list_inner}>
               {error && <p className={css.topics_message}>{t.forum.loadError}</p>}

               {!isLoading && !error && topics.length === 0 && (
                  <p className={css.topics_message}>{t.forum.empty}</p>
               )}

               <TopicsList topics={topics} onTopicClick={handleTopicClick} />

               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={setCurrentPage}
               />
            </div>
         </div>

         <CreateTopicModal
            isOpen={isCreateModalOpen}
            isSubmitting={isPublishing}
            error={publishFailed}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateTopic}
         />
      </div>
   );
};
