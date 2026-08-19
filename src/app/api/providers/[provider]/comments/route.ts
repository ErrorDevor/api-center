import type { NextRequest } from "next/server";

import { getAccessToken } from "shared/lib/auth/session-cookies";
import { callSub2Api, callSub2ApiWithAuth } from "shared/lib/auth/sub2api";

// GET /api/providers/[provider]/comments — proxies
// GET /providers/:provider/comments (COMMENTS_API_GUIDE.md §1). Auth is
// optional here (only needed to get each comment's user_vote back), so no
// 401-retry dance — an expired/absent token just means an anonymous read.
export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ provider: string }> }
): Promise<Response> {
   const { provider } = await params;
   const accessToken = await getAccessToken();

   const forwardedParams = new URLSearchParams();

   for (const key of ["page", "page_size", "sort", "sentiment"]) {
      const value = request.nextUrl.searchParams.get(key);

      if (value) {
         forwardedParams.set(key, value);
      }
   }

   const query = forwardedParams.toString();

   const result = await callSub2Api<Record<string, unknown>>(
      `/providers/${encodeURIComponent(provider)}/comments${query ? `?${query}` : ""}`,
      { accessToken }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}

// POST /api/providers/[provider]/comments — proxies
// POST /providers/:provider/comments (COMMENTS_API_GUIDE.md §2). Publishing
// a root review requires a signed-in user.
export async function POST(
   request: Request,
   { params }: { params: Promise<{ provider: string }> }
): Promise<Response> {
   const { provider } = await params;
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

   const { content, sentiment } = (body ?? {}) as { content?: unknown; sentiment?: unknown };

   if (typeof content !== "string" || !content.trim()) {
      return Response.json({ message: "Review content is required" }, { status: 400 });
   }

   const result = await callSub2ApiWithAuth<Record<string, unknown>>(
      `/providers/${encodeURIComponent(provider)}/comments`,
      accessToken,
      {
         method: "POST",
         body: JSON.stringify({
            content,
            sentiment: sentiment === "negative" ? "negative" : "positive",
         }),
      }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
