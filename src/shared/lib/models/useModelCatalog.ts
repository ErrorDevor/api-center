"use client";

import React from "react";

import { parseModelCatalog } from "./types";
import type { ModelCatalogEntry } from "./types";

// Same co-located-static-file convention as useProviderRecords' providers
// feed: in production the backend parser writes real data straight onto
// the server's disk at public/data/models.json (outside of git). Set
// NEXT_PUBLIC_MODELS_JSON_URL to override.
const MODELS_JSON_URL = process.env.NEXT_PUBLIC_MODELS_JSON_URL || "/data/models.json";

/**
 * Fetches the model catalog (display name + localized description per
 * canonical_model_id) once per page load and shares the result between
 * every consumer.
 */
let catalogPromise: Promise<ModelCatalogEntry[]> | null = null;

const fetchModelCatalog = (): Promise<ModelCatalogEntry[]> => {
   if (!catalogPromise) {
      catalogPromise = fetch(MODELS_JSON_URL, { cache: "no-store" })
         .then((response) => {
            if (!response.ok) {
               throw new Error(`Failed to load ${MODELS_JSON_URL}: ${response.status}`);
            }

            return response.json();
         })
         .then(parseModelCatalog)
         .catch((error) => {
            catalogPromise = null;
            throw error;
         });
   }

   return catalogPromise;
};

interface UseModelCatalogResult {
   entries: ModelCatalogEntry[];
   isLoading: boolean;
   error: Error | null;
}

export const useModelCatalog = (): UseModelCatalogResult => {
   const [entries, setEntries] = React.useState<ModelCatalogEntry[]>([]);
   const [isLoading, setIsLoading] = React.useState(true);
   const [error, setError] = React.useState<Error | null>(null);

   React.useEffect(() => {
      let cancelled = false;

      setIsLoading(true);

      fetchModelCatalog()
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
