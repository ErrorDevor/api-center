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

// Computed straight from the price fields (actual vs official) rather than
// trusting the backend's precomputed input/output_discount_percent as-is —
// those two numbers should agree, but deriving from the prices themselves
// means a bad/stale percent field can't ever show a discount that doesn't
// match the prices actually displayed next to it.
const discountFromPrice = (actualPrice: number, officialPrice: number): number | null =>
   officialPrice > 0 ? ((officialPrice - actualPrice) / officialPrice) * 100 : null;

const computeDiscountPercent = (record: ProviderPriceRecord): number => {
   const inputDiscount =
      discountFromPrice(record.inputPriceUsdPer1m, record.officialInputPriceUsdPer1m) ??
      record.inputDiscountPercent;
   const outputDiscount =
      discountFromPrice(record.outputPriceUsdPer1m, record.officialOutputPriceUsdPer1m) ??
      record.outputDiscountPercent;

   // The pipeline is only supposed to publish listings that are actually
   // cheaper than official (see bestai_price_parser_tz.md step 11), but
   // clamp defensively so a stray bad record can't render "-5% cheaper".
   return Math.max(0, Math.round((inputDiscount + outputDiscount) / 2));
};

export const toModelItems = (records: ProviderPriceRecord[]): ModelItem[] => {
   return records.map((record): ModelItem => ({
      id: `${record.providerDomain}__${record.canonicalModelId}`,
      name: record.modelName,
      canonicalModelId: record.canonicalModelId,
      translationKey: STUB_TRANSLATION_KEY,
      inputPrice: record.inputPriceUsdPer1m,
      outputPrice: record.outputPriceUsdPer1m,
      discountPercent: computeDiscountPercent(record),
      weChat: STUB_WECHAT,
      tags: STUB_TAGS,
      provider: record.providerName,
      providerUrl: record.providerUrl,
      reviews: STUB_REVIEWS,
      reports: STUB_REPORTS,
   }));
};
