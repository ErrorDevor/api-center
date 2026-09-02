// Shapes for FORUM_API_GUIDE.md's forum backend (proxied through
// src/app/api/forum/posts and src/app/api/forum/posts/[id]/*). Defensive
// `parse*` functions in the same spirit as screens/03-Reviews/lib/
// comments.type.ts: a malformed/unexpected payload drops the offending
// record (or the whole response) instead of crashing the page.

import type { CommentLayerType } from "./types";

export type VoteType = "like" | "dislike" | "none";

export interface ForumPost {
   id: number;
   userId: number;
   userEmailMasked: string;
   parentId: number | null;
   content: string;
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

export interface ForumPagination {
   page: number;
   pageSize: number;
   total: number;
   pages: number;
}

export interface ForumPostsResult {
   posts: ForumPost[];
   pagination: ForumPagination;
}

export interface ForumRepliesResult {
   postId: number;
   replies: ForumPost[];
   pagination: ForumPagination;
}

export interface ForumVoteResult {
   postId: number;
   likeCount: number;
   dislikeCount: number;
   userVote: "like" | "dislike" | "none";
}

const isNonEmptyString = (value: unknown): value is string =>
   typeof value === "string" && value.length > 0;

const isFiniteNumber = (value: unknown): value is number =>
   typeof value === "number" && Number.isFinite(value);

export const parseForumPost = (payload: unknown): ForumPost | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const id = raw.id;
   const userId = raw.user_id;
   const content = raw.content;
   const status = raw.status;
   const likeCount = raw.like_count;
   const dislikeCount = raw.dislike_count;
   const replyCount = raw.reply_count;
   const createdAt = raw.created_at;

   const isValid =
      isFiniteNumber(id) &&
      isFiniteNumber(userId) &&
      isNonEmptyString(content) &&
      isNonEmptyString(status) &&
      isFiniteNumber(likeCount) &&
      isFiniteNumber(dislikeCount) &&
      isFiniteNumber(replyCount) &&
      isNonEmptyString(createdAt);

   if (!isValid) {
      return null;
   }

   const userVote = raw.user_vote === "like" || raw.user_vote === "dislike" ? raw.user_vote : "";

   // Present on every post/reply returned by the GET endpoints, but the
   // POST responses may omit it (see the comments backend's equivalent
   // quirk) — default rather than reject, so posting doesn't look failed.
   const userEmailMasked = isNonEmptyString(raw.user_email_masked) ? raw.user_email_masked : "";

   return {
      id,
      userId,
      userEmailMasked,
      parentId: isFiniteNumber(raw.parent_id) ? raw.parent_id : null,
      content,
      status,
      likeCount,
      dislikeCount,
      replyCount,
      userVote,
      createdAt,
      updatedAt: isNonEmptyString(raw.updated_at) ? raw.updated_at : createdAt,
   };
};

const parseForumPagination = (payload: unknown): ForumPagination | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   // FORUM_API_GUIDE.md documents lowercase keys (page/page_size/total/
   // pages), but the sub2api backend has been seen to send this object
   // capitalized on the comments endpoints — accept both rather than
   // trusting the docs over the wire format.
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

export const parseForumPostsResult = (payload: unknown): ForumPostsResult | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const pagination = parseForumPagination(raw.pagination);

   if (!pagination || !Array.isArray(raw.posts)) {
      return null;
   }

   const posts = raw.posts
      .map(parseForumPost)
      .filter((post): post is ForumPost => post !== null);

   return { posts, pagination };
};

export const parseForumRepliesResult = (payload: unknown): ForumRepliesResult | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const postId = raw.post_id;
   const pagination = parseForumPagination(raw.pagination);

   if (!isFiniteNumber(postId) || !pagination || !Array.isArray(raw.replies)) {
      return null;
   }

   const replies = raw.replies
      .map(parseForumPost)
      .filter((reply): reply is ForumPost => reply !== null);

   return { postId, replies, pagination };
};

export const parseForumVoteResult = (payload: unknown): ForumVoteResult | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const postId = raw.post_id;
   const likeCount = raw.like_count;
   const dislikeCount = raw.dislike_count;
   const userVote = raw.user_vote;

   if (
      !isFiniteNumber(postId) ||
      !isFiniteNumber(likeCount) ||
      !isFiniteNumber(dislikeCount) ||
      (userVote !== "like" && userVote !== "dislike" && userVote !== "none")
   ) {
      return null;
   }

   return { postId, likeCount, dislikeCount, userVote };
};

// Maps an API post onto the generic shape CommentLayer renders (same
// bridge as apiCommentToCommentLayer in the Reviews screen).
export const forumPostToCommentLayer = (post: ForumPost): CommentLayerType => ({
   id: post.id,
   userName: post.userEmailMasked || "anonymous",
   publishedAt: post.createdAt,
   content: post.content,
   reactions: {
      likes: post.likeCount,
      dislikes: post.dislikeCount,
   },
   userVote: post.userVote,
   replyCount: post.replyCount,
});
