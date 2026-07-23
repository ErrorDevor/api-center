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