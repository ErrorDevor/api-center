"use client";

import React from "react";

import { useRouter } from "next/navigation";

import type { SidebarMode } from "../lib/sidebar.types";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { NextLink } from "shared/ui/base/NextLink";
import { CurrencyDropdown } from "shared/ui/components/CurrencyDropdown";
import { LanguageDropdown } from "shared/ui/components/LanguageDropdown";
import { Search } from "shared/ui/components/Search";
import { CloseIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import { SidebarContent } from "./SidebarContent";

import css from "../Sidebar.module.scss";

interface Props {
   opened: boolean;
   onClose: () => void;
   activeVendorId?: string;
   activeModelId?: string;
   activeModelTypeId?: string;
   onSelectVendor?: (vendorId: string | undefined) => void;
   onSelectModel?: (canonicalModelId: string | undefined) => void;
   onSelectModelType?: (modelTypeId: string | undefined) => void;
}

export const MobileSidebar: React.FC<Props> = ({
   opened,
   onClose,
   activeVendorId,
   activeModelId,
   activeModelTypeId,
   onSelectVendor,
   onSelectModel,
   onSelectModelType,
}) => {
   const { t } = useTranslation();
   const router = useRouter();

   const handleLogin = () => {
      router.replace("/login");
   };

   React.useEffect(() => {
      if (!opened) {
         return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            onClose();
         }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, [opened, onClose]);

   return (
      <div
         className={clsx(css.mobile_sidebar, opened && css.mobile_sidebar_opened)}
         aria-hidden={!opened}
      >
         <button
            type="button"
            className={css.mobile_sidebar_overlay}
            aria-label="Close menu"
            onClick={onClose}
         />

         <aside
            className={css.mobile_sidebar_panel}
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar menu"
         >
            <div className={css.mobile_sidebar_header}>
               <NextLink href="/" className={css.mobile_sidebar_logo_icon}>
                  <Image.Default src="/images/Logo.svg" className={css.main_logo} />
                  Best Ai Price
               </NextLink>

               <button
                  type="button"
                  className={css.mobile_sidebar_close}
                  aria-label="Close menu"
                  onClick={onClose}
               >
                  <CloseIcon />
               </button>
            </div>

            <div className={css.mobile_sidebar_menu}>
               <div className={css.mobile_sidebar_menu_top}>
                  <div className={css.mobile_sidebar_menu_dropdowns}>
                     <LanguageDropdown />

                     <CurrencyDropdown />
                  </div>

                  <Button variant="black" className={css.enter_button} onClick={handleLogin}>
                     {t.common.login}
                  </Button>
               </div>
            </div>

            <Search />

            <SidebarContent
               activeVendorId={activeVendorId}
               activeModelId={activeModelId}
               activeModelTypeId={activeModelTypeId}
               onSelectVendor={onSelectVendor}
               onSelectModel={onSelectModel}
               onSelectModelType={onSelectModelType}
            />
         </aside>
      </div>
   );
};
