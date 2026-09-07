import { getAccessToken } from "shared/lib/auth/session-cookies";
import { callSub2Api } from "shared/lib/auth/sub2api";

// GET /api/forum/topics/[id] — proxies GET /forum/topics/:id
// (FORUM_API_GUIDE.md §3). Auth optional, same reasoning as the topics list.
export async function GET(
   _request: Request,
   { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
   const { id } = await params;
   const accessToken = await getAccessToken();

   const result = await callSub2Api<Record<string, unknown>>(
      `/forum/topics/${encodeURIComponent(id)}`,
      { accessToken }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
