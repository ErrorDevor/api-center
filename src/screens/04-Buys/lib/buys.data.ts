import { GroupBuyItem } from "screens/02-GroupBuys/lib/groupBuys.data";

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

export const card: GroupBuyItem = {
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
};
