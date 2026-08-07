import React from "react";

import clsx from "clsx";

import { useTranslation } from "shared/lib/i18n";

import css from "./BurgerButton.module.scss";

interface Props {
   className?: string;
   onClick: () => void;
}

export const BurgerButton: React.FC<Props> = ({ className, onClick }) => {
   const { t } = useTranslation();

   return (
      <button
         type="button"
         className={clsx(css.burger_button, className)}
         aria-label="Open menu"
         onClick={onClick}
      >
         <span>{t.common.menu}</span>

         <svg
            className={css.burger_button_icon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               d="M21 6H13M21 11.5H8M21 17H3"
               stroke="#212121"
               strokeWidth="1.5"
               strokeLinecap="round"
               strokeLinejoin="round"
            />
         </svg>
      </button>
   );
};
