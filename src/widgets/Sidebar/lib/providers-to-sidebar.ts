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

// Pulls the ordered numeric version components out of a canonical model id
// ("anthropic/claude-sonnet-4-6" -> [4, 6], "openai/gpt-5.4-mini" -> [5, 4],
// "deepseek/deepseek-v3" -> [3]). providers.json carries no release date, so
// ranking a vendor's models by "newness" is really this naming heuristic:
// a model whose slug carries no version number (o3, kimi-k2, ...) gets an
// empty list and sorts below the versioned ones.
const parseModelVersion = (canonicalModelId: string): number[] => {
   const [, modelSlug] = canonicalModelId.split("/");
   const source = modelSlug || canonicalModelId;

   return source
      .split(/[-_]/)
      .map((segment) => /^v?(\d+(?:\.\d+)?)/i.exec(segment)?.[1])
      .filter((match): match is string => match !== undefined)
      .flatMap((match) => match.split(".").map(Number));
};

// Orders two version lists newest-first. A missing component counts as -1,
// so "Sonnet 5" ([5]) ranks above "Sonnet 4-6" ([4, 6]) but below
// "Sonnet 5.1" ([5, 1]).
const compareModelVersionDesc = (a: number[], b: number[]): number => {
   const length = Math.max(a.length, b.length);

   for (let index = 0; index < length; index += 1) {
      const diff = (b[index] ?? -1) - (a[index] ?? -1);

      if (diff !== 0) {
         return diff;
      }
   }

   return 0;
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

   // Fixed known vendors first (in their original sidebar order), even ones
   // with zero records today — then any vendor providers.json introduces
   // that isn't in the known list yet, so new data is never silently
   // dropped.
   const extraVendorIds = Array.from(modelsByVendor.keys())
      .filter((vendorId) => !KNOWN_VENDOR_IDS.includes(vendorId))
      .sort((a, b) => vendorListingCount(b) - vendorListingCount(a));

   const providers = [...KNOWN_VENDOR_IDS, ...extraVendorIds].map(toProviderItem);

   // Vendors with no listings yet sink to the bottom instead of cluttering
   // their fixed slot among vendors that actually have models.
   const withListings = providers.filter((provider) => provider.count > 0);
   const withoutListings = providers.filter((provider) => provider.count === 0);

   return [...withListings, ...withoutListings];
};
