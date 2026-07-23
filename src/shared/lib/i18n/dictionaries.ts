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
         tableView: "Table View",
      },
      table: {
         modelName: "Model Name",
         price: "Price (Input & Output & Off official price)",
         tags: "Tags",
         provider: "Provider",
         reviews: "Reviews",
         resizeColumn: "Resize column",
      },
   },

   groupBuys: {
      tabs: {
         groupBuys: "Group Buys",
         api: "API",
         video: "Video",
      },

      items: {
         gptTerraSharing: {
            title: "OpenAI API (GPT-5.6)",
            description:
               "High-performance and reliable access to advanced language models via a unified interface with minimal latency.",
         },
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
         tableView: "Таблица",
      },
      table: {
         modelName: "Название модели",
         price: "Цена (Вход, Выход и Дешевле от официальной)",
         tags: "Теги",
         provider: "Поставщик",
         reviews: "Отзывы",
         resizeColumn: "Изменить ширину столбца",
      },
   },

   groupBuys: {
      tabs: {
         groupBuys: "Складчины",
         api: "API",
         video: "Видео",
      },

      items: {
         gptTerraSharing: {
            title: "OpenAI API (GPT-5.6)",
            description:
               "Высокопроизводительный и надежный доступ к передовым языковым моделям через единый интерфейс с минимальной задержкой.",
         },
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
