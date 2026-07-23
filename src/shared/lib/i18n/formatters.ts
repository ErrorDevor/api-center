import type { Locale } from "./types";

const localeMap: Record<Locale, string> = {
   en: "en-US",
   ru: "ru-RU",
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

export const formatProviderAge = (years: number, months: number, locale: Locale) => {
   const yearsFormatter = new Intl.NumberFormat(localeMap[locale], {
      style: "unit",
      unit: "year",
      unitDisplay: "long",
   });

   const monthsFormatter = new Intl.NumberFormat(localeMap[locale], {
      style: "unit",
      unit: "month",
      unitDisplay: "long",
   });

   const formattedYears = yearsFormatter.format(years);
   const formattedMonths = monthsFormatter.format(months);

   if (years > 0 && months > 0) {
      return locale === "ru"
         ? `${formattedYears} и ${formattedMonths}`
         : `${formattedYears} and ${formattedMonths}`;
   }

   if (years > 0) {
      return formattedYears;
   }

   return formattedMonths;
};
