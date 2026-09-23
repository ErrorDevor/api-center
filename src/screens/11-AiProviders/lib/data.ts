export interface ProviderModel {
   id: string;
   name: string;
   icon: string | null;
}

export type ProviderStatus = "working" | "not-working";

export interface Provider {
   id: string;
   name: string;
   domainAgeDays: number | null;
   verified: boolean;
   models: ProviderModel[];
   paymentMethods: string[];
   status: ProviderStatus;
   reviews: {
      positive: number;
      negative: number;
   };
}
