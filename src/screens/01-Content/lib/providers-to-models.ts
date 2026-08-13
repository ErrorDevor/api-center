import type { ModelDescription, ModelItem } from "./content.data";

import type { ModelCatalogEntry } from "shared/lib/models/types";
import type { ProviderPriceRecord } from "shared/lib/providers/types";

// Fields with no real-data equivalent (review/report counters) intentionally
// stay static placeholders shared by every row — see ModelRow's fallback
// lookup in provider.data.ts.
const STUB_REVIEWS = 123;
const STUB_REPORTS = 12;

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

const computeDiscountPercent = (record: ProviderPriceRecord): number => {
   const inputDiscount =
      discountFromPrice(record.inputPriceUsdPer1m, record.officialInputPriceUsdPer1m) ??
      record.inputDiscountPercent;
   const outputDiscount =
      discountFromPrice(record.outputPriceUsdPer1m, record.officialOutputPriceUsdPer1m) ??
      record.outputDiscountPercent;

   // The backend pipeline is only supposed to publish listings that are
   // actually cheaper than official, but clamp defensively so a stray bad
   // record can't render "-5% cheaper".
   return Math.max(0, Math.round((inputDiscount + outputDiscount) / 2));
};

// Dozens of resellers can list the same canonical model — showing every
// single listing floods the table with near-duplicate rows for whichever
// model happens to be popular (same name/description, differing only by
// provider) and crowds out everything else. Cap it to the cheapest few
// offers per model instead.
const MAX_LISTINGS_PER_MODEL = 2;

const selectCheapestPerModel = (records: ProviderPriceRecord[]): ProviderPriceRecord[] => {
   const totalPrice = (record: ProviderPriceRecord): number =>
      record.inputPriceUsdPer1m + record.outputPriceUsdPer1m;

   const groupsByModel = new Map<string, ProviderPriceRecord[]>();

   for (const record of records) {
      const group = groupsByModel.get(record.canonicalModelId);

      if (group) {
         group.push(record);
      } else {
         groupsByModel.set(record.canonicalModelId, [record]);
      }
   }

   return Array.from(groupsByModel.values()).flatMap((group) =>
      [...group].sort((a, b) => totalPrice(a) - totalPrice(b)).slice(0, MAX_LISTINGS_PER_MODEL)
   );
};

export const toModelItems = (
   records: ProviderPriceRecord[],
   catalog: ModelCatalogEntry[] = []
): ModelItem[] => {
   // Multiple provider listings share the same canonical_model_id (one row
   // per reseller), so index the catalog once instead of scanning it per row.
   const catalogById = new Map(catalog.map((entry) => [entry.canonicalModelId, entry]));

   return selectCheapestPerModel(records).map((record): ModelItem => {
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
         discountPercent: computeDiscountPercent(record),
         paymentMethods: record.paymentMethods,
         provider: record.providerName,
         providerUrl: record.providerUrl,
         reviews: STUB_REVIEWS,
         reports: STUB_REPORTS,
      };
   });
};
