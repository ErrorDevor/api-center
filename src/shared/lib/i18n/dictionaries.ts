export const en = {
   common: {
      search: "Search",
      create: "Create",
      filter: "Filter",
      previous: "Previous",
      next: "Next",
      provider: "Provider",
      reviews: "Reviews",
      age: "Age",
      input: "Input",
      output: "Output",
      new: "New",
      top: "Top",
      participants: "Reviews of participants",
      sort: "Sort",
   },

   models: {
      discount: "{percent}% cheaper",

      items: {
         gptTerra: {
            description: "GPT-5.6 Terra is the flagship base model of the GPT-5.6 family",
         },
      },
   },

   header: {
      searchPlaceholder: "Search models...",
      language: "Language",
   },

   sidebar: {
      api: "API",
      groupBuys: "Group Buys",
      showMore: "Show more",
      showLess: "Show less",

      modelTypeTitle: "Model Type",
      forum: "Forum",
      discussions: "Discussions",

      modelTypes: {
         allTypes: "All Types",
         images: "Images",
         search: "Search",
         audioVideo: "Audio & Video",
         text: "Text",
         chat: "Chat",
      },
   },

   content: {
      results: "results",
      tabs: {
         allTypes: "All Types",
         image: "Image",
         new: "New",
         search: "Search",
         audioVideo: "Audio & Video",
         groupBuys: "Group Buys",
         api: "API",
         video: "Video",
      },
      actions: {
         tableView: "Sort",
      },
      table: {
         modelName: "Model Name",
         price: "Price (Input & Output & Off official price)",
         tags: "Tags",
         provider: "Provider",
         reviews: "Reviews",
         resizeColumn: "Resize column",
      },
      modelDescription: {
         title: "Cheap GPT-5.6 Terra API",
         text: "Offers for the GPT-5.6 Terra API from various providers and aggregators are displayed here. Compare input and output token prices, check support for the features you need, and choose the most cost-effective API route for connecting the model to an application, bot, SaaS product, or internal AI tool. The table helps you find GPT-5.6 Terra at a lower price than the official one and quickly navigate to a provider with suitable terms. You can compare available payment methods, provider ratings, reviews, service age, supported model capabilities, request limits, and other important conditions before choosing an API provider.",
         readMore: "Read more",
         showLess: "Show less",
      },
   },

   groupBuys: {
      tabs: {
         groupBuys: "Group Buys",
         api: "API",
         video: "Video",
      },

      reviewsTitle: "Reviews of participants",
      reply: "Reply",

      providerDetails: {
         link: "Link",
         age: "Age",
         paymentMethods: "Payment methods",
         rating: "Rating",
         reviews: "Reviews",
         showAll: "View all",
         topModelsPrices: "Top 10 model prices",
         modelName: "Model name",
         price: "Price",
         resizeColumn: "Resize column",
      },

      items: {
         gptTerraSharing: {
            title: "OpenAI API (GPT-5.6)",
            description:
               "High-performance and reliable access to advanced language models via a unified interface with minimal latency.",
         },

         yunwu: {
            title: "Yunwu",
            description:
               "Yunwu.ai - is an API gateway for developers that provides access to models from OpenAI, Claude, Gemini, and others through a single OpenAI-compatible endpoint. It works without a VPN, accepts payments via local methods (Alipay, WeChat), and offers prices lower than the official ones.",
            review:
               "Bought this, and I'm very satisfied! The price is 4 times lower than the original, and the seller is completely trustworthy.",
         },
      },

      actions: {
         like: "Like",
         dislike: "Dislike",
         favorite: "Add to favorites",
         share: "Share",
      },

      person: "person",
      persons: "persons",
      comment: "comment",
      comments: "comments",
   },

   pagination: {
      page: "Page",
      of: "of",
      previous: "Previous",
      next: "Next",
   },

   tags: {
      image: "Image",
      video: "Video",
   },

   providers: {
      age: "Age",
      reviews: "Reviews",

      items: {
         openRouter: {
            description:
               "OpenRouter is a unified API gateway for accessing AI models from different providers.",
         },
      },
   },
} as const;

type DeepStringValues<T> = {
   [Key in keyof T]: T[Key] extends string
      ? string
      : T[Key] extends Record<string, unknown>
        ? DeepStringValues<T[Key]>
        : T[Key];
};

export type Dictionary = DeepStringValues<typeof en>;

