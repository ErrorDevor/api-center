"use client";

import React from "react";

import { parseVendorDescriptions } from "./types";
import type { VendorDescriptionEntry } from "./types";

// Same co-located-static-file convention as useProviderRecords' providers
// feed / useModelCatalog's models feed: in production the backend parser
// writes real data straight onto the server's disk at
// public/data/api_descriptions.json (outside of git). Set
// NEXT_PUBLIC_API_DESCRIPTIONS_JSON_URL to override — e.g. for local dev,
// where that file doesn't exist (see .env.example).
const API_DESCRIPTIONS_JSON_URL =
   process.env.NEXT_PUBLIC_API_DESCRIPTIONS_JSON_URL || "/data/api_descriptions.json";

/**
 * Fetches the vendor description feed (the "Cheap {vendor} API" header
 * title + blurb shown above the models table, per vendor) once per page
 * load and shares the result between every consumer.
 */
let descriptionsPromise: Promise<VendorDescriptionEntry[]> | null = null;

const fetchVendorDescriptions = (): Promise<VendorDescriptionEntry[]> => {
   if (!descriptionsPromise) {
      descriptionsPromise = fetch(API_DESCRIPTIONS_JSON_URL, { cache: "no-store" })
         .then((response) => {
            if (!response.ok) {
               throw new Error(`Failed to load ${API_DESCRIPTIONS_JSON_URL}: ${response.status}`);
            }

            return response.json();
         })
         .then(parseVendorDescriptions)
         .catch((error) => {
            descriptionsPromise = null;
            throw error;
         });
   }

   return descriptionsPromise;
};

interface UseVendorDescriptionsResult {
   entries: VendorDescriptionEntry[];
   isLoading: boolean;
   error: Error | null;
}

export const useVendorDescriptions = (): UseVendorDescriptionsResult => {
   const [entries, setEntries] = React.useState<VendorDescriptionEntry[]>([]);
   const [isLoading, setIsLoading] = React.useState(true);
   const [error, setError] = React.useState<Error | null>(null);

   React.useEffect(() => {
      let cancelled = false;

      setIsLoading(true);

      fetchVendorDescriptions()
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

   return { entries, isLoading, error };
};
