export interface ProviderDescriptionEntry {
   providerDomain: string;
   descriptionRu: string;
   descriptionEn: string;
}

const isNonEmptyString = (value: unknown): value is string =>
   typeof value === "string" && value.length > 0;

/**
 * Defensively parses the raw provider_descriptions.json payload (per-provider,
 * localized review-page description, keyed by provider_domain — joins with
 * providers.json's providerDomain/providerName, see useProviderRecords).
 * Entries that don't match the expected shape are dropped instead of
 * crashing the page.
 */
export const parseProviderDescriptions = (payload: unknown): ProviderDescriptionEntry[] => {
   if (!Array.isArray(payload)) {
      return [];
   }

   const entries: ProviderDescriptionEntry[] = [];

   for (const item of payload) {
      if (typeof item !== "object" || item === null) {
         continue;
      }

      const raw = item as Record<string, unknown>;

      const providerDomain = raw.provider_domain;
      const descriptionRu = raw.description_ru;
      const descriptionEn = raw.description_en;

      const isValid =
         isNonEmptyString(providerDomain) &&
         isNonEmptyString(descriptionRu) &&
         isNonEmptyString(descriptionEn);

      if (!isValid) {
         continue;
      }

      entries.push({
         providerDomain,
         descriptionRu,
         descriptionEn,
      });
   }

   return entries;
};
