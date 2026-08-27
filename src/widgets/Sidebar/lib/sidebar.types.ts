import type { ModelContentType } from "shared/lib/models/modelType";

export type SidebarMode = "api" | "group-buys";

export type ModelBadge = "new" | "top";

export interface ProviderModel {
   id: string;
   name: string;
   count: number;
   badge?: ModelBadge;
}

export interface ProviderItem {
   id: string;
   name: string;
   count: number;
   icon?: string;
   models?: ProviderModel[];
}

export interface ListData {
   id: string;
   nameKey: ModelTypeTranslationKey;
   count: number;
}

export type ModelTypeTranslationKey = "allTypes" | ModelContentType;
