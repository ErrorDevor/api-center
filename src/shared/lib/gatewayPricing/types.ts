// BestAIPrice's own retail pricing, keyed by canonical_model_id — the exact
// numbers the gateway bills from (see /api/gateway/pricing and
// AUTH_API_BASE_URL's /models in sub2api.ts). This is deliberately a
// separate feed from providers.json's third-party reseller prices
// (content.data.ts's ModelItem): the catalog's BestAIPrice row must never
// compute or cache its own copy of a price, only render exactly what this
// endpoint returns, so the advertised price can't drift from billing.
export interface GatewayModelPricing {
   canonicalModelId: string;
   inputPrice: number | null;
   outputPrice: number | null;
   nativePriceUsd: number | null;
   nativePriceUnit: string | null;
   available: boolean;
}

const isNonEmptyString = (value: unknown): value is string =>
   typeof value === "string" && value.length > 0;

const isFiniteNumber = (value: unknown): value is number =>
   typeof value === "number" && Number.isFinite(value);

const toNullableNumber = (value: unknown): number | null | undefined => {
   if (value === null || value === undefined) {
      return null;
   }

   return isFiniteNumber(value) ? value : undefined;
};

// Defensively parses sub2api's GET /models response. Field names here are
// our best guess at the contract (snake_case, $/1M token pricing — same
// convention as models.json/providers.json) and should be checked against
// the real sub2api API guide once available; an entry whose shape doesn't
// match is dropped rather than rendered with a guessed/fabricated price.
export const parseGatewayPricingList = (payload: unknown): GatewayModelPricing[] => {
   if (!Array.isArray(payload)) {
      return [];
   }

   const entries: GatewayModelPricing[] = [];

   for (const item of payload) {
      if (typeof item !== "object" || item === null) {
         continue;
      }

      const raw = item as Record<string, unknown>;

      const canonicalModelId = raw.canonical_model_id ?? raw.model_id;

      if (!isNonEmptyString(canonicalModelId)) {
         continue;
      }

      const inputPrice = toNullableNumber(raw.input_price_per_1m ?? raw.input_price);
      const outputPrice = toNullableNumber(raw.output_price_per_1m ?? raw.output_price);
      const nativePriceUsd = toNullableNumber(raw.native_price_usd);
      const nativePriceUnitRaw = raw.native_price_unit;
      const nativePriceUnit = isNonEmptyString(nativePriceUnitRaw) ? nativePriceUnitRaw : null;

      if (inputPrice === undefined || outputPrice === undefined || nativePriceUsd === undefined) {
         continue;
      }

      const available =
         typeof raw.available === "boolean" ? raw.available : raw.status === "available";

      entries.push({
         canonicalModelId,
         inputPrice,
         outputPrice,
         nativePriceUsd,
         nativePriceUnit,
         available,
      });
   }

   return entries;
};
