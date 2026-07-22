export type SidebarMode = "api" | "group-buys";

export type ModelBadge = "new" | "top";

export interface ProviderModel {
   id: string;
   name: string;
   count: number;
   badge?: ModelBadge;
}

export interface ProviderItem {
   id: string;
   name: string;
   count: number;
   icon: string;
   models?: ProviderModel[];
}

export const providers: ProviderItem[] = [
   {
      id: "google",
      name: "Google",
      count: 94,
      icon: "/icons/providers/google.svg",
   },
   {
      id: "openai",
      name: "OpenAI",
      count: 158,
      icon: "/icons/providers/openai.svg",
      models: [
         {
            id: "gpt-5-6-sol",
            name: "GPT-5.6 Sol",
            count: 28,
            badge: "new",
         },
         {
            id: "gpt-5-6-terra",
            name: "GPT-5.6 Terra",
            count: 47,
         },
         {
            id: "gpt-5-6-luna",
            name: "GPT-5.6 Luna",
            count: 64,
            badge: "top",
         },
         {
            id: "gpt-4-1-nano",
            name: "GPT-4.1 nano",
            count: 19,
         },
      ],
   },
   {
      id: "deepseek",
      name: "DeepSeek",
      count: 86,
      icon: "/icons/providers/deepseek.svg",
   },
   {
      id: "minimax",
      name: "Minimax",
      count: 75,
      icon: "/icons/providers/minimax.svg",
   },
   {
      id: "anthropic",
      name: "Anthropic",
      count: 68,
      icon: "/icons/providers/anthropic.svg",
   },
   {
      id: "xai",
      name: "xAI",
      count: 59,
      icon: "/icons/providers/xai.svg",
   },
   {
      id: "chatglm",
      name: "ChatGLM",
      count: 53,
      icon: "/icons/providers/chatglm.svg",
   },
   {
      id: "grok",
      name: "Grok",
      count: 47,
      icon: "/icons/providers/grok.svg",
   },
];
