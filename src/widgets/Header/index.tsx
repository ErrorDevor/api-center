"use client";
import React from "react";
import { useRouter } from "next/navigation";
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
   const router = useRouter();

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

            <Button variant="black" className={css.create_button} onClick={() => router.push("/create")}>
               <PlusIcon />
               {t.common.create}
            </Button>

            <Button variant="grey" className={css.enter_button}>
               {t.common.enter}
            </Button>

            {/* <div className={css.header_account_block}>
               <UserInfo userName="@truthseeker" userAvatar="/images/avatar.png" withName={false} />
            </div> */}
         </div>
      </header>
   );
};