export const ru: Dictionary = {
   common: {
      search: "Поиск",
      create: "Создать",
      filter: "Фильтр",
      previous: "Назад",
      next: "Далее",
      provider: "Провайдер",
      reviews: "Отзывы",
      age: "Возраст",
      input: "Вход",
      output: "Выход",
      new: "Новое",
      top: "Топ",
      participants: "Отзывы участников",
      sort: "Сортировка",
   },

   models: {
      discount: "На {percent}% дешевле",

      items: {
         gptTerra: {
            description:
               "GPT-5.6 Sol — флагманская базовая модель серии GPT-5.6, соответствующая оригинальной базовой версии GPT-5 без суффикса.",
         },
      },
   },

   header: {
      searchPlaceholder: "Поиск моделей...",
      language: "Язык",
   },

   sidebar: {
      api: "API",
      groupBuys: "Складчины",
      showMore: "Показать ещё",
      showLess: "Скрыть",

      modelTypeTitle: "Тип модели",
      forum: "Форум",
      discussions: "Обсуждения",

      modelTypes: {
         allTypes: "Все типы",
         images: "Изображения",
         search: "Поиск",
         audioVideo: "Аудио и видео",
         text: "Текст",
         chat: "Чат",
      },
   },

   content: {
      results: "результатов",
      tabs: {
         allTypes: "Все типы",
         image: "Изображения",
         new: "Новинки",
         search: "Поиск",
         audioVideo: "Аудио и видео",
         groupBuys: "Складчины",
         api: "API",
         video: "Видео",
      },
      actions: {
         tableView: "Сортировка",
      },
      table: {
         modelName: "Название модели",
         price: "Цена (Вход, Выход и Дешевле от официальной)",
         tags: "Теги",
         provider: "Поставщик",
         reviews: "Отзывы",
         resizeColumn: "Изменить ширину столбца",
      },
      modelDescription: {
         title: "Дешевый GPT-5.6 Terra API",
         text: "Здесь показаны предложения GPT-5.6 Terra API от разных поставщиков и агрегаторов. Сравните цену входных и выходных токенов, проверьте поддержку нужных функций и выберите самый выгодный API-маршрут для подключения модели к приложению, боту, SaaS-продукту или внутреннему AI-инструменту. Таблица помогает найти GPT-5.6 Terra дешевле официальной цены и быстро перейти к поставщику с подходящими условиями. Здесь показаны предложения GPT-5.6 Terra API от разных поставщиков и агрегаторов. Сравните цену входных и выходных токенов, проверьте поддержку нужных функций и выберите самый выгодный API-маршрут для подключения модели к приложению, боту, SaaS-продукту или внутреннему AI-инструменту. Таблица помогает найти GPT-5.6 Terra дешевле официальной цены и быстро перейти к поставщику с подходящими условиями",
         readMore: "Читать далее",
         showLess: "Скрыть",
      },
   },

   groupBuys: {
      tabs: {
         groupBuys: "Складчины",
         api: "API",
         video: "Видео",
      },

      reviewsTitle: "Отзывы участников",
      reply: "Ответить",

      providerDetails: {
         link: "Ссылка",
         age: "Возраст",
         paymentMethods: "Способы оплаты",
         rating: "Оценка",
         reviews: "Отзывы",
         showAll: "Смотреть все",
         topModelsPrices: "Цены топ-10 моделей",
         modelName: "Название модели",
         price: "Цена",
         resizeColumn: "Изменить ширину колонки",
      },

      items: {
         gptTerraSharing: {
            title: "OpenAI API (GPT-5.6)",
            description:
               "Высокопроизводительный и надежный доступ к передовым языковым моделям через единый интерфейс с минимальной задержкой.",
         },

         yunwu: {
            title: "Yunwu",
            description:
               "Yunwu.ai — API-шлюз для разработчиков, который даёт доступ к моделям OpenAI, Claude, Gemini и другим через единый OpenAI-совместимый эндпоинт. Работает без VPN, принимает оплату через локальные методы (Alipay, WeChat), цены ниже официальных.",
            review:
               "Купил доступ и остался очень доволен! Цена в 4 раза ниже официальной, а продавцу можно полностью доверять.",
         },
      },

      actions: {
         like: "Нравится",
         dislike: "Не нравится",
         favorite: "Добавить в избранное",
         share: "Поделиться",
      },

      person: "участник",
      persons: "участников",
      comment: "комментарий",
      comments: "комментариев",
   },

   pagination: {
      page: "Страница",
      of: "из",
      previous: "Назад",
      next: "Далее",
   },

   tags: {
      image: "Изображение",
      video: "Видео",
   },

   providers: {
      age: "Возраст",
      reviews: "Отзывы",

      items: {
         openRouter: {
            description:
               "OpenRouter — единый API-шлюз для доступа к AI-моделям от разных провайдеров.",
         },
      },
   },
};

export const dictionaries = {
   en,
   ru,
};
