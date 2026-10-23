import type { RankingCategoryId } from "./types";

// A /rating "explore" card: a re-cut of one leaderboard feed, rebuilt from
// live data every time (no hard-coded model lists), so the cards keep
// working as the feeds and OpenRouter's rankings refresh.
export interface RankingView {
   categoryId: RankingCategoryId;
   // Rank by this metric of the feed (best first) instead of its own order.
   sortMetric?: string;
   // Keep only models OpenRouter ranks in this usage category, in its order
   // (see openRouterCategory.action).
   openRouterCategory?: string;
   // Keep only models that accept image input (modelCapabilities.action).
   requiresImageInput?: boolean;
}

// Keyed by the explore card's id (see rating.data.ts).
export const RANKING_VIEWS: Record<string, RankingView> = {
   // By capability
   coding: { categoryId: "llm", sortMetric: "coding" },
   reasoning: { categoryId: "llm", sortMetric: "reasoning" },
   research: { categoryId: "llm", openRouterCategory: "academia" },
   tools: { categoryId: "llm", sortMetric: "agent" },
   writing: { categoryId: "llm", openRouterCategory: "marketing" },
   context: { categoryId: "llm", sortMetric: "context" },
   chat: { categoryId: "llm" },

   // By modality
   speech: { categoryId: "text-to-speech" },
   "computer-use": { categoryId: "llm", sortMetric: "agent", requiresImageInput: true },
   "video-generation": { categoryId: "video-generation" },
   transcription: { categoryId: "speech-to-text" },
   "image-understanding": { categoryId: "llm", requiresImageInput: true },
   "image-generation": { categoryId: "image-generation" },

   // By industry
   law: { categoryId: "llm", openRouterCategory: "legal" },
   roleplay: { categoryId: "llm", openRouterCategory: "roleplay" },
   math: { categoryId: "llm", openRouterCategory: "science" },
   finance: { categoryId: "llm", openRouterCategory: "finance" },
   healthcare: { categoryId: "llm", openRouterCategory: "health" },
};

// "Claude Opus 5.5" / "claude-opus-5-5" -> "claudeopus55"
export const rankingModelKey = (value: string): string =>
   value.toLowerCase().replace(/[^a-z0-9]/g, "");
