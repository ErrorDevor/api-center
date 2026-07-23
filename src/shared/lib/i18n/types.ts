export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

export interface LocaleOption {
   value: Locale;
   shortLabel: string;
   label: string;
}
