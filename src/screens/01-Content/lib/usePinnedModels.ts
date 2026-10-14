"use client";

import React from "react";

import type { ModelItem } from "./content.data";

import { useGatewayPricing } from "shared/lib/gatewayPricing/useGatewayPricing";
import { getVendorId } from "shared/lib/providers/vendors";
import { RANKING_CATEGORIES } from "shared/lib/rankings/categories";
import { useRankings } from "shared/lib/rankings/useRankings";

export interface PinnedModel {
   id: string;
   model: ModelItem;
}

// Main listing: the most popular model of each of these vendors, in this order.
const MAIN_LISTING_VENDORS = ["google", "openai", "anthropic"];
const VENDOR_PAGE_COUNT = 3;

const LLM_CATEGORY = RANKING_CATEGORIES[0];

const normalize = (value: string): string =>
   value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

/**
 * Which models get a pinned BestAIPrice row above the reseller rows:
 * - a model page → that model;
 * - a vendor page → the vendor's 3 most popular models;
 * - the main listing → the most popular Gemini, OpenAI and Claude model.
 * "Popular" = rank on the llm-stats leaderboard (llm_rankings.json); only
 * models the gateway prices and the catalog lists are considered.
 */
export const usePinnedModels = (
   models: ModelItem[],
   selectedVendorId?: string,
   selectedModelId?: string
): PinnedModel[] => {
   const { entries: rankings } = useRankings(LLM_CATEGORY);
   const { entries: gatewayEntries } = useGatewayPricing();

   return React.useMemo(() => {
      const firstListing = new Map<string, ModelItem>();

      for (const model of models) {
         if (!firstListing.has(model.canonicalModelId)) {
            firstListing.set(model.canonicalModelId, model);
         }
      }

      if (selectedModelId) {
         const model = firstListing.get(selectedModelId);

         return model ? [{ id: selectedModelId, model }] : [];
      }

      // normalized slug -> gateway-priced, catalog-listed canonical ids
      const idsBySlug = new Map<string, string[]>();

      for (const entry of gatewayEntries) {
         const hasPrice = entry.inputPrice !== null || entry.nativePriceUsd !== null;

         if (!hasPrice || !firstListing.has(entry.canonicalModelId)) {
            continue;
         }

         const slug = normalize(entry.canonicalModelId.split("/").slice(1).join("/"));

         idsBySlug.set(slug, [...(idsBySlug.get(slug) ?? []), entry.canonicalModelId]);
      }

      // Ranked ids, best first (a ranking name maps to its slug, or the
      // slug's "-preview" twin).
      const rankedIds: string[] = [];

      for (const ranking of rankings
         .filter((entry): entry is typeof entry & { rank: number } => entry.rank !== null)
         .sort((a, b) => a.rank - b.rank)) {
         const slug = normalize(ranking.model);
         const ids = idsBySlug.get(slug) ?? idsBySlug.get(`${slug}-preview`) ?? [];

         for (const id of ids) {
            if (!rankedIds.includes(id)) {
               rankedIds.push(id);
            }
         }
      }

      const topOfVendor = (vendorId: string, count: number): string[] =>
         rankedIds.filter((id) => getVendorId(id) === vendorId).slice(0, count);

      const ids = selectedVendorId
         ? topOfVendor(selectedVendorId, VENDOR_PAGE_COUNT)
         : MAIN_LISTING_VENDORS.flatMap((vendorId) => topOfVendor(vendorId, 1));

      return ids.flatMap((id) => {
         const model = firstListing.get(id);

         return model ? [{ id, model }] : [];
      });
   }, [models, rankings, gatewayEntries, selectedVendorId, selectedModelId]);
};
