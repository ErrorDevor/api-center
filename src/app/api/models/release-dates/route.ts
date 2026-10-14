// GET /api/models/release-dates — { dates: { "<model-slug>": "YYYY-MM-DD" } }.
// Neither models.json nor providers.json carries a release date, so it is
// pulled from two public catalogs and merged server-side (one cached fetch
// instead of every visitor hitting them): llm-stats.com first, OpenRouter's
// `created` timestamp as the fallback for slugs llm-stats doesn't list.
// Keys are the slug part of canonical_model_id, lowercased with "." -> "-"
// (see normalizeModelSlug), so "gpt-5.4" and "gpt-5-4" meet in the middle.

const REVALIDATE_SECONDS = 60 * 60 * 24;

const LLM_STATS_URL = "https://api.llm-stats.com/v1/models";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/models";

interface LlmStatsModel {
   id?: unknown;
   release_date?: unknown;
}

interface OpenRouterModel {
   id?: unknown;
   created?: unknown;
}

const normalizeModelSlug = (slug: string): string => slug.toLowerCase().replace(/\./g, "-");

const fetchJson = async (url: string): Promise<unknown> => {
   try {
      const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });

      return response.ok ? await response.json() : null;
   } catch {
      return null;
   }
};

export async function GET(): Promise<Response> {
   const [llmStats, openRouter] = await Promise.all([
      fetchJson(LLM_STATS_URL),
      fetchJson(OPENROUTER_URL),
   ]);

   const dates: Record<string, string> = {};

   const openRouterModels =
      (openRouter as { data?: OpenRouterModel[] } | null)?.data ?? [];

   for (const model of openRouterModels) {
      if (typeof model.id !== "string" || typeof model.created !== "number") {
         continue;
      }

      // "anthropic/claude-sonnet-4.5:free" -> "claude-sonnet-4-5"
      const slug = normalizeModelSlug(model.id.split("/").slice(1).join("/").split(":")[0]);

      if (slug && model.created > 0) {
         const date = new Date(model.created * 1000).toISOString().slice(0, 10);

         // Several listings can share a slug — keep the earliest, i.e. the
         // actual release rather than a later re-listing.
         if (!dates[slug] || date < dates[slug]) {
            dates[slug] = date;
         }
      }
   }

   if (Array.isArray(llmStats)) {
      for (const model of llmStats as LlmStatsModel[]) {
         if (typeof model.id === "string" && typeof model.release_date === "string") {
            dates[normalizeModelSlug(model.id)] = model.release_date.slice(0, 10);
         }
      }
   }

   return Response.json(
      { dates },
      { headers: { "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}` } }
   );
}
