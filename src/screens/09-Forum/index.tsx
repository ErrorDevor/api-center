"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { forumTopic, tabs } from "./lib/data";
import { forumPostToCommentLayer } from "./lib/forum.type";
import {
   createForumPost,
   fetchForumReplies,
   replyToForumPost,
   useForumPosts,
   voteOnForumPost,
} from "./lib/useForumPosts";
import { ForumThread } from "./ui/ForumThread";
import clsx from "clsx";

import { useAuth } from "shared/lib/auth";
import { useTranslation } from "shared/lib/i18n";
import type { CommentLayerActions } from "shared/ui/components/CommentLayer";
import { ContentHeader, ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";

import css from "./ForumScreen.module.scss";

type TabId = (typeof tabs)[number]["id"];

interface Prop {
   className?: string;
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
}

export const ForumScreen: React.FC<Prop> = ({ className, selectedVendorId, onSelectVendor }) => {
   const { t } = useTranslation();
   const router = useRouter();
   const { status } = useAuth();

   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);
   const [isPosting, setIsPosting] = React.useState(false);

   const { result, isLoading, error, refetch } = useForumPosts(currentPage, "latest");

   const comments = React.useMemo(
      () => (result?.posts ?? []).map(forumPostToCommentLayer),
      [result]
   );

   const totalPages = Math.max(1, result?.pagination.pages ?? 1);
   const resultsCount = result?.pagination.total ?? 0;

   const requireAuth = React.useCallback(() => {
      router.push("/login");
   }, [router]);

   const commentActions: CommentLayerActions = React.useMemo(
      () => ({
         isAuthenticated: status === "authenticated",
         onRequireAuth: requireAuth,

         onVote: async (postId, voteType) => {
            const voteResult = await voteOnForumPost(postId, voteType);

            if (!voteResult.ok) {
               if (voteResult.status === 401) {
                  requireAuth();
               }

               throw new Error("Vote failed");
            }
         },

         onLoadReplies: async (postId) => {
            const repliesResult = await fetchForumReplies(postId);

            if (!repliesResult.ok) {
               return [];
            }

            return repliesResult.data.replies.map(forumPostToCommentLayer);
         },

         onReply: async (postId, content) => {
            const replyResult = await replyToForumPost(postId, content);

            if (!replyResult.ok) {
               if (replyResult.status === 401) {
                  requireAuth();
               }

               return false;
            }

            return true;
         },
      }),
      [status, requireAuth]
   );

   const handleCreatePost = async (content: string) => {
      if (status !== "authenticated") {
         requireAuth();
         return;
      }

      setIsPosting(true);

      const createResult = await createForumPost(content);

      setIsPosting(false);

      if (!createResult.ok) {
         if (createResult.status === 401) {
            requireAuth();
         }

         return;
      }

      if (currentPage === 1) {
         refetch();
      } else {
         setCurrentPage(1);
      }
   };

   const headerTabs: ContentHeaderTab<TabId>[] = tabs.map((tab) => ({
      id: tab.id,
      label: t.forum.tabs[tab.translationKey],
   }));

   return (
      <div className={clsx(css.forum, className)}>
         <ContentHeader
            title="OpenAI"
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={headerTabs}
            activeTab={activeTab}
            actionsVariant="forum"
            onTabChange={setActiveTab}
            selectedVendorId={selectedVendorId}
            onSelectVendor={onSelectVendor}
         />

         <div className={css.forum_list}>
            <div className={css.forum_list_inner}>
               <ForumThread
                  comments={comments}
                  userName={forumTopic.userName}
                  userAvatar={forumTopic.userAvatar}
                  providers={forumTopic.providers}
                  title={forumTopic.title}
                  description={forumTopic.description}
                  replyPlaceholder={t.common.replyPlaceholder}
                  replyButtonText={t.common.buttonText}
                  actions={commentActions}
                  isLoading={isLoading}
                  error={Boolean(error)}
                  isPosting={isPosting}
                  onCreatePost={handleCreatePost}
               />

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
