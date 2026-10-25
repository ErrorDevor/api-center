"use client";

import React from "react";

import { usePathname, useRouter } from "next/navigation";

import {
   gaTrackAddProviderClick,
   gaTrackLoginClick,
   gaTrackSignupClick,
} from "shared/lib/analytics/ga";
import { useAuth } from "shared/lib/auth";
import { DASHBOARD_URL } from "shared/lib/gatewayPricing/cabinet";
import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { Modal } from "shared/ui/base/Modal";
import { NextLink } from "shared/ui/base/NextLink";
import { CatalogSearch } from "shared/ui/components/CatalogSearch";
// import { CurrencyDropdown } from "shared/ui/components/CurrencyDropdown";
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
      router.push("/login");
   };

   const handleSignup = () => {
      gaTrackSignupClick();
      router.push("/register");
   };

   // The gateway dashboard lives outside this Next app, so a full navigation.
   const handleOpenDashboard = () => {
      window.location.assign(DASHBOARD_URL);
   };

   // The avatar opens a small menu (just "Log out" for now) instead of
   // navigating anywhere.
   const accountRef = React.useRef<HTMLDivElement>(null);
   const [isAccountMenuOpen, setIsAccountMenuOpen] = React.useState(false);

   const handleLogout = async () => {
      setIsAccountMenuOpen(false);
      await logout();
      router.replace("/");
   };

   return (
      <header className={css.header}>
         <div className={css.header_left_side}>
            <NextLink href="/" className={css.header_logo}>
               <Image.Default src="/images/Logo.svg" className={css.main_logo} />
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

            {/* <CurrencyDropdown /> */}

            {isGroupBuysPage && (
               <Button variant="black" className={css.create_button} onClick={handleCreate}>
                  <PlusIcon />
                  {t.common.create}
               </Button>
            )}

            <Button variant="blue" className={css.dashboard_button} onClick={handleOpenDashboard}>
               {t.common.dashboard}
            </Button>

            {status === "authenticated" && user ? (
               <div className={css.header_account_block}>
                  <div ref={accountRef}>
                     <UserInfo
                        userName={user.email}
                        withName={false}
                        onAvatarClick={() => setIsAccountMenuOpen((current) => !current)}
                     />
                  </div>

                  <Modal
                     isOpen={isAccountMenuOpen}
                     variant="dropdown"
                     anchorRef={accountRef}
                     placement="bottom-end"
                     gap={8}
                     contentClassName={css.account_menu}
                     ariaLabel={user.email}
                     onClose={() => setIsAccountMenuOpen(false)}
                  >
                     <button type="button" className={css.account_menu_item} onClick={handleLogout}>
                        {t.common.logout}
                     </button>
                  </Modal>
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
