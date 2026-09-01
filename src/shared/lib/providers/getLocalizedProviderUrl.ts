import type { Locale } from "shared/lib/i18n/types";

interface LocalizedProviderUrls {
   providerUrl: string;
   providerUrlRu: string | null;
   providerUrlEn: string | null;
}

// Some resellers run a locale-specific storefront (e.g. zivv.pro's own
// "/en/" path) — providers.json's provider_url_ru/provider_url_en carry
// those when they exist. Falls back to the base provider_url when the
// current site language's variant is missing (as in the feed's own example:
// provider_url_ru: null).
export const getLocalizedProviderUrl = (
   record: LocalizedProviderUrls,
   locale: Locale
): string => {
   const localizedUrl = locale === "ru" ? record.providerUrlRu : record.providerUrlEn;

   return localizedUrl || record.providerUrl;
};
