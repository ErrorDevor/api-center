export type TrustStatus = "green" | "yellow" | "red";

export interface ProviderPriceRecord {
   providerName: string;
   providerDomain: string;
   providerUrl: string;
   // Locale-specific storefront for this reseller (e.g. zivv.pro's own
   // "/en/" path) — not every reseller has one, so null rather than
   // dropping the record; see shared/lib/providers/getLocalizedProviderUrl,
   // which falls back to providerUrl above when the current locale's is
   // missing.
   providerUrlRu: string | null;
   providerUrlEn: string | null;
   modelName: string;
   canonicalModelId: string;
   // Per-token pricing. Null on records priced natively instead (see
   // nativePriceUsd below) — e.g. per-request/per-second image/video models
   // like Kling, which have no meaningful "per 1M tokens" rate.
   inputPriceUsdPer1m: number | null;
   outputPriceUsdPer1m: number | null;
   officialInputPriceUsdPer1m: number | null;
   officialOutputPriceUsdPer1m: number | null;
   inputDiscountPercent: number | null;
   outputDiscountPercent: number | null;
   // Flat native price for models billed per-request/per-second/etc rather
   // than per token (native_price_unit names the unit, e.g. "request",
   // "second"). Mutually exclusive with the per-token fields above — a
   // record has one pricing shape or the other, never both, never neither.
   nativePriceUsd: number | null;
   nativePriceUnit: string | null;
   // Official (undiscounted) native price and the resulting discount, mirroring
   // the per-token official/discount fields above — not backfilled onto every
   // natively-priced record yet, so null rather than dropping the row. Despite
   // its "_per_second" name (backend quirk), this key is sent as-is regardless
   // of the record's own nativePriceUnit — see parseProviderPriceRecords.
   officialNativePriceUsd: number | null;
   nativeDiscountPercent: number | null;
   trustStatus: TrustStatus;
   sourceUrl: string;
   lastCheckedAt: string;
   paymentMethods: string[];
   // Whois-derived domain age (see ProviderTooltip / CommentCardOptions'
   // "Возраст" row). Not backfilled onto every record yet — null rather
   // than dropping the record when it's absent/malformed.
   domainAgeDays: number | null;
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
      // Optional, same reasoning as domainAgeDays below: not every reseller
      // has a locale-specific storefront, so an absent/malformed value
      // defaults to null rather than dropping the record.
      const providerUrlRu = isNonEmptyString(raw.provider_url_ru) ? raw.provider_url_ru : null;
      const providerUrlEn = isNonEmptyString(raw.provider_url_en) ? raw.provider_url_en : null;
      const modelName = raw.model_name;
      const canonicalModelId = raw.canonical_model_id;
      const inputPriceUsdPer1m = isFiniteNumber(raw.input_price_usd_per_1m)
         ? raw.input_price_usd_per_1m
         : null;
      const outputPriceUsdPer1m = isFiniteNumber(raw.output_price_usd_per_1m)
         ? raw.output_price_usd_per_1m
         : null;
      const officialInputPriceUsdPer1m = isFiniteNumber(raw.official_input_price_usd_per_1m)
         ? raw.official_input_price_usd_per_1m
         : null;
      const officialOutputPriceUsdPer1m = isFiniteNumber(raw.official_output_price_usd_per_1m)
         ? raw.official_output_price_usd_per_1m
         : null;
      const inputDiscountPercent = isFiniteNumber(raw.input_discount_percent)
         ? raw.input_discount_percent
         : null;
      const outputDiscountPercent = isFiniteNumber(raw.output_discount_percent)
         ? raw.output_discount_percent
         : null;
      // Optional: only present on natively-priced records (see
      // ProviderPriceRecord.nativePriceUsd above).
      const nativePriceUsd = isFiniteNumber(raw.native_price_usd) ? raw.native_price_usd : null;
      const nativePriceUnit = isNonEmptyString(raw.native_price_unit)
         ? raw.native_price_unit
         : null;
      // Fixed key name regardless of this record's own native_price_unit —
      // the backend sends "official_native_price_usd_per_second" even on
      // "request"-unit rows (e.g. bytedance/seedance-1-0-pro), so it isn't
      // actually unit-specific despite the name.
      const officialNativePriceUsd = isFiniteNumber(raw.official_native_price_usd_per_second)
         ? raw.official_native_price_usd_per_second
         : null;
      const nativeDiscountPercent = isFiniteNumber(raw.native_discount_percent)
         ? raw.native_discount_percent
         : null;
      const trustStatus = raw.trust_status;
      const sourceUrl = raw.source_url;
      const lastCheckedAt = raw.last_checked_at;
      // Optional: newer field the backend may not have backfilled onto
      // every record yet, so an absent/malformed value defaults to an
      // empty array instead of dropping the whole record.
      const paymentMethods = Array.isArray(raw.payment_methods)
         ? raw.payment_methods.filter(isNonEmptyString)
         : [];
      // Optional, same reasoning: not backfilled onto every record yet.
      const domainAgeDays = isFiniteNumber(raw.domain_age_days) ? raw.domain_age_days : null;

      // A record is priced either per-token or natively (flat per-request/
      // per-second/etc) — never both, never neither.
      const hasTokenPricing =
         inputPriceUsdPer1m !== null &&
         outputPriceUsdPer1m !== null &&
         officialInputPriceUsdPer1m !== null &&
         officialOutputPriceUsdPer1m !== null &&
         inputDiscountPercent !== null &&
         outputDiscountPercent !== null;
      const hasNativePricing = nativePriceUsd !== null && nativePriceUnit !== null;

      const isValid =
         isNonEmptyString(providerName) &&
         isNonEmptyString(providerDomain) &&
         isNonEmptyString(providerUrl) &&
         isNonEmptyString(modelName) &&
         isNonEmptyString(canonicalModelId) &&
         (hasTokenPricing || hasNativePricing) &&
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
         providerUrlRu,
         providerUrlEn,
         modelName,
         canonicalModelId,
         inputPriceUsdPer1m,
         outputPriceUsdPer1m,
         officialInputPriceUsdPer1m,
         officialOutputPriceUsdPer1m,
         inputDiscountPercent,
         outputDiscountPercent,
         nativePriceUsd,
         nativePriceUnit,
         officialNativePriceUsd,
         nativeDiscountPercent,
         trustStatus: trustStatus as TrustStatus,
         sourceUrl,
         lastCheckedAt,
         paymentMethods,
         domainAgeDays,
      });
   }

   return records;
};
