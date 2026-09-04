import type { RankingColumnFormat } from "./categories";

const DASH = "—";

// Context window, tokens → "128K" / "1.05M".
const formatContext = (value: number): string => {
   if (value >= 1_000_000) {
      return `${Number((value / 1_000_000).toFixed(2))}M`;
   }

   if (value >= 1_000) {
      return `${Math.round(value / 1_000)}K`;
   }

   return String(value);
};

/**
 * Renders one metric cell for the /rating table. `null` (feed carries no
 * value for this model on this axis) always renders as a dash.
 */
export const formatMetric = (
   value: number | null,
   format: RankingColumnFormat
): string => {
   if (value == null) {
      return DASH;
   }

   switch (format) {
      // Benchmark index (llm_stats / reasoning / coding / agent) — one decimal.
      case "score":
         return value.toFixed(1);
      // Elo-style arena rating (image_gen, text_to_video, tts, stt, …).
      case "int":
         return Math.round(value).toLocaleString("en-US");
      case "context":
         return formatContext(value);
      case "speed":
         return `${Math.round(value)} т/с`;
      case "latency":
         return `${Math.round(value)} мс`;
      // Blended price per 1M tokens / per generated unit, USD.
      case "pricePer1M":
      case "pricePerMinute":
         return `$${value.toFixed(2)}`;
      case "pricePerImage":
      case "pricePerSecond":
         return `$${value.toFixed(3)}`;
   }
};
