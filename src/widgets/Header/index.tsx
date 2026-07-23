"use client";

import React from "react";

import Image from "shared/ui/base/Image";
import { NextLink } from "shared/ui/base/NextLink";
import { CurrencyDropdown } from "shared/ui/components/CurrencyDropdown";
import { LanguageDropdown } from "shared/ui/components/LanguageDropdown";
import { Search } from "shared/ui/components/Search";
import { UserInfo } from "shared/ui/components/UserInfo";

import css from "./Header.module.scss";

export const Header: React.FC = () => {
   return (
      <header className={css.header}>
         <div className={css.header_left_side}>
            <NextLink href="/" className={css.header_logo}>
               <Image.Default src="/images/Logo.svg" />
               Logoipsum
            </NextLink>

            <Search />
         </div>

         <div className={css.header_right_side}>
            <LanguageDropdown />

            <CurrencyDropdown />

            <div className={css.header_account_block}>
               <UserInfo userName="@truthseeker" userAvatar="/images/avatar.png" withName={false} />
            </div>
         </div>
      </header>
   );
};
