export interface ProviderDetails {
   description: string;
   age: string;
   positiveReviews: number;
   negativeReviews: number;
}

export const providerDetails: Record<string, ProviderDetails> = {
   OpenRouter: {
      description:
         "OpenRouter is a unified API gateway for accessing AI models from multiple providers.",
      age: "8 years and 10 months",
      positiveReviews: 123,
      negativeReviews: 12,
   },
};
