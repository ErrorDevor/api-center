export type ProviderTranslationKey = "generic";

export interface ProviderAge {
   years: number;
   months: number;
}

export interface ProviderDetails {
   translationKey: ProviderTranslationKey;
   age: ProviderAge;
   positiveReviews: number;
   negativeReviews: number;
}

// The real dataset (providers.json) supplies arbitrary reseller names —
// ProviderName can't be a closed literal union derived from a fixed
// dictionary anymore. `providerDetails`/`pricesDetails` below now serve as a
// single generic placeholder shown for any provider (see ModelRow's
// fallback lookup), not a per-provider dictionary.
export type ProviderName = string;

// Typed as Record<string, ...> (not just `satisfies`) so it stays indexable
// by arbitrary real provider names in ModelRow, not just its own literal key.
export const providerDetails: Record<string, ProviderDetails> = {
   generic: {
      translationKey: "generic",
      age: {
         years: 8,
         months: 10,
      },
      positiveReviews: 123,
      negativeReviews: 12,
   },
};

/* Prices tooltip */
export type PricesGroupTranslationKey = "quickSelect" | "cards";

export type PricesOptionTranslationKey =
   | "anyCrypto"
   | "anyCard"
   | "anyWallet"
   | "bankTransfer"
   | "visa"
   | "mastercard"
   | "wechat"
   | "alipay";

export interface PricesOption {
   id: string;
   translationKey: PricesOptionTranslationKey;
   price: number;
   emphasized?: boolean;
}

export interface PricesGroup {
   id: string;
   translationKey: PricesGroupTranslationKey;
   items: PricesOption[];
}

export interface PricesDetails {
   groups: PricesGroup[];
}

export const pricesDetails: Record<string, PricesDetails> = {
   generic: {
      groups: [
         {
            id: "quick-select",
            translationKey: "quickSelect",
            items: [
               {
                  id: "any-crypto",
                  translationKey: "anyCrypto",
                  price: 40,
                  emphasized: true,
               },
               {
                  id: "any-card",
                  translationKey: "anyCard",
                  price: 40,
                  emphasized: true,
               },
               {
                  id: "any-wallet",
                  translationKey: "anyWallet",
                  price: 40,
                  emphasized: true,
               },
               {
                  id: "bank-transfer",
                  translationKey: "bankTransfer",
                  price: 40,
                  emphasized: true,
               },
            ],
         },
         {
            id: "cards",
            translationKey: "cards",
            items: [
               {
                  id: "visa",
                  translationKey: "visa",
                  price: 40,
               },
               {
                  id: "mastercard",
                  translationKey: "mastercard",
                  price: 40,
               },
               {
                  id: "wechat",
                  translationKey: "wechat",
                  price: 40,
               },
               {
                  id: "alipay",
                  translationKey: "alipay",
                  price: 40,
               },
            ],
         },
      ],
   },
};
