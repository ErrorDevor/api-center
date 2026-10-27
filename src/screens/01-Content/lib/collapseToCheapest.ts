import type { ModelItem } from "./content.data";

// True when `candidate` is a strictly better per-token deal than `incumbent`
// — cheaper input price, or the same input price with a cheaper output price.
const isCheaper = (candidate: ModelItem, incumbent: ModelItem): boolean => {
   // Natively-priced listings (image/video) have no per-token price to
   // compare — fall back to their flat per-request/per-second price.
   if (candidate.inputPrice === null || incumbent.inputPrice === null) {
      return (candidate.nativePriceUsd ?? Infinity) < (incumbent.nativePriceUsd ?? Infinity);
   }

   const inputDelta = (candidate.inputPrice ?? 0) - (incumbent.inputPrice ?? 0);

   if (inputDelta !== 0) {
      return inputDelta < 0;
   }

   return (candidate.outputPrice ?? 0) < (incumbent.outputPrice ?? 0);
};

/**
 * The главная catalog lists every model once — the single cheapest offer —
 * instead of one row per reseller (which made a popular model repeat dozens
 * of times). Collapses to one `ModelItem` per `canonicalModelId`, keeping
 * the lowest-priced provider's row.
 *
 * Natively-priced models (image/video, "$/request"-style — inputPrice is
 * null) are kept too, collapsed by their flat native price; listings with
 * no price of either kind are dropped.
 */
export const collapseToCheapest = (items: ModelItem[]): ModelItem[] => {
   const cheapestByModel = new Map<string, ModelItem>();

   for (const item of items) {
      if (item.inputPrice === null && item.nativePriceUsd === null) {
         continue;
      }

      const incumbent = cheapestByModel.get(item.canonicalModelId);

      if (!incumbent || isCheaper(item, incumbent)) {
         cheapestByModel.set(item.canonicalModelId, item);
      }
   }

   return Array.from(cheapestByModel.values());
};
