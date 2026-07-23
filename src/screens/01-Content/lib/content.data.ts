import type { ProviderName } from "./provider.data";

export type ModelTranslationKey = "gptTerra";
export type ModelTag = "image" | "video";

export interface ModelItem {
   id: number;
   name: string;
   translationKey: ModelTranslationKey;
   inputPrice: number;
   outputPrice: number;
   discountPercent: number;
   tags: ModelTag[];
   provider: ProviderName;
   reviews: number;
   reports: number;
}

export const tabs = [
   {
      id: "all",
      translationKey: "allTypes",
   },
   {
      id: "image",
      translationKey: "image",
   },
   {
      id: "search",
      translationKey: "search",
   },
   {
      id: "audio-video",
      translationKey: "audioVideo",
   },
] as const;

export const models: ModelItem[] = Array.from({ length: 11 }, (_, index): ModelItem => ({
   id: index + 1,
   name: "GPT-5.6 Terra",
   translationKey: "gptTerra",
   inputPrice: 4,
   outputPrice: 8,
   discountPercent: 90,
   tags: ["image", "video"],
   provider: "OpenRouter",
   reviews: 123,
   reports: 12,
}));
