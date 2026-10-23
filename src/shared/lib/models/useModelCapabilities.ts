"use client";

import React from "react";

import { capabilitySlug } from "./capabilitySlug";
import { getModelCapabilities, type ModelCapabilities } from "./modelCapabilities.action";
import { type ModelContentType, getModelContentTypes } from "./modelType";

type CapabilityMap = Record<string, ModelCapabilities>;

// One shared request per page load, same pattern as useModelReleaseDates.
let capabilitiesPromise: Promise<CapabilityMap> | null = null;

const fetchCapabilities = (): Promise<CapabilityMap> => {
   if (!capabilitiesPromise) {
      capabilitiesPromise = getModelCapabilities().catch(() => {
         capabilitiesPromise = null;

         return {};
      });
   }

   return capabilitiesPromise;
};

/**
 * Content-type buckets for a canonical model id, refined with the public
 * catalogs' capability data once it arrives (until then, and for models no
 * catalog knows, the name heuristic in modelType.ts decides). The returned
 * function's identity changes when the data lands, so memos re-run.
 */
export const useModelContentTypes = () => {
   const [capabilities, setCapabilities] = React.useState<CapabilityMap>({});

   React.useEffect(() => {
      let cancelled = false;

      void fetchCapabilities().then((result) => {
         if (!cancelled) {
            setCapabilities(result);
         }
      });

      return () => {
         cancelled = true;
      };
   }, []);

   const getContentTypes = React.useCallback(
      (canonicalModelId: string): ModelContentType[] => {
         const slug = canonicalModelId.split("/").slice(1).join("/") || canonicalModelId;

         return getModelContentTypes(canonicalModelId, capabilities[capabilitySlug(slug)]);
      },
      [capabilities]
   );

   return { getContentTypes };
};
