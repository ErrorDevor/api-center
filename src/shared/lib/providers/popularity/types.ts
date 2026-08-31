const isFiniteNumber = (value: unknown): value is number =>
   typeof value === "number" && Number.isFinite(value);

export interface ProviderPopularity {
   // Opaque provider key the backend aggregates on. On this site that's the
   // reseller domain for /home rows (e.g. "litellm.ai") and the vendor id
   // for /group-buys rows (e.g. "openai") — the click endpoint takes
   // whatever key we send, so both live in the same store.
   provider: string;
   clickCount: number;
   rank: number;
}

/**
 * Unwraps GET /providers/popularity's `data.providers[]`
 * (PROVIDERS_POPULARITY_API_GUIDE.md §2) into a plain list. Rows missing a
 * provider key or a numeric click count are dropped rather than coerced to
 * 0 — a partial feed shouldn't invent popularity.
 */
export const parseProviderPopularityList = (payload: unknown): ProviderPopularity[] => {
   if (typeof payload !== "object" || payload === null) {
      return [];
   }

   const providers = (payload as Record<string, unknown>).providers;

   if (!Array.isArray(providers)) {
      return [];
   }

   const parsed: ProviderPopularity[] = [];

   for (const entry of providers) {
      if (typeof entry !== "object" || entry === null) {
         continue;
      }

      const raw = entry as Record<string, unknown>;
      const provider = raw.provider;
      const clickCount = raw.click_count;

      if (typeof provider !== "string" || !provider || !isFiniteNumber(clickCount)) {
         continue;
      }

      parsed.push({
         provider,
         clickCount,
         rank: isFiniteNumber(raw.rank) ? raw.rank : 0,
      });
   }

   return parsed;
};

export interface ClickResult {
   clickCount: number;
   // false when the backend's 15-min anti-abuse cooldown swallowed this
   // click — the count is unchanged and an optimistic local bump should be
   // rolled back.
   counted: boolean;
}

/**
 * Unwraps a POST /providers/:provider/click response
 * (PROVIDERS_POPULARITY_API_GUIDE.md §1) — the fresh aggregate count for
 * that provider plus whether it was actually counted, or null when the
 * payload isn't the expected shape.
 */
export const parseClickResult = (payload: unknown): ClickResult | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   if (!isFiniteNumber(raw.click_count)) {
      return null;
   }

   return { clickCount: raw.click_count, counted: raw.counted !== false };
};
