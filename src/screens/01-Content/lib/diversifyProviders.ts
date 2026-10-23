import type { ModelItem } from "./content.data";

// A provider may fill at most this many consecutive rows.
export const MAX_PROVIDER_RUN = 2;

/**
 * Breaks up runs of rows from the same reseller (e.g. one provider happening
 * to be cheapest for every Claude model) so the same provider never shows
 * more than MAX_PROVIDER_RUN times in a row, while keeping the current sort
 * as intact as possible: rows are taken in their existing order, skipping
 * only the ones that would extend a run past the limit.
 *
 * A provider that dominates the list would otherwise pile up at the tail, so
 * once its remaining rows can only just be spread out, it is placed ahead of
 * the others. If the limit is still unavoidable (e.g. one provider is the
 * only listing left) the rest keeps its order — hiding a listing to "fix"
 * this would lose real data.
 */
export const limitProviderRuns = (models: ModelItem[]): ModelItem[] => {
   const remaining = [...models];
   const counts = new Map<string, number>();

   for (const model of remaining) {
      counts.set(model.providerDomain, (counts.get(model.providerDomain) ?? 0) + 1);
   }

   const result: ModelItem[] = [];
   let lastDomain: string | undefined;
   let lastRun = 0;

   // Whether the rows left after placing `domain` next can still be arranged
   // without a run over the limit. A provider with `count` rows left and
   // `others` rows of other providers can use at most
   // MAX * (others + 1) slots (one run per gap between the others), minus
   // what its current run already used up.
   const canPlace = (domain: string): boolean => {
      const run = domain === lastDomain ? lastRun + 1 : 1;

      if (run > MAX_PROVIDER_RUN) {
         return false;
      }

      const left = remaining.length - 1;

      for (const [providerDomain, count] of counts) {
         const countAfter = providerDomain === domain ? count - 1 : count;
         const capacity =
            MAX_PROVIDER_RUN * (left - countAfter + 1) - (providerDomain === domain ? run : 0);

         if (countAfter > capacity) {
            return false;
         }
      }

      return true;
   };

   while (remaining.length > 0) {
      // First row, in the current order, that keeps the rest arrangeable.
      let index = remaining.findIndex((model) => canPlace(model.providerDomain));

      if (index === -1) {
         // Already unavoidable (e.g. one provider is all that is left) —
         // fall back to the first row that at least doesn't extend a run.
         index = remaining.findIndex(
            (model) => model.providerDomain !== lastDomain || lastRun < MAX_PROVIDER_RUN
         );
      }

      const [next] = remaining.splice(index === -1 ? 0 : index, 1);

      lastRun = next.providerDomain === lastDomain ? lastRun + 1 : 1;
      lastDomain = next.providerDomain;
      counts.set(next.providerDomain, (counts.get(next.providerDomain) ?? 1) - 1);
      result.push(next);
   }

   return result;
};
