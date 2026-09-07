"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { forumCommentToCommentLayer } from "./lib/comments.mapper";
import { tabs } from "./lib/data";
import { ForumThread } from "./ui/ForumThread";
import clsx from "clsx";

import { useAuth } from "shared/lib/auth";
import {
   createTopicComment,
   fetchForumReplies,
   replyToForumComment,
   useForumTopic,
   useTopicComments,
   voteOnForumComment,
} from "shared/lib/forum";
import type { ForumCommentsSort } from "shared/lib/forum";
import { useTranslation } from "shared/lib/i18n";
import type { CommentLayerActions } from "shared/ui/components/CommentLayer";
import { ContentHeader, ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";

import css from "./ForumScreen.module.scss";

type TabId = (typeof tabs)[number]["id"];

interface Prop {
   className?: string;
   // The topic this thread renders — /topic/[id]'s route param.
   topicId?: string;
   selectedVendorId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
}

export const ForumScreen: React.FC<Prop> = ({
   className,
   topicId,
   selectedVendorId,
   onSelectVendor,
}) => {
   const { t } = useTranslation();
   const router = useRouter();
   const { status } = useAuth();

   const [activeTab, setActiveTab] = React.useState<TabId>(tabs[0].id);
   const [currentPage, setCurrentPage] = React.useState(1);
   const [isPosting, setIsPosting] = React.useState(false);

   // Comment order isn't user-selectable on this screen yet (the header's
   // sort dropdown drives the /discussions list, not a thread) — newest
   // first matches how the reply box appends to the top of page 1.
   const sort: ForumCommentsSort = "latest";

   const { topic, isMissing, error: topicError } = useForumTopic(topicId);
   const {
      result,
      isLoading,
      error: commentsError,
      refetch,
   } = useTopicComments(topicId, currentPage, sort);

   const comments = React.useMemo(
      () => (result?.comments ?? []).map(forumCommentToCommentLayer),
      [result]
   );

   const totalPages = Math.max(1, result?.pagination.pages ?? 1);
   // The header count is the topic's own comment_count (all pages), falling
   // back to this page's pagination total before the topic has loaded.
   const resultsCount = topic?.commentCount ?? result?.pagination.total ?? 0;

   const requireAuth = React.useCallback(() => {
      router.push("/login");
   }, [router]);

   const commentActions: CommentLayerActions = React.useMemo(
      () => ({
         isAuthenticated: status === "authenticated",
         onRequireAuth: requireAuth,

         onVote: async (commentId, voteType) => {
            const voteResult = await voteOnForumComment(commentId, voteType);

            if (!voteResult.ok) {
               if (voteResult.status === 401) {
                  requireAuth();
               }

               throw new Error("Vote failed");
            }
         },

         onLoadReplies: async (commentId) => {
            const repliesResult = await fetchForumReplies(commentId);

            if (!repliesResult.ok) {
               return [];
            }

            return repliesResult.data.comments.map(forumCommentToCommentLayer);
         },

         onReply: async (commentId, content) => {
            const replyResult = await replyToForumComment(commentId, content);

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

   const handleCreateComment = async (content: string) => {
      if (!topicId) {
         return;
      }

      if (status !== "authenticated") {
         requireAuth();

         return;
      }

      setIsPosting(true);

      const createResult = await createTopicComment(topicId, content);

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

   if (isMissing) {
      return (
         <div className={clsx(css.forum, className)}>
            <ContentHeader
               title={t.forum.discussionsTitle}
               actionsVariant="forum"
               tabs={headerTabs}
               activeTab={activeTab}
               onTabChange={setActiveTab}
               selectedVendorId={selectedVendorId}
               onSelectVendor={onSelectVendor}
               withTabs={false}
            />

            <div className={css.forum_list}>
               <div className={css.forum_list_inner}>
                  <p className={css.forum_message}>{t.forum.notFound}</p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className={clsx(css.forum, className)}>
         <ContentHeader
            title={topic?.title ?? t.forum.discussionsTitle}
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={headerTabs}
            activeTab={activeTab}
            actionsVariant="forum"
            onTabChange={setActiveTab}
            selectedVendorId={selectedVendorId}
            onSelectVendor={onSelectVendor}
            withTabs={false}
         />

         <div className={css.forum_list}>
            <div className={css.forum_list_inner}>
               {topicError && <p className={css.forum_message}>{t.forum.loadError}</p>}

               <ForumThread
                  comments={comments}
                  userName={topic?.userEmailMasked || "anonymous"}
                  providers={[]}
                  title={topic?.title ?? ""}
                  description={topic?.content ?? ""}
                  replyPlaceholder={t.common.replyPlaceholder}
                  replyButtonText={t.common.buttonText}
                  actions={commentActions}
                  isLoading={isLoading}
                  error={Boolean(commentsError)}
                  isPosting={isPosting}
                  onCreatePost={handleCreateComment}
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
