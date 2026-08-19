"use client";

import React from "react";

import { useRouter } from "next/navigation";

import clsx from "clsx";

import { apiCommentToCommentLayer } from "./lib/comments.type";
import type { CommentProviderDetails, CommentProviderModel } from "./lib/comments.type";
import {
   createProviderComment,
   fetchCommentReplies,
   replyToComment,
   useProviderComments,
   voteOnComment,
} from "./lib/useProviderComments";
import type { CommentsSort } from "./lib/useProviderComments";
import { CommentCard } from "./ui/CommentCard";
import { CommentLayer } from "./ui/CommentLayer";
import type { CommentLayerActions } from "./ui/CommentLayer";
import { LeaveReviewModal } from "./ui/LeaveReviewModal";

import { useAuth } from "shared/lib/auth";
import { useTranslation } from "shared/lib/i18n";
import { useProviderDescriptions } from "shared/lib/providerDescriptions/useProviderDescriptions";
import { getVendorIcon, getVendorId } from "shared/lib/providers/vendors";
import { useProviderRecords } from "shared/lib/providers/useProviderRecords";
import { ContentActions } from "shared/ui/components/ContentActions";
import { ContentHeader } from "shared/ui/components/ContentHeader";
import type { ContentHeaderTab } from "shared/ui/components/ContentHeader";
import { Pagination } from "shared/ui/components/Pagination";
import { PlusIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";
import { SortDropdown } from "shared/ui/ui-kit/SortDropdown";

import css from "./Comments.module.scss";

type SentimentTabId = "all" | "positive" | "negative";

interface Prop {
   className?: string;
   providerDomain?: string;
}

export const Comments: React.FC<Prop> = ({ className, providerDomain }) => {
   const { t, locale } = useTranslation();
   const router = useRouter();
   const { status } = useAuth();
   const { records } = useProviderRecords();
   const { entries: providerDescriptions } = useProviderDescriptions();

   const [page, setPage] = React.useState(1);
   const [sort, setSort] = React.useState<CommentsSort>("latest");
   const [sentimentTab, setSentimentTab] = React.useState<SentimentTabId>("all");
   const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
   const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);

   const sentiment = sentimentTab === "all" ? undefined : sentimentTab;

   const { result, isLoading, error, refetch } = useProviderComments(
      providerDomain,
      page,
      sort,
      sentiment
   );

   const providerRecords = React.useMemo(
      () => records.filter((record) => record.providerDomain === providerDomain),
      [records, providerDomain]
   );

   const providerRecord = providerRecords[0];

   const providerDescriptionEntry = providerDescriptions.find(
      (entry) => entry.providerDomain === providerDomain
   );

   const providerName = providerRecord?.providerName ?? providerDomain ?? "";

   const description = providerDescriptionEntry
      ? locale === "ru"
         ? providerDescriptionEntry.descriptionRu
         : providerDescriptionEntry.descriptionEn
      : "";

   // Real per-provider "top models & prices" table, built from the same
   // providers.json feed the /home models table uses — replaces the old
   // hardcoded 10-row mock list.
   const models: CommentProviderModel[] = React.useMemo(() => {
      const seenModelIds = new Set<string>();
      const items: CommentProviderModel[] = [];

      for (const record of providerRecords) {
         if (seenModelIds.has(record.canonicalModelId)) {
            continue;
         }

         seenModelIds.add(record.canonicalModelId);

         items.push({
            id: record.canonicalModelId,
            name: record.modelName,
            icon: getVendorIcon(getVendorId(record.canonicalModelId)) ?? null,
            inputPrice: record.inputPriceUsdPer1m,
            outputPrice: record.outputPriceUsdPer1m,
         });
      }

      return items;
   }, [providerRecords]);

   const paymentMethods = React.useMemo(
      () => Array.from(new Set(providerRecords.flatMap((record) => record.paymentMethods))),
      [providerRecords]
   );

   const providerDetails: CommentProviderDetails = {
      url: providerRecord?.providerUrl ?? (providerDomain ? `https://${providerDomain}` : ""),
      paymentMethods,
      positiveCount: result?.summary.positiveCount ?? 0,
      negativeCount: result?.summary.negativeCount ?? 0,
      positiveRatio: result?.summary.positiveRatio ?? 0,
      models,
   };

   const resultsCount = result?.summary.totalComments ?? 0;
   const totalPages = Math.max(1, result?.pagination.pages ?? 1);
   const comments = React.useMemo(
      () => result?.comments.map(apiCommentToCommentLayer) ?? [],
      [result]
   );

   const requireAuth = React.useCallback(() => {
      router.push("/login");
   }, [router]);

   const commentActions: CommentLayerActions = React.useMemo(
      () => ({
         isAuthenticated: status === "authenticated",
         onRequireAuth: requireAuth,

         onVote: async (commentId, voteType) => {
            const voteResult = await voteOnComment(commentId, voteType);

            if (!voteResult.ok) {
               if (voteResult.status === 401) {
                  requireAuth();
               }

               throw new Error("Vote failed");
            }
         },

         onLoadReplies: async (commentId) => {
            const repliesResult = await fetchCommentReplies(commentId);

            if (!repliesResult.ok) {
               return [];
            }

            return repliesResult.data.replies.map(apiCommentToCommentLayer);
         },

         onReply: async (commentId, content) => {
            const replyResult = await replyToComment(commentId, content);

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

   const sentimentTabs: ContentHeaderTab<SentimentTabId>[] = [
      { id: "all", label: t.groupBuys.sentimentTabs.all },
      { id: "positive", label: t.groupBuys.sentimentTabs.positive },
      { id: "negative", label: t.groupBuys.sentimentTabs.negative },
   ];

   const sortOptions = [
      { value: "latest" as CommentsSort, label: t.sortDropdown.newest },
      { value: "top_liked" as CommentsSort, label: t.sortDropdown.popular },
      { value: "most_replies" as CommentsSort, label: t.sortDropdown.mostReplies },
   ];

   const handleSentimentTabChange = (tabId: SentimentTabId) => {
      setSentimentTab(tabId);
      setPage(1);
   };

   const handleSortChange = (nextSort: CommentsSort) => {
      setSort(nextSort);
      setPage(1);
   };

   const handleOpenReviewModal = () => {
      if (status !== "authenticated") {
         requireAuth();
         return;
      }

      setIsReviewModalOpen(true);
   };

   const handleSubmitReview = async (
      content: string,
      reviewSentiment: "positive" | "negative"
   ) => {
      if (!providerDomain) {
         return;
      }

      setIsSubmittingReview(true);

      const createResult = await createProviderComment(providerDomain, content, reviewSentiment);

      setIsSubmittingReview(false);

      if (!createResult.ok) {
         if (createResult.status === 401) {
            requireAuth();
         }

         return;
      }

      setIsReviewModalOpen(false);
      setPage(1);
      refetch();
   };

   if (!providerDomain) {
      return (
         <div className={clsx(css.comments, className)}>
            <div className={css.comments_empty}>
               <h3>{t.groupBuys.noProviderSelected.title}</h3>
               <p>{t.groupBuys.noProviderSelected.description}</p>
            </div>
         </div>
      );
   }

   return (
      <div className={clsx(css.comments, className)}>
         <ContentHeader
            title={providerName}
            resultsCount={resultsCount}
            resultsLabel={t.content.results}
            tabs={sentimentTabs}
            activeTab={sentimentTab}
            actionsVariant="group"
            onTabChange={handleSentimentTabChange}
         />

         <ContentActions variant="api" className={css.comments_actions} />

         <div className={css.comments_list}>
            <CommentCard
               providerName={providerName}
               description={description}
               providerDetails={providerDetails}
            />

            <div className={css.comments_data_list}>
               <div className={css.comments_data_list_title}>
                  <h6>{t.common.participants}</h6>

                  <div className={css.buttons_block}>
                     <SortDropdown
                        name={t.common.sort}
                        options={sortOptions}
                        value={sort}
                        onChange={handleSortChange}
                     />

                     <Button
                        variant="black"
                        className={css.feedback_button}
                        onClick={handleOpenReviewModal}
                     >
                        <PlusIcon />
                        {t.common.feedback}
                     </Button>
                  </div>
               </div>

               {error && <p className={css.comments_error}>{t.groupBuys.loadError}</p>}

               {!isLoading && !error && comments.length === 0 && (
                  <p className={css.comments_error}>{t.groupBuys.noReviewsYet}</p>
               )}

               {comments.map((item) => (
                  <CommentLayer
                     key={item.id}
                     data={item}
                     className={css.comments_padding}
                     actions={commentActions}
                  />
               ))}
            </div>

            <Pagination
               className={css.comments_pag}
               currentPage={page}
               totalPages={totalPages}
               onChange={setPage}
            />
         </div>

         <LeaveReviewModal
            isOpen={isReviewModalOpen}
            isSubmitting={isSubmittingReview}
            onClose={() => setIsReviewModalOpen(false)}
            onSubmit={handleSubmitReview}
         />
      </div>
   );
};
