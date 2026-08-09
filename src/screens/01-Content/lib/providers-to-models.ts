import type { ModelItem } from "./content.data";

import type { ProviderPriceRecord } from "shared/lib/providers/types";

// Fields with no real-data equivalent (description, WeChat note, tags,
// review/report counters) intentionally stay static placeholders shared by
// every row — see ModelRow's fallback lookup in provider.data.ts.
const STUB_TRANSLATION_KEY = "gptTerra" as const;
const STUB_WECHAT = "WeChat +30";
const STUB_TAGS: ModelItem["tags"] = ["image", "video"];
const STUB_REVIEWS = 123;
const STUB_REPORTS = 12;

const roundDiscount = (inputPercent: number, outputPercent: number): number =>
   Math.round((inputPercent + outputPercent) / 2);

export const toModelItems = (records: ProviderPriceRecord[]): ModelItem[] => {
   return records.map((record): ModelItem => ({
      id: `${record.providerDomain}__${record.canonicalModelId}`,
      name: record.modelName,
      canonicalModelId: record.canonicalModelId,
      translationKey: STUB_TRANSLATION_KEY,
      inputPrice: record.inputPriceUsdPer1m,
      outputPrice: record.outputPriceUsdPer1m,
      discountPercent: roundDiscount(record.inputDiscountPercent, record.outputDiscountPercent),
      weChat: STUB_WECHAT,
      tags: STUB_TAGS,
      provider: record.providerName,
      reviews: STUB_REVIEWS,
      reports: STUB_REPORTS,
   }));
};
