import type { ProviderProbeStatus } from "shared/lib/providerStatus/types";

export interface ProviderModel {
   id: string;
   name: string;
   icon: string | null;
}

// "unknown" until the live probe (see useProviderStatuses) has answered.
export type ProviderStatus = "working" | "not-working" | "unknown";

export interface Provider {
   id: string;
   name: string;
   domainAgeDays: number | null;
   verified: boolean;
   models: ProviderModel[];
   paymentMethods: string[];
   status: ProviderStatus;
   probe: ProviderProbeStatus | null;
   reviews: {
      positive: number;
      negative: number;
   };
}
