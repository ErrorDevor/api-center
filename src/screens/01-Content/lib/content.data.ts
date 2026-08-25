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

export type SortKey = "name" | "price" | "reviews";
export type SortDirection = "asc" | "desc";

export interface SortState {
   key: SortKey;
   direction: SortDirection;
}

export const DEFAULT_SORT: SortState = { key: "name", direction: "asc" };

// The "Сортировка" dropdown in ContentActions offers a curated set of full
// (key + direction) presets rather than the table's raw key/direction pair —
// picking one is a single click instead of "pick a column, then maybe click
// its header icon again to flip direction". The table's own per-column sort
// icons (see ModelsTable) can still reach any key/direction combination;
// when the current sort isn't one of these presets (e.g. "Reviews"
// ascending), sortStateToValue returns undefined and the dropdown just shows
// no option selected — the header icon stays the source of truth for that.
export type ModelsSortValue = "name_asc" | "price_asc" | "price_desc" | "popular";

export const MODELS_SORT_PRESETS: Record<ModelsSortValue, SortState> = {
   name_asc: { key: "name", direction: "asc" },
   price_asc: { key: "price", direction: "asc" },
   price_desc: { key: "price", direction: "desc" },
   popular: { key: "reviews", direction: "desc" },
};

export const sortStateToValue = (sort: SortState): ModelsSortValue | undefined =>
   (Object.keys(MODELS_SORT_PRESETS) as ModelsSortValue[]).find((value) => {
      const preset = MODELS_SORT_PRESETS[value];

      return preset.key === sort.key && preset.direction === sort.direction;
   });

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
