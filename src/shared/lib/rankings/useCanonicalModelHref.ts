"use client";

import React from "react";

import { useProviderRecords } from "shared/lib/providers/useProviderRecords";

import { rankingModelKey } from "./views";

const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

/**
 * Maps a leaderboard model name to its catalog page (/home/vendor/model).
 * Only exact normalised matches against models that actually have offers
 * are linked, so a row never points at an empty page.
 */
export const useCanonicalModelHref = (): ((modelName: string) => string | undefined) => {
   const { records } = useProviderRecords();

   const hrefByKey = React.useMemo(() => {
      const map = new Map<string, string>();

      for (const record of records) {
         // Rankings name models without the vendor ("Claude Opus 5.5").
         const key = rankingModelKey(record.canonicalModelId.split("/").slice(1).join("/"));

         if (!map.has(key)) {
            map.set(key, `/home/${encodePath(record.canonicalModelId)}`);
         }
      }

      return map;
   }, [records]);

   return React.useCallback(
      (modelName: string) => hrefByKey.get(rankingModelKey(modelName)),
      [hrefByKey]
   );
};
