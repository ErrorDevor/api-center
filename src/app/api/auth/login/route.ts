import { callSub2Api } from "shared/lib/auth/sub2api";
import { setSessionCookies } from "shared/lib/auth/session-cookies";
import { parseAuthTokens, parseAuthUser } from "shared/lib/auth/types";

interface LoginRequestBody {
   email?: unknown;
   password?: unknown;
}

// POST /api/auth/login — proxies sub2api's POST /auth/login. Turnstile is
// out of scope for this pass, so it's always sent empty. 2FA (AUTH_API_
// GUIDE.md §5 "Вариант Б") is explicitly out of scope too — an account
// that has it enabled gets a hard, clearly-worded failure here rather than
// a half-built flow, since the confirmation screen (§6) isn't implemented.
export async function POST(request: Request): Promise<Response> {
   let body: LoginRequestBody;

   try {
      body = await request.json();
   } catch {
      return Response.json({ message: "Invalid request body" }, { status: 400 });
   }

   const { email, password } = body;

   if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return Response.json({ message: "Email and password are required" }, { status: 400 });
   }

   const result = await callSub2Api<Record<string, unknown>>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, turnstile_token: "" }),
   });

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   if (result.data.require_2fa) {
      return Response.json(
         { message: "Two-factor authentication is required but not supported yet." },
         { status: 501 }
      );
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
