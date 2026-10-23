"use server";

// Server action returning, for one OpenRouter usage category ("programming",
// "legal", "health", ...), the models OpenRouter ranks in it, best first.
// Each model comes as the set of normalised keys it can be recognised by
// (display name, id slug, canonical slug — see modelKey), so the /rating
// leaderboard can match them against its own feed's model names. Cached
// in memory for a day so visitors don't each hit OpenRouter; new models and
// re-rankings show up without a code change.

const REVALIDATE_SECONDS = 60 * 60 * 24;

const OPENROUTER_URL = "https://openrouter.ai/api/v1/models";

const cache = new Map<string, { at: number; models: string[][] }>();

// "Claude Opus 5.5" / "claude-opus-5.5" -> "claudeopus55"
const modelKey = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export async function getOpenRouterCategoryModels(category: string): Promise<string[][]> {
   const cached = cache.get(category);

   if (cached && Date.now() - cached.at < REVALIDATE_SECONDS * 1000) {
      return cached.models;
   }

   try {
      const response = await fetch(`${OPENROUTER_URL}?category=${encodeURIComponent(category)}`, {
         next: { revalidate: REVALIDATE_SECONDS },
      });

      if (!response.ok) {
         return cached?.models ?? [];
      }

      const payload = (await response.json()) as { data?: Record<string, unknown>[] };

      const models = (payload.data ?? []).map((model) => {
         const keys = new Set<string>();

         if (typeof model.name === "string") {
            keys.add(modelKey(model.name.split(":").slice(1).join(":") || model.name));
         }

         for (const id of [model.id, model.canonical_slug]) {
            if (typeof id === "string") {
               keys.add(modelKey(id.split("/").slice(1).join("/")));
            }
         }

         return Array.from(keys);
      });

      if (models.length > 0) {
         cache.set(category, { at: Date.now(), models });
      }

      return models;
   } catch {
      return cached?.models ?? [];
   }
}
