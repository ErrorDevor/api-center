import type { NextRequest } from "next/server";

import { getAccessToken } from "shared/lib/auth/session-cookies";
import { callSub2Api } from "shared/lib/auth/sub2api";

// GET /api/forum/posts/[id]/replies — proxies GET /forum/posts/:id/replies
// (FORUM_API_GUIDE.md §3). Auth optional, same reasoning as the root-posts
// GET route.
export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
   const { id } = await params;
   const accessToken = await getAccessToken();

   const forwardedParams = new URLSearchParams();

   for (const key of ["page", "page_size"]) {
      const value = request.nextUrl.searchParams.get(key);

      if (value) {
         forwardedParams.set(key, value);
      }
   }

   const query = forwardedParams.toString();

   const result = await callSub2Api<Record<string, unknown>>(
      `/forum/posts/${encodeURIComponent(id)}/replies${query ? `?${query}` : ""}`,
      { accessToken }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
