"use client";

import React from "react";

import { useAuth } from "shared/lib/auth";
import { DASHBOARD_URL } from "shared/lib/gatewayPricing/cabinet";
import { useTranslation } from "shared/lib/i18n";
import { SUPPORT_EMAIL, SUPPORT_TELEGRAM_URL } from "shared/lib/support/contacts";
import { SiteFooter } from "shared/ui/components/SiteFooter";
import Image from "shared/ui/base/Image";
import { PasswordEyeIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./MainScreen.module.scss";

interface Props {
   mode?: "register" | "login" | "forgot" | "reset";
   // ?model= of the page the visitor came from; carried over between
   // /login and /register.
   modelParam?: string;
   // From the emailed link on /reset-password.
   resetEmail?: string;
   resetToken?: string;
}

const MIN_PASSWORD_LENGTH = 8;

const MainScreen: React.FC<Props> = ({
   mode = "register",
   modelParam,
   resetEmail = "",
   resetToken = "",
}) => {
   const isLogin = mode === "login";
   const { t } = useTranslation();
   const { mainLanding: content } = t;
   const isForgot = mode === "forgot";
   const isReset = mode === "reset";
   const isRecovery = isForgot || isReset;
   const modelQuery = modelParam ? `?model=${encodeURIComponent(modelParam)}` : "";
   const { register, login } = useAuth();
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
   const [showPassword, setShowPassword] = React.useState(false);
   const [form, setForm] = React.useState({
      email: "",
      password: "",
      repeatPassword: "",
   });
   const [notice, setNotice] = React.useState<string | null>(null);
   const [isDone, setIsDone] = React.useState(false);

   const handleRecoverySubmit = async () => {
      if (isReset) {
         if (form.password.length < MIN_PASSWORD_LENGTH) {
            setErrorMessage(content.passwordTooShort);
            setIsSubmitting(false);

            return;
         }

         if (form.password !== form.repeatPassword) {
            setErrorMessage(content.passwordsMismatch);
            setIsSubmitting(false);

            return;
         }
      }

      try {
         const response = await fetch(
            isReset ? "/api/auth/reset-password" : "/api/auth/forgot-password",
            {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(
                  isReset
                     ? { email: resetEmail, token: resetToken, password: form.password }
                     : { email: form.email }
               ),
            }
         );

         if (response.ok) {
            setNotice(isReset ? content.resetDone : content.resetSent);
            setIsDone(true);
         } else {
            const payload = (await response.json().catch(() => null)) as {
               message?: string;
            } | null;

            setErrorMessage(payload?.message || content.resetInvalidLink);
         }
      } catch {
         setErrorMessage(content.resetInvalidLink);
      }

      setIsSubmitting(false);
   };

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setErrorMessage(null);

      if (isRecovery) {
         await handleRecoverySubmit();

         return;
      }

      const result = await (isLogin ? login : register)(form.email, form.password);

      setIsSubmitting(false);

      if (result.ok) {
         window.location.assign(DASHBOARD_URL);
      } else {
         setErrorMessage(result.message);
      }
   };

   return (
      <main className={css.main}>
         <div className={css.main_container}>
            <section className={css.main_hero} id="register">
               <div className={css.main_hero_glow} />
               <div className={css.main_hero_content}>
                  <div className={css.main_hero_tag}>
                     <Image.Default src="/icons/sparkle.svg" alt="" />
                     {content.badge}
                  </div>
                  {isRecovery ? (
                     <>
                        <h1 className={css.main_hero_title}>
                           {isReset ? content.resetTitle : content.forgotTitle}
                        </h1>
                        <p className={css.main_hero_description}>
                           {isReset ? content.resetDescription : content.forgotDescription}
                        </p>
                     </>
                  ) : (
                     <>
                  <h1 className={css.main_hero_title}>
                           {content.titleBefore}
                           <span className={css.main_hero_title_accent}>{content.titleAccent}</span>
                           {content.titleAfter}
                        </h1>
                        <p className={css.main_hero_description}>
                           {content.descriptionBefore}
                           <a
                              className={css.main_hero_description_link}
                              href="https://claude.ai/"
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              Claude
                           </a>
                           {", "}
                           <a
                              className={css.main_hero_description_link}
                              href="https://openai.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              OpenAI
                           </a>{" "}
                           {content.descriptionAnd}{" "}
                           <a
                              className={css.main_hero_description_link}
                              href="https://gemini.google.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              Gemini
                           </a>
                           .
                        </p>
                     </>
                  )}
                  {isDone ? (
                     <>
                        <p className={css.main_notice} role="status">
                           {notice}
                        </p>
                        <p className={css.main_switch}>
                           <a className={css.main_switch_link} href="/login">
                              {content.backToLogin}
                           </a>
                        </p>
                     </>
                  ) : isReset && (!resetEmail || !resetToken) ? (
                     <>
                        <p className={css.main_form_error}>{content.resetInvalidLink}</p>
                        <p className={css.main_switch}>
                           <a className={css.main_switch_link} href="/forgot-password">
                              {content.requestNewLink}
                           </a>
                        </p>
                     </>
                  ) : (
                     <form className={css.main_form} onSubmit={handleSubmit}>
                        {!isReset && (
                           <input
                              className={css.main_form_input}
                              type="email"
                              name="email"
                              autoComplete="email"
                              required
                              placeholder={content.email}
                              aria-label={content.email}
                              value={form.email}
                              onChange={(event) =>
                                 setForm((current) => ({ ...current, email: event.target.value }))
                              }
                           />
                        )}
                        {!isForgot && (
                           <div className={css.main_form_password}>
                              <input
                                 className={css.main_form_input}
                                 type={showPassword ? "text" : "password"}
                                 name="password"
                                 autoComplete={isLogin ? "current-password" : "new-password"}
                                 required
                                 placeholder={isReset ? content.newPassword : content.password}
                                 aria-label={isReset ? content.newPassword : content.password}
                                 value={form.password}
                                 onChange={(event) =>
                                    setForm((current) => ({
                                       ...current,
                                       password: event.target.value,
                                    }))
                                 }
                              />
                              <button
                                 className={css.main_form_password_toggle}
                                 type="button"
                                 aria-label={
                                    showPassword ? content.hidePassword : content.showPassword
                                 }
                                 aria-pressed={showPassword}
                                 onClick={() => setShowPassword((current) => !current)}
                              >
                                 <PasswordEyeIcon className={css.main_form_password_icon} />
                              </button>
                           </div>
                        )}
                        {isReset && (
                           <input
                              className={css.main_form_input}
                              type={showPassword ? "text" : "password"}
                              name="repeat-password"
                              autoComplete="new-password"
                              required
                              placeholder={content.repeatPassword}
                              aria-label={content.repeatPassword}
                              value={form.repeatPassword}
                              onChange={(event) =>
                                 setForm((current) => ({
                                    ...current,
                                    repeatPassword: event.target.value,
                                 }))
                              }
                           />
                        )}
                        {errorMessage && <p className={css.main_form_error}>{errorMessage}</p>}
                        <Button
                           type="submit"
                           variant="blue"
                           className={css.main_form_submit}
                           disabled={isSubmitting}
                        >
                           {isReset
                              ? content.savePassword
                              : isForgot
                                ? content.sendResetLink
                                : isLogin
                                  ? content.logIn
                                  : content.createAccount}
                           <Image.Default src="/icons/dot-arrow-white.svg" alt="" />
                        </Button>
                     </form>
                  )}
                  {isLogin && (
                     <p className={css.main_switch}>
                        <a className={css.main_switch_link} href="/forgot-password">
                           {content.forgotPassword}
                        </a>
                     </p>
                  )}
                  {isRecovery && !isDone && (
                     <p className={css.main_switch}>
                        <a className={css.main_switch_link} href="/login">
                           {content.backToLogin}
                        </a>
                     </p>
                  )}
                  {!isRecovery && (
                     <p className={css.main_switch}>
                        {isLogin ? content.noAccount : content.haveAccount}{" "}
                        <a
                           className={css.main_switch_link}
                           href={`${isLogin ? "/register" : "/login"}${modelQuery}`}
                        >
                           {isLogin ? content.createAccount : content.logIn}
                        </a>
                     </p>
                  )}
                  {(SUPPORT_TELEGRAM_URL || SUPPORT_EMAIL) && (
                     <p className={css.main_support}>
                        {content.supportTitle}{" "}
                        {SUPPORT_TELEGRAM_URL && (
                           <a
                              className={css.main_switch_link}
                              href={SUPPORT_TELEGRAM_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              {content.supportTelegram}
                           </a>
                        )}
                        {SUPPORT_TELEGRAM_URL && SUPPORT_EMAIL && " · "}
                        {SUPPORT_EMAIL && (
                           <a className={css.main_switch_link} href={`mailto:${SUPPORT_EMAIL}`}>
                              {SUPPORT_EMAIL}
                           </a>
                        )}
                     </p>
                  )}
               </div>

               <div className={css.main_hero_visual}>
                  <Image.Default
                     className={css.main_hero_network}
                     src="/images/network.webp"
                     alt={content.networkAlt}
                  />
                  <Image.Default
                     className={css.main_hero_network_mobile}
                     src="/images/network-mobile.webp"
                     alt={content.networkAlt}
                  />
               </div>

               <Image.Default
                  className={css.main_hero_decoration}
                  src="/images/decoration.png"
                  alt=""
               />
            </section>

            <SiteFooter />
         </div>
      </main>
   );
};

export { MainScreen };
