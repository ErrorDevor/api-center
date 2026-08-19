import type { CommentLayerType } from "./comments.type";

// Static demo data for the still-mock 04-Buys "participants" list (group
// buys aren't backed by a real API yet — out of scope for the provider
// reviews work, see COMMENTS_API_GUIDE.md). The Reviews screen itself no
// longer reads this — it fetches real data via useProviderComments.
export const mockReviews: CommentLayerType[] = [
   {
      id: "review-1",
      userName: "@anar_h",
      userAvatar: "/images/avatar3.png",
      publishedAt: "2026-07-23T10:40:00.000Z",
      content:
         "Bought this, and I'm very satisfied! The price is 4 times lower than the original, and the seller is completely trustworthy.",
      reactions: {
         likes: 12,
         dislikes: 3,
      },
      replies: [
         {
            id: "review-1-reply-1",
            userName: "@admin",
            userAvatar: "/images/avatar3.png",
            publishedAt: "2026-07-23T10:45:00.000Z",
            content: "Thanks for the detailed feedback!",
            reactions: {
               likes: 12,
               dislikes: 3,
            },
         },
      ],
   },
   {
      id: "review-2",
      userName: "@anar_h",
      userAvatar: "/images/avatar3.png",
      publishedAt: "2026-07-23T09:25:00.000Z",
      content:
         "Bought this, and I'm very satisfied! The price is 4 times lower than the original, and the seller is completely trustworthy.",
      reactions: {
         likes: 12,
         dislikes: 3,
      },
   },
   {
      id: "review-3",
      userName: "@anar_h",
      userAvatar: "/images/avatar3.png",
      publishedAt: "2026-07-23T10:40:00.000Z",
      content:
         "Bought this, and I'm very satisfied! The price is 4 times lower than the original, and the seller is completely trustworthy.",
      reactions: {
         likes: 12,
         dislikes: 3,
      },
   },
   {
      id: "review-4",
      userName: "@anar_h",
      userAvatar: "/images/avatar3.png",
      publishedAt: "2026-07-23T09:25:00.000Z",
      content:
         "Bought this, and I'm very satisfied! The price is 4 times lower than the original, and the seller is completely trustworthy.",
      reactions: {
         likes: 12,
         dislikes: 3,
      },
   },
];
