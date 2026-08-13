export interface ModelCatalogEntry {
   canonicalModelId: string;
   displayName: string;
   descriptionRu: string;
   descriptionEn: string;
}

const isNonEmptyString = (value: unknown): value is string =>
   typeof value === "string" && value.length > 0;

/**
 * Defensively parses the raw models.json payload (per-model display name +
 * localized description, keyed by canonical_model_id — a separate feed from
 * providers.json's per-listing price records). Entries that don't match the
 * expected shape are dropped instead of crashing the page.
 */
export const parseModelCatalog = (payload: unknown): ModelCatalogEntry[] => {
   if (!Array.isArray(payload)) {
      return [];
   }

   const entries: ModelCatalogEntry[] = [];

   for (const item of payload) {
      if (typeof item !== "object" || item === null) {
         continue;
      }

      const raw = item as Record<string, unknown>;

      const canonicalModelId = raw.canonical_model_id;
      const displayName = raw.display_name;
      const descriptionRu = raw.description_ru;
      const descriptionEn = raw.description_en;

      const isValid =
         isNonEmptyString(canonicalModelId) &&
         isNonEmptyString(displayName) &&
         isNonEmptyString(descriptionRu) &&
         isNonEmptyString(descriptionEn);

      if (!isValid) {
         continue;
      }

      entries.push({
         canonicalModelId,
         displayName,
         descriptionRu,
         descriptionEn,
      });
   }

   return entries;
};
