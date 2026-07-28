export type GroupBuyTranslationKey = "gptTerraSharing";

export interface GroupBuyItem {
   id: string;
   userName: string;
   userAvatar: string;
   translationKey: GroupBuyTranslationKey;

   price: number;
   comments: number;
   publishedAt: string;

   totalPersons: number;
   takenPersons: number;
   paymentMethod: string;
}

export const tabs = [
   {
      id: "coding",
      translationKey: "coding",
   },
   {
      id: "chat",
      translationKey: "chat",
   },
   {
      id: "image",
      translationKey: "image",
   },
   {
      id: "video",
      translationKey: "video",
   },
   {
      id: "audio",
      translationKey: "audio",
   },
   {
      id: "others",
      translationKey: "others",
   },
] as const;

export type GroupBuysTabId = (typeof tabs)[number]["id"];

export const groupBuys: GroupBuyItem[] = [
   {
      id: "1",
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      translationKey: "gptTerraSharing",
      price: 8,
      totalPersons: 4,
      takenPersons: 1,
      paymentMethod: "Alipay",
      publishedAt: "2026-07-23T10:10:00.000Z",
      comments: 42,
   },
   {
      id: "2",
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      translationKey: "gptTerraSharing",
      price: 8,
      totalPersons: 4,
      takenPersons: 2,
      paymentMethod: "Alipay",
      publishedAt: "2026-07-23T09:25:00.000Z",
      comments: 42,
   },
   {
      id: "3",
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      translationKey: "gptTerraSharing",
      price: 8,
      totalPersons: 4,
      takenPersons: 3,
      paymentMethod: "Alipay",
      publishedAt: "2026-07-21T11:00:00.000Z",
      comments: 42,
   },
   {
      id: "4",
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      translationKey: "gptTerraSharing",
      price: 8,
      totalPersons: 4,
      takenPersons: 1,
      paymentMethod: "Alipay",
      publishedAt: "2026-07-20T11:00:00.000Z",
      comments: 42,
   },
];
