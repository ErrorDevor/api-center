import { sendGAEvent } from "@next/third-parties/google";

// Thin wrappers around GA4's gtag event calls (see @next/third-parties'
// `sendGAEvent`, backed by the `<GoogleAnalytics gaId="G-DS3V7S0NC9" />`
// mounted in the root layout). One function per event this product tracks —
// keeps the event name/param shape in one place instead of scattered
// `sendGAEvent` calls with hand-typed strings at every call site.

export const gaTrackSearch = (searchTerm: string): void => {
   if (!searchTerm) {
      return;
   }

   sendGAEvent("event", "search", { search_term: searchTerm });
};

export const gaTrackFilterApply = (filterType: string, filterValue: string): void => {
   sendGAEvent("event", "filter_apply", { filter_type: filterType, filter_value: filterValue });
};

export const gaTrackProviderClick = (providerName: string, modelName?: string): void => {
   sendGAEvent("event", "provider_click", { provider_name: providerName, model_name: modelName });
};

export const gaTrackSignupClick = (): void => {
   sendGAEvent("event", "signup_click");
};

export const gaTrackLoginClick = (): void => {
   sendGAEvent("event", "login_click");
};

export const gaTrackAddProviderClick = (): void => {
   sendGAEvent("event", "add_provider_click");
};

export const gaTrackCurrencyChange = (currency: string): void => {
   sendGAEvent("event", "currency_change", { currency });
};

export const gaTrackLanguageChange = (language: string): void => {
   sendGAEvent("event", "language_change", { language });
};
