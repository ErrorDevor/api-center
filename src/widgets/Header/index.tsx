"use client";

import React from "react";

import { usePathname, useRouter } from "next/navigation";

import { gaTrackAddProviderClick, gaTrackLoginClick, gaTrackSignupClick } from "shared/lib/analytics/ga";
import { useAuth } from "shared/lib/auth";
import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { NextLink } from "shared/ui/base/NextLink";
import { CatalogSearch } from "shared/ui/components/CatalogSearch";
import { CurrencyDropdown } from "shared/ui/components/CurrencyDropdown";
import { LanguageDropdown } from "shared/ui/components/LanguageDropdown";
import { UserInfo } from "shared/ui/components/UserInfo";
import { PlusIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./Header.module.scss";

export const Header: React.FC = () => {
   const { t } = useTranslation();
   const { user, status, logout } = useAuth();
   const pathname = usePathname();
   const router = useRouter();

   const isApiPage = pathname === "/home";
   const isGroupBuysPage = pathname === "/group-buys";

   const handleAddProvider = () => {
      gaTrackAddProviderClick();
      router.push("/create");
   };

   const handleCreate = () => {
      router.push("/create");
   };

   const handleLogin = () => {
      gaTrackLoginClick();
      router.replace("/login");
   };

   const handleSignup = () => {
      gaTrackSignupClick();
      router.replace("/signup");
   };

   const handleLogout = async () => {
      await logout();
      router.replace("/");
   };

   return (
      <header className={css.header}>
         <div className={css.header_left_side}>
            <NextLink href="/" className={css.header_logo}>
               <Image.Default src="/images/Logo.svg" className={css.main_logo}/>
               <p>Best Ai Price</p>
               
            </NextLink>

            <CatalogSearch />
         </div>

         <div className={css.header_right_side}>
            {isApiPage && (
               <Button
                  variant="grey"
                  className={css.add_provider_button}
                  onClick={handleAddProvider}
               >
                  <PlusIcon />
                  {t.common.addProvider}
               </Button>
            )}

            <LanguageDropdown />

            <CurrencyDropdown />

            {isGroupBuysPage && (
               <Button variant="black" className={css.create_button} onClick={handleCreate}>
                  <PlusIcon />
                  {t.common.create}
               </Button>
            )}

            {status === "authenticated" && user ? (
               <div className={css.header_account_block}>
                  <UserInfo userName={user.email} withName={false} />

                  <Button variant="grey" className={css.logout_button} onClick={handleLogout}>
                     {t.common.logout}
                  </Button>
               </div>
            ) : (
               <>
                  <Button variant="grey" className={css.signup_button} onClick={handleSignup}>
                     {t.common.signup}
                  </Button>

                  <Button variant="black" className={css.enter_button} onClick={handleLogin}>
                     {t.common.login}
                  </Button>
               </>
            )}
         </div>
      </header>
   );
};
