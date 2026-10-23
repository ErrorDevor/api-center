"use server";

// Server action returning { "<model-slug>": { out, search, coding } } — what
// each model can actually produce (output modalities), whether it has
// built-in web search and whether OpenRouter files it under its
// "programming" category. providers.json carries no such taxonomy, so it's read from the
// same two public catalogs as releaseDates.action (OpenRouter and
// llm-stats.com), which list new models as they ship — the sidebar's "Model
// Type" counts follow without a code change. Keys are the slug part of
// canonical_model_id, lowercased, "." -> "-", without ":variant" / date
// suffixes (see capabilitySlug).

import { capabilitySlug } from "./capabilitySlug";

export interface ModelCapabilities {
   // Output modalities: "text" | "image" | "video" | "audio" | "embeddings"
   // Input modalities: "text" | "image" | "audio" | "video" | "file"
   in: string[];
   out: string[];
   search: boolean;
   coding: boolean;
}

const REVALIDATE_SECONDS = 60 * 60 * 24;

let cache: { at: number; capabilities: Record<string, ModelCapabilities> } | null = null;

const LLM_STATS_URL = "https://api.llm-stats.com/v1/models";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/models";
const OPENROUTER_PROGRAMMING_URL = `${OPENROUTER_URL}?category=programming`;

const fetchJson = async (url: string): Promise<unknown> => {
   try {
      const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });

      return response.ok ? await response.json() : null;
   } catch {
      return null;
   }
};

const toStringArray = (value: unknown): string[] =>
   Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const merge = (
   target: Record<string, ModelCapabilities>,
   slug: string,
   inputs: string[],
   out: string[],
   search: boolean,
   coding = false
) => {
   if (!slug || out.length === 0) {
      return;
   }

   const existing = target[slug];

   target[slug] = {
      in: Array.from(new Set([...(existing?.in ?? []), ...inputs])),
      out: Array.from(new Set([...(existing?.out ?? []), ...out])),
      search: (existing?.search ?? false) || search,
      coding: (existing?.coding ?? false) || coding,
   };
};

export async function getModelCapabilities(): Promise<Record<string, ModelCapabilities>> {
   if (cache && Date.now() - cache.at < REVALIDATE_SECONDS * 1000) {
      return cache.capabilities;
   }

   const [openRouter, llmStats, programming] = await Promise.all([
      fetchJson(OPENROUTER_URL),
      fetchJson(LLM_STATS_URL),
      fetchJson(OPENROUTER_PROGRAMMING_URL),
   ]);

   const codingIds = new Set(
      ((programming as { data?: Record<string, unknown>[] } | null)?.data ?? [])
         .flatMap((model) => [model.id, model.canonical_slug])
         .filter((value): value is string => typeof value === "string")
   );

   const capabilities: Record<string, ModelCapabilities> = {};

   const openRouterModels = (openRouter as { data?: Record<string, unknown>[] } | null)?.data ?? [];

   for (const model of openRouterModels) {
      const architecture = (model.architecture ?? {}) as Record<string, unknown>;
      const inputs = toStringArray(architecture.input_modalities);
      const out = toStringArray(architecture.output_modalities);
      const search = toStringArray(model.supported_parameters).includes("web_search_options");
      const slugs = [model.id, model.canonical_slug].filter(
         (value): value is string => typeof value === "string"
      );

      for (const id of slugs) {
         merge(
            capabilities,
            capabilitySlug(id.split("/").slice(1).join("/")),
            inputs,
            out,
            search,
            codingIds.has(id)
         );
      }
   }

   if (Array.isArray(llmStats)) {
      for (const model of llmStats as Record<string, unknown>[]) {
         if (typeof model.id === "string") {
            merge(
               capabilities,
               capabilitySlug(model.id),
               toStringArray(model.input_modalities),
               toStringArray(model.output_modalities),
               false
            );
         }
      }
   }

   if (Object.keys(capabilities).length > 0) {
      cache = { at: Date.now(), capabilities };
   }

   return capabilities;
}
