import { CommentLayerType } from "./types";

export const tabs = [
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

export const forumTopic = {
   userName: "@insightminer",
   userAvatar: "/images/avatar2.png",
   providers: ["OpenAI", "Anthropic"],
   title:
      "Высокопроизводительный и дешевый GPT-5.6 Terra API для разработчиков и бизнеса",
   description:
      "Yunwu.ai - API-шлюз для разработчиков, который даёт доступ к моделям OpenAI, Claude, Gemini и другим через единый OpenAI-совместимый эндпоинт. Работает без VPN, принимает оплату через локальные методы (Alipay, WeChat), цены ниже официальных. Какие модели там их около 100 и способы оплаты, его рейтинг(отзывы сумма), дата создания",
};

export const forumComments: CommentLayerType[] = [
   {
      id: 1,
      userName: "@anar_h",
      userAvatar: "/images/avatar3.png",
      publishedAt: "2026-09-02T11:17:00.000Z",
      content:
         "Купил это, и я очень доволен! Цена в 4 раза ниже оригинальной, а продавцу можно полностью доверять.",
      reactions: {
         likes: 12,
         dislikes: 3,
      },
      replyCount: 0,
   },
   {
      id: 2,
      userName: "@anar_h",
      userAvatar: "/images/avatar3.png",
      publishedAt: "2026-09-02T11:17:00.000Z",
      content:
         "Купил это, и я очень доволен! Цена в 4 раза ниже оригинальной, а продавцу можно полностью доверять.",
      reactions: {
         likes: 12,
         dislikes: 3,
      },
      replyCount: 1,
      replies: [
         {
            id: 21,
            userName: "@insightminer",
            userAvatar: "/images/avatar2.png",
            publishedAt: "2026-09-02T11:22:00.000Z",
            content:
               "Купил это, и я очень доволен! Цена в 4 раза ниже оригинальной, а продавцу можно полностью доверять.",
            reactions: {
               likes: 12,
               dislikes: 3,
            },
            replyCount: 0,
         },
      ],
   },
   {
      id: 3,
      userName: "@anar_h",
      userAvatar: "/images/avatar3.png",
      publishedAt: "2026-09-02T11:17:00.000Z",
      content:
         "Купил это, и я очень доволен! Цена в 4 раза ниже оригинальной, а продавцу можно полностью доверять.",
      reactions: {
         likes: 12,
         dislikes: 3,
      },
      replyCount: 0,
   },
];
