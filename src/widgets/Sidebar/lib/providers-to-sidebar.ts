import type { ProviderItem, ProviderModel } from "./sidebar.types";

import {
   KNOWN_VENDOR_IDS,
   getVendorDisplayName,
   getVendorIcon,
   getVendorId,
} from "shared/lib/providers/vendors";
import type { ProviderPriceRecord } from "shared/lib/providers/types";

const KNOWN_ACRONYMS = new Set(["gpt"]);

const capitalizeSegment = (segment: string): string => {
   if (KNOWN_ACRONYMS.has(segment.toLowerCase())) {
      return segment.toUpperCase();
   }

   if (!segment) {
      return segment;
   }

   return segment[0].toUpperCase() + segment.slice(1);
};

const isVersionSegment = (segment: string): boolean => /^\d/.test(segment);

// "claude-sonnet-5" -> "Claude Sonnet 5", "gpt-5.4-mini" -> "GPT 5.4 Mini",
// "claude-sonnet-4-6" -> "Claude Sonnet 4-6" (keeps version numbers like
// "4-6" hyphenated instead of splitting them into separate words).
const formatModelName = (canonicalModelId: string): string => {
   const [, modelSlug] = canonicalModelId.split("/");
   const source = modelSlug || canonicalModelId;
   const segments = source.split("-");

   return segments.reduce((name, segment, index) => {
      if (index === 0) {
         return capitalizeSegment(segment);
      }

      const separator = isVersionSegment(segment) && isVersionSegment(segments[index - 1]) ? "-" : " ";

      return name + separator + capitalizeSegment(segment);
   }, "");
};

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
      const modelList = Array.from(modelsByVendor.get(vendorId)?.values() ?? []).sort(
         (a, b) => b.count - a.count
      );

      return {
         id: vendorId,
         name: getVendorDisplayName(vendorId),
         count: vendorListingCount(vendorId),
         icon: getVendorIcon(vendorId),
         models: modelList,
      };
   };

   // Fixed known vendors first (in their original sidebar order), even ones
   // with zero records today — then any vendor providers.json introduces
   // that isn't in the known list yet, so new data is never silently
   // dropped.
   const extraVendorIds = Array.from(modelsByVendor.keys())
      .filter((vendorId) => !KNOWN_VENDOR_IDS.includes(vendorId))
      .sort((a, b) => vendorListingCount(b) - vendorListingCount(a));

   return [...KNOWN_VENDOR_IDS, ...extraVendorIds].map(toProviderItem);
};
