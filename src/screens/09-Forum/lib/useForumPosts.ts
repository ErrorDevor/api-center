"use client";

import React from "react";

import {
   parseForumPost,
   parseForumPostsResult,
   parseForumRepliesResult,
   parseForumVoteResult,
} from "./forum.type";
import type {
   ForumPost,
   ForumPostsResult,
   ForumRepliesResult,
   ForumVoteResult,
   VoteType,
} from "./forum.type";

// Client-side data layer for FORUM_API_GUIDE.md, talking only to our own
// same-origin /api/forum/* routes (see src/app/api/forum/posts/route.ts and
// src/app/api/forum/posts/[id]/*) — never the sub2api gateway directly,
// same convention as the Reviews screen's useProviderComments.

export type ForumSort = "latest" | "top_liked" | "most_replies";

export type ForumActionResult<T> = { ok: true; data: T } | { ok: false; status: number };

const parseJsonBody = async (response: Response): Promise<Record<string, unknown> | null> => {
   try {
      return (await response.json()) as Record<string, unknown>;
   } catch {
      return null;
   }
};

interface UseForumPostsResult {
   result: ForumPostsResult | null;
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
}

/**
 * Fetches one page of root forum posts. Re-fetches whenever page/sort
 * change, or refetch() is called (e.g. after publishing a new post).
 */
export const useForumPosts = (page: number, sort: ForumSort): UseForumPostsResult => {
   const [result, setResult] = React.useState<ForumPostsResult | null>(null);
   const [isLoading, setIsLoading] = React.useState(true);
   const [error, setError] = React.useState<Error | null>(null);
   const [reloadToken, setReloadToken] = React.useState(0);

   React.useEffect(() => {
      let cancelled = false;

      setIsLoading(true);

      const params = new URLSearchParams({ page: String(page), sort });

      fetch(`/api/forum/posts?${params}`, { cache: "no-store" })
         .then(async (response) => {
            const payload = await parseJsonBody(response);

            if (!response.ok) {
               throw new Error(
                  (payload?.message as string | undefined) || "Failed to load forum posts"
               );
            }

            const parsed = parseForumPostsResult(payload?.data);

            if (!parsed) {
               throw new Error("Unexpected response from the forum server");
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
   }, [page, sort, reloadToken]);

   const refetch = React.useCallback(() => setReloadToken((current) => current + 1), []);

   return { result, isLoading, error, refetch };
};

export const createForumPost = async (
   content: string
): Promise<ForumActionResult<ForumPost>> => {
   const response = await fetch("/api/forum/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
   });

   const payload = await parseJsonBody(response);
   const post = response.ok ? parseForumPost(payload?.data) : null;

   if (!post) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: post };
};

export const fetchForumReplies = async (
   postId: number | string
): Promise<ForumActionResult<ForumRepliesResult>> => {
   const response = await fetch(`/api/forum/posts/${postId}/replies`, { cache: "no-store" });
   const payload = await parseJsonBody(response);
   const replies = response.ok ? parseForumRepliesResult(payload?.data) : null;

   if (!replies) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: replies };
};

export const replyToForumPost = async (
   postId: number | string,
   content: string
): Promise<ForumActionResult<ForumPost>> => {
   const response = await fetch(`/api/forum/posts/${postId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
   });

   const payload = await parseJsonBody(response);
   const post = response.ok ? parseForumPost(payload?.data) : null;

   if (!post) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: post };
};

export const voteOnForumPost = async (
   postId: number | string,
   voteType: VoteType
): Promise<ForumActionResult<ForumVoteResult>> => {
   const response = await fetch(`/api/forum/posts/${postId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vote_type: voteType }),
   });

   const payload = await parseJsonBody(response);
   const vote = response.ok ? parseForumVoteResult(payload?.data) : null;

   if (!vote) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: vote };
};
