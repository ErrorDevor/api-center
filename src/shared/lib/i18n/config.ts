import type { Locale, LocaleOption } from "./types";

export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALE_STORAGE_KEY = "api-center-locale";

export const localeOptions: LocaleOption[] = [
   {
      value: "en",
      shortLabel: "En",
      label: "English",
   },
   {
      value: "ru",
      shortLabel: "Ru",
      label: "Русский",
   },
];
