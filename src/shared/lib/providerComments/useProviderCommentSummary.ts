"use client";

import React from "react";

import { parseProviderCommentSummary } from "./types";
import type { ProviderCommentSummary } from "./types";

/**
 * Per-domain singleton-promise cache, same convention as
 * useProviderRecords/useProviderDescriptions — just keyed by provider
 * domain instead of one global feed, so every row showing the same
 * reseller (very common — see providers-to-models.ts) shares one request
 * instead of firing one per row.
 */
const summaryPromises = new Map<string, Promise<ProviderCommentSummary | null>>();

const fetchProviderCommentSummary = (
   providerDomain: string
): Promise<ProviderCommentSummary | null> => {
   let promise = summaryPromises.get(providerDomain);

   if (!promise) {
      // page_size=1: we only want the summary object the endpoint always
      // includes alongside the page of comments, not the comments
      // themselves — this keeps the request cheap.
      promise = fetch(
         `/api/providers/${encodeURIComponent(providerDomain)}/comments?page=1&page_size=1`,
         { cache: "no-store" }
      )
         .then(async (response) => {
            if (!response.ok) {
               return null;
            }

            const payload = await response.json().catch(() => null);

            return parseProviderCommentSummary((payload as { data?: unknown } | null)?.data);
         })
         .catch(() => null);

      summaryPromises.set(providerDomain, promise);
   }

   return promise;
};

interface UseProviderCommentSummaryResult {
   summary: ProviderCommentSummary | null;
   isLoading: boolean;
}

/**
 * Real reviews/negative-reviews counts for one provider domain (see the
 * "Отзывы" column in ModelsTable and ProviderTooltip's review row — both
 * used to show the same hardcoded 123/12 stub for every provider).
 * Returns `summary: null` while loading and on failure — callers fall back
 * to a placeholder rather than trusting a stale/fake number.
 */
export const useProviderCommentSummary = (
   providerDomain: string
): UseProviderCommentSummaryResult => {
   const [summary, setSummary] = React.useState<ProviderCommentSummary | null>(null);
   const [isLoading, setIsLoading] = React.useState(true);

   React.useEffect(() => {
      let cancelled = false;

      setIsLoading(true);

      fetchProviderCommentSummary(providerDomain).then((result) => {
         if (!cancelled) {
            setSummary(result);
            setIsLoading(false);
         }
      });

      return () => {
         cancelled = true;
      };
   }, [providerDomain]);

   return { summary, isLoading };
};
