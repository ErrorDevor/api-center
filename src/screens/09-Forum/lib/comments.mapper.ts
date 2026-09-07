import type { ForumComment } from "shared/lib/forum";

import type { CommentLayerType } from "./types";

/**
 * Maps one API comment (FORUM_API_GUIDE.md §5/§7) onto the generic shape
 * CommentLayer renders — same bridge as apiCommentToCommentLayer in the
 * Reviews screen. Nested replies aren't inlined here: CommentLayer loads
 * them on demand through its onLoadReplies action.
 */
export const forumCommentToCommentLayer = (comment: ForumComment): CommentLayerType => ({
   id: comment.id,
   userName: comment.userEmailMasked || "anonymous",
   publishedAt: comment.createdAt,
   content: comment.content,
   reactions: {
      likes: comment.likeCount,
      dislikes: comment.dislikeCount,
   },
   userVote: comment.userVote,
   replyCount: comment.replyCount,
});
