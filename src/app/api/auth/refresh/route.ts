import { refreshTokens } from "shared/lib/auth/sub2api";
import {
   clearSessionCookies,
   getRefreshToken,
   setSessionCookies,
} from "shared/lib/auth/session-cookies";

// POST /api/auth/refresh — rotates the session using the refresh_token
// cookie (the client never sends or sees it). Nothing in this pass's UI
// calls this directly — /api/auth/profile does its own internal
// refresh-on-401 via the same shared refreshTokens() helper — but it's
// exposed per AUTH_API_GUIDE.md §7 for future authenticated routes to use.
export async function POST(): Promise<Response> {
   const refreshToken = await getRefreshToken();

   if (!refreshToken) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
   }

   const result = await refreshTokens(refreshToken);

   if (!result.ok) {
      await clearSessionCookies();

      return Response.json({ message: result.message }, { status: result.status });
   }

   await setSessionCookies(result.data);

   return Response.json({ ok: true });
}
