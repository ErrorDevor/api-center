"use client";

import React from "react";

import { parseProviderPriceRecords } from "./types";
import type { ProviderPriceRecord } from "./types";

const PROVIDERS_JSON_URL = "/data/providers.json";

/**
 * Fetches public/data/providers.json once per page load and shares the
 * result between every consumer (Sidebar + Content both need it, and may
 * mount at the same time on /home).
 */
let recordsPromise: Promise<ProviderPriceRecord[]> | null = null;

const fetchProviderRecords = (): Promise<ProviderPriceRecord[]> => {
   if (!recordsPromise) {
      recordsPromise = fetch(PROVIDERS_JSON_URL, { cache: "no-store" })
         .then((response) => {
            if (!response.ok) {
               throw new Error(`Failed to load ${PROVIDERS_JSON_URL}: ${response.status}`);
            }

            return response.json();
         })
         .then(parseProviderPriceRecords)
         .catch((error) => {
            recordsPromise = null;
            throw error;
         });
   }

   return recordsPromise;
};

interface UseProviderRecordsResult {
   records: ProviderPriceRecord[];
   isLoading: boolean;
   error: Error | null;
}

export const useProviderRecords = (): UseProviderRecordsResult => {
   const [records, setRecords] = React.useState<ProviderPriceRecord[]>([]);
   const [isLoading, setIsLoading] = React.useState(true);
   const [error, setError] = React.useState<Error | null>(null);

   React.useEffect(() => {
      let cancelled = false;

      setIsLoading(true);

      fetchProviderRecords()
         .then((loadedRecords) => {
            if (!cancelled) {
               setRecords(loadedRecords);
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

   return { records, isLoading, error };
};
