import type { NextRequest } from "next/server";

import { getAccessToken } from "shared/lib/auth/session-cookies";
import { callSub2Api } from "shared/lib/auth/sub2api";

// POST /api/providers/[provider]/click — proxies POST /providers/:provider/click
// (PROVIDERS_POPULARITY_API_GUIDE.md §1). Records a click/visit for a
// provider, behind the backend's anti-abuse engine:
//   - auth is optional (a Bearer token just ties the click to a user_id),
//   - the backend rate-limits and de-dupes by real client IP + User-Agent
//     and rejects missing/suspicious UAs outright, so both headers are
//     forwarded from the browser request rather than left as this server's.
export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ provider: string }> }
): Promise<Response> {
   const { provider } = await params;
   const accessToken = await getAccessToken();

   const userAgent = request.headers.get("user-agent");
   const forwardedFor = request.headers.get("x-forwarded-for");
   const realIp = request.headers.get("x-real-ip");

   const result = await callSub2Api<Record<string, unknown>>(
      `/providers/${encodeURIComponent(provider)}/click`,
      {
         method: "POST",
         accessToken,
         headers: {
            ...(userAgent ? { "User-Agent": userAgent } : {}),
            ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
            ...(realIp ? { "X-Real-IP": realIp } : {}),
         },
      }
   );

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
