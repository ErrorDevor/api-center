import type { ProviderName } from "./provider.data";

export type ModelTranslationKey = "gptTerra";
export type ModelTag = "image" | "video";

export interface ModelItem {
   id: string;
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
