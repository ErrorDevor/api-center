import type { ForumTopic } from "shared/lib/forum";

import type { TopicItem } from "./types";

/**
 * Bridges one API topic (FORUM_API_GUIDE.md §1) onto the shape TopicCard
 * renders — same bridge as the Reviews screen's apiCommentToCommentLayer.
 * The backend only exposes a masked email per author (no display name or
 * avatar), so TopicCard falls back to rendering the plain name.
 */
export const forumTopicToTopicItem = (topic: ForumTopic): TopicItem => ({
   id: topic.id,
   userName: topic.userEmailMasked || "anonymous",
   title: topic.title,
   description: topic.content,
   publishedAt: topic.createdAt,
   commentsCount: topic.commentCount,
});
