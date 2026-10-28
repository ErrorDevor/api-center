import { callSub2Api } from "shared/lib/auth/sub2api";

// POST /api/auth/reset-password — proxies sub2api's POST /auth/reset-password
// with the email + token from the emailed link and the new password.
export async function POST(request: Request): Promise<Response> {
   let body: { email?: unknown; token?: unknown; password?: unknown };

   try {
      body = await request.json();
   } catch {
      return Response.json({ message: "Invalid request body" }, { status: 400 });
   }

   const { email, token, password } = body;

   if (
      typeof email !== "string" ||
      typeof token !== "string" ||
      typeof password !== "string" ||
      !email ||
      !token ||
      !password
   ) {
      return Response.json({ message: "Email, token and password are required" }, { status: 400 });
   }

   const result = await callSub2Api<unknown>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, token, new_password: password }),
   });

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ ok: true });
}
