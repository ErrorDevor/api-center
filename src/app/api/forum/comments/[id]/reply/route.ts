import { getAccessToken } from "shared/lib/auth/session-cookies";
import { callSub2ApiWithAuth } from "shared/lib/auth/sub2api";

const CONTENT_MAX_LENGTH = 5000;

// POST /api/forum/comments/[id]/reply — proxies POST
// /forum/comments/:id/reply (FORUM_API_GUIDE.md §7). Requires a signed-in
// user; the parent comment's reply_count is bumped by the backend.
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
      return Response.json({ message: "Reply content is required" }, { status: 400 });
   }

   if (content.trim().length > CONTENT_MAX_LENGTH) {
      return Response.json(
         { message: `Reply must be at most ${CONTENT_MAX_LENGTH} characters` },
         { status: 400 }
      );
   }

   const result = await callSub2ApiWithAuth<Record<string, unknown>>(
      `/forum/comments/${encodeURIComponent(id)}/reply`,
      accessToken,
      { method: "POST", body: JSON.stringify({ content: content.trim() }) }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
