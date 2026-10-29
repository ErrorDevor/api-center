"use client";

import React from "react";

import { parseProviderProbeStatuses } from "./types";
import type { ProviderProbeStatuses } from "./types";

// One shared request per page load, same convention as useProviderRecords.
let statusesPromise: Promise<ProviderProbeStatuses> | null = null;

const fetchProviderStatuses = (): Promise<ProviderProbeStatuses> => {
   if (!statusesPromise) {
      statusesPromise = fetch("/api/providers/status", { cache: "no-store" })
         .then(async (response) => {
            if (!response.ok) {
               throw new Error(`Failed to load provider statuses: ${response.status}`);
            }

            const payload = await response.json().catch(() => null);

            return parseProviderProbeStatuses((payload as { data?: unknown } | null)?.data);
         })
         .catch((error) => {
            statusesPromise = null;
            throw error;
         });
   }

   return statusesPromise;
};

/**
 * Live availability per provider domain (trial request result, HTTP code,
 * last successful check). Empty until the probes finish — the first request
 * after a cold cache takes a few seconds — and on failure; callers show
 * "no data" rather than guessing.
 */
export const useProviderStatuses = (): ProviderProbeStatuses => {
   const [statuses, setStatuses] = React.useState<ProviderProbeStatuses>({});

   React.useEffect(() => {
      let isActive = true;

      fetchProviderStatuses()
         .then((result) => {
            if (isActive) {
               setStatuses(result);
            }
         })
         .catch(() => {});

      return () => {
         isActive = false;
      };
   }, []);

   return statuses;
};
