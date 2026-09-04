export type RankingCategoryId =
   | "llm"
   | "image-generation"
   | "video-generation"
   | "text-to-speech"
   | "speech-to-text";

/**
 * One leaderboard row, normalised across every category feed
 * (llm_rankings.json, image_generation_rankings.json, …). The feeds all
 * share `rank` / `model` / `license`; every other column is a category-
 * specific numeric metric, kept here as a flat bag keyed by the feed's own
 * field name. categories.ts declares which keys each category reads and how
 * each one is rendered.
 */
export interface RankingEntry {
   // Leaderboard position, 1 = best. Null on entries the feed lists but
   // hasn't placed yet — the table filters those out.
   rank: number | null;
   // Model display name (the feed's "model"). Also drives the vendor icon,
   // see vendor-icons.ts.
   model: string;
   // The feed reports licence access directly as "open" or "closed" — any
   // other/absent value is treated as "closed".
   license: "open" | "closed";
   // Numeric columns by feed field name; missing/non-numeric → null (the
   // table renders a dash).
   metrics: Record<string, number | null>;
}

const isNonEmptyString = (value: unknown): value is string =>
   typeof value === "string" && value.length > 0;

const isFiniteNumber = (value: unknown): value is number =>
   typeof value === "number" && Number.isFinite(value);

const finiteOrNull = (value: unknown): number | null =>
   isFiniteNumber(value) ? value : null;

/**
 * Defensively parses a raw *_rankings.json payload. The feeds' exact field
 * set drifts over time, so the only hard requirement is a non-empty model
 * name; every requested metric falls back to null. Rows without a name are
 * dropped instead of crashing the page, since the feed's refresh job is out
 * of our control.
 */
export const parseRankings = (
   payload: unknown,
   metricKeys: readonly string[]
): RankingEntry[] => {
   if (!Array.isArray(payload)) {
      return [];
   }

   const entries: RankingEntry[] = [];

   for (const item of payload) {
      if (typeof item !== "object" || item === null) {
         continue;
      }

      const raw = item as Record<string, unknown>;

      if (!isNonEmptyString(raw.model)) {
         continue;
      }

      const metrics: Record<string, number | null> = {};

      for (const key of metricKeys) {
         metrics[key] = finiteOrNull(raw[key]);
      }

      entries.push({
         rank: finiteOrNull(raw.rank),
         model: raw.model,
         license: raw.license === "open" ? "open" : "closed",
         metrics,
      });
   }

   return entries;
};
