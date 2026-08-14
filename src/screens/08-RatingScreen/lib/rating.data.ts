import type { RatingCategory, RatingExploreGroup, RatingModel, RatingTab } from "./rating.type";

export const ratingCategories: RatingCategory[] = [
   {
      id: "programming",
      icon: "code",
      tone: "blue",
      translationKey: "programming",
   },
   {
      id: "texts",
      icon: "text",
      tone: "pink",
      translationKey: "texts",
   },
   {
      id: "research",
      icon: "research",
      tone: "purple",
      translationKey: "research",
   },
   {
      id: "images",
      icon: "image",
      tone: "green",
      translationKey: "images",
   },
];

export const ratingTabs: RatingTab[] = [
   {
      id: "text",
      translationKey: "text",
      count: 50,
      icon: "/icons/rating/nav-text.svg",
   },
   {
      id: "coding",
      translationKey: "coding",
      count: 45,
      icon: "/icons/rating/nav-coding.svg",
   },
   {
      id: "video",
      translationKey: "video",
      count: 20,
      icon: "/icons/rating/nav-video.svg",
   },
   {
      id: "audio",
      translationKey: "audio",
      count: 25,
      icon: "/icons/rating/nav-audio.svg",
   },
   {
      id: "image",
      translationKey: "image",
      count: 30,
      icon: "/icons/rating/nav-image.svg",
   },
];

export const ratingModels: RatingModel[] = Array.from({ length: 10 }, (_, index) => ({
   id: index + 1,
   rank: index + 1,
   name: "GPT-5.6 Terra",
   icon: "/icons/providers/openai.svg",
   description:
      "GPT-5.6 Sol — флагманская базовая модель серии GPT-5.6, соответствующая оригинальной базовой версии GPT-5 без суффикса.",
   tts: 1950,
   speed: 165,
   latency: 190,
   price: 15,
   isLicensed: true,
}));

export const ratingExploreGroups: RatingExploreGroup[] = [
   {
      id: "capabilities",
      translationKey: "capabilities",
      items: [
         {
            id: "coding",
            icon: "/icons/rating/coding.svg",
            translationKey: "coding",
         },
         {
            id: "reasoning",
            icon: "/icons/rating/reasoning.svg",
            translationKey: "reasoning",
         },
         {
            id: "research",
            icon: "/icons/rating/research-light.svg",
            translationKey: "research",
         },
         {
            id: "tools",
            icon: "/icons/rating/tools.svg",
            translationKey: "tools",
         },
         {
            id: "writing",
            icon: "/icons/rating/writing.svg",
            translationKey: "writing",
         },
         {
            id: "context",
            icon: "/icons/rating/context.svg",
            translationKey: "context",
         },
         {
            id: "chat",
            icon: "/icons/rating/chat.svg",
            translationKey: "chat",
         },
      ],
   },
   {
      id: "modality",
      translationKey: "modality",
      items: [
         {
            id: "speech",
            icon: "/icons/rating/speech.svg",
            translationKey: "speech",
         },
         {
            id: "computer-use",
            icon: "/icons/rating/computer-use.svg",
            translationKey: "computerUse",
         },
         {
            id: "video-generation",
            icon: "/icons/rating/video-generation.svg",
            translationKey: "videoGeneration",
         },
         {
            id: "transcription",
            icon: "/icons/rating/transcription.svg",
            translationKey: "transcription",
         },
         {
            id: "image-understanding",
            icon: "/icons/rating/image-understanding.svg",
            translationKey: "imageUnderstanding",
         },
         {
            id: "image-generation",
            icon: "/icons/rating/image-generation.svg",
            translationKey: "imageGeneration",
         },
      ],
   },
   {
      id: "industries",
      translationKey: "industries",
      items: [
         {
            id: "law",
            icon: "/icons/rating/law.svg",
            translationKey: "law",
         },
         {
            id: "roleplay",
            icon: "/icons/rating/roleplay.svg",
            translationKey: "roleplay",
         },
         {
            id: "math",
            icon: "/icons/rating/math.svg",
            translationKey: "math",
         },
         {
            id: "finance",
            icon: "/icons/rating/finance.svg",
            translationKey: "finance",
         },
         {
            id: "healthcare",
            icon: "/icons/rating/healthcare.svg",
            translationKey: "healthcare",
         },
      ],
   },
];
