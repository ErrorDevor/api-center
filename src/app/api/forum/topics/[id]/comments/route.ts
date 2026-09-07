import type { NextRequest } from "next/server";

import { getAccessToken } from "shared/lib/auth/session-cookies";
import { callSub2Api, callSub2ApiWithAuth } from "shared/lib/auth/sub2api";

const CONTENT_MAX_LENGTH = 5000;

// GET /api/forum/topics/[id]/comments — proxies GET
// /forum/topics/:id/comments (FORUM_API_GUIDE.md §5). Auth optional.
export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
   const { id } = await params;
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
      `/forum/topics/${encodeURIComponent(id)}/comments${query ? `?${query}` : ""}`,
      { accessToken }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}

// POST /api/forum/topics/[id]/comments — proxies POST
// /forum/topics/:id/comments (FORUM_API_GUIDE.md §6). Requires a signed-in
// user; the topic's comment_count is bumped by the backend.
export async function POST(
   request: Request,
   { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
   const { id } = await params;
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
      return Response.json({ message: "Comment content is required" }, { status: 400 });
   }

   if (content.trim().length > CONTENT_MAX_LENGTH) {
      return Response.json(
         { message: `Comment must be at most ${CONTENT_MAX_LENGTH} characters` },
         { status: 400 }
      );
   }

   const result = await callSub2ApiWithAuth<Record<string, unknown>>(
      `/forum/topics/${encodeURIComponent(id)}/comments`,
      accessToken,
      { method: "POST", body: JSON.stringify({ content: content.trim() }) }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
