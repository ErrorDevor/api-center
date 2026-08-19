export const en = {
   common: {
      search: "Search",
      create: "Create",
      menu: "Menu",
      newPost: "New topic",
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
      feedback: "Feedback",
      login: "Log In",
      signup: "Sign Up",
      logout: "Log Out",
      addProvider: "Add provider",
      replyPlaceholder: "Post your reply",
      buttonText: "Reply",
   },

   models: {
      discount: "{percent}% cheaper",
      discountTooltip: "How much cheaper this provider sells than the official API price",
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
      catalogTitle: "AI API providers",
      results: "results",
      tabs: {
         crypto: "Crypto",
         paymentToAccount: "Payment to account",
         freeTest: "Free test",
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
         emptyState: "No models found",
         descriptionUnavailable: "No description available yet",
      },
      modelDescription: {
         title: "Cheap {provider} API",
         text: "Offers for {provider} API from various providers and aggregators are displayed here. Compare input and output token prices, check support for the features you need, and choose the most cost-effective API route for connecting a model to an application, bot, SaaS product, or internal AI tool. The table helps you find a model cheaper than the official price and quickly navigate to a provider with suitable terms. You can compare available payment methods, provider ratings, reviews, service age, supported model capabilities, request limits, and other important conditions before choosing an API provider.",
         defaultProvider: "AI",
         readMore: "Read more",
         showLess: "Show less",
      },
   },

   groupBuys: {
      tabs: {
         coding: "Coding",
         chat: "Chat",
         image: "Image",
         video: "Video",
         audio: "Audio",
         others: "Others",
      },

      reviewsTitle: "Reviews of participants",
      reply: "Reply",
      hideReplies: "Hide replies",
      viewReplies: "View {count} replies",
      noReviewsYet: "No reviews yet — be the first to leave one.",
      loadError: "Couldn't load reviews. Please try again later.",

      sentimentTabs: {
         all: "All",
         positive: "Positive",
         negative: "Negative",
      },

      noProviderSelected: {
         title: "No provider selected",
         description: "Open a provider from the Home page to see its reviews.",
      },

      leaveReview: {
         title: "Leave a review",
         placeholder: "Share your experience with this provider",
         submit: "Post review",
         positive: "Positive",
         negative: "Negative",
      },

      providerDetails: {
         link: "Link",
         age: "Age",
         paymentMethods: "Payment methods",
         positiveRatio: "Positive",
         reviews: "Reviews",
         showAll: "See all",
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
         share: "Share",
      },

      forPeople: "For {count} people",
      seatsTaken: "{taken} of {total} already taken",
      forOnePerson: "for one person",

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

   pricesTooltip: {
      title: "Prices",

      groups: {
         quickSelect: "Quick selection",
         cards: "Cards",
      },

      options: {
         anyCrypto: "Any crypto",
         anyCard: "Any card",
         anyWallet: "Any wallet",
         bankTransfer: "Bank transfer",
         visa: "Visa",
         mastercard: "Mastercard",
         wechat: "WeChat",
         alipay: "Alipay",
      },
   },

   sortDropdown: {
      newest: "Newest first",
      popular: "Most popular first",
      positive: "Positive first",
      negative: "Negative first",
      mostReplies: "Most replies",
   },

   filterDropdown: {
      title: "Account type",
      buttonShow: "Show",
      buttonCancel: "Reset",
      price: "Price per seat",
      status: "Status",
      payment: "Payment methods",
      choosePayment: "Choose methods",
      active: "Active — seats available",
   },

   freeTest: {
      title: "Free trial",
      trial: "Trial available before deposit",
      rating: "Rating",
      reviews: "Minimum reviews",
      payment: "Payment methods",
      choosePayment: "Choose methods",

      ratingOptions: {
         any: "Any",
         five: "5 stars",
         four: "4 stars or higher",
         three: "3 stars or higher",
      },

      reviewsOptions: {
         any: "Any number",
         ten: "10 or more reviews",
         twentyFive: "25 or more reviews",
         fifty: "50 or more reviews",
         hundred: "100 or more reviews",
      },
   },

   paymentMethodsModal: {
      title: "Payment methods",
      close: "Close payment methods",
      searchPlaceholder: "WeChat, Alipay, USDT, UOI...",
      regionsLabel: "Payment method regions",
      selected: "Selected",
      apply: "Apply ({count})",
      nothingFound: "No payment methods found",

      groups: {
         quickSelect: "Quick selection",
         cards: "Cards",
      },

      regions: {
         all: "All",
         global: "Global",
         europe: "Europe",
         asia: "Asia",
         middleEast: "Middle East",
         latinAmerica: "Latin America",
         africa: "Africa",
         cis: "CIS",
      },

      methods: {
         anyCrypto: "Any crypto",
         anyCard: "Any card",
         anyWallet: "Any wallet",
         bankTransfer: "Bank transfer",
         visa: "Visa",
         mastercard: "Mastercard",
         unionPay: "UnionPay",
         americanExpress: "American Express",
         wechat: "WeChat",
         alipay: "Alipay",
         usdt: "USDT",
         uoi: "UOI",
      },
   },

   onboarding: {
      common: {
         close: "Close onboarding",
         back: "Go back",
         previous: "Previous",
         next: "Next",
         or: "or",
         telegram: "Continue with Telegram",
         genericError: "Something went wrong. Please try again.",
         networkError: "Network error. Please check your connection and try again.",
      },

      roleSelector: {
         title: "Welcome to the platform for AI access distribution",
         description: "Choose which account you want to create.",
         createGroupBuy: "Create group buy",
         joinExisting: "Join existing",
         create: "Create",
         accountType: "Account type",
      },

      distribution: {
         addAccount: {
            title: "Add your account",
            description: "Add your accounts for sharing in the system.",
         },

         setLimits: {
            title: "Set limits",
            description: "Configuring limits for $n$ people for secure access.",
         },

         securityIsolation: {
            title: "Security & Isolation",
            description:
               "Everything works from a single IP and fingerprint, the system doesn't see local files.",
         },
      },

      recipient: {
         singleDevice: {
            title: "Single Device",
            description:
               "The system emulates one device for everyone, so you get one shared API key.",
         },

         yourSoftware: {
            title: "Your Software",
            description: "You can continue using your software: Claude Desktop, Codex, Cursor.",
         },

         privacy: {
            title: "Privacy",
            description:
               "It doesn't send local files to the server or through the API, and no one sees your data.",
         },
      },

      registration: {
         title: "Let's create your profile",
         email: "Email *",
         userName: "Enter username *",
         password: "Password *",
         submit: "Create account",
         close: "Close registration",
      },

      login: {
         title: "Sign in to your account",
         email: "Email *",
         password: "Password *",
         submit: "Sign In",
         close: "Close login",
      },

      password: {
         show: "Show password",
         hide: "Hide password",
      },

      terms: {
         prefix: "I agree with the",
         termsAndConditions: "Terms & Conditions",
         conjunction: "and",
         contractOffer: "The contract offer",
      },
   },

   createPost: {
      postTypes: {
         discussion: "Discussion",
         model: "Model",
      },

      fields: {
         title: "Title",
         titlePlaceholder: "Write your topic title and description...",
         descriptionPlaceholder: "Write your topic title and description...",
         modelPlaceholder: "Model",
         pricePlaceholder: "Enter price",
         personsPlaceholder: "Enter number of people",
         postType: "Post type",
      },

      actions: {
         addImage: "Add image",
         addEmoji: "Add emoji",
         addTags: "Add tags",
         publish: "Publish",
      },

      validation: {
         titleRequired: "Enter a title",
         descriptionRequired: "Enter a description",
         modelRequired: "Select a model",
         priceRequired: "Enter a price",
         personsRequired: "Enter the number of people",
      },
   },

   rating: {
      title: "Top best AI in the category",

      categories: {
         programming: {
            title: "Best AI for programming",
            description: "Code generation and debugging",
         },
         texts: {
            title: "Best AI for writing",
            description: "Content creation and creative writing",
         },
         research: {
            title: "Best AI for research",
            description: "Analysis and reasoning tasks",
         },
         images: {
            title: "Best AI for image generation",
            description: "Text-to-image generation models",
         },
      },

      tabs: {
         text: "Text",
         coding: "Coding",
         video: "Video",
         audio: "Audio",
         image: "Images",
      },

      explore: {
         badge: "Model overview",
         title: "Explore category leaderboards",
         description: "Find the best model for your task — by capability, modality, or industry.",

         groups: {
            capabilities: "By capability",
            modality: "By modality",
            industries: "By industry",
         },

         items: {
            coding: {
               title: "Coding",
               description: "Code generation and debugging",
            },
            reasoning: {
               title: "Reasoning",
               description: "Logic, planning, and problem solving",
            },
            research: {
               title: "Research",
               description: "Analysis and reasoning tasks",
            },
            tools: {
               title: "Tool calling",
               description: "Function calling and tool usage",
            },
            writing: {
               title: "Writing",
               description: "Content creation and creative writing",
            },
            context: {
               title: "Long context",
               description: "Understanding long context",
            },
            chat: {
               title: "Chat",
               description: "Conversation and instruction following",
            },

            speech: {
               title: "Speech",
               description: "Text-to-speech and voice synthesis",
            },
            computerUse: {
               title: "Computer use",
               description: "PC and browser automation",
            },
            videoGeneration: {
               title: "Video generation",
               description: "AI video generation and editing",
            },
            transcription: {
               title: "Transcription",
               description: "Speech recognition and audio-to-text",
            },
            imageUnderstanding: {
               title: "Image understanding",
               description: "Visual perception and image analysis",
            },
            imageGeneration: {
               title: "Image generation",
               description: "Text-to-image generation models",
            },

            law: {
               title: "Law",
               description: "Legal knowledge and jurisprudence",
            },
            roleplay: {
               title: "Roleplay",
               description: "Character and role simulation",
            },
            math: {
               title: "Math & Science",
               description: "Mathematical reasoning and problem solving",
            },
            finance: {
               title: "Finance & Accounting",
               description: "Financial analysis and economic reasoning",
            },
            healthcare: {
               title: "Healthcare",
               description: "Medical knowledge and healthcare domains",
            },
         },
      },
      table: {
         rating: "Rating",
         modelName: "Model name",
         tts: "TTS",
         speed: "Speed",
         latency: "Latency",
         pricePerMillion: "$ / 1M",
         license: "License",
         sortTts: "Sort by TTS",
         resizeColumn: "Resize column",
      },
      about: {
         overview: {
            title: "Comprehensive AI model rating, comparison, and analytics platform",
            description:
               "This page is an advanced rating and comparison hub designed for professionals, developers, researchers, and digital content creators who use artificial intelligence (AI) technologies. In a rapidly evolving digital world, choosing the right tool is critical for saving both time and budget. This page allows users to analyze products from leading global AI providers in depth and select the model that best fits their tasks.",
         },

         providers: {
            title: "Global providers and model diversity",
            intro: "Leading global artificial intelligence developers and their models are systematically grouped in the navigation panel and throughout the platform:",
            google:
               "Google, OpenAI and DeepSeek: Industry-leading flagship models capable of handling complex reasoning tasks, large-volume text processing, and deep analytics.",
            alternatives:
               "Anthropic, xAI, Minimax, ChatGLM and Grok: Alternative high-performance and innovative AI solutions specializing in different areas.",
            outro: "Hundreds of models can be filtered by different categories, including all types, images, search, audio, video, text, and chat, allowing users to find the right model more precisely.",
         },

         categories: {
            title: "Main AI categories and use cases",
            intro: "The quick-access panel at the top of the platform and the sections below classify models by their functionality:",
            programming:
               "Programming and coding: The best AI models for automatic code generation, finding and fixing errors (debugging), and software development.",
            writing:
               "Text and creative writing: Tools for creating high-quality content, editing text, creative writing, and brand communications.",
            research:
               "Research and analysis: Specialized models for analyzing complex data, scientific research, and solving analytical reasoning tasks.",
            media: "Media, graphics and audio: Services for image generation, visual understanding, video editing, speech synthesis (TTS), and transcription.",
         },

         metrics: {
            title: "Technical metrics and transparent comparison table",
            intro: "The category leaderboard displays detailed metrics required for an objective evaluation of each model's performance:",
            ranking:
               "Ranking position: Sequential model ranking based on overall performance and user feedback.",
            model: "Model name and description: Flagship base models, such as GPT-5.6 Terra, together with a short description.",
            tts: "TTS and speed (c/s): Speech synthesis capabilities and character processing speed per second.",
            latency:
               "Latency (ms): Response delay in milliseconds, indicating how quickly the model responds to a request.",
            price: "Pricing ($ / 1M): Cost per one million tokens.",
            license: "License status: Usage rights and model availability indicators.",
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
      menu: "Меню",
      newPost: "Новая Тема",
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
      feedback: "Оставить отзыв",
      login: "Войти",
      signup: "Зарегистрироваться",
      logout: "Выйти",
      addProvider: "Добавить провайдер",
      replyPlaceholder: "Post your reply",
      buttonText: "Ответить",
   },

   models: {
      discount: "На {percent}% дешевле",
      discountTooltip: "Насколько этот поставщик продаёт дешевле официальной цены API",
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
      catalogTitle: "AI API провайдеры",
      results: "результатов",
      tabs: {
         crypto: "Крипта",
         paymentToAccount: "Оплата на счёт",
         freeTest: "Бесплатный тест",
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
         emptyState: "Модели не найдены",
         descriptionUnavailable: "Описание пока недоступно",
      },
      modelDescription: {
         title: "Дешёвый {provider} API",
         text: "Здесь показаны предложения {provider} API от разных поставщиков и агрегаторов. Сравните цену входных и выходных токенов, проверьте поддержку нужных функций и выберите самый выгодный API-маршрут для подключения модели к приложению, боту, SaaS-продукту или внутреннему AI-инструменту. Таблица помогает найти модель дешевле официальной цены и быстро перейти к поставщику с подходящими условиями. Вы можете сравнить доступные способы оплаты, рейтинг поставщика, отзывы, возраст сервиса, поддерживаемые возможности модели, лимиты запросов и другие важные условия перед выбором API-провайдера.",
         defaultProvider: "AI",
         readMore: "Читать далее",
         showLess: "Скрыть",
      },
   },

   groupBuys: {
      tabs: {
         coding: "Coding",
         chat: "Чат",
         image: "Изображение",
         video: "Видео",
         audio: "Аудио",
         others: "Другое",
      },

      reviewsTitle: "Отзывы участников",
      reply: "Ответить",
      hideReplies: "Скрыть ответы",
      viewReplies: "Показать ответы ({count})",
      noReviewsYet: "Пока нет отзывов — оставьте первый.",
      loadError: "Не удалось загрузить отзывы. Попробуйте позже.",

      sentimentTabs: {
         all: "Все",
         positive: "Положительные",
         negative: "Отрицательные",
      },

      noProviderSelected: {
         title: "Провайдер не выбран",
         description: "Откройте провайдера на главной странице, чтобы увидеть его отзывы.",
      },

      leaveReview: {
         title: "Оставить отзыв",
         placeholder: "Поделитесь впечатлением об этом провайдере",
         submit: "Опубликовать отзыв",
         positive: "Положительный",
         negative: "Отрицательный",
      },

      providerDetails: {
         link: "Ссылка",
         age: "Возраст",
         paymentMethods: "Способы оплаты",
         positiveRatio: "Положительные",
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
         share: "Поделиться",
      },

      forPeople: "Для {count} человек",
      seatsTaken: "занято {taken} из {total}",
      forOnePerson: "с человека",

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

   pricesTooltip: {
      title: "Цены",

      groups: {
         quickSelect: "Быстрый выбор",
         cards: "Карты",
      },

      options: {
         anyCrypto: "Любая крипта",
         anyCard: "Любая карта",
         anyWallet: "Любой кошелёк",
         bankTransfer: "Банковский перевод",
         visa: "Visa",
         mastercard: "Mastercard",
         wechat: "WeChat",
         alipay: "Alipay",
      },
   },

   sortDropdown: {
      newest: "Сначала новые",
      popular: "Сначала популярные",
      positive: "Сначала положительные",
      negative: "Сначала отрицательные",
      mostReplies: "Больше всего ответов",
   },

   filterDropdown: {
      title: "Тип аккаунта",
      buttonShow: "Показать",
      buttonCancel: "Сбросить",
      price: "Цена за место",
      status: "Статус",
      payment: "Способы оплаты",
      choosePayment: "Выбрать способы",
      active: "Активна — есть места",
   },

   freeTest: {
      title: "Бесплатный тест",
      trial: "Есть триал до депозита",
      rating: "Рейтинг",
      reviews: "Минимум отзывов",
      payment: "Способы оплаты",
      choosePayment: "Выбрать способы",

      ratingOptions: {
         any: "Любой",
         five: "5 звёзд",
         four: "От 4 звёзд",
         three: "От 3 звёзд",
      },

      reviewsOptions: {
         any: "Любое количество",
         ten: "От 10 отзывов",
         twentyFive: "От 25 отзывов",
         fifty: "От 50 отзывов",
         hundred: "От 100 отзывов",
      },
   },

   paymentMethodsModal: {
      title: "Способы оплаты",
      close: "Закрыть способы оплаты",
      searchPlaceholder: "WeChat, Alipay, USDT, UOI...",
      regionsLabel: "Регионы способов оплаты",
      selected: "Выбрано",
      apply: "Применить ({count})",
      nothingFound: "Способы оплаты не найдены",

      groups: {
         quickSelect: "Быстрый выбор",
         cards: "Карты",
      },

      regions: {
         all: "Все",
         global: "Глобальные",
         europe: "Европа",
         asia: "Азия",
         middleEast: "Бл. Восток",
         latinAmerica: "Лат. Америка",
         africa: "Африка",
         cis: "СНГ",
      },

      methods: {
         anyCrypto: "Любая крипта",
         anyCard: "Любая карта",
         anyWallet: "Любой кошелёк",
         bankTransfer: "Банковский перевод",
         visa: "Visa",
         mastercard: "Mastercard",
         unionPay: "UnionPay",
         americanExpress: "American Express",
         wechat: "WeChat",
         alipay: "Alipay",
         usdt: "USDT",
         uoi: "UOI",
      },
   },

   onboarding: {
      common: {
         close: "Закрыть онбординг",
         back: "Вернуться назад",
         previous: "Назад",
         next: "Далее",
         or: "или",
         telegram: "Продолжить через Telegram",
         genericError: "Что-то пошло не так. Попробуйте ещё раз.",
         networkError: "Ошибка сети. Проверьте подключение и попробуйте ещё раз.",
      },

      roleSelector: {
         title: "Добро пожаловать на платформу распределения доступа к ИИ",
         description: "Выберите, какой аккаунт вы хотите создать.",
         createGroupBuy: "Создать складчину",
         joinExisting: "Присоединиться к существующей",
         create: "Создать",
         accountType: "Тип аккаунта",
      },

      distribution: {
         addAccount: {
            title: "Добавьте свой аккаунт",
            description: "Добавьте свои аккаунты для совместного использования в системе.",
         },

         setLimits: {
            title: "Установите лимиты",
            description: "Настройка лимитов для $n$ пользователей для безопасного доступа.",
         },

         securityIsolation: {
            title: "Безопасность и изоляция",
            description:
               "Всё работает с единого IP-адреса и отпечатка, система не видит локальные файлы.",
         },
      },

      recipient: {
         singleDevice: {
            title: "Одно устройство",
            description:
               "Система эмулирует одно устройство для всех, поэтому вы получаете один общий ключ API.",
         },

         yourSoftware: {
            title: "Ваши программы",
            description:
               "Вы можете продолжать использовать своё ПО: Claude Desktop, Codex, Cursor.",
         },

         privacy: {
            title: "Конфиденциальность",
            description:
               "Система не передаёт локальные файлы на сервер или через API, и никто не видит ваши данные.",
         },
      },

      registration: {
         title: "Давайте создадим ваш профиль",
         email: "Email *",
         userName: "Укажите имя пользователя *",
         password: "Пароль *",
         submit: "Создать аккаунт",
         close: "Закрыть регистрацию",
      },

      login: {
         title: "Войдите в свой аккаунт",
         email: "Email *",
         password: "Пароль *",
         submit: "Войти",
         close: "Закрыть окно входа",
      },

      password: {
         show: "Показать пароль",
         hide: "Скрыть пароль",
      },

      terms: {
         prefix: "Я согласен с",
         termsAndConditions: "Условиями и положениями",
         conjunction: "и",
         contractOffer: "Договором оферты",
      },
   },

   createPost: {
      postTypes: {
         discussion: "Обсуждение",
         model: "Модель",
      },

      fields: {
         title: "Заголовок",
         titlePlaceholder: "Напишите заголовок и описание темы...",
         descriptionPlaceholder: "Напишите заголовок и описание темы...",
         modelPlaceholder: "Модель",
         pricePlaceholder: "Введите цену",
         personsPlaceholder: "Введите количество человек",
         postType: "Тип публикации",
      },

      actions: {
         addImage: "Добавить изображение",
         addEmoji: "Добавить эмодзи",
         addTags: "Добавить теги",
         publish: "Опубликовать",
      },

      validation: {
         titleRequired: "Введите заголовок",
         descriptionRequired: "Введите описание",
         modelRequired: "Выберите модель",
         priceRequired: "Введите цену",
         personsRequired: "Введите количество человек",
      },
   },

   rating: {
      title: "Tоп лучших ии в категории",

      categories: {
         programming: {
            title: "Лучший ИИ для программирования",
            description: "Генерация кода и отладка",
         },
         texts: {
            title: "Лучший ИИ для текстов",
            description: "Создание контента и креативное письмо",
         },
         research: {
            title: "Лучший ИИ для исследований",
            description: "Задачи анализа и логического мышления",
         },
         images: {
            title: "Лучший ИИ для генерации изображений",
            description: "Модели преобразования текста в изображения",
         },
      },

      tabs: {
         text: "Текст",
         coding: "Кодинг",
         video: "Видео",
         audio: "Аудио",
         image: "Картинки",
      },

      explore: {
         badge: "Обзор моделей",
         title: "Исследовать таблицы лидеров по категориям",
         description:
            "Найдите лучшую модель для задачи — по возможностям, модальности или отрасли.",

         groups: {
            capabilities: "По возможностям",
            modality: "По модальности",
            industries: "По отраслям",
         },

         items: {
            coding: {
               title: "Кодинг",
               description: "Генерация кода и отладка",
            },
            reasoning: {
               title: "Логические рассуждения",
               description: "Логика, планирование и решение задач",
            },
            research: {
               title: "Исследования",
               description: "Задачи анализа и логического мышления",
            },
            tools: {
               title: "Вызов инструментов",
               description: "Вызов функций и использование инструментов",
            },
            writing: {
               title: "Создание текстов",
               description: "Создание контента и креативное письмо",
            },
            context: {
               title: "Большой контекст",
               description: "Понимание длинного контекста",
            },
            chat: {
               title: "Чат",
               description: "Диалог и следование инструкциям",
            },

            speech: {
               title: "Речь",
               description: "Синтез речи из текста и голосовой синтез",
            },
            computerUse: {
               title: "Использование компьютера",
               description: "Автоматизация работы ПК и браузера",
            },
            videoGeneration: {
               title: "Генерация видео",
               description: "ИИ-генерация и редактирование видео",
            },
            transcription: {
               title: "Транскрипция",
               description: "Распознавание речи и перевод аудио в текст",
            },
            imageUnderstanding: {
               title: "Понимание изображений",
               description: "Визуальное восприятие и анализ изображений",
            },
            imageGeneration: {
               title: "Генерация изображений",
               description: "Модели преобразования текста в изображения",
            },

            law: {
               title: "Юриспруденция",
               description: "Юридические знания и правоведение",
            },
            roleplay: {
               title: "Ролевые игры",
               description: "Симуляция персонажей и ролей",
            },
            math: {
               title: "Математика и науки",
               description: "Математические рассуждения и решение задач",
            },
            finance: {
               title: "Финансы и бухгалтерия",
               description: "Финансовый анализ и экономические рассуждения",
            },
            healthcare: {
               title: "Здравоохранение",
               description: "Медицинские знания и сферы здравоохранения",
            },
         },
      },

      table: {
         rating: "Рейтинг",
         modelName: "Название модели",
         tts: "TTS",
         speed: "Скорость",
         latency: "Задержка",
         pricePerMillion: "$ / 1M",
         license: "Лицензия",
         sortTts: "Сортировать по TTS",
         resizeColumn: "Изменить ширину колонки",
      },
      about: {
         overview: {
            title: "Комплексный рейтинг, сравнение и аналитическая платформа моделей искусственного интеллекта (ИИ)",
            description:
               "Представленная страница представляет собой передовой центр рейтингов и сравнения, специально разработанный для специалистов, программистов, исследователей и создателей цифрового контента, использующих технологии искусственного интеллекта (ИИ). В быстро развивающемся цифровом мире выбор правильного инструмента критически важен для экономии как времени, так и бюджета. Данная страница позволяет пользователям глубоко анализировать продукты ведущих мировых провайдеров ИИ и выбирать наиболее подходящую модель под свои задачи.",
         },

         providers: {
            title: "Глобальные провайдеры и разнообразие моделей",
            intro: "В левой части страницы и на панели навигации систематически сгруппированы ведущие мировые разработчики искусственного интеллекта и предлагаемые ими модели:",
            google:
               "Google, OpenAI и DeepSeek: Передовые модели, являющиеся флагманами индустрии, которые справляются со сложными логическими задачами, обработкой текстов большого объема и глубокой аналитикой.",
            alternatives:
               "Anthropic, xAI, Minimax, ChatGLM и Grok: Альтернативные и высокопроизводительные инновационные ИИ-решения, специализирующиеся в различных областях.",
            outro: "На странице сотни моделей могут фильтроваться по различным категориям (все типы, изображения, поиск, аудио, видео, текст и чаты), что обеспечивает пользователю возможность точного поиска.",
         },

         categories: {
            title: "Основные категории ИИ и направления использования",
            intro: "Панель быстрых переходов в верхней части платформы и разделы ниже представляют классификацию моделей по их функционалу:",
            programming:
               "Программирование и кодинг: Лучшие ИИ-модели для автоматической генерации кода, поиска и исправления ошибок (отладки), а также разработки программного обеспечения.",
            writing:
               "Текст и креативное письмо: Инструменты для создания качественного контента, редактирования текста, творческого письма и бренд-коммуникаций.",
            research:
               "Исследования и анализ: Специализированные модели для анализа сложных данных, научных исследований и решения аналитических логических задач.",
            media: "Медиа, графика и звук: Сервисы генерации изображений, визуального восприятия, редактирования видео, синтеза речи (TTS) и транскрипции.",
         },

         metrics: {
            title: "Технические показатели и прозрачная таблица сравнения",
            intro: "Таблица «Топ лучших ИИ в категории» отображает детальные метрики, необходимые для объективной оценки производительности каждой модели:",
            ranking:
               "Номер рейтинга: Последовательное ранжирование моделей на основе общей производительности и пользовательских отзывов.",
            model: "Название модели и характеристика: Базовые флагманские модели (например, GPT-5.6 Terra) и их краткое описание.",
            tts: "TTS и скорость (с/с): Возможности синтеза речи модели и скорость обработки символов в секунду.",
            latency:
               "Задержка (мс): Время задержки в миллисекундах, определяющее скорость ответа на запрос.",
            price: "Ценовая политика ($ / 1M): Стоимость за 1 миллион токенов.",
            license: "Статус лицензии: Метки прав на использование модели и доступности.",
         },
      },
   },
};

export const dictionaries = {
   en,
   ru,
};
