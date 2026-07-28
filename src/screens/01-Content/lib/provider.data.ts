export type ProviderTranslationKey = "openRouter";

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

export const providerDetails = {
   OpenRouter: {
      translationKey: "openRouter",
      age: {
         years: 8,
         months: 10,
      },
      positiveReviews: 123,
      negativeReviews: 12,
   },
} satisfies Record<string, ProviderDetails>;

export type ProviderName = keyof typeof providerDetails;

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

export const pricesDetails = {
   OpenRouter: {
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
} satisfies Record<ProviderName, PricesDetails>;
