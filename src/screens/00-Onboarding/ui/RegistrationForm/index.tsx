"use client";

import React from "react";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { ArrowIcon, PasswordEyeIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./RegistrationForm.module.scss";

interface Props {
   onBack?: () => void;
   onSubmit?: () => void;
   onClose?: () => void;
}

export const RegistrationForm: React.FC<Props> = ({ onBack, onSubmit, onClose }) => {
   const { t } = useTranslation();

   const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

   const togglePasswordVisibility = () => {
      setIsPasswordVisible((current) => !current);
   };

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit?.();
   };

   return (
      <div className={css.registration_form}>
         <div className={css.registration_form_top}>
            <button
               type="button"
               className={css.registration_form_back}
               onClick={onBack}
               aria-label="Go back"
            >
               <ArrowIcon />
            </button>

            <button
               type="button"
               className={css.registration_form_close}
               onClick={onClose}
               aria-label="Close registration"
            >
               <Image.Default src="/icons/close.svg" alt="" />
            </button>
         </div>

         <h2 className={css.registration_form_title}>{t.onboarding.registration.title}</h2>

         <form className={css.registration_form_form} onSubmit={handleSubmit}>
            <input
               type="text"
               name="name"
               placeholder={t.onboarding.registration.userName}
               aria-label={t.onboarding.registration.userName}
               autoComplete="name"
               required
            />

            <input
               type="email"
               name="email"
               placeholder={t.onboarding.registration.email}
               aria-label={t.onboarding.registration.email}
               autoComplete="email"
               required
            />

            <div className={css.registration_form_password}>
               <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  placeholder={t.onboarding.registration.password}
                  aria-label={t.onboarding.registration.password}
                  autoComplete="new-password"
                  required
               />

               <button
                  type="button"
                  className={css.registration_form_password_toggle}
                  onClick={togglePasswordVisibility}
                  aria-label={
                     isPasswordVisible ? t.onboarding.password.hide : t.onboarding.password.show
                  }
               >
                  <PasswordEyeIcon />
               </button>
            </div>

            <Button type="submit" variant="black" className={css.registration_form_submit}>
               {t.onboarding.registration.submit}
            </Button>
         </form>

         <div className={css.registration_form_divider}>
            <span />
            <span className={css.registration_form_divider_text}>{t.onboarding.common.or}</span>
            <span />
         </div>

         <button
            type="button"
            className={css.registration_form_telegram}
            aria-label={t.onboarding.common.telegram}
         >
            <Image.Default src="/icons/telegram.svg" alt="Telegram" />
         </button>

         <p className={css.registration_form_terms}>
            {t.onboarding.terms.prefix} <a href="/terms">{t.onboarding.terms.termsAndConditions}</a>{" "}
            {t.onboarding.terms.conjunction} <a href="/offer">{t.onboarding.terms.contractOffer}</a>
            .
         </p>
      </div>
   );
};
