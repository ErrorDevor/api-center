"use client";

import React from "react";

import { parseGatewayPricingList } from "./types";
import type { GatewayModelPricing } from "./types";

// Same singleton-promise-per-page-load pattern as useModelCatalog — one
// fetch of /api/gateway/pricing (which proxies sub2api's GET /models, the
// gateway's own billing table) shared between every BestAiPriceRow on the
// page, instead of one request per row.
let pricingPromise: Promise<GatewayModelPricing[]> | null = null;

const fetchGatewayPricing = (): Promise<GatewayModelPricing[]> => {
   if (!pricingPromise) {
      pricingPromise = fetch("/api/gateway/pricing", { cache: "no-store" })
         .then((response) => {
            if (!response.ok) {
               throw new Error(`Failed to load gateway pricing: ${response.status}`);
            }

            return response.json();
         })
         .then((payload: { data?: unknown }) => parseGatewayPricingList(payload.data))
         .catch((error) => {
            pricingPromise = null;
            throw error;
         });
   }

   return pricingPromise;
};

interface UseGatewayPricingResult {
   entries: GatewayModelPricing[];
   isLoading: boolean;
   error: Error | null;
   // undefined while still loading/unknown, null when the model isn't
   // (yet) offered through the gateway at all.
   getPricingForModel: (canonicalModelId: string) => GatewayModelPricing | null | undefined;
}

export const useGatewayPricing = (): UseGatewayPricingResult => {
   const [entries, setEntries] = React.useState<GatewayModelPricing[]>([]);
   const [isLoading, setIsLoading] = React.useState(true);
   const [error, setError] = React.useState<Error | null>(null);

   React.useEffect(() => {
      let cancelled = false;

      setIsLoading(true);

      fetchGatewayPricing()
         .then((loadedEntries) => {
            if (!cancelled) {
               setEntries(loadedEntries);
               setError(null);
            }
         })
         .catch((loadError: Error) => {
            if (!cancelled) {
               setError(loadError);
            }
         })
         .finally(() => {
            if (!cancelled) {
               setIsLoading(false);
            }
         });

      return () => {
         cancelled = true;
      };
   }, []);

   const getPricingForModel = React.useCallback(
      (canonicalModelId: string) => {
         if (isLoading) {
            return undefined;
         }

         return entries.find((entry) => entry.canonicalModelId === canonicalModelId) ?? null;
      },
      [entries, isLoading]
   );

   return { entries, isLoading, error, getPricingForModel };
};
