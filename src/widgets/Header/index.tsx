"use client";

import React from "react";

import { usePathname, useRouter } from "next/navigation";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { NextLink } from "shared/ui/base/NextLink";
import { CurrencyDropdown } from "shared/ui/components/CurrencyDropdown";
import { LanguageDropdown } from "shared/ui/components/LanguageDropdown";
import { Search } from "shared/ui/components/Search";
// import { UserInfo } from "shared/ui/components/UserInfo";
import { PlusIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./Header.module.scss";

export const Header: React.FC = () => {
   const { t } = useTranslation();
   const pathname = usePathname();
   const router = useRouter();

   const isApiPage = pathname === "/home";
   const isGroupBuysPage = pathname === "/group-buys";

   const handleAddProvider = () => {
      router.push("/create");
   };

   const handleCreate = () => {
      router.push("/create");
   };

   const handleLogin = () => {
      router.replace("/login");
   };

   const handleSignup = () => {
      router.replace("/signup");
   };

   return (
      <header className={css.header}>
         <div className={css.header_left_side}>
            <NextLink href="/" className={css.header_logo}>
               <Image.Default src="/images/Logo.svg" />
               Best Api Price
            </NextLink>

            <Search />
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

            <Button variant="grey" className={css.signup_button} onClick={handleSignup}>
               {t.common.signup}
            </Button>

            <Button variant="black" className={css.enter_button} onClick={handleLogin}>
               {t.common.login}
            </Button>

            {/* <div className={css.header_account_block}>
               <UserInfo
                  userName="@truthseeker"
                  userAvatar="/images/avatar.png"
                  withName={false}
               />
            </div> */}
         </div>
      </header>
   );
};
