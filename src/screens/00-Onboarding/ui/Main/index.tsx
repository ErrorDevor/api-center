"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "shared/lib/auth";
import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { PasswordEyeIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./MainScreen.module.scss";

const MainScreenView = () => {
   const { t } = useTranslation();
   const { mainLanding: content } = t;
   const router = useRouter();
   const searchParams = useSearchParams();
   const { register } = useAuth();
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
   const [showPassword, setShowPassword] = React.useState(false);
   const [form, setForm] = React.useState({
      email: "",
      username: "",
      password: "",
   });

   const footerItems = [
      { label: content.getStarted, href: "#register" },
      { label: content.partners, href: "#partners" },
      { label: content.about, href: "#about" },
      { label: content.media, href: "#media" },
      { label: content.docs, href: "#docs" },
   ];

   // sub2api's register endpoint takes only email + password (see
   // RegistrationForm); the username field is kept for UX continuity.
   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setErrorMessage(null);

      const result = await register(form.email, form.password);

      setIsSubmitting(false);

      if (result.ok) {
         const selectedModelId = searchParams.get("model");
         router.replace(selectedModelId ? `/home/${selectedModelId}` : "/home");
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
                     <input
                        className={css.main_form_input}
                        type="text"
                        name="username"
                        autoComplete="username"
                        required
                        placeholder={content.username}
                        aria-label={content.username}
                        value={form.username}
                        onChange={(event) =>
                           setForm((current) => ({ ...current, username: event.target.value }))
                        }
                     />
                     <div className={css.main_form_password}>
                        <input
                           className={css.main_form_input}
                           type={showPassword ? "text" : "password"}
                           name="password"
                           autoComplete="new-password"
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
                        {content.createAccount}
                        <Image.Default src="/icons/dot-arrow-white.svg" alt="" />
                     </Button>
                  </form>
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

            <footer className={css.main_footer}>
               <nav className={css.main_footer_links} aria-label={content.footerNavigation}>
                  {footerItems.map((item) => (
                     <a className={css.main_footer_link} key={item.href} href={item.href}>
                        {item.label}
                     </a>
                  ))}
               </nav>
               <div className={css.main_footer_bottom}>
                  <span className={css.main_footer_copyright}>{content.copyright}</span>
                  <a className={css.main_footer_policy} href="#privacy">
                     {content.privacy}
                  </a>
                  <a className={css.main_footer_policy} href="#terms">
                     {content.terms}
                  </a>
               </div>
            </footer>
         </div>
      </main>
   );
};

export const MainScreen = () => (
   <React.Suspense fallback={null}>
      <MainScreenView />
   </React.Suspense>
);
