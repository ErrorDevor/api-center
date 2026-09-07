// Shapes for FORUM_API_GUIDE.md's forum backend (topics + comments),
// proxied through src/app/api/forum/*. Lives in shared/ rather than in one
// screen's lib/ because two screens read it: the /discussions topic list
// (screens/10-Topics) and the /topic/[id] thread (screens/09-Forum).
//
// Defensive `parse*` functions in the same spirit as screens/03-Reviews/
// lib/comments.type.ts: a malformed/unexpected payload drops the offending
// record (or the whole response) instead of crashing the page.

export type VoteType = "like" | "dislike" | "none";

// "" means the caller hasn't voted (or wasn't authenticated) — kept as ""
// rather than null to match the guide's wire format directly.
export type UserVote = "like" | "dislike" | "";

export interface ForumTopic {
   id: number;
   userId: number;
   userEmailMasked: string;
   title: string;
   content: string;
   status: string;
   likeCount: number;
   dislikeCount: number;
   commentCount: number;
   userVote: UserVote;
   createdAt: string;
   updatedAt: string;
}

export interface ForumComment {
   id: number;
   topicId: number | null;
   userId: number;
   userEmailMasked: string;
   parentId: number | null;
   content: string;
   status: string;
   likeCount: number;
   dislikeCount: number;
   replyCount: number;
   userVote: UserVote;
   createdAt: string;
   updatedAt: string;
}

export interface ForumPagination {
   page: number;
   pageSize: number;
   total: number;
   pages: number;
}

export interface ForumTopicsResult {
   topics: ForumTopic[];
   pagination: ForumPagination;
}

export interface ForumCommentsResult {
   topicId: number | null;
   comments: ForumComment[];
   pagination: ForumPagination;
}

export interface ForumVoteResult {
   id: number;
   likeCount: number;
   dislikeCount: number;
   userVote: VoteType;
}

const isNonEmptyString = (value: unknown): value is string =>
   typeof value === "string" && value.length > 0;

const isFiniteNumber = (value: unknown): value is number =>
   typeof value === "number" && Number.isFinite(value);

const toUserVote = (value: unknown): UserVote =>
   value === "like" || value === "dislike" ? value : "";

export const parseForumTopic = (payload: unknown): ForumTopic | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const id = raw.id;
   const userId = raw.user_id;
   const title = raw.title;
   const content = raw.content;
   const status = raw.status;
   const createdAt = raw.created_at;

   if (
      !isFiniteNumber(id) ||
      !isFiniteNumber(userId) ||
      !isNonEmptyString(title) ||
      !isNonEmptyString(content) ||
      !isNonEmptyString(status) ||
      !isNonEmptyString(createdAt)
   ) {
      return null;
   }

   return {
      id,
      userId,
      // Present on every topic returned by the GET endpoints, but the POST
      // response may omit it (the comments backend has the same quirk) —
      // default the counters and the masked email rather than reject, so a
      // freshly published topic doesn't look like a failure.
      userEmailMasked: isNonEmptyString(raw.user_email_masked) ? raw.user_email_masked : "",
      title,
      content,
      status,
      likeCount: isFiniteNumber(raw.like_count) ? raw.like_count : 0,
      dislikeCount: isFiniteNumber(raw.dislike_count) ? raw.dislike_count : 0,
      commentCount: isFiniteNumber(raw.comment_count) ? raw.comment_count : 0,
      userVote: toUserVote(raw.user_vote),
      createdAt,
      updatedAt: isNonEmptyString(raw.updated_at) ? raw.updated_at : createdAt,
   };
};

export const parseForumComment = (payload: unknown): ForumComment | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const id = raw.id;
   const userId = raw.user_id;
   const content = raw.content;
   const status = raw.status;
   const createdAt = raw.created_at;

   if (
      !isFiniteNumber(id) ||
      !isFiniteNumber(userId) ||
      !isNonEmptyString(content) ||
      !isNonEmptyString(status) ||
      !isNonEmptyString(createdAt)
   ) {
      return null;
   }

   return {
      id,
      topicId: isFiniteNumber(raw.topic_id) ? raw.topic_id : null,
      userId,
      userEmailMasked: isNonEmptyString(raw.user_email_masked) ? raw.user_email_masked : "",
      parentId: isFiniteNumber(raw.parent_id) ? raw.parent_id : null,
      content,
      status,
      likeCount: isFiniteNumber(raw.like_count) ? raw.like_count : 0,
      dislikeCount: isFiniteNumber(raw.dislike_count) ? raw.dislike_count : 0,
      replyCount: isFiniteNumber(raw.reply_count) ? raw.reply_count : 0,
      userVote: toUserVote(raw.user_vote),
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
   // pages), but the sub2api backend sends this object capitalized on the
   // forum endpoints — accept both rather than trusting the docs over the
   // wire format.
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

export const parseForumTopicsResult = (payload: unknown): ForumTopicsResult | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const pagination = parseForumPagination(raw.pagination);

   if (!pagination || !Array.isArray(raw.topics)) {
      return null;
   }

   const topics = raw.topics
      .map(parseForumTopic)
      .filter((topic): topic is ForumTopic => topic !== null);

   return { topics, pagination };
};

/**
 * Parses both comment collections the guide returns: a topic's root
 * comments (`{topic_id, comments, pagination}`, §5) and one comment's
 * replies (§7, whose body isn't spelled out — hence accepting `replies`
 * as well as `comments`).
 */
export const parseForumCommentsResult = (payload: unknown): ForumCommentsResult | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const pagination = parseForumPagination(raw.pagination);
   const items = Array.isArray(raw.comments)
      ? raw.comments
      : Array.isArray(raw.replies)
        ? raw.replies
        : null;

   if (!pagination || !items) {
      return null;
   }

   const comments = items
      .map(parseForumComment)
      .filter((comment): comment is ForumComment => comment !== null);

   return {
      topicId: isFiniteNumber(raw.topic_id) ? raw.topic_id : null,
      comments,
      pagination,
   };
};

export const parseForumVoteResult = (payload: unknown): ForumVoteResult | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   // The guide's vote response keys the record as `id`; the older
   // posts/comments endpoints used `post_id`/`comment_id`, so accept those
   // too — the id is only used for logging/lookups, never for the counts.
   const id = raw.id ?? raw.topic_id ?? raw.comment_id;
   const likeCount = raw.like_count;
   const dislikeCount = raw.dislike_count;
   const userVote = raw.user_vote;

   if (
      !isFiniteNumber(id) ||
      !isFiniteNumber(likeCount) ||
      !isFiniteNumber(dislikeCount) ||
      (userVote !== "like" && userVote !== "dislike" && userVote !== "none")
   ) {
      return null;
   }

   return { id, likeCount, dislikeCount, userVote };
};
