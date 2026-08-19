import type { Locale } from "./types";

const localeMap: Record<Locale, string> = {
   en: "en-US",
   ru: "ru-RU",
};

export interface ProviderAge {
   years: number;
   months: number;
}

const DAYS_PER_YEAR = 365;
const DAYS_PER_MONTH = 30;

// Converts providers.json's domain_age_days (a whois-derived day count)
// into the {years, months} shape formatProviderAge already expects —
// calendar-approximate (365/30-day years/months), same as any other
// "X years, Y months" age display.
export const daysToProviderAge = (days: number): ProviderAge => {
   const wholeDays = Math.max(0, Math.floor(days));

   return {
      years: Math.floor(wholeDays / DAYS_PER_YEAR),
      months: Math.floor((wholeDays % DAYS_PER_YEAR) / DAYS_PER_MONTH),
   };
};

export const formatRelativeDate = (value: string | Date, locale: Locale) => {
   const date = new Date(value);

   const differenceInSeconds = Math.round((date.getTime() - Date.now()) / 1000);

   const formatter = new Intl.RelativeTimeFormat(localeMap[locale], {
      numeric: "auto",
   });

   const absoluteSeconds = Math.abs(differenceInSeconds);

   if (absoluteSeconds < 60) {
      return formatter.format(differenceInSeconds, "second");
   }

   const differenceInMinutes = Math.round(differenceInSeconds / 60);

   if (Math.abs(differenceInMinutes) < 60) {
      return formatter.format(differenceInMinutes, "minute");
   }

   const differenceInHours = Math.round(differenceInMinutes / 60);

   if (Math.abs(differenceInHours) < 24) {
      return formatter.format(differenceInHours, "hour");
   }

   const differenceInDays = Math.round(differenceInHours / 24);

   return formatter.format(differenceInDays, "day");
};

export const formatPersons = (count: number, locale: Locale) => {
   if (locale === "en") {
      return `${count} ${count === 1 ? "person" : "persons"}`;
   }

   const pluralRule = new Intl.PluralRules("ru-RU").select(count);

   const labels: Record<Intl.LDMLPluralRule, string> = {
      zero: "участников",
      one: "участник",
      two: "участника",
      few: "участника",
      many: "участников",
      other: "участников",
   };

   return `${count} ${labels[pluralRule]}`;
};

export const formatComments = (count: number, locale: Locale) => {
   if (locale === "en") {
      return `${count} `;
   }

   return `${count} `;
};

const formatUnit = (
   value: number,
   locale: Locale,
   forms: {
      en: [string, string];
      ru: [string, string, string];
   }
): string => {
   if (locale === "en") {
      const unit = value === 1 ? forms.en[0] : forms.en[1];

      return `${value} ${unit}`;
   }

   const mod10 = value % 10;
   const mod100 = value % 100;

   let unit = forms.ru[2];

   if (mod10 === 1 && mod100 !== 11) {
      unit = forms.ru[0];
   } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      unit = forms.ru[1];
   }

   return `${value} ${unit}`;
};

export const formatProviderAge = (age: ProviderAge, locale: Locale): string => {
   const parts: string[] = [];

   if (age.years > 0) {
      parts.push(
         formatUnit(age.years, locale, {
            en: ["year", "years"],
            ru: ["год", "года", "лет"],
         })
      );
   }

   if (age.months > 0) {
      parts.push(
         formatUnit(age.months, locale, {
            en: ["month", "months"],
            ru: ["месяц", "месяца", "месяцев"],
         })
      );
   }

   return parts.join(locale === "ru" ? " и " : " and ");
};
