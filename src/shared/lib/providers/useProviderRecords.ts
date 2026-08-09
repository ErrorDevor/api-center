"use client";

import React from "react";

import { parseProviderPriceRecords } from "./types";
import type { ProviderPriceRecord } from "./types";

// Defaults to the co-located static file (see bestai_price_parser_tz.md
// FRONTEND_JSON_PATH — the parser writes into this Next app's own
// public/data/). Set NEXT_PUBLIC_PROVIDERS_JSON_URL to point at a remote
// host instead (e.g. a backend served from a different domain/VPS). A
// remote URL only works if that host sends CORS headers allowing this
// site's origin — that's the backend's responsibility, not something this
// fetch can work around.
const PROVIDERS_JSON_URL =
   process.env.NEXT_PUBLIC_PROVIDERS_JSON_URL || "/data/providers.json";

/**
 * Fetches the providers feed once per page load and shares the result
 * between every consumer (Sidebar + Content both need it, and may mount at
 * the same time on /home).
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
