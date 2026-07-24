import type { CommentType } from "./comments.type";

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

export const commentsData: CommentType = {
   id: "1",
   userName: "@insightminer",
   userAvatar: "/images/avatar2.png",
   providers: ["OpenAI", "Anthropic"],

   commentsData: {
      translationKey: "yunwu",
      price: 8,
      persons: 4,
      publishedAt: "2026-07-23T10:10:00.000Z",
      comments: 42,

      providerDetails: {
         url: "https://yunwu.ai/",
         age: {
            years: 2,
            months: 4,
         },
         paymentMethods: ["WeChat", "Alipay", "Crypto"],
         rating: 4.8,
         positiveReviews: 123,
         negativeReviews: 12,

         models: [
            {
               id: "openai-1",
               name: "OpenAI",
               icon: "/icons/providers/openai.svg",
               inputPrice: 4,
               outputPrice: 8,
            },
            {
               id: "google-1",
               name: "Google",
               icon: "/icons/providers/google.svg",
               inputPrice: 4,
               outputPrice: 8,
            },
            {
               id: "deepseek",
               name: "DeepSeek",
               icon: "/icons/providers/deepseek.svg",
               inputPrice: 4,
               outputPrice: 8,
            },
            {
               id: "minimax-1",
               name: "Minimax",
               icon: "/icons/providers/minimax.svg",
               inputPrice: 4,
               outputPrice: 8,
            },
            {
               id: "chatglm",
               name: "ChatGLM",
               icon: "/icons/providers/chatglm.svg",
               inputPrice: 4,
               outputPrice: 8,
            },
            {
               id: "grok",
               name: "Grok",
               icon: "/icons/providers/grok.svg",
               inputPrice: 4,
               outputPrice: 8,
            },
            {
               id: "anthropic",
               name: "Anthropic",
               icon: "/icons/providers/anthropic.svg",
               inputPrice: 4,
               outputPrice: 8,
            },
            {
               id: "openai-2",
               name: "OpenAI",
               icon: "/icons/providers/openai.svg",
               inputPrice: 4,
               outputPrice: 8,
            },
            {
               id: "minimax-2",
               name: "Minimax",
               icon: "/icons/providers/minimax.svg",
               inputPrice: 4,
               outputPrice: 8,
            },
            {
               id: "google-2",
               name: "Google",
               icon: "/icons/providers/google.svg",
               inputPrice: 4,
               outputPrice: 8,
            },
         ],
      },

      reviews: [
         {
            id: "review-1",
            userName: "@anar_h",
            userAvatar: "/images/avatar3.png",
            publishedAt: "2026-07-23T10:40:00.000Z",
            translationKey: "yunwu",
            reactions: {
               likes: 12,
               dislikes: 3,
               favorites: 0,
            },
            replies: [
               {
                  id: "review-1-reply-1",
                  userName: "@admin",
                  userAvatar: "/images/avatar3.png",
                  publishedAt: "2026-07-23T10:45:00.000Z",
                  translationKey: "yunwu",
                  reactions: {
                     likes: 12,
                     dislikes: 3,
                     favorites: 0,
                  },
               },
            ],
         },
         {
            id: "review-2",
            userName: "@anar_h",
            userAvatar: "/images/avatar3.png",
            publishedAt: "2026-07-23T09:25:00.000Z",
            translationKey: "yunwu",
            reactions: {
               likes: 12,
               dislikes: 3,
               favorites: 0,
            },
         },
         {
            id: "review-3",
            userName: "@anar_h",
            userAvatar: "/images/avatar3.png",
            publishedAt: "2026-07-23T10:40:00.000Z",
            translationKey: "yunwu",
            reactions: {
               likes: 12,
               dislikes: 3,
               favorites: 0,
            },
         },
         {
            id: "review-4",
            userName: "@anar_h",
            userAvatar: "/images/avatar3.png",
            publishedAt: "2026-07-23T09:25:00.000Z",
            translationKey: "yunwu",
            reactions: {
               likes: 12,
               dislikes: 3,
               favorites: 0,
            },
         },
      ],
   },
};
