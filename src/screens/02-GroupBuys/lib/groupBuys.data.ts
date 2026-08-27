export type GroupBuyTranslationKey =
   | "gptTerraSharing"
   | "yunwu"
   | "claudeSonnetSharing"
   | "geminiProSharing";

export interface GroupBuyItem {
   id: string;
   userName: string;
   userAvatar: string;
   translationKey: GroupBuyTranslationKey;

   // Vendor id(s) this offer grants access to (see shared/lib/providers/
   // vendors' getVendorId) — a gateway-style offer like "yunwu" can bundle
   // several vendors at once, so this is a list rather than a single id.
   // Drives the Sidebar's provider filter (see GroupBuysContent).
   vendorIds: string[];

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
      vendorIds: ["openai"],
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
      vendorIds: ["openai"],
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
      vendorIds: ["openai"],
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
      vendorIds: ["openai"],
      price: 8,
      totalPersons: 4,
      takenPersons: 1,
      paymentMethod: "Alipay",
      publishedAt: "2026-07-20T11:00:00.000Z",
      comments: 42,
   },
   {
      id: "5",
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      translationKey: "claudeSonnetSharing",
      vendorIds: ["anthropic"],
      price: 6,
      totalPersons: 4,
      takenPersons: 2,
      paymentMethod: "Crypto",
      publishedAt: "2026-07-24T08:00:00.000Z",
      comments: 15,
   },
   {
      id: "6",
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      translationKey: "geminiProSharing",
      vendorIds: ["google"],
      price: 5,
      totalPersons: 4,
      takenPersons: 1,
      paymentMethod: "Alipay",
      publishedAt: "2026-07-22T14:30:00.000Z",
      comments: 9,
   },
   {
      id: "7",
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      translationKey: "yunwu",
      vendorIds: ["openai", "anthropic", "google"],
      price: 4,
      totalPersons: 4,
      takenPersons: 3,
      paymentMethod: "Alipay",
      publishedAt: "2026-07-19T12:00:00.000Z",
      comments: 21,
   },
];
