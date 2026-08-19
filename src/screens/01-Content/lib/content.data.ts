import type { ProviderName } from "./provider.data";

// Localized model description, keyed by Locale ("ru"/"en" — see
// shared/lib/i18n/types.ts). Sourced from models.json (see
// useModelCatalog), not the UI translation dictionary — every model gets
// its own text instead of one static blurb shared by every row.
export interface ModelDescription {
   ru: string;
   en: string;
}

export interface ModelItem {
   id: string;
   name: string;
   // "vendor/model" id (e.g. "anthropic/claude-sonnet-5") — lets the table
   // be filtered by the Sidebar's vendor/model selection.
   canonicalModelId: string;
   description: ModelDescription;
   inputPrice: number;
   outputPrice: number;
   discountPercent: number;
   paymentMethods: string[];
   provider: ProviderName;
   // Reseller's site — the Provider column links out here.
   providerUrl: string;
   // Bare domain (e.g. "xiaojingai.com") straight from providers.json —
   // providerUrl can carry a subdomain ("https://open.xiaojingai.com"), so
   // this is the reliable join key against provider_descriptions.json's
   // provider_domain (see useProviderDescriptions consumers).
   providerDomain: string;
   reviews: number;
   reports: number;
   // Whois-derived domain age from providers.json's domain_age_days — null
   // when the backend hasn't backfilled it for this record yet (see
   // ModelRow's ProviderTooltip "Возраст" row).
   domainAgeDays: number | null;
}

export const tabs = [
   {
      id: "crypto",
      translationKey: "crypto",
   },
   {
      id: "paytoacc",
      translationKey: "paymentToAccount",
   },
   {
      id: "freetest",
      translationKey: "freeTest",
   },
] as const;
