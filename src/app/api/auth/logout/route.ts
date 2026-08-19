import { callSub2Api } from "shared/lib/auth/sub2api";
import { clearSessionCookies, getAccessToken, getRefreshToken } from "shared/lib/auth/session-cookies";

// POST /api/auth/logout — best-effort revokes the session on sub2api, but
// always clears the local cookies regardless of whether that call
// succeeds. A user must always be able to log out of this app, even if the
// auth backend is unreachable or the token was already invalid.
export async function POST(): Promise<Response> {
   const [accessToken, refreshToken] = await Promise.all([getAccessToken(), getRefreshToken()]);

   if (accessToken && refreshToken) {
      await callSub2Api("/auth/logout", {
         method: "POST",
         accessToken,
         body: JSON.stringify({ refresh_token: refreshToken }),
      });
   }

   await clearSessionCookies();

   return Response.json({ ok: true });
}
