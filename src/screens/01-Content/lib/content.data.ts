export interface ModelItem {
   id: number;
   name: string;
   description: string;
   inputPrice: number;
   outputPrice: number;
   discount: string;
   tags: string[];
   provider: string;
   reviews: number;
   reports: number;
}

export const tabs = ["All Types", "Image", "Search", "Audio & Video"];

export const models: ModelItem[] = Array.from({ length: 11 }, (_, index) => ({
   id: index + 1,
   name: "GPT-5.6 Terra",
   description: "GPT-5.6 Sol is the flagship base model of the GPT-5.6 family",
   inputPrice: 4,
   outputPrice: 8,
   discount: "90% cheaper",
   tags: ["Image", "Video"],
   provider: "OpenRouter",
   reviews: 123,
   reports: 12,
}));
