export interface VendorDescriptionEntry {
   vendorSlug: string;
   displayName: string;
   titleRu: string;
   descriptionRu: string;
   titleEn: string;
   descriptionEn: string;
}

// The catalog's generic, not-vendor-specific entry (shown when no vendor is
// selected) — see toModelItems / getVendorId consumers for the same "no
// vendor selected" convention.
export const GENERIC_VENDOR_SLUG = "generic";

const isNonEmptyString = (value: unknown): value is string =>
   typeof value === "string" && value.length > 0;

/**
 * Defensively parses the raw api_descriptions.json payload (per-vendor,
 * localized "Cheap {vendor} API" title + description, keyed by vendor_slug —
 * a separate feed from providers.json/models.json). Entries that don't
 * match the expected shape are dropped instead of crashing the page.
 */
export const parseVendorDescriptions = (payload: unknown): VendorDescriptionEntry[] => {
   if (!Array.isArray(payload)) {
      return [];
   }

   const entries: VendorDescriptionEntry[] = [];

   for (const item of payload) {
      if (typeof item !== "object" || item === null) {
         continue;
      }

      const raw = item as Record<string, unknown>;

      const vendorSlug = raw.vendor_slug;
      const displayName = raw.display_name;
      const titleRu = raw.title_ru;
      const descriptionRu = raw.description_ru;
      const titleEn = raw.title_en;
      const descriptionEn = raw.description_en;

      const isValid =
         isNonEmptyString(vendorSlug) &&
         isNonEmptyString(displayName) &&
         isNonEmptyString(titleRu) &&
         isNonEmptyString(descriptionRu) &&
         isNonEmptyString(titleEn) &&
         isNonEmptyString(descriptionEn);

      if (!isValid) {
         continue;
      }

      entries.push({
         vendorSlug,
         displayName,
         titleRu,
         descriptionRu,
         titleEn,
         descriptionEn,
      });
   }

   return entries;
};
