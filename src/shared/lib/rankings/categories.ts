import type { Dictionary } from "shared/lib/i18n/dictionaries";

import type { RankingCategoryId } from "./types";

// How a metric cell is rendered — see format.ts.
export type RankingColumnFormat =
   | "score"
   | "int"
   | "context"
   | "speed"
   | "latency"
   | "pricePer1M"
   | "pricePerImage"
   | "pricePerSecond"
   | "pricePerMinute";

export interface RankingColumn {
   // Field name in the feed row.
   key: string;
   // Column header, keyed into t.rating.table.
   labelKey: keyof Dictionary["rating"]["table"];
   format: RankingColumnFormat;
}

export interface RankingCategory {
   id: RankingCategoryId;
   // Tab label, keyed into t.rating.categoryTabs.
   labelKey: keyof Dictionary["rating"]["categoryTabs"];
   icon: string;
   // Where the leaderboard feed lives. Same co-located-static-file
   // convention as the other feeds: in production the backend writes the
   // real data onto the server's disk at /data/<name>.json (outside git);
   // set the matching NEXT_PUBLIC_*_RANKINGS_JSON_URL to override (see
   // .env.example).
   feedUrl: string;
   // Metric columns shown between "Model name" and "License".
   columns: RankingColumn[];
}

// process.env.NEXT_PUBLIC_* must be referenced literally so Next can inline
// it into the client bundle at build time.
const FEED_URLS: Record<RankingCategoryId, string> = {
   llm:
      process.env.NEXT_PUBLIC_LLM_RANKINGS_JSON_URL || "/data/llm_rankings.json",
   "image-generation":
      process.env.NEXT_PUBLIC_IMAGE_GENERATION_RANKINGS_JSON_URL ||
      "/data/image_generation_rankings.json",
   "video-generation":
      process.env.NEXT_PUBLIC_VIDEO_GENERATION_RANKINGS_JSON_URL ||
      "/data/video_generation_rankings.json",
   "text-to-speech":
      process.env.NEXT_PUBLIC_TEXT_TO_SPEECH_RANKINGS_JSON_URL ||
      "/data/text_to_speech_rankings.json",
   "speech-to-text":
      process.env.NEXT_PUBLIC_SPEECH_TO_TEXT_RANKINGS_JSON_URL ||
      "/data/speech_to_text_rankings.json",
};

// Tab set mirrors llm-stats.com's leaderboard switcher. Column choices match
// each feed's fields (rank / model / … / license are rendered by RatingRow
// itself; only the middle metric columns are listed here).
export const RANKING_CATEGORIES: RankingCategory[] = [
   {
      id: "llm",
      labelKey: "llm",
      icon: "/icons/rating/nav-text.svg",
      feedUrl: FEED_URLS.llm,
      columns: [
         { key: "llm_stats", labelKey: "llmStats", format: "score" },
         { key: "reasoning", labelKey: "reasoning", format: "score" },
         { key: "coding", labelKey: "coding", format: "score" },
         { key: "agent", labelKey: "agent", format: "score" },
         { key: "context", labelKey: "context", format: "context" },
         { key: "speed", labelKey: "speed", format: "speed" },
         { key: "pricing", labelKey: "pricePerMillion", format: "pricePer1M" },
      ],
   },
   {
      id: "image-generation",
      labelKey: "imageGeneration",
      icon: "/icons/rating/nav-image.svg",
      feedUrl: FEED_URLS["image-generation"],
      columns: [
         { key: "image_gen", labelKey: "imageGen", format: "int" },
         { key: "image_edit", labelKey: "imageEdit", format: "int" },
         { key: "price_per_image", labelKey: "pricePerImage", format: "pricePerImage" },
      ],
   },
   {
      id: "video-generation",
      labelKey: "videoGeneration",
      icon: "/icons/rating/nav-video.svg",
      feedUrl: FEED_URLS["video-generation"],
      columns: [
         { key: "text_to_video", labelKey: "textToVideo", format: "int" },
         { key: "image_to_video", labelKey: "imageToVideo", format: "int" },
         { key: "price_per_second", labelKey: "pricePerSecond", format: "pricePerSecond" },
      ],
   },
   {
      id: "text-to-speech",
      labelKey: "textToSpeech",
      icon: "/icons/rating/speech.svg",
      feedUrl: FEED_URLS["text-to-speech"],
      columns: [
         { key: "tts", labelKey: "tts", format: "int" },
         { key: "speed", labelKey: "speed", format: "speed" },
         { key: "latency", labelKey: "latency", format: "latency" },
         { key: "price_per_1m", labelKey: "pricePerMillion", format: "pricePer1M" },
      ],
   },
   {
      id: "speech-to-text",
      labelKey: "speechToText",
      icon: "/icons/rating/nav-audio.svg",
      feedUrl: FEED_URLS["speech-to-text"],
      columns: [
         { key: "stt", labelKey: "stt", format: "int" },
         { key: "price_per_minute", labelKey: "pricePerMinute", format: "pricePerMinute" },
      ],
   },
];
