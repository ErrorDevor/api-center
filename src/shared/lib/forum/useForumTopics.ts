"use client";

import React from "react";

import { fetchForumTopics } from "./forum.api";
import type { ForumTopicsSort } from "./forum.api";
import type { ForumTopicsResult } from "./forum.types";

interface UseForumTopicsResult {
   result: ForumTopicsResult | null;
   isLoading: boolean;
   error: boolean;
   refetch: () => void;
}

/**
 * Fetches one page of forum topics (FORUM_API_GUIDE.md §1). Re-fetches
 * whenever page/sort/search change, or refetch() is called (e.g. after
 * publishing a new topic).
 */
export const useForumTopics = (
   page: number,
   sort: ForumTopicsSort,
   search?: string
): UseForumTopicsResult => {
   const [result, setResult] = React.useState<ForumTopicsResult | null>(null);
   const [isLoading, setIsLoading] = React.useState(true);
   const [error, setError] = React.useState(false);
   const [reloadToken, setReloadToken] = React.useState(0);

   React.useEffect(() => {
      let cancelled = false;

      setIsLoading(true);

      fetchForumTopics(page, sort, search)
         .then((topicsResult) => {
            if (cancelled) {
               return;
            }

            if (!topicsResult.ok) {
               setError(true);

               return;
            }

            setResult(topicsResult.data);
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
   }, [page, sort, search, reloadToken]);

   const refetch = React.useCallback(() => setReloadToken((current) => current + 1), []);

   return { result, isLoading, error, refetch };
};
