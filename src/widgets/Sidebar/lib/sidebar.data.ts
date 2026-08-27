import type { ListData, ModelTypeTranslationKey } from "./sidebar.types";

import { getModelContentTypes, type ModelContentType } from "shared/lib/models/modelType";
import type { ProviderPriceRecord } from "shared/lib/providers/types";

export type SidebarMode = "api" | "group-buys";

export type ModelBadge = "new" | "top";

export const ALL_MODEL_TYPES_ID = "allTypes";

const MODEL_TYPE_ORDER: ModelContentType[] = ["images", "search", "audioVideo", "text", "chat"];

/**
 * Builds the Sidebar's "Model Type" list (see modelTypeTitle) straight from
 * the live records, one row per getModelContentTypes bucket plus "All
 * Types". Replaces the old static mock — providers.json has no
 * content-type field of its own, so counts here come from classifying each
 * record's canonical_model_id (see modelType.ts), not from the backend. A
 * record can count toward more than one bucket (a general-purpose LLM tags
 * Chat, Text, Search, and Images all at once), so these don't sum to "All
 * Types".
 */
export const buildModelTypeList = (records: ProviderPriceRecord[]): ListData[] => {
   const counts = new Map<ModelContentType, number>();

   for (const record of records) {
      for (const contentType of getModelContentTypes(record.canonicalModelId)) {
         counts.set(contentType, (counts.get(contentType) ?? 0) + 1);
      }
   }

   const items: ListData[] = MODEL_TYPE_ORDER.map((contentType) => ({
      id: contentType,
      nameKey: contentType as ModelTypeTranslationKey,
      count: counts.get(contentType) ?? 0,
   }));

   return [
      { id: ALL_MODEL_TYPES_ID, nameKey: "allTypes", count: records.length },
      ...items,
   ];
};
