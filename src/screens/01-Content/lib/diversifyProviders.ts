import type { ModelItem } from "./content.data";

/**
 * Breaks up runs of adjacent rows from the same reseller (e.g. one provider
 * happening to be cheapest for every Claude model in a row) without
 * disturbing the current sort otherwise — a light local swap, not a re-sort.
 *
 * For each clash, pulls the nearest later row with a different provider
 * than the one directly above into the clashing slot. When a provider
 * dominates the remaining tail (e.g. it's the sole listing for every model
 * left), a clash can be mathematically unavoidable — that remainder is left
 * as-is rather than forced, since hiding a listing to "fix" this would lose
 * real data.
 */
export const diversifyAdjacentProviders = (models: ModelItem[]): ModelItem[] => {
   const result = [...models];

   for (let index = 1; index < result.length; index++) {
      const previousProvider = result[index - 1].provider;

      if (result[index].provider !== previousProvider) {
         continue;
      }

      const swapIndex = result.findIndex(
         (model, candidateIndex) => candidateIndex > index && model.provider !== previousProvider
      );

      if (swapIndex === -1) {
         continue;
      }

      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
   }

   return result;
};
