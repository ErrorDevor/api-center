import { callSub2Api } from "shared/lib/auth/sub2api";
import { setSessionCookies } from "shared/lib/auth/session-cookies";
import { parseAuthTokens, parseAuthUser } from "shared/lib/auth/types";

interface RegisterRequestBody {
   email?: unknown;
   password?: unknown;
}

// POST /api/auth/register — proxies sub2api's POST /auth/register. Email
// verification, promo/invitation codes, and turnstile are out of scope for
// this pass (see AUTH_API_GUIDE.md §3/§4), so those fields are always sent
// empty. On success, the token pair is stored in httpOnly cookies and never
// reaches the client — only the user object is returned.
export async function POST(request: Request): Promise<Response> {
   let body: RegisterRequestBody;

   try {
      body = await request.json();
   } catch {
      return Response.json({ message: "Invalid request body" }, { status: 400 });
   }

   const { email, password } = body;

   if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return Response.json({ message: "Email and password are required" }, { status: 400 });
   }

   const result = await callSub2Api<Record<string, unknown>>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
         email,
         password,
         verify_code: "",
         promo_code: "",
         invitation_code: "",
         turnstile_token: "",
      }),
   });

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   const tokens = parseAuthTokens(result.data);
   const user = parseAuthUser(result.data.user);

   if (!tokens || !user) {
      return Response.json(
         { message: "Unexpected response from the auth server" },
         { status: 502 }
      );
   }

   await setSessionCookies(tokens);

   return Response.json({ user });
}
