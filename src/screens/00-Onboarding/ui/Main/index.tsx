"use client";

import React from "react";

import { useSearchParams } from "next/navigation";

import { useAuth } from "shared/lib/auth";
import { DASHBOARD_URL } from "shared/lib/gatewayPricing/cabinet";
import { useTranslation } from "shared/lib/i18n";
import { SiteFooter } from "shared/ui/components/SiteFooter";
import Image from "shared/ui/base/Image";
import { PasswordEyeIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./MainScreen.module.scss";

interface Props {
   mode?: "register" | "login";
}

const MainScreenView: React.FC<Props> = ({ mode = "register" }) => {
   const isLogin = mode === "login";
   const { t } = useTranslation();
   const { mainLanding: content } = t;
   const searchParams = useSearchParams();
   const modelParam = searchParams.get("model");
   const modelQuery = modelParam ? `?model=${encodeURIComponent(modelParam)}` : "";
   const { register, login } = useAuth();
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
   const [showPassword, setShowPassword] = React.useState(false);
   const [form, setForm] = React.useState({
      email: "",
      password: "",
   });

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setErrorMessage(null);

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
                  <form className={css.main_form} onSubmit={handleSubmit}>
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
                     <div className={css.main_form_password}>
                        <input
                           className={css.main_form_input}
                           type={showPassword ? "text" : "password"}
                           name="password"
                           autoComplete={isLogin ? "current-password" : "new-password"}
                           required
                           placeholder={content.password}
                           aria-label={content.password}
                           value={form.password}
                           onChange={(event) =>
                              setForm((current) => ({ ...current, password: event.target.value }))
                           }
                        />
                        <button
                           className={css.main_form_password_toggle}
                           type="button"
                           aria-label={showPassword ? content.hidePassword : content.showPassword}
                           aria-pressed={showPassword}
                           onClick={() => setShowPassword((current) => !current)}
                        >
                           <PasswordEyeIcon className={css.main_form_password_icon} />
                        </button>
                     </div>
                     {errorMessage && <p className={css.main_form_error}>{errorMessage}</p>}
                     <Button
                        type="submit"
                        variant="blue"
                        className={css.main_form_submit}
                        disabled={isSubmitting}
                     >
                        {isLogin ? content.logIn : content.createAccount}
                        <Image.Default src="/icons/dot-arrow-white.svg" alt="" />
                     </Button>
                  </form>
                  <p className={css.main_switch}>
                     {isLogin ? content.noAccount : content.haveAccount}{" "}
                     <a
                        className={css.main_switch_link}
                        href={`${isLogin ? "/register" : "/login"}${modelQuery}`}
                     >
                        {isLogin ? content.createAccount : content.logIn}
                     </a>
                  </p>
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

export const MainScreen: React.FC<Props> = (props) => (
   <React.Suspense fallback={null}>
      <MainScreenView {...props} />
   </React.Suspense>
);
