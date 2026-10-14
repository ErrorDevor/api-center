"use client";

import React from "react";

import { getModelReleaseDates } from "./releaseDates.action";

type ReleaseDates = Record<string, string>;

// One shared request per page load, same pattern as useProviderRecords.
let datesPromise: Promise<ReleaseDates> | null = null;

const fetchReleaseDates = (): Promise<ReleaseDates> => {
   if (!datesPromise) {
      datesPromise = getModelReleaseDates().catch(() => {
         datesPromise = null;

         return {};
      });
   }

   return datesPromise;
};

const normalizeModelSlug = (slug: string): string => slug.toLowerCase().replace(/\./g, "-");

/**
 * Release date ("YYYY-MM-DD") per canonical model id, or undefined when no
 * public catalog knows the model. `version` bumps when the dates arrive so
 * sorts can re-run.
 */
export const useModelReleaseDates = () => {
   const [dates, setDates] = React.useState<ReleaseDates>({});

   React.useEffect(() => {
      let cancelled = false;

      void fetchReleaseDates().then((result) => {
         if (!cancelled) {
            setDates(result);
         }
      });

      return () => {
         cancelled = true;
      };
   }, []);

   const getReleaseDate = React.useCallback(
      (canonicalModelId: string): string | undefined => {
         const slug = canonicalModelId.split("/").slice(1).join("/") || canonicalModelId;

         return dates[normalizeModelSlug(slug)];
      },
      [dates]
   );

   return { getReleaseDate };
};
