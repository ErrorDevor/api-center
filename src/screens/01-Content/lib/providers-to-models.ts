import type { ModelDescription, ModelItem } from "./content.data";

import type { ModelCatalogEntry } from "shared/lib/models/types";
import type { ProviderPriceRecord } from "shared/lib/providers/types";

// Placeholder shown only until ModelRow's useProviderCommentSummary loads
// the real per-provider counts (see shared/lib/providerComments) — this
// pure function has no hook access, so it can't fetch them itself. 0 rather
// than some plausible-looking fake number, so a slow/failed fetch reads as
// "unknown" instead of quietly lying.
const PLACEHOLDER_REVIEWS = 0;
const PLACEHOLDER_REPORTS = 0;

// Shown when a model has no matching entry in the catalog feed (models.json)
// — e.g. a brand-new listing the catalog hasn't caught up with yet. Actual
// text is picked/translated by the consumer (ModelRow), same as any other
// UI copy — this is just a marker the description was never found.
const MISSING_DESCRIPTION: ModelDescription = { ru: "", en: "" };

// Computed straight from the price fields (actual vs official) rather than
// trusting the backend's precomputed input/output_discount_percent as-is —
// those two numbers should agree, but deriving from the prices themselves
// means a bad/stale percent field can't ever show a discount that doesn't
// match the prices actually displayed next to it.
const discountFromPrice = (actualPrice: number, officialPrice: number): number | null =>
   officialPrice > 0 ? ((officialPrice - actualPrice) / officialPrice) * 100 : null;

const computeRawDiscountPercent = (record: ProviderPriceRecord): number | null => {
   if (record.nativePriceUsd !== null) {
      // Not every natively-priced record has been backfilled with an official
      // price or a precomputed percent yet — null (badge hidden) rather than
      // a fake "0% cheaper" when there's simply no discount data at all. A
      // genuinely computed 0% (actual price matches official) is still shown.
      const nativeDiscount =
         (record.officialNativePriceUsd !== null
            ? discountFromPrice(record.nativePriceUsd, record.officialNativePriceUsd)
            : null) ?? record.nativeDiscountPercent;

      if (nativeDiscount === null) {
         return null;
      }

      return Math.round(nativeDiscount);
   }

   // Natively-priced records are handled above; anything left without a full
   // per-token pricing set has nothing to discount against either.
   if (
      record.inputPriceUsdPer1m === null ||
      record.outputPriceUsdPer1m === null ||
      record.officialInputPriceUsdPer1m === null ||
      record.officialOutputPriceUsdPer1m === null
   ) {
      return null;
   }

   const inputDiscount =
      discountFromPrice(record.inputPriceUsdPer1m, record.officialInputPriceUsdPer1m) ??
      record.inputDiscountPercent;
   const outputDiscount =
      discountFromPrice(record.outputPriceUsdPer1m, record.officialOutputPriceUsdPer1m) ??
      record.outputDiscountPercent;

   // Same rule as above: no fabricated 0% when a side's discount couldn't be
   // computed from prices and has no precomputed percent to fall back on.
   if (inputDiscount === null || outputDiscount === null) {
      return null;
   }

   return Math.round((inputDiscount + outputDiscount) / 2);
};

// A real reseller discount is strictly below 100% (that would be free) and
// not negative (that would be pricier than official); anything outside that
// range is bad price data, so the whole listing is dropped, not just its badge.
const isDiscountInRange = (percent: number | null): boolean =>
   percent === null || (percent >= 0 && percent < 100);

// Discount of BestAIPrice's own gateway price against the model's official
// price. Null (badge hidden) when there's nothing to compare against, when
// BestAIPrice isn't actually cheaper, or for an impossible 100%+ discount.
export const computeGatewayDiscountPercent = (
   pricing: {
      inputPrice: number | null;
      outputPrice: number | null;
      nativePriceUsd: number | null;
   },
   official: {
      officialInputPrice: number | null;
      officialOutputPrice: number | null;
      officialNativePriceUsd: number | null;
   }
): number | null => {
   let percent: number | null = null;

   if (pricing.nativePriceUsd !== null) {
      percent =
         official.officialNativePriceUsd !== null
            ? discountFromPrice(pricing.nativePriceUsd, official.officialNativePriceUsd)
            : null;
   } else if (
      pricing.inputPrice !== null &&
      pricing.outputPrice !== null &&
      official.officialInputPrice !== null &&
      official.officialOutputPrice !== null
   ) {
      const input = discountFromPrice(pricing.inputPrice, official.officialInputPrice);
      const output = discountFromPrice(pricing.outputPrice, official.officialOutputPrice);

      percent = input !== null && output !== null ? (input + output) / 2 : null;
   }

   if (percent === null) {
      return null;
   }

   const rounded = Math.round(percent);

   return rounded > 0 && rounded < 100 ? rounded : null;
};

export const toModelItems = (
   records: ProviderPriceRecord[],
   catalog: ModelCatalogEntry[] = []
): ModelItem[] => {
   // Multiple provider listings share the same canonical_model_id (one row
   // per reseller), so index the catalog once instead of scanning it per row.
   const catalogById = new Map(catalog.map((entry) => [entry.canonicalModelId, entry]));

   return records
      .filter((record) => isDiscountInRange(computeRawDiscountPercent(record)))
      .map((record): ModelItem => {
         const catalogEntry = catalogById.get(record.canonicalModelId);
         const description: ModelDescription = catalogEntry
            ? { ru: catalogEntry.descriptionRu, en: catalogEntry.descriptionEn }
            : MISSING_DESCRIPTION;

         return {
            id: `${record.providerDomain}__${record.canonicalModelId}`,
            name: record.modelName,
            canonicalModelId: record.canonicalModelId,
            description,
            inputPrice: record.inputPriceUsdPer1m,
            outputPrice: record.outputPriceUsdPer1m,
            nativePriceUsd: record.nativePriceUsd,
            nativePriceUnit: record.nativePriceUnit,
            discountPercent: computeRawDiscountPercent(record),
            officialInputPrice: record.officialInputPriceUsdPer1m,
            officialOutputPrice: record.officialOutputPriceUsdPer1m,
            officialNativePriceUsd: record.officialNativePriceUsd,
            paymentMethods: record.paymentMethods,
            provider: record.providerName,
            providerUrl: record.providerUrl,
            providerUrlRu: record.providerUrlRu,
            providerUrlEn: record.providerUrlEn,
            providerDomain: record.providerDomain,
            reviews: PLACEHOLDER_REVIEWS,
            reports: PLACEHOLDER_REPORTS,
            domainAgeDays: record.domainAgeDays,
         };
      });
};
