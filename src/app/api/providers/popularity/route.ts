import { callSub2Api } from "shared/lib/auth/sub2api";

// GET /api/providers/popularity — proxies GET /providers/popularity
// (PROVIDERS_POPULARITY_API_GUIDE.md §2). Public, no auth: returns every
// provider's aggregated click count and rank, ordered most-popular first.
export async function GET(): Promise<Response> {
   const result = await callSub2Api<Record<string, unknown>>("/providers/popularity");

   if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status });
   }

   return Response.json({ data: result.data });
}
