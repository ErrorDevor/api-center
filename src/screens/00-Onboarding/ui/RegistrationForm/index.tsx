"use client";

import React from "react";

import { useAuth } from "shared/lib/auth";
import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { ArrowIcon, PasswordEyeIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./RegistrationForm.module.scss";

interface Props {
   onBack?: () => void;
   onSuccess?: () => void;
   onClose?: () => void;
}

export const RegistrationForm: React.FC<Props> = ({ onBack, onSuccess, onClose }) => {
   const { t } = useTranslation();
   const { register, sendVerifyCode } = useAuth();

   const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
   const [isCodeSent, setIsCodeSent] = React.useState(false);
   const formRef = React.useRef<HTMLFormElement>(null);

   const togglePasswordVisibility = () => {
      setIsPasswordVisible((current) => !current);
   };

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // sub2api's /auth/register has no username/name field (see
      // AUTH_API_GUIDE.md §4) — the "name" input below is kept for UX
      // continuity but its value is intentionally not read/sent.
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      const verifyCode = String(formData.get("code") ?? "");

      setIsSubmitting(true);
      setErrorMessage(null);

      // Step 1: email the code; step 2: register with it.
      if (!isCodeSent) {
         const sent = await sendVerifyCode(email);

         setIsSubmitting(false);

         if (sent.ok) {
            setIsCodeSent(true);
         } else {
            setErrorMessage(sent.message);
         }

         return;
      }

      const result = await register(email, password, verifyCode);

      setIsSubmitting(false);

      if (result.ok) {
         onSuccess?.();
      } else {
         setErrorMessage(result.message);
      }
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

         <form ref={formRef} className={css.registration_form_form} onSubmit={handleSubmit}>
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

            {isCodeSent && (
               <>
                  <input
                     type="text"
                     name="code"
                     placeholder={t.onboarding.registration.code}
                     aria-label={t.onboarding.registration.code}
                     autoComplete="one-time-code"
                     inputMode="numeric"
                     required
                  />

                  <p>{t.onboarding.registration.codeHint}</p>
               </>
            )}

            {errorMessage && <p className={css.registration_form_error}>{errorMessage}</p>}

            <Button
               type="submit"
               variant="black"
               className={css.registration_form_submit}
               disabled={isSubmitting}
            >
               {isCodeSent
                  ? t.onboarding.registration.submit
                  : t.onboarding.registration.sendCode}
            </Button>

            {isCodeSent && (
               <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={async () => {
                     const email = formRef.current
                        ? new FormData(formRef.current).get("email")
                        : "";

                     setErrorMessage(null);

                     const sent = await sendVerifyCode(String(email ?? ""));

                     if (!sent.ok) {
                        setErrorMessage(sent.message);
                     }
                  }}
               >
                  {t.onboarding.registration.resendCode}
               </button>
            )}
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
