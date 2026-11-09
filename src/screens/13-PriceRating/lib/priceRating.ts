import { formatModelName } from "shared/lib/models/canonicalModelId";
import type { ProviderPriceRecord } from "shared/lib/providers/types";
import { getVendorId } from "shared/lib/providers/vendors";

// The families the rating covers: vendor id in canonical_model_id -> label.
export const PRICE_FAMILIES = [
   { id: "openai", label: "OpenAI" },
   { id: "anthropic", label: "Claude" },
   { id: "google", label: "Gemini" },
   { id: "kuaishou", label: "Kling" },
] as const;

export type PriceFamilyId = (typeof PRICE_FAMILIES)[number]["id"];

export type PriceSortKey = "input" | "output" | "discount";

export interface PriceModelOption {
   id: string;
   name: string;
   providersCount: number;
}

export interface PriceRow {
   rank: number;
   record: ProviderPriceRecord;
   // Per-token models: $/1M. Native models: input = flat price, output = null.
   input: number;
   output: number | null;
   officialInput: number | null;
   officialOutput: number | null;
   inputDiscount: number | null;
   outputDiscount: number | null;
}

export interface PriceFilters {
   maxInput: number | null;
   maxOutput: number | null;
   minDiscount: number | null;
}

export const isNativeRecord = (record: ProviderPriceRecord): boolean =>
   record.nativePriceUsd !== null && record.inputPriceUsdPer1m === null;

/** Models of one family, the most widely resold first. */
export const getModelOptions = (
   records: ProviderPriceRecord[],
   familyId: PriceFamilyId
): PriceModelOption[] => {
   const providersByModel = new Map<string, Set<string>>();

   for (const record of records) {
      if (getVendorId(record.canonicalModelId) !== familyId) {
         continue;
      }

      const set = providersByModel.get(record.canonicalModelId) ?? new Set<string>();

      set.add(record.providerDomain);
      providersByModel.set(record.canonicalModelId, set);
   }

   return Array.from(providersByModel, ([id, providers]) => ({
      id,
      name: formatModelName(id),
      providersCount: providers.size,
   })).sort((a, b) => b.providersCount - a.providersCount || a.name.localeCompare(b.name));
};

const toRow = (record: ProviderPriceRecord): Omit<PriceRow, "rank"> =>
   isNativeRecord(record)
      ? {
           record,
           input: record.nativePriceUsd as number,
           output: null,
           officialInput: record.officialNativePriceUsd,
           officialOutput: null,
           inputDiscount: record.nativeDiscountPercent,
           outputDiscount: null,
        }
      : {
           record,
           input: record.inputPriceUsdPer1m as number,
           output: record.outputPriceUsdPer1m,
           officialInput: record.officialInputPriceUsdPer1m,
           officialOutput: record.officialOutputPriceUsdPer1m,
           inputDiscount: record.inputDiscountPercent,
           outputDiscount: record.outputDiscountPercent,
        };

export const buildPriceRows = (
   records: ProviderPriceRecord[],
   modelId: string,
   filters: PriceFilters,
   sortKey: PriceSortKey
): PriceRow[] => {
   const rows = records
      .filter((record) => record.canonicalModelId === modelId)
      .map(toRow)
      .filter((row) => {
         if (filters.maxInput !== null && row.input > filters.maxInput) {
            return false;
         }

         if (filters.maxOutput !== null && row.output !== null && row.output > filters.maxOutput) {
            return false;
         }

         if (filters.minDiscount !== null && (row.inputDiscount ?? 0) < filters.minDiscount) {
            return false;
         }

         return true;
      });

   rows.sort((a, b) => {
      if (sortKey === "discount") {
         return (b.inputDiscount ?? -Infinity) - (a.inputDiscount ?? -Infinity);
      }

      if (sortKey === "output") {
         return (a.output ?? a.input) - (b.output ?? b.input) || a.input - b.input;
      }

      return a.input - b.input || (a.output ?? 0) - (b.output ?? 0);
   });

   return rows.map((row, index) => ({ ...row, rank: index + 1 }));
};

export interface PriceSummary {
   officialInput: number | null;
   officialOutput: number | null;
   cheapestInput: number | null;
   maxDiscount: number | null;
   avgDiscount: number | null;
}

// Reference ("official") price = the most common official price in the feed.
const mode = (values: number[]): number | null => {
   if (values.length === 0) {
      return null;
   }

   const counts = new Map<number, number>();

   for (const value of values) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
   }

   return Array.from(counts).sort((a, b) => b[1] - a[1])[0][0];
};

export const summarize = (rows: PriceRow[]): PriceSummary => {
   const discounts = rows.map((r) => r.inputDiscount).filter((d): d is number => d !== null);

   return {
      officialInput: mode(rows.map((r) => r.officialInput).filter((v): v is number => v !== null)),
      officialOutput: mode(
         rows.map((r) => r.officialOutput).filter((v): v is number => v !== null)
      ),
      cheapestInput: rows.length ? Math.min(...rows.map((r) => r.input)) : null,
      maxDiscount: discounts.length ? Math.max(...discounts) : null,
      avgDiscount: discounts.length
         ? discounts.reduce((sum, d) => sum + d, 0) / discounts.length
         : null,
   };
};

export const formatUsd = (value: number): string =>
   `$${value < 1 ? Number(value.toFixed(4)) : value.toFixed(2)}`;
