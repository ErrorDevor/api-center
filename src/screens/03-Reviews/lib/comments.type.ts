// Shapes for COMMENTS_API_GUIDE.md's provider-comments backend (proxied
// through src/app/api/providers/[provider]/comments and
// src/app/api/comments/[id]/*, see shared/lib/comments/fetchComments.ts).
// Defensive `parse*` functions in the same spirit as
// shared/lib/providers/types.ts: a malformed/unexpected payload drops the
// offending record (or the whole response) instead of crashing the page.

export type CommentSentiment = "positive" | "negative" | "neutral";

export type VoteType = "like" | "dislike" | "none";

export interface ApiComment {
   id: number;
   provider: string;
   userId: number;
   userEmailMasked: string;
   parentId: number | null;
   content: string;
   sentiment: CommentSentiment;
   status: string;
   likeCount: number;
   dislikeCount: number;
   replyCount: number;
   // "" means the caller hasn't voted (or wasn't authenticated) — kept as
   // "" rather than null to match the guide's wire format directly.
   userVote: "like" | "dislike" | "";
   createdAt: string;
   updatedAt: string;
}

export interface CommentsSummary {
   provider: string;
   totalComments: number;
   positiveCount: number;
   negativeCount: number;
   positiveRatio: number;
}

export interface CommentsPagination {
   page: number;
   pageSize: number;
   total: number;
   pages: number;
}

export interface ProviderCommentsResult {
   provider: string;
   summary: CommentsSummary;
   comments: ApiComment[];
   pagination: CommentsPagination;
}

export interface RepliesResult {
   commentId: number;
   replies: ApiComment[];
   pagination: CommentsPagination;
}

export interface VoteResult {
   commentId: number;
   likeCount: number;
   dislikeCount: number;
   userVote: "like" | "dislike" | "none";
}

const isNonEmptyString = (value: unknown): value is string =>
   typeof value === "string" && value.length > 0;

const isFiniteNumber = (value: unknown): value is number =>
   typeof value === "number" && Number.isFinite(value);

const isSentiment = (value: unknown): value is CommentSentiment =>
   value === "positive" || value === "negative" || value === "neutral";

export const parseApiComment = (payload: unknown): ApiComment | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const id = raw.id;
   const provider = raw.provider;
   const userId = raw.user_id;
   const content = raw.content;
   const sentiment = raw.sentiment;
   const status = raw.status;
   const likeCount = raw.like_count;
   const dislikeCount = raw.dislike_count;
   const replyCount = raw.reply_count;
   const createdAt = raw.created_at;

   const isValid =
      isFiniteNumber(id) &&
      isNonEmptyString(provider) &&
      isFiniteNumber(userId) &&
      isNonEmptyString(content) &&
      isSentiment(sentiment) &&
      isNonEmptyString(status) &&
      isFiniteNumber(likeCount) &&
      isFiniteNumber(dislikeCount) &&
      isFiniteNumber(replyCount) &&
      isNonEmptyString(createdAt);

   if (!isValid) {
      return null;
   }

   const userVote = raw.user_vote === "like" || raw.user_vote === "dislike" ? raw.user_vote : "";

   // Present on every comment/reply returned by the two GET endpoints, but
   // the live backend's POST /providers/:provider/comments response omits
   // it entirely (unlike COMMENTS_API_GUIDE.md's example) — default rather
   // than reject, so posting a review doesn't get treated as a failure.
   const userEmailMasked = isNonEmptyString(raw.user_email_masked) ? raw.user_email_masked : "";

   return {
      id,
      provider,
      userId,
      userEmailMasked,
      parentId: isFiniteNumber(raw.parent_id) ? raw.parent_id : null,
      content,
      sentiment: sentiment as CommentSentiment,
      status,
      likeCount,
      dislikeCount,
      replyCount,
      userVote,
      createdAt,
      updatedAt: isNonEmptyString(raw.updated_at) ? raw.updated_at : createdAt,
   };
};

