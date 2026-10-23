import type { ProviderItem, ProviderModel } from "./sidebar.types";

import {
   KNOWN_VENDOR_IDS,
   getVendorDisplayName,
   getVendorIcon,
   getVendorId,
} from "shared/lib/providers/vendors";
import type { ProviderPriceRecord } from "shared/lib/providers/types";
import { formatModelName } from "shared/lib/models/canonicalModelId";
import { compareModelVersionDesc, parseModelVersion } from "shared/lib/models/modelVersion";

/**
 * Derives the Sidebar's provider/model tree from the flat reseller x model
 * price listing. Here "provider" means the model vendor (anthropic, openai,
 * google, ...) parsed out of canonical_model_id — a different concept from
 * ModelItem.provider (the reseller) used in the Content screen's table.
 */
export const toSidebarProviders = (records: ProviderPriceRecord[]): ProviderItem[] => {
   const modelsByVendor = new Map<string, Map<string, ProviderModel>>();

   for (const record of records) {
      const vendorId = getVendorId(record.canonicalModelId);

      let models = modelsByVendor.get(vendorId);

      if (!models) {
         models = new Map<string, ProviderModel>();
         modelsByVendor.set(vendorId, models);
      }

      const existingModel = models.get(record.canonicalModelId);

      if (existingModel) {
         existingModel.count += 1;
      } else {
         models.set(record.canonicalModelId, {
            id: record.canonicalModelId,
            name: formatModelName(record.canonicalModelId),
            count: 1,
         });
      }
   }

   const vendorListingCount = (vendorId: string): number =>
      Array.from(modelsByVendor.get(vendorId)?.values() ?? []).reduce(
         (total, model) => total + model.count,
         0
      );

   const toProviderItem = (vendorId: string): ProviderItem => {
      // Newest model first (see parseModelVersion). Models on the same
      // version fall back to listing count, then name, so the order stays
      // stable between feed refreshes.
      const modelList = Array.from(modelsByVendor.get(vendorId)?.values() ?? []).sort((a, b) => {
         const byVersion = compareModelVersionDesc(
            parseModelVersion(a.id),
            parseModelVersion(b.id)
         );

         if (byVersion !== 0) {
            return byVersion;
         }

         if (b.count !== a.count) {
            return b.count - a.count;
         }

         return a.name.localeCompare(b.name);
      });

      return {
         id: vendorId,
         name: getVendorDisplayName(vendorId),
         count: vendorListingCount(vendorId),
         icon: getVendorIcon(vendorId),
         models: modelList,
      };
   };

   // Known vendors keep their fixed sidebar order, followed by any vendor
   // providers.json introduces that isn't in the known list yet, so new data
   // is never silently dropped. Vendors without listings are hidden.
   const extraVendorIds = Array.from(modelsByVendor.keys())
      .filter((vendorId) => !KNOWN_VENDOR_IDS.includes(vendorId))
      .sort((a, b) => vendorListingCount(b) - vendorListingCount(a));

   const providers = [...KNOWN_VENDOR_IDS, ...extraVendorIds].map(toProviderItem);

   return providers.filter((provider) => provider.count > 0);
};
