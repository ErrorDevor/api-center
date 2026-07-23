"use client";

import React from "react";

import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from "./config";
import { dictionaries } from "./dictionaries";
import type { Dictionary } from "./dictionaries";
import type { Locale } from "./types";

interface I18nContextValue {
   locale: Locale;
   dictionary: Dictionary;
   setLocale: (locale: Locale) => void;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

interface Props {
   children: React.ReactNode;
}

export const I18nProvider: React.FC<Props> = ({ children }) => {
   const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);

   React.useEffect(() => {
      const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;

      if (storedLocale && storedLocale in dictionaries) {
         setLocaleState(storedLocale);
      }
   }, []);

   React.useEffect(() => {
      document.documentElement.lang = locale;
   }, [locale]);

   const setLocale = React.useCallback((nextLocale: Locale) => {
      setLocaleState(nextLocale);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
   }, []);

   const value = React.useMemo<I18nContextValue>(
      () => ({
         locale,
         dictionary: dictionaries[locale],
         setLocale,
      }),
      [locale, setLocale]
   );

   return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18nContext = () => {
   const context = React.useContext(I18nContext);

   if (!context) {
      throw new Error("useI18nContext must be used inside I18nProvider");
   }

   return context;
};
