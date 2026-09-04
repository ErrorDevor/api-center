export type RatingCategoryIcon = "code" | "text" | "research" | "image";

export type RatingCategoryTone = "blue" | "pink" | "purple" | "green";

export type RatingCategoryTranslationKey =
   | "programming"
   | "texts"
   | "research"
   | "images";

export interface RatingCategory {
   id: string;
   icon: RatingCategoryIcon;
   tone: RatingCategoryTone;
   translationKey: RatingCategoryTranslationKey;
}

// The /rating table now renders straight from shared/lib/rankings — see
// RANKING_CATEGORIES (tab set + per-category columns) and RankingEntry (row
// shape). Nothing category-specific lives in this screen's types anymore.

export type RatingExploreGroupId =
   | "capabilities"
   | "modality"
   | "industries";

export type RatingExploreItemTranslationKey =
   | "coding"
   | "reasoning"
   | "research"
   | "tools"
   | "writing"
   | "context"
   | "chat"
   | "speech"
   | "computerUse"
   | "videoGeneration"
   | "transcription"
   | "imageUnderstanding"
   | "imageGeneration"
   | "law"
   | "roleplay"
   | "math"
   | "finance"
   | "healthcare";

export interface RatingExploreItem {
   id: string;
   icon: string;
   translationKey: RatingExploreItemTranslationKey;
}

export interface RatingExploreGroup {
   id: RatingExploreGroupId;
   translationKey: RatingExploreGroupId;
   items: RatingExploreItem[];
}