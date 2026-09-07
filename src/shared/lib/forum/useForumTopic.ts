"use client";

import React from "react";

import { fetchForumTopic } from "./forum.api";
import type { ForumTopic } from "./forum.types";

interface UseForumTopicResult {
   topic: ForumTopic | null;
   isLoading: boolean;
   // 404 from the backend (or an unparseable topic) is reported separately
   // from a transport failure, so /topic/[id] can tell "this discussion is
   // gone" apart from "couldn't reach the server".
   isMissing: boolean;
   error: boolean;
}

/**
 * Loads one topic by id (FORUM_API_GUIDE.md §3) for the /topic/[id] page.
 */
export const useForumTopic = (topicId: string | number | undefined): UseForumTopicResult => {
   const [topic, setTopic] = React.useState<ForumTopic | null>(null);
   const [isLoading, setIsLoading] = React.useState(true);
   const [isMissing, setIsMissing] = React.useState(false);
   const [error, setError] = React.useState(false);

   React.useEffect(() => {
      if (topicId === undefined || topicId === "") {
         setTopic(null);
         setIsMissing(true);
         setIsLoading(false);

         return;
      }

      let cancelled = false;

      setIsLoading(true);

      fetchForumTopic(topicId)
         .then((topicResult) => {
            if (cancelled) {
               return;
            }

            if (!topicResult.ok) {
               setIsMissing(topicResult.status === 404);
               setError(topicResult.status !== 404);

               return;
            }

            setTopic(topicResult.data);
            setIsMissing(false);
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
   }, [topicId]);

   return { topic, isLoading, isMissing, error };
};
