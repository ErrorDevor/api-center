"use client";

import React from "react";

import type { OnboardingRole } from "../../lib/onboarding.types";
import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";
import { DropdownArrowIcon, ExistingIcon, GroupBuyIcon } from "shared/ui/icons";
import { Button } from "shared/ui/ui-kit/Button";

import css from "./RoleSelector.module.scss";

interface Props {
   selectedRole: OnboardingRole;
   onRoleChange: (role: OnboardingRole) => void;
   onSubmit: () => void;
   onClose: () => void;
}

export const RoleSelector: React.FC<Props> = ({
   selectedRole,
   onRoleChange,
   onSubmit,
   onClose,
}) => {
   const { t } = useTranslation();

   return (
      <div className={css.role_selector}>
         <button
            type="button"
            className={css.role_selector_close}
            onClick={onClose}
            aria-label="Close onboarding"
         >
            <Image.Default src="/icons/close.svg" alt="" />
         </button>

         <div className={css.role_selector_body}>
            <div className={css.role_selector_content}>
               <div className={css.role_selector_header}>
                  <h1 className={css.role_selector_title}>{t.onboarding.roleSelector.title}</h1>

                  <p className={css.role_selector_description}>
                     {t.onboarding.roleSelector.description}
                  </p>
               </div>

               <div
                  className={css.role_selector_options}
                  role="radiogroup"
                  aria-label="Account type"
               >
                  <button
                     type="button"
                     role="radio"
                     aria-checked={selectedRole === "distribution"}
                     className={clsx(
                        css.role_selector_option,
                        selectedRole === "distribution" && css.role_selector_option_active
                     )}
                     onClick={() => onRoleChange("distribution")}
                  >
                     <GroupBuyIcon className={css.role_selector_option_icon} />

                     <span className={css.role_selector_option_text}>
                        {t.onboarding.roleSelector.createGroupBuy}
                     </span>
                  </button>

                  <button
                     type="button"
                     role="radio"
                     aria-checked={selectedRole === "recipient"}
                     className={clsx(
                        css.role_selector_option,
                        selectedRole === "recipient" && css.role_selector_option_active
                     )}
                     onClick={() => onRoleChange("recipient")}
                  >
                     <ExistingIcon className={css.role_selector_option_icon} />

                     <span className={css.role_selector_option_text}>
                        {t.onboarding.roleSelector.joinExisting}
                     </span>
                  </button>
               </div>
            </div>

            <Button variant="black" className={css.role_selector_submit} onClick={onSubmit}>
               {t.onboarding.roleSelector.create}
               <DropdownArrowIcon />
            </Button>
         </div>
      </div>
   );
};
