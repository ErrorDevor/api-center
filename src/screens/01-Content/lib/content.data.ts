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
   weChat: string;
   tags: ModelTag[];
   provider: ProviderName;
   reviews: number;
   reports: number;
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

export const models: ModelItem[] = Array.from({ length: 11 }, (_, index): ModelItem => ({
   id: index + 1,
   name: "GPT-5.6 Terra",
   translationKey: "gptTerra",
   inputPrice: 4,
   outputPrice: 8,
   discountPercent: 90,
   weChat: "WeChat +30",
   tags: ["image", "video"],
   provider: "OpenRouter",
   reviews: 123,
   reports: 12,
}));
