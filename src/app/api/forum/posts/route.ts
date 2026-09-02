import type { NextRequest } from "next/server";

import { getAccessToken } from "shared/lib/auth/session-cookies";
import { callSub2Api, callSub2ApiWithAuth } from "shared/lib/auth/sub2api";

// GET /api/forum/posts — proxies GET /forum/posts (FORUM_API_GUIDE.md §1).
// Auth is optional: a token only fills in each post's `user_vote`, so an
// absent/expired one just means an anonymous read (no 401-retry dance).
export async function GET(request: NextRequest): Promise<Response> {
   const accessToken = await getAccessToken();

   const forwardedParams = new URLSearchParams();

   for (const key of ["page", "page_size", "sort"]) {
      const value = request.nextUrl.searchParams.get(key);

      if (value) {
         forwardedParams.set(key, value);
      }
   }

   const query = forwardedParams.toString();

   const result = await callSub2Api<Record<string, unknown>>(
      `/forum/posts${query ? `?${query}` : ""}`,
      { accessToken }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}

// POST /api/forum/posts — proxies POST /forum/posts (FORUM_API_GUIDE.md §2).
// Publishing a root post requires a signed-in user.
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

   const { content } = (body ?? {}) as { content?: unknown };

   if (typeof content !== "string" || !content.trim()) {
      return Response.json({ message: "Post content is required" }, { status: 400 });
   }

   const result = await callSub2ApiWithAuth<Record<string, unknown>>(
      "/forum/posts",
      accessToken,
      { method: "POST", body: JSON.stringify({ content }) }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
