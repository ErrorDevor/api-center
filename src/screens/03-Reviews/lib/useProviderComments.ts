"use client";

import React from "react";

import {
   parseApiComment,
   parseProviderCommentsResult,
   parseRepliesResult,
   parseVoteResult,
} from "./comments.type";
import type {
   ApiComment,
   ProviderCommentsResult,
   RepliesResult,
   VoteResult,
} from "./comments.type";

// Client-side data layer for COMMENTS_API_GUIDE.md, talking only to our own
// same-origin /api/providers/*/comments and /api/comments/* routes (see
// src/app/api/providers/[provider]/comments/route.ts and
// src/app/api/comments/[id]/*) — never the sub2api gateway directly, same
// convention as AuthProvider/LoginForm.

// "negative_first" is client-only — the backend only knows the first three
// (COMMENTS_API_GUIDE.md never documented a sentiment-ordering sort value,
// and the sentiment *filter* param already exists separately and means
// something different: hide the other sentiment entirely, not just
// reorder). Requesting it would forward an unrecognized value, so it's
// mapped to a safe backend sort below and reordered client-side instead —
// see Comments' `comments` memo.
export type CommentsSort = "latest" | "top_liked" | "most_replies" | "negative_first";
export type CommentsSentimentFilter = "positive" | "negative" | undefined;

export type CommentActionResult<T> = { ok: true; data: T } | { ok: false; status: number };

const parseJsonBody = async (response: Response): Promise<Record<string, unknown> | null> => {
   try {
      return (await response.json()) as Record<string, unknown>;
   } catch {
      return null;
   }
};

interface UseProviderCommentsResult {
   result: ProviderCommentsResult | null;
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
}

/**
 * Fetches one page of a provider's reviews + summary. Re-fetches whenever
 * providerDomain/page/sort/sentiment change, or refetch() is called (e.g.
 * after posting a new review). Can't reuse useProviderRecords' module-level
 * singleton-promise pattern since these params vary per call.
 */
export const useProviderComments = (
   providerDomain: string | undefined,
   page: number,
   sort: CommentsSort,
   sentiment: CommentsSentimentFilter
): UseProviderCommentsResult => {
   const [result, setResult] = React.useState<ProviderCommentsResult | null>(null);
   // Starts true when there's already a provider to fetch, so the first
   // render (including SSR, before the effect below ever runs) doesn't
   // briefly flash a "no reviews yet" empty state ahead of the real result.
   const [isLoading, setIsLoading] = React.useState(Boolean(providerDomain));
   const [error, setError] = React.useState<Error | null>(null);
   const [reloadToken, setReloadToken] = React.useState(0);

   React.useEffect(() => {
      if (!providerDomain) {
         setResult(null);
         setIsLoading(false);
         setError(null);
         return;
      }

      let cancelled = false;

      setIsLoading(true);

      const params = new URLSearchParams({
         page: String(page),
         sort: sort === "negative_first" ? "latest" : sort,
         ...(sentiment ? { sentiment } : {}),
      });

      fetch(`/api/providers/${encodeURIComponent(providerDomain)}/comments?${params}`, {
         cache: "no-store",
      })
         .then(async (response) => {
            const payload = await parseJsonBody(response);

            if (!response.ok) {
               throw new Error(
                  (payload?.message as string | undefined) || "Failed to load reviews"
               );
            }

            const parsed = parseProviderCommentsResult(payload?.data);

            if (!parsed) {
               throw new Error("Unexpected response from the reviews server");
            }

            if (!cancelled) {
               setResult(parsed);
               setError(null);
            }
         })
         .catch((loadError: Error) => {
            if (!cancelled) {
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
   }, [providerDomain, page, sort, sentiment, reloadToken]);

   const refetch = React.useCallback(() => setReloadToken((current) => current + 1), []);

   return { result, isLoading, error, refetch };
};

export const createProviderComment = async (
   providerDomain: string,
   content: string,
   sentiment: "positive" | "negative"
): Promise<CommentActionResult<ApiComment>> => {
   const response = await fetch(`/api/providers/${encodeURIComponent(providerDomain)}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, sentiment }),
   });

   const payload = await parseJsonBody(response);
   const comment = response.ok ? parseApiComment(payload?.data) : null;

   if (!comment) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: comment };
};

export const fetchCommentReplies = async (
   commentId: number | string
): Promise<CommentActionResult<RepliesResult>> => {
   const response = await fetch(`/api/comments/${commentId}/replies`, { cache: "no-store" });
   const payload = await parseJsonBody(response);
   const replies = response.ok ? parseRepliesResult(payload?.data) : null;

   if (!replies) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: replies };
};

export const replyToComment = async (
   commentId: number | string,
   content: string
): Promise<CommentActionResult<ApiComment>> => {
   const response = await fetch(`/api/comments/${commentId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
   });

   const payload = await parseJsonBody(response);
   const comment = response.ok ? parseApiComment(payload?.data) : null;

   if (!comment) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: comment };
};

export const voteOnComment = async (
   commentId: number | string,
   voteType: "like" | "dislike" | "none"
): Promise<CommentActionResult<VoteResult>> => {
   const response = await fetch(`/api/comments/${commentId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vote_type: voteType }),
   });

   const payload = await parseJsonBody(response);
   const vote = response.ok ? parseVoteResult(payload?.data) : null;

   if (!vote) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: vote };
};
