import { useI18nContext } from "./I18nProvider";

export const useTranslation = () => {
   const { locale, dictionary, setLocale } = useI18nContext();

   return {
      locale,
      t: dictionary,
      setLocale,
   };
};
