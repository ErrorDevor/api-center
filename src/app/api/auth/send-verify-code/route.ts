import { callSub2Api } from "shared/lib/auth/sub2api";

// POST /api/auth/send-verify-code — proxies sub2api's POST
// /auth/send-verify-code, which emails a registration code to the address
// (sub2api sends it through its configured SMTP, e.g. Resend). Turnstile is
// always sent empty, like the other auth routes.
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

   const result = await callSub2Api<unknown>("/auth/send-verify-code", {
      method: "POST",
      body: JSON.stringify({ email, turnstile_token: "" }),
   });

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ ok: true });
}
