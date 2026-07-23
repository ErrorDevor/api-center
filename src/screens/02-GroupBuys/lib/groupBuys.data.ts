export type GroupBuyTranslationKey = "gptTerraSharing";

export interface GroupBuyItem {
   id: number;
   userName: string;
   userAvatar: string;
   providers: string[];
   translationKey: GroupBuyTranslationKey;
   price: number;
   persons: number;
   publishedAt: string;
   comments: number;
}

export const tabs = [
   {
      id: "group-buys",
      translationKey: "groupBuys",
   },
   {
      id: "api",
      translationKey: "api",
   },
   {
      id: "video",
      translationKey: "video",
   },
] as const;

export type GroupBuysTabId = (typeof tabs)[number]["id"];

export const groupBuys: GroupBuyItem[] = [
   {
      id: 1,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      providers: ["OpenAI", "Anthropic"],
      translationKey: "gptTerraSharing",
      price: 8,
      persons: 4,
      publishedAt: "2026-07-23T10:10:00.000Z",
      comments: 42,
   },
   {
      id: 2,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      providers: ["OpenAI", "Anthropic"],
      translationKey: "gptTerraSharing",
      price: 8,
      persons: 4,
      publishedAt: "2026-07-23T09:25:00.000Z",
      comments: 42,
   },
   {
      id: 3,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      providers: ["OpenAI", "Anthropic"],
      translationKey: "gptTerraSharing",
      price: 8,
      persons: 4,
      publishedAt: "2026-07-21T11:00:00.000Z",
      comments: 42,
   },
   {
      id: 4,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      providers: ["OpenAI", "Anthropic"],
      translationKey: "gptTerraSharing",
      price: 8,
      persons: 4,
      publishedAt: "2026-07-20T11:00:00.000Z",
      comments: 42,
   },
];
