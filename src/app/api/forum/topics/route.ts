import type { NextRequest } from "next/server";

import { getAccessToken } from "shared/lib/auth/session-cookies";
import { callSub2Api, callSub2ApiWithAuth } from "shared/lib/auth/sub2api";

const TITLE_MAX_LENGTH = 255;
const CONTENT_MAX_LENGTH = 10000;

// GET /api/forum/topics — proxies GET /forum/topics (FORUM_API_GUIDE.md §1).
// Auth is optional: a token only fills in each topic's `user_vote`, so an
// absent/expired one just means an anonymous read (no 401-retry dance).
export async function GET(request: NextRequest): Promise<Response> {
   const accessToken = await getAccessToken();

   const forwardedParams = new URLSearchParams();

   for (const key of ["page", "page_size", "sort", "search"]) {
      const value = request.nextUrl.searchParams.get(key);

      if (value) {
         forwardedParams.set(key, value);
      }
   }

   const query = forwardedParams.toString();

   const result = await callSub2Api<Record<string, unknown>>(
      `/forum/topics${query ? `?${query}` : ""}`,
      { accessToken }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}

// POST /api/forum/topics — proxies POST /forum/topics (FORUM_API_GUIDE.md §2).
// Opening a discussion requires a signed-in user.
export async function POST(request: Request): Promise<Response> {
   const accessToken = await getAccessToken();

   if (!accessToken) {
      return Response.json({ message: "Not signed in" }, { status: 401 });
   }

   let body: unknown;

   try {
      body = await request.json();
   } catch {
      return Response.json({ message: "Invalid request body" }, { status: 400 });
   }

   const { title, content } = (body ?? {}) as { title?: unknown; content?: unknown };

   if (typeof title !== "string" || !title.trim()) {
      return Response.json({ message: "Topic title is required" }, { status: 400 });
   }

   if (typeof content !== "string" || !content.trim()) {
      return Response.json({ message: "Topic content is required" }, { status: 400 });
   }

   // Mirrors the guide's documented limits so an over-long draft fails here
   // with a clear message instead of as an opaque backend validation error.
   if (title.trim().length > TITLE_MAX_LENGTH) {
      return Response.json(
         { message: `Topic title must be at most ${TITLE_MAX_LENGTH} characters` },
         { status: 400 }
      );
   }

   if (content.trim().length > CONTENT_MAX_LENGTH) {
      return Response.json(
         { message: `Topic content must be at most ${CONTENT_MAX_LENGTH} characters` },
         { status: 400 }
      );
   }

   const result = await callSub2ApiWithAuth<Record<string, unknown>>("/forum/topics", accessToken, {
      method: "POST",
      body: JSON.stringify({ title: title.trim(), content: content.trim() }),
   });

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
