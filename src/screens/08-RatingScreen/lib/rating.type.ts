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

export type RatingTabId = "text" | "coding" | "video" | "audio" | "image";

export type RatingTabTranslationKey =
   | "text"
   | "coding"
   | "video"
   | "audio"
   | "image";

export interface RatingTab {
   id: RatingTabId;
   translationKey: RatingTabTranslationKey;
   count: number;
   icon: string;
}

export interface RatingModel {
   id: number;
   rank: number;
   icon: string;
   name: string;
   description: string;
   tts: number;
   speed: number;
   latency: number;
   price: number;
   isLicensed: boolean;
}

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