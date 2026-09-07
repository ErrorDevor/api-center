"use client";

import React from "react";

import { fetchTopicComments } from "./forum.api";
import type { ForumCommentsSort } from "./forum.api";
import type { ForumCommentsResult } from "./forum.types";

interface UseTopicCommentsResult {
   result: ForumCommentsResult | null;
   isLoading: boolean;
   error: boolean;
   refetch: () => void;
}

/**
 * Fetches one page of a topic's root comments (FORUM_API_GUIDE.md §5).
 * Replies to those comments are loaded lazily instead, by CommentLayer's
 * onLoadReplies (see fetchForumReplies).
 */
export const useTopicComments = (
   topicId: string | number | undefined,
   page: number,
   sort: ForumCommentsSort
): UseTopicCommentsResult => {
   const [result, setResult] = React.useState<ForumCommentsResult | null>(null);
   const [isLoading, setIsLoading] = React.useState(true);
   const [error, setError] = React.useState(false);
   const [reloadToken, setReloadToken] = React.useState(0);

   React.useEffect(() => {
      if (topicId === undefined || topicId === "") {
         setResult(null);
         setIsLoading(false);

         return;
      }

      let cancelled = false;

      setIsLoading(true);

      fetchTopicComments(topicId, page, sort)
         .then((commentsResult) => {
            if (cancelled) {
               return;
            }

            if (!commentsResult.ok) {
               setError(true);

               return;
            }

            setResult(commentsResult.data);
            setError(false);
         })
         .catch(() => {
            if (!cancelled) {
               setError(true);
            }
         })
         .finally(() => {
            if (!cancelled) {
               setIsLoading(false);
            }
         });

      return () => {
         cancelled = true;
      };
   }, [topicId, page, sort, reloadToken]);

   const refetch = React.useCallback(() => setReloadToken((current) => current + 1), []);

   return { result, isLoading, error, refetch };
};
