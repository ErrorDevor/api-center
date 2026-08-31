"use client";

import React from "react";

import { parseClickResult, parseProviderPopularityList } from "./types";

// One shared, mutable popularity store for the whole page. Both tables
// (/home models, /group-buys) read click counts from here, and a click
// tracked in any row updates every subscriber so the "popular" sort
// re-orders live. Kept as a hand-rolled external store (rather than the
// singleton-promise + useState pattern the other provider hooks use)
// precisely because it has to broadcast mutations, not just a one-time load.
const clickCounts = new Map<string, number>();
const listeners = new Set<() => void>();

let snapshot = 0;
let loadPromise: Promise<void> | null = null;

const emit = () => {
   snapshot += 1;
   listeners.forEach((listener) => listener());
};

const loadPopularity = (): Promise<void> => {
   if (!loadPromise) {
      loadPromise = fetch("/api/providers/popularity", { cache: "no-store" })
         .then(async (response) => {
            if (!response.ok) {
               return;
            }

            const payload = await response.json().catch(() => null);
            const list = parseProviderPopularityList(
               (payload as { data?: unknown } | null)?.data
            );

            let changed = false;

            for (const item of list) {
               // A locally-tracked optimistic bump can race ahead of a
               // stale list response — keep the higher of the two.
               const current = clickCounts.get(item.provider) ?? 0;

               if (item.clickCount > current) {
                  clickCounts.set(item.provider, item.clickCount);
                  changed = true;
               }
            }

            if (changed) {
               emit();
            }
         })
         .catch(() => {
            // Leave loadPromise set so a failed feed isn't retried on every
            // mount — popularity is a nice-to-have sort input, not critical.
         });
   }

   return loadPromise;
};

const subscribe = (listener: () => void): (() => void) => {
   listeners.add(listener);

   return () => {
      listeners.delete(listener);
   };
};

const getSnapshot = () => snapshot;

// De-dupes rapid double-fires (the site link and the reviews link for the
// same row both call this) so we don't send two requests the backend would
// only cooldown-reject anyway.
const inFlight = new Set<string>();

/**
 * Records a click for `providerKey` and optimistically bumps its local
 * count so the popular sort reacts immediately. The backend's own 15-min
 * per-provider cooldown means a second call soon after is a no-op there —
 * it returns the unchanged count, which we reconcile to.
 */
export const trackProviderClick = async (providerKey: string): Promise<void> => {
   if (!providerKey || inFlight.has(providerKey)) {
      return;
   }

   inFlight.add(providerKey);

   const previous = clickCounts.get(providerKey) ?? 0;

   clickCounts.set(providerKey, previous + 1);
   emit();

   try {
      const response = await fetch(
         `/api/providers/${encodeURIComponent(providerKey)}/click`,
         { method: "POST" }
      );

      const payload = await response.json().catch(() => null);
      const result = parseClickResult((payload as { data?: unknown } | null)?.data);

      if (!response.ok || (result && !result.counted)) {
         // Hard failure (429/403/5xx) or a cooldown no-op — the real count
         // didn't move, so drop the optimistic bump. Trust the server's
         // number when it gave one.
         clickCounts.set(providerKey, result ? result.clickCount : previous);
      } else if (result) {
         clickCounts.set(providerKey, Math.max(result.clickCount, clickCounts.get(providerKey) ?? 0));
      }

      emit();
   } catch {
      clickCounts.set(providerKey, previous);
      emit();
   } finally {
      inFlight.delete(providerKey);
   }
};

interface UseProviderPopularityResult {
   getClickCount: (providerKey: string | undefined) => number;
   trackClick: (providerKey: string) => Promise<void>;
   // Bumped on every store change — include it in a useMemo's deps to make
   // a popularity-keyed sort recompute when a click lands.
   version: number;
}

/**
 * Read + write access to the shared provider-popularity store. `getClickCount`
 * returns 0 for an unknown/unclicked provider (and while the feed loads),
 * so it's always safe to use as a sort key.
 */
export const useProviderPopularity = (): UseProviderPopularityResult => {
   const version = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

   React.useEffect(() => {
      void loadPopularity();
   }, []);

   const getClickCount = React.useCallback(
      (providerKey: string | undefined) =>
         providerKey ? clickCounts.get(providerKey) ?? 0 : 0,
      []
   );

   return { getClickCount, trackClick: trackProviderClick, version };
};
