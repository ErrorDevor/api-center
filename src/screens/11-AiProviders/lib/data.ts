interface ProviderModel {
   id: string;
   name: string;
   icon: string;
}

type ProviderStatus = "working" | "not-working";

export interface Provider {
   id: string;
   name: string;
   description: string;
   age: string;
   verified: boolean;
   models: ProviderModel[];
   paymentMethods: string[];
   status: ProviderStatus;
   reviews: {
      positive: number;
      negative: number;
   };
}

export const PROVIDERS: Provider[] = [
   {
      id: "apikey-fan-1",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [
         {
            id: "openai",
            name: "OpenAI",
            icon: "/icons/providers/openai.svg",
         },
         {
            id: "glm",
            name: "GLM",
            icon: "/icons/providers/chatglm.svg",
         },
         // {
         //    id: "claude",
         //    name: "Claude",
         //    icon: "/icons/providers/claude.svg",
         // },
         {
            id: "gemini",
            name: "Gemini",
            icon: "/icons/providers/google.svg",
         },
         {
            id: "deepseek",
            name: "DeepSeek",
            icon: "/icons/providers/deepseek.svg",
         },
         {
            id: "grok",
            name: "Grok",
            icon: "/icons/providers/grok.svg",
         },
         
         {
            id: "qwen",
            name: "Qwen",
            icon: "/icons/providers/qwen.svg",
         },
         {
            id: "llama",
            name: "Llama",
            icon: "/icons/providers/llama.svg",
         },
         {
            id: "mistral",
            name: "Mistral",
            icon: "/icons/providers/mistral.svg",
         },
         
         {
            id: "kimi",
            name: "Kimi",
            icon: "/icons/providers/kimi.svg",
         },
         {
            id: "minimax",
            name: "MiniMax",
            icon: "/icons/providers/minimax.svg",
         },
         {
            id: "perplexity",
            name: "Perplexity",
            icon: "/icons/providers/perplexity.svg",
         },
         {
            id: "cohere",
            name: "Cohere",
            icon: "/icons/providers/cohere.svg",
         },
         {
            id: "yi",
            name: "Yi",
            icon: "/icons/providers/yi.svg",
         },
         {
            id: "ernie",
            name: "Ernie",
            icon: "/icons/providers/ernie.svg",
         },
         {
            id: "doubao",
            name: "Doubao",
            icon: "/icons/providers/doubao.svg",
         },
         {
            id: "hunyuan",
            name: "Hunyuan",
            icon: "/icons/providers/hunyuan.svg",
         },
      ],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
   {
      id: "apikey-fan-2",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
   {
      id: "apikey-fan-3",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
   {
      id: "apikey-fan-4",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
   {
      id: "apikey-fan-5",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
   {
      id: "apikey-fan-6",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "not-working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
   {
      id: "apikey-fan-7",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
   {
      id: "apikey-fan-8",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
   {
      id: "apikey-fan-9",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "not-working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
   {
      id: "apikey-fan-10",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
   {
      id: "apikey-fan-11",
      name: "APIKEY.FAN",
      description: "Единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
      age: "8 лет и 10 месяцев",
      verified: true,
      models: [],
      paymentMethods: ["WeChat", "Alibaba", "PayPal"],
      status: "working",
      reviews: {
         positive: 123,
         negative: 12,
      },
   },
];