const parseCommentsPagination = (payload: unknown): CommentsPagination | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   // COMMENTS_API_GUIDE.md documents lowercase keys (page/page_size/total/
   // pages), but the live backend actually sends this one object
   // capitalized (Page/PageSize/Total/Pages) — every other object in the
   // response (comments, summary) does match the guide's snake_case, so
   // this looks like a backend quirk specific to pagination. Accept both
   // rather than trusting the docs over the wire format.
   const page = raw.page ?? raw.Page;
   const pageSize = raw.page_size ?? raw.PageSize;
   const total = raw.total ?? raw.Total;
   const pages = raw.pages ?? raw.Pages;

   if (
      !isFiniteNumber(page) ||
      !isFiniteNumber(pageSize) ||
      !isFiniteNumber(total) ||
      !isFiniteNumber(pages)
   ) {
      return null;
   }

   return { page, pageSize, total, pages };
};

const parseCommentsSummary = (payload: unknown): CommentsSummary | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const provider = raw.provider;
   const totalComments = raw.total_comments;
   const positiveCount = raw.positive_count;
   const negativeCount = raw.negative_count;
   const positiveRatio = raw.positive_ratio;

   if (
      !isNonEmptyString(provider) ||
      !isFiniteNumber(totalComments) ||
      !isFiniteNumber(positiveCount) ||
      !isFiniteNumber(negativeCount) ||
      !isFiniteNumber(positiveRatio)
   ) {
      return null;
   }

   return { provider, totalComments, positiveCount, negativeCount, positiveRatio };
};

export const parseProviderCommentsResult = (payload: unknown): ProviderCommentsResult | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const provider = raw.provider;
   const summary = parseCommentsSummary(raw.summary);
   const pagination = parseCommentsPagination(raw.pagination);

   if (!isNonEmptyString(provider) || !summary || !pagination || !Array.isArray(raw.comments)) {
      return null;
   }

   const comments = raw.comments
      .map(parseApiComment)
      .filter((comment): comment is ApiComment => comment !== null);

   return { provider, summary, comments, pagination };
};

export const parseRepliesResult = (payload: unknown): RepliesResult | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const commentId = raw.comment_id;
   const pagination = parseCommentsPagination(raw.pagination);

   if (!isFiniteNumber(commentId) || !pagination || !Array.isArray(raw.replies)) {
      return null;
   }

   const replies = raw.replies
      .map(parseApiComment)
      .filter((reply): reply is ApiComment => reply !== null);

   return { commentId, replies, pagination };
};

export const parseVoteResult = (payload: unknown): VoteResult | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const commentId = raw.comment_id;
   const likeCount = raw.like_count;
   const dislikeCount = raw.dislike_count;
   const userVote = raw.user_vote;

   if (
      !isFiniteNumber(commentId) ||
      !isFiniteNumber(likeCount) ||
      !isFiniteNumber(dislikeCount) ||
      (userVote !== "like" && userVote !== "dislike" && userVote !== "none")
   ) {
      return null;
   }

   return { commentId, likeCount, dislikeCount, userVote };
};

// --- UI-facing shapes -------------------------------------------------
// CommentLayer/CommentItem render this generic shape regardless of where
// the data came from — the real API (Reviews screen, mapped from
// ApiComment below) or the still-static mock list (04-Buys screen, see
// screens/03-Reviews/lib/comments.data.ts).

export interface CommentLayerType {
   id: string | number;
   userName: string;
   userAvatar?: string;
   publishedAt: string;
   content: string;
   reactions: {
      likes: number;
      dislikes: number;
   };
   userVote?: "like" | "dislike" | "";
   replyCount?: number;
   replies?: CommentLayerType[];
}

export const apiCommentToCommentLayer = (comment: ApiComment): CommentLayerType => ({
   id: comment.id,
   userName: comment.userEmailMasked,
   publishedAt: comment.createdAt,
   content: comment.content,
   reactions: {
      likes: comment.likeCount,
      dislikes: comment.dislikeCount,
   },
   userVote: comment.userVote,
   replyCount: comment.replyCount,
});

// --- Provider details panel (CommentCardOptions) -----------------------

export interface CommentProviderAge {
   years: number;
   months: number;
}

export interface CommentProviderModel {
   id: string;
   name: string;
   icon: string | null;
   // Per-token pricing, or nativePriceUsd/nativePriceUnit for models billed
   // per-request/per-second instead — see ProviderPriceRecord.
   inputPrice: number | null;
   outputPrice: number | null;
   nativePriceUsd: number | null;
   nativePriceUnit: string | null;
}

export interface CommentProviderDetails {
   url: string;
   age?: CommentProviderAge;
   paymentMethods: string[];
   positiveCount: number;
   negativeCount: number;
   positiveRatio: number;
   models: CommentProviderModel[];
}
