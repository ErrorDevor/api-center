"use client";

import {
   parseForumComment,
   parseForumCommentsResult,
   parseForumTopic,
   parseForumTopicsResult,
   parseForumVoteResult,
} from "./forum.types";
import type {
   ForumComment,
   ForumCommentsResult,
   ForumTopic,
   ForumTopicsResult,
   ForumVoteResult,
   VoteType,
} from "./forum.types";

// Client-side data layer for FORUM_API_GUIDE.md, talking only to our own
// same-origin /api/forum/* routes (see src/app/api/forum/topics/* and
// src/app/api/forum/comments/[id]/*) — never the sub2api gateway directly,
// same convention as the Reviews screen's useProviderComments.

export type ForumTopicsSort = "latest" | "top_liked" | "most_comments";
export type ForumCommentsSort = "latest" | "oldest" | "top_liked";

export type ForumActionResult<T> = { ok: true; data: T } | { ok: false; status: number };

export const parseJsonBody = async (
   response: Response
): Promise<Record<string, unknown> | null> => {
   try {
      return (await response.json()) as Record<string, unknown>;
   } catch {
      return null;
   }
};

export const buildTopicsQuery = (
   page: number,
   sort: ForumTopicsSort,
   search?: string
): string => {
   const params = new URLSearchParams({ page: String(page), sort });

   if (search?.trim()) {
      params.set("search", search.trim());
   }

   return params.toString();
};

export const fetchForumTopics = async (
   page: number,
   sort: ForumTopicsSort,
   search?: string
): Promise<ForumActionResult<ForumTopicsResult>> => {
   const response = await fetch(`/api/forum/topics?${buildTopicsQuery(page, sort, search)}`, {
      cache: "no-store",
   });

   const payload = await parseJsonBody(response);
   const topics = response.ok ? parseForumTopicsResult(payload?.data) : null;

   if (!topics) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: topics };
};

export const createForumTopic = async (
   title: string,
   content: string
): Promise<ForumActionResult<ForumTopic>> => {
   const response = await fetch("/api/forum/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
   });

   const payload = await parseJsonBody(response);
   const topic = response.ok ? parseForumTopic(payload?.data) : null;

   if (!topic) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: topic };
};

export const fetchForumTopic = async (
   topicId: number | string
): Promise<ForumActionResult<ForumTopic>> => {
   const response = await fetch(`/api/forum/topics/${topicId}`, { cache: "no-store" });
   const payload = await parseJsonBody(response);

   // GET /forum/topics/:id is documented as returning the topic object
   // itself, but a `{topic: {...}}` wrapper would be just as plausible for
   // this backend — try the bare object first, then the wrapper.
   const raw = payload?.data as Record<string, unknown> | undefined;
   const topic = response.ok ? (parseForumTopic(raw) ?? parseForumTopic(raw?.topic)) : null;

   if (!topic) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: topic };
};

export const fetchTopicComments = async (
   topicId: number | string,
   page: number,
   sort: ForumCommentsSort
): Promise<ForumActionResult<ForumCommentsResult>> => {
   const params = new URLSearchParams({ page: String(page), sort });

   const response = await fetch(`/api/forum/topics/${topicId}/comments?${params}`, {
      cache: "no-store",
   });

   const payload = await parseJsonBody(response);
   const comments = response.ok ? parseForumCommentsResult(payload?.data) : null;

   if (!comments) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: comments };
};

export const createTopicComment = async (
   topicId: number | string,
   content: string
): Promise<ForumActionResult<ForumComment>> => {
   const response = await fetch(`/api/forum/topics/${topicId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
   });

   const payload = await parseJsonBody(response);
   const comment = response.ok ? parseForumComment(payload?.data) : null;

   if (!comment) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: comment };
};

export const fetchForumReplies = async (
   commentId: number | string
): Promise<ForumActionResult<ForumCommentsResult>> => {
   const response = await fetch(`/api/forum/comments/${commentId}/replies`, {
      cache: "no-store",
   });

   const payload = await parseJsonBody(response);
   const replies = response.ok ? parseForumCommentsResult(payload?.data) : null;

   if (!replies) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: replies };
};

export const replyToForumComment = async (
   commentId: number | string,
   content: string
): Promise<ForumActionResult<ForumComment>> => {
   const response = await fetch(`/api/forum/comments/${commentId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
   });

   const payload = await parseJsonBody(response);
   const comment = response.ok ? parseForumComment(payload?.data) : null;

   if (!comment) {
      return { ok: false, status: response.status };
   }

   return { ok: true, data: comment };
};

export const voteOnForumComment = async (
   commentId: number | string,
   voteType: VoteType
): Promise<ForumActionResult<ForumVoteResult>> => {
   const response = await fetch(`/api/forum/comments/${commentId}/vote`, {
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
