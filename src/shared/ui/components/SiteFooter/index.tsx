"use client";

import React from "react";

import { useTranslation } from "shared/lib/i18n";
import { NextLink } from "shared/ui/base/NextLink";

import css from "./SiteFooter.module.scss";

// Plain crawlable links to every top-level section plus the XML sitemap, so
// search engines (and visitors) can reach them from any page.
export const SiteFooter: React.FC = () => {
   const { t } = useTranslation();

   const links = [
      { href: "/home", label: t.sidebar.api },
      { href: "/group-buys", label: t.sidebar.groupBuys },
      { href: "/leaderboard", label: t.sidebar.liderTable },
      { href: "/discussions", label: t.sidebar.discussions },
   ];

   return (
      <footer className={css.footer}>
         <span className={css.footer_copy}>© {new Date().getFullYear()} Best AI Price</span>

         <nav className={css.footer_nav} aria-label="Footer">
            {links.map((link) => (
               <NextLink key={link.href} href={link.href} className={css.footer_link}>
                  {link.label}
               </NextLink>
            ))}

            <a href="/sitemap.xml" className={css.footer_link}>
               Sitemap
            </a>
         </nav>
      </footer>
   );
};
