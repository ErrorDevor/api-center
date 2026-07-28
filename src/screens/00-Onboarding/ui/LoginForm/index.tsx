"use client";

import React from "react";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { ArrowIcon, PasswordEyeIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./LoginForm.module.scss";

interface Props {
   onBack: () => void;
   onSubmit: () => void;
   onClose: () => void;
}

export const LoginForm: React.FC<Props> = ({ onBack, onSubmit, onClose }) => {
   const { t } = useTranslation();

   const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((current) => !current);
   };

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit();
   };

   return (
      <div className={css.login_form}>
         <div className={css.login_form_top}>
            <button
               type="button"
               className={css.login_form_back}
               onClick={onBack}
               aria-label="Go back"
            >
               <ArrowIcon />
            </button>

            <button
               type="button"
               className={css.login_form_close}
               onClick={onClose}
               aria-label="Close login"
            >
               <Image.Default src="/icons/close.svg" alt="" />
            </button>
         </div>

         <h2 className={css.login_form_title}>{t.onboarding.login.title}</h2>

         <form className={css.login_form_form} onSubmit={handleSubmit}>
            <input
               type="email"
               name="email"
               placeholder={t.onboarding.login.email}
               aria-label={t.onboarding.login.email}
               autoComplete="email"
               required
            />

            <div className={css.login_form_password}>
               <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  placeholder={t.onboarding.login.password}
                  aria-label={t.onboarding.login.password}
                  autoComplete="current-password"
                  required
               />

               <button
                  type="button"
                  className={css.login_form_password_toggle}
                  onClick={togglePasswordVisibility}
                  aria-label={
                     isPasswordVisible ? t.onboarding.password.hide : t.onboarding.password.show
                  }
               >
                  <PasswordEyeIcon />
               </button>
            </div>

            <Button type="submit" variant="black" className={css.login_form_submit}>
               {t.onboarding.login.submit}
            </Button>
         </form>

         <div className={css.login_form_divider}>
            <span />
            <span className={css.login_form_divider_text}>{t.onboarding.common.or}</span>
            <span />
         </div>

         <button
            type="button"
            className={css.login_form_telegram}
            aria-label={t.onboarding.common.telegram}
         >
            <Image.Default src="/icons/telegram.svg" alt="" />
         </button>

         <p className={css.login_form_terms}>
            {t.onboarding.terms.prefix} <a href="/terms">{t.onboarding.terms.termsAndConditions}</a>{" "}
            {t.onboarding.terms.conjunction} <a href="/offer">{t.onboarding.terms.contractOffer}</a>
            .
         </p>
      </div>
   );
};
