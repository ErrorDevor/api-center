import { callSub2Api } from "shared/lib/auth/sub2api";

// GET /api/gateway/pricing — proxies sub2api's GET /models: BestAIPrice's
// own retail pricing table, the same one the gateway bills from. Public, no
// auth (same visibility as the catalog itself). Returns the raw list as-is
// — no markup/rounding/derivation happens here or in the client hook, so
// the catalog's advertised price can never diverge from what the gateway
// actually charges.
export async function GET(): Promise<Response> {
   const result = await callSub2Api<unknown>("/models");

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
