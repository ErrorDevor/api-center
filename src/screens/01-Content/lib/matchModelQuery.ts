import type { ModelItem } from "./content.data";
import { expandQueryToken } from "./transliterateQuery";

import { getVendorDisplayName, getVendorId } from "shared/lib/providers/vendors";

// Free-text catalog search (the header/mobile-sidebar box, wired through the
// `?q=` query param — see shared/ui/components/CatalogSearch). Matches the
// model's own name, its canonical id (so "sonnet" finds
// "anthropic/claude-sonnet-5"), the model vendor (id + display name), and the
// reseller (provider_name + provider_domain). Everything the user could
// reasonably type to mean "this row", joined and lower-cased once per row.
const haystack = (model: ModelItem): string => {
   const vendorId = getVendorId(model.canonicalModelId);

   return [
      model.name,
      model.canonicalModelId,
      vendorId,
      getVendorDisplayName(vendorId),
      model.provider,
      model.providerDomain,
   ]
      .join(" ")
      .toLowerCase();
};

// Case-insensitive AND across whitespace-separated tokens: "claude sonnet"
// only matches a row whose text contains both words. Each token is expanded
// to its possible Latin spellings first (see expandQueryToken), so a Russian
// query like "клод соннет" matches too — the token passes if ANY of its
// variants is found in the row.
export const modelMatchesQuery = (model: ModelItem, query: string): boolean => {
   const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

   if (tokens.length === 0) {
      return true;
   }

   const text = haystack(model);

   return tokens.every((token) =>
      expandQueryToken(token).some((variant) => text.includes(variant))
   );
};

export const filterModelsByQuery = (models: ModelItem[], query: string): ModelItem[] =>
   query.trim() ? models.filter((model) => modelMatchesQuery(model, query)) : models;
