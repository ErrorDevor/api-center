"use client";

import React from "react";

import { usePathname } from "next/navigation";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import { NextLink } from "shared/ui/base/NextLink";

import css from "../Sidebar.module.scss";

export const SidebarSwitcher: React.FC = () => {
   const { t } = useTranslation();
   const pathname = usePathname();

   const isApiActive = pathname === "/home" || pathname.startsWith("/home/");
   const isGroupBuysActive = pathname === "/group-buys" || pathname.startsWith("/group-buys/");

   return (
      <div className={css.mode_switcher}>
         <NextLink
            href="/home"
            className={clsx(css.mode_button, isApiActive && css.mode_button_active)}
         >
            {t.sidebar.api}
         </NextLink>

         <NextLink
            href="/group-buys"
            className={clsx(css.mode_button, isGroupBuysActive && css.mode_button_active)}
         >
            {t.sidebar.groupBuys}
         </NextLink>
      </div>
   );
};
