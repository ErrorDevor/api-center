import { getAccessToken } from "shared/lib/auth/session-cookies";
import { callSub2ApiWithAuth } from "shared/lib/auth/sub2api";

// POST /api/comments/[id]/vote — proxies POST /comments/:id/vote
// (COMMENTS_API_GUIDE.md §5). Requires a signed-in user; vote_type is
// "like" | "dislike" | "none" (the last one clears the caller's vote).
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

   const { vote_type: voteType } = (body ?? {}) as { vote_type?: unknown };

   if (voteType !== "like" && voteType !== "dislike" && voteType !== "none") {
      return Response.json({ message: "vote_type must be like, dislike or none" }, { status: 400 });
   }

   const result = await callSub2ApiWithAuth<Record<string, unknown>>(
      `/comments/${encodeURIComponent(id)}/vote`,
      accessToken,
      { method: "POST", body: JSON.stringify({ vote_type: voteType }) }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
