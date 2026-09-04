"use client";

import React from "react";

import type { RankingCategory } from "./categories";
import { parseRankings } from "./types";
import type { RankingEntry } from "./types";

/**
 * Fetches one /rating leaderboard feed per page load and shares the result
 * between consumers. Keyed by feed URL so switching category tabs back and
 * forth doesn't refetch.
 */
const feedCache = new Map<string, Promise<RankingEntry[]>>();

const fetchRankings = (category: RankingCategory): Promise<RankingEntry[]> => {
   const { feedUrl } = category;

   let promise = feedCache.get(feedUrl);

   if (!promise) {
      const metricKeys = category.columns.map((column) => column.key);

      promise = fetch(feedUrl, { cache: "no-store" })
         .then((response) => {
            if (!response.ok) {
               throw new Error(`Failed to load ${feedUrl}: ${response.status}`);
            }

            return response.json();
         })
         .then((payload) => parseRankings(payload, metricKeys))
         .catch((error) => {
            feedCache.delete(feedUrl);
            throw error;
         });

      feedCache.set(feedUrl, promise);
   }

   return promise;
};

interface UseRankingsResult {
   entries: RankingEntry[];
   isLoading: boolean;
   error: Error | null;
}

export const useRankings = (category: RankingCategory): UseRankingsResult => {
   const [entries, setEntries] = React.useState<RankingEntry[]>([]);
   const [isLoading, setIsLoading] = React.useState(true);
   const [error, setError] = React.useState<Error | null>(null);

   React.useEffect(() => {
      let cancelled = false;

      setIsLoading(true);
      setEntries([]);

      fetchRankings(category)
         .then((loadedEntries) => {
            if (!cancelled) {
               setEntries(loadedEntries);
               setError(null);
            }
         })
         .catch((loadError: Error) => {
            if (!cancelled) {
               setEntries([]);
               setError(loadError);
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
   }, [category]);

   return { entries, isLoading, error };
};
