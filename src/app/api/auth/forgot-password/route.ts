import { callSub2Api } from "shared/lib/auth/sub2api";

// POST /api/auth/forgot-password — proxies sub2api's POST /auth/forgot-password,
// which emails a link to /reset-password?email=…&token=…. Turnstile is always
// sent empty, like the other auth routes.
export async function POST(request: Request): Promise<Response> {
   let body: { email?: unknown };

   try {
      body = await request.json();
   } catch {
      return Response.json({ message: "Invalid request body" }, { status: 400 });
   }

   const { email } = body;

   if (typeof email !== "string" || !email) {
      return Response.json({ message: "Email is required" }, { status: 400 });
   }

   const result = await callSub2Api<unknown>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email, turnstile_token: "" }),
   });

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ ok: true });
}
