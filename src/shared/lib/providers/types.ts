export type TrustStatus = "green" | "yellow" | "red";

export interface ProviderPriceRecord {
   providerName: string;
   providerDomain: string;
   providerUrl: string;
   modelName: string;
   canonicalModelId: string;
   inputPriceUsdPer1m: number;
   outputPriceUsdPer1m: number;
   officialInputPriceUsdPer1m: number;
   officialOutputPriceUsdPer1m: number;
   inputDiscountPercent: number;
   outputDiscountPercent: number;
   trustStatus: TrustStatus;
   sourceUrl: string;
   lastCheckedAt: string;
   paymentMethods: string[];
}

const TRUST_STATUSES: readonly TrustStatus[] = ["green", "yellow", "red"];

const isNonEmptyString = (value: unknown): value is string =>
   typeof value === "string" && value.length > 0;

const isFiniteNumber = (value: unknown): value is number =>
   typeof value === "number" && Number.isFinite(value);

/**
 * Defensively parses the raw providers.json payload produced by the backend
 * parser. Records that don't match the expected shape are dropped instead of
 * crashing the page, since the daily cron job is out of our control.
 */
export const parseProviderPriceRecords = (payload: unknown): ProviderPriceRecord[] => {
   if (!Array.isArray(payload)) {
      return [];
   }

   const records: ProviderPriceRecord[] = [];

   for (const item of payload) {
      if (typeof item !== "object" || item === null) {
         continue;
      }

      const raw = item as Record<string, unknown>;

      const providerName = raw.provider_name;
      const providerDomain = raw.provider_domain;
      const providerUrl = raw.provider_url;
      const modelName = raw.model_name;
      const canonicalModelId = raw.canonical_model_id;
      const inputPriceUsdPer1m = raw.input_price_usd_per_1m;
      const outputPriceUsdPer1m = raw.output_price_usd_per_1m;
      const officialInputPriceUsdPer1m = raw.official_input_price_usd_per_1m;
      const officialOutputPriceUsdPer1m = raw.official_output_price_usd_per_1m;
      const inputDiscountPercent = raw.input_discount_percent;
      const outputDiscountPercent = raw.output_discount_percent;
      const trustStatus = raw.trust_status;
      const sourceUrl = raw.source_url;
      const lastCheckedAt = raw.last_checked_at;
      // Optional: newer field the backend may not have backfilled onto
      // every record yet, so an absent/malformed value defaults to an
      // empty array instead of dropping the whole record.
      const paymentMethods = Array.isArray(raw.payment_methods)
         ? raw.payment_methods.filter(isNonEmptyString)
         : [];

      const isValid =
         isNonEmptyString(providerName) &&
         isNonEmptyString(providerDomain) &&
         isNonEmptyString(providerUrl) &&
         isNonEmptyString(modelName) &&
         isNonEmptyString(canonicalModelId) &&
         isFiniteNumber(inputPriceUsdPer1m) &&
         isFiniteNumber(outputPriceUsdPer1m) &&
         isFiniteNumber(officialInputPriceUsdPer1m) &&
         isFiniteNumber(officialOutputPriceUsdPer1m) &&
         isFiniteNumber(inputDiscountPercent) &&
         isFiniteNumber(outputDiscountPercent) &&
         isNonEmptyString(sourceUrl) &&
         isNonEmptyString(lastCheckedAt) &&
         typeof trustStatus === "string" &&
         TRUST_STATUSES.includes(trustStatus as TrustStatus);

      if (!isValid) {
         continue;
      }

      records.push({
         providerName,
         providerDomain,
         providerUrl,
         modelName,
         canonicalModelId,
         inputPriceUsdPer1m,
         outputPriceUsdPer1m,
         officialInputPriceUsdPer1m,
         officialOutputPriceUsdPer1m,
         inputDiscountPercent,
         outputDiscountPercent,
         trustStatus: trustStatus as TrustStatus,
         sourceUrl,
         lastCheckedAt,
         paymentMethods,
      });
   }

   return records;
};
