"use client";

import React from "react";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { PasswordEyeIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./MainScreen.module.scss";

export const MainScreen = () => {
   const { t } = useTranslation();
   const { mainLanding: content } = t;
   const [showPassword, setShowPassword] = React.useState(false);
   const [form, setForm] = React.useState({
      email: "",
      username: "",
      password: "",
   });

   const navItems = [
      { label: content.network, href: "#network" },
      { label: content.pricing, href: "#pricing" },
      { label: content.docs, href: "#docs" },
      { label: content.ecosystem, href: "#ecosystem" },
      { label: content.about, href: "#about" },
      { label: content.rentNode, href: "#rent-node" },
      { label: content.token, href: "#token" },
   ];

   const footerItems = [
      { label: content.getStarted, href: "#register" },
      { label: content.partners, href: "#partners" },
      { label: content.about, href: "#about" },
      { label: content.media, href: "#media" },
      { label: content.docs, href: "#docs" },
   ];

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
   };

   return (
      <main className={css.main}>
         <div className={css.main_container}>
            <header className={css.main_header}>
               <nav className={css.main_nav} aria-label={content.navigation}>
                  <a className={css.main_nav_brand} href="#register">
                     <span className={css.main_nav_logo}>
                        <Image.Default src="/images/Logo.svg" alt="Best Ai Price" />
                     </span>
                     <span className={css.main_nav_brand_name}>Best Ai Price</span>
                  </a>
                  <div className={css.main_nav_links}>
                     {navItems.map((item) => (
                        <a className={css.main_nav_link} key={item.href} href={item.href}>
                           {item.label}
                        </a>
                     ))}
                  </div>
                  <a className={css.main_nav_action} href="#register">
                     {content.getStarted}
                     <Image.Default src="/icons/dot-arrow.svg" alt="" />
                  </a>

                  <button
   className={css.main_nav_menu}
   type="button"
   aria-label={content.navigation}
   aria-expanded={false}
>
   <span className={css.main_nav_menu_line} />
   <span className={css.main_nav_menu_line} />
   <span className={css.main_nav_menu_line} />
</button>
               </nav>
            </header>
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
                     <Button type="submit" variant="blue" className={css.main_form_submit}>
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
