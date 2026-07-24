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
            tone: "orange",
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
            tone: "blue",
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
            tone: "white",
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
            tone: "blue",
         },
      ],
   },
};
