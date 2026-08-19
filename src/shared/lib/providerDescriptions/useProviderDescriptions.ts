"use client";

import React from "react";

import { parseProviderDescriptions } from "./types";
import type { ProviderDescriptionEntry } from "./types";

// Same co-located-static-file convention as useProviderRecords' providers
// feed / useVendorDescriptions' api_descriptions feed: in production the
// backend parser writes real data straight onto the server's disk at
// public/data/provider_descriptions.json (outside of git). Set
// NEXT_PUBLIC_PROVIDER_DESCRIPTIONS_JSON_URL to override — e.g. for local
// dev, where that file doesn't exist (see .env.example).
const PROVIDER_DESCRIPTIONS_JSON_URL =
   process.env.NEXT_PUBLIC_PROVIDER_DESCRIPTIONS_JSON_URL || "/data/provider_descriptions.json";

/**
 * Fetches the provider description feed (the localized blurb shown on a
 * provider's reviews page, per provider_domain) once per page load and
 * shares the result between every consumer.
 */
let descriptionsPromise: Promise<ProviderDescriptionEntry[]> | null = null;

const fetchProviderDescriptions = (): Promise<ProviderDescriptionEntry[]> => {
   if (!descriptionsPromise) {
      descriptionsPromise = fetch(PROVIDER_DESCRIPTIONS_JSON_URL, { cache: "no-store" })
         .then((response) => {
            if (!response.ok) {
               throw new Error(
                  `Failed to load ${PROVIDER_DESCRIPTIONS_JSON_URL}: ${response.status}`
               );
            }

            return response.json();
         })
         .then(parseProviderDescriptions)
         .catch((error) => {
            descriptionsPromise = null;
            throw error;
         });
   }

   return descriptionsPromise;
};

interface UseProviderDescriptionsResult {
   entries: ProviderDescriptionEntry[];
   isLoading: boolean;
   error: Error | null;
}

export const useProviderDescriptions = (): UseProviderDescriptionsResult => {
   const [entries, setEntries] = React.useState<ProviderDescriptionEntry[]>([]);
   const [isLoading, setIsLoading] = React.useState(true);
   const [error, setError] = React.useState<Error | null>(null);

   React.useEffect(() => {
      let cancelled = false;

      setIsLoading(true);

      fetchProviderDescriptions()
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
