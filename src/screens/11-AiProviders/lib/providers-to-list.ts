import { displayPaymentMethods } from "shared/lib/payments/sortPaymentMethods";
import type { ProviderPriceRecord } from "shared/lib/providers/types";
import { getVendorIcon, getVendorId } from "shared/lib/providers/vendors";

import type { Provider, ProviderModel } from "./data";

// Placeholder shown only until AiProviderRow's useProviderCommentSummary loads
// the real per-provider counts — this pure function has no hook access, so it
// can't fetch them itself. 0 rather than some plausible-looking fake number,
// same convention as providers-to-models.ts' PLACEHOLDER_REVIEWS/REPORTS.
const PLACEHOLDER_REVIEWS = 0;
const PLACEHOLDER_REPORTS = 0;

/**
 * Groups the per-model providers.json rows (one row per provider_domain +
 * canonical_model_id pair) into one card per reseller. Records that don't
 * match the expected shape are already dropped upstream by
 * parseProviderPriceRecords, so every record here is trusted.
 */
export const recordsToProviders = (records: ProviderPriceRecord[]): Provider[] => {
   const recordsByDomain = new Map<string, ProviderPriceRecord[]>();

   for (const record of records) {
      const group = recordsByDomain.get(record.providerDomain);

      if (group) {
         group.push(record);
      } else {
         recordsByDomain.set(record.providerDomain, [record]);
      }
   }

   const providers: Provider[] = [];

   for (const groupRecords of recordsByDomain.values()) {
      const [firstRecord] = groupRecords;

      const seenModelIds = new Set<string>();
      const models: ProviderModel[] = [];

      for (const record of groupRecords) {
         if (seenModelIds.has(record.canonicalModelId)) {
            continue;
         }

         seenModelIds.add(record.canonicalModelId);

         models.push({
            id: record.canonicalModelId,
            name: record.modelName,
            icon: getVendorIcon(getVendorId(record.canonicalModelId)) ?? null,
         });
      }

      const paymentMethods = displayPaymentMethods(
         Array.from(new Set(groupRecords.flatMap((record) => record.paymentMethods)))
      );

      providers.push({
         id: firstRecord.providerDomain,
         name: firstRecord.providerName,
         domainAgeDays: firstRecord.domainAgeDays,
         // Decorative — there's no real "verified" field in the feed, same
         // as ProviderTooltip's always-shown verified badge.
         verified: true,
         models,
         paymentMethods,
         // Filled in from the live probe by the screen — providers.json has no
         // availability signal (trust_status is about the reseller, not uptime).
         status: "unknown",
         probe: null,
         reviews: {
            positive: PLACEHOLDER_REVIEWS,
            negative: PLACEHOLDER_REPORTS,
         },
      });
   }

   return providers;
};
