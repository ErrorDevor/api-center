export interface GroupBuyItem {
   id: number;
   userName: string;
   userAvatar: string;
   providers: string[];
   title: string;
   description: string;
   price: number;
   persons: number;
   publishedAt: string;
   comments: number;
}

export const groupBuys: GroupBuyItem[] = [
   {
      id: 1,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      providers: ["OpenAI", "Anthropic"],
      title: "Sharing GPT-5.6 Terra (4 spots, 2 free) — save on the top tier!",
      description:
         "Taking the top-tier plan, I'm splitting it into 4 equal accesses. Each spot comes out twice as cheaper than buying 5xMax separately, saving you money.",
      price: 8,
      persons: 4,
      publishedAt: "50 min ago",
      comments: 42,
   },
   {
      id: 2,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      providers: ["OpenAI", "Anthropic"],
      title: "Sharing GPT-5.6 Terra (4 spots, 2 free) — save on the top tier!",
      description:
         "Taking the top-tier plan, I'm splitting it into 4 equal accesses. Each spot comes out twice as cheaper than buying 5xMax separately, saving you money.",
      price: 8,
      persons: 4,
      publishedAt: "1h 35 min ago",
      comments: 42,
   },
   {
      id: 3,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      providers: ["OpenAI", "Anthropic"],
      title: "Sharing GPT-5.6 Terra (4 spots, 2 free) — save on the top tier!",
      description:
         "Taking the top-tier plan, I'm splitting it into 4 equal accesses. Each spot comes out twice as cheaper than buying 5xMax separately, saving you money.",
      price: 8,
      persons: 4,
      publishedAt: "2 days ago",
      comments: 42,
   },
   {
      id: 4,
      userName: "@insightminer",
      userAvatar: "/images/avatar2.png",
      providers: ["OpenAI", "Anthropic"],
      title: "Sharing GPT-5.6 Terra (4 spots, 2 free) — save on the top tier!",
      description:
         "Taking the top-tier plan, I'm splitting it into 4 equal accesses. Each spot comes out twice as cheaper than buying 5xMax separately, saving you money.",
      price: 8,
      persons: 4,
      publishedAt: "3 days ago",
      comments: 42,
   },
];
