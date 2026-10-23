"use client";

import React from "react";

import { getOpenRouterCategoryModels } from "./openRouterCategory.action";

import {
   type ModelCapabilities,
   getModelCapabilities,
} from "shared/lib/models/modelCapabilities.action";

import type { RankingEntry } from "./types";
import { type RankingView, rankingModelKey } from "./views";

// One shared request per page load, same pattern as useModelContentTypes.
let capabilitiesPromise: Promise<Record<string, ModelCapabilities>> | null = null;

const fetchCapabilities = () => {
   if (!capabilitiesPromise) {
      capabilitiesPromise = getModelCapabilities().catch(() => {
         capabilitiesPromise = null;

         return {};
      });
   }

   return capabilitiesPromise;
};

export interface ViewData {
   // OpenRouter's ranked models for the view's category: one key set each.
   categoryModels: string[][] | null;
   // normalised model key -> capabilities
   capabilities: Map<string, ModelCapabilities> | null;
}

/**
 * The pure part of useRankingView: filters, re-orders and re-ranks `entries`
 * for `view` given the extra data it asked for.
 */
export const applyRankingView = (
   entries: RankingEntry[],
   view: RankingView,
   data: ViewData
): RankingEntry[] => {
   let result = entries.filter((entry) => entry.rank !== null);

   if (view.requiresImageInput && data.capabilities) {
      const capabilities = data.capabilities;

      result = result.filter((entry) =>
         capabilities.get(rankingModelKey(entry.model))?.in.includes("image")
      );
   }

   if (view.openRouterCategory && data.categoryModels && data.categoryModels.length > 0) {
      const categoryModels = data.categoryModels;
      const position = (entry: RankingEntry): number => {
         const key = rankingModelKey(entry.model);

         return categoryModels.findIndex((keys) => keys.includes(key));
      };

      result = result
         .map((entry) => ({ entry, position: position(entry) }))
         .filter(({ position: index }) => index !== -1)
         .sort((first, second) => first.position - second.position)
         .map(({ entry }) => entry);
   } else if (view.sortMetric) {
      const metric = view.sortMetric;

      result = result
         .filter((entry) => entry.metrics[metric] !== null && entry.metrics[metric] !== undefined)
         .sort((first, second) => (second.metrics[metric] ?? 0) - (first.metrics[metric] ?? 0));
   } else {
      result = [...result].sort((first, second) => (first.rank ?? 0) - (second.rank ?? 0));
   }

   return result.map((entry, index) => ({ ...entry, rank: index + 1 }));
};

/**
 * Re-cuts a leaderboard feed for an explore card (see RankingView): filters,
 * re-orders and re-ranks `entries` from live data. Without a view the
 * entries pass through untouched. While the view's extra data is loading
 * `isLoading` is true and entries stay empty, so the table never flashes the
 * unfiltered list. If that data can't be fetched the view degrades to the
 * feed's own order rather than an empty table.
 */
export const useRankingView = (
   view: RankingView | undefined,
   entries: RankingEntry[]
): { entries: RankingEntry[]; isLoading: boolean } => {
   const [data, setData] = React.useState<ViewData | null>(null);

   const category = view?.openRouterCategory;
   const needsCapabilities = view?.requiresImageInput ?? false;

   React.useEffect(() => {
      if (!category && !needsCapabilities) {
         setData({ categoryModels: null, capabilities: null });

         return;
      }

      let cancelled = false;

      setData(null);

      void Promise.all([
         category ? getOpenRouterCategoryModels(category).catch(() => []) : null,
         needsCapabilities ? fetchCapabilities() : null,
      ]).then(([categoryModels, capabilities]) => {
         if (cancelled) {
            return;
         }

         setData({
            categoryModels,
            capabilities: capabilities
               ? new Map(
                    Object.entries(capabilities).map(([slug, value]) => [
                       rankingModelKey(slug),
                       value,
                    ])
                 )
               : null,
         });
      });

      return () => {
         cancelled = true;
      };
   }, [category, needsCapabilities]);

   const viewEntries = React.useMemo(() => {
      if (!view) {
         return entries;
      }

      if (!data) {
         return [];
      }

      return applyRankingView(entries, view, data);
   }, [view, data, entries]);

   return { entries: viewEntries, isLoading: Boolean(view) && data === null };
};
