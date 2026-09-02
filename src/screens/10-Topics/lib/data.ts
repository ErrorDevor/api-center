import type { TopicItem } from "./types";

export const topicsTabs = [
   {
      id: "groupBuys",
      translationKey: "chat",
   },
   {
      id: "api",
      translationKey: "image",
   },
   {
      id: "video",
      translationKey: "video",
   },
] as const;

export const topics: TopicItem[] = [
   {
      id: 1,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      title: "OpenAI API (GPT-5.6)",
      description:
         "Высокопроизводительный и надежный доступ к передовым языковым моделям через единый интерфейс с минимальной задержкой.",
      publishedAt: "2026-09-02T11:15:00.000Z",
      commentsCount: 42,
   },
   {
      id: 2,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      title: "OpenAI API (GPT-5.6)",
      description:
         "Высокопроизводительный и надежный доступ к передовым языковым моделям через единый интерфейс с минимальной задержкой.",
      publishedAt: "2026-09-02T11:15:00.000Z",
      commentsCount: 42,
   },
   {
      id: 3,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      title: "OpenAI API (GPT-5.6)",
      description:
         "Высокопроизводительный и надежный доступ к передовым языковым моделям через единый интерфейс с минимальной задержкой.",
      publishedAt: "2026-09-02T11:15:00.000Z",
      commentsCount: 42,
   },
   {
      id: 4,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      title: "OpenAI API (GPT-5.6)",
      description:
         "Высокопроизводительный и надежный доступ к передовым языковым моделям через единый интерфейс с минимальной задержкой.",
      publishedAt: "2026-09-02T11:15:00.000Z",
      commentsCount: 42,
   },
];
