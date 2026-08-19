import { getAccessToken } from "shared/lib/auth/session-cookies";
import { callSub2ApiWithAuth } from "shared/lib/auth/sub2api";
import { parseAuthUser } from "shared/lib/auth/types";

// GET /api/auth/profile — the session-hydration endpoint AuthProvider
// calls on mount. callSub2ApiWithAuth implements AUTH_API_GUIDE.md's
// authFetch retry-on-401 pattern server-side: an expired access token is
// silently refreshed once using the refresh_token cookie before giving up.
// "Not logged in" (no cookies, or an unrecoverable 401) is reported as a
// normal `{user: null}` 200 — it's expected steady state, not an error.
// Only an unreachable/misbehaving auth backend is reported as a real error.
export async function GET(): Promise<Response> {
   const accessToken = await getAccessToken();

   if (!accessToken) {
      return Response.json({ user: null });
   }

   const result = await callSub2ApiWithAuth<Record<string, unknown>>(
      "/user/profile",
      accessToken
   );

   if (!result.ok && result.status === 401) {
      return Response.json({ user: null });
   }

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: 502 });
   }

   const user = parseAuthUser(result.data);

   if (!user) {
      return Response.json(
         { message: "Unexpected response from the auth server" },
         { status: 502 }
      );
   }

   return Response.json({ user });
}
