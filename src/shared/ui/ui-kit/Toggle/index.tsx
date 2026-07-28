"use client";

import React from "react";

import clsx from "clsx";

import css from "./Toggle.module.scss";

interface Props {
   className?: string;
   checked: boolean;
   disabled?: boolean;
   ariaLabel?: string;
   onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<Props> = ({
   className,
   checked,
   disabled = false,
   ariaLabel,
   onChange,
}) => {
   return (
      <button
         type="button"
         role="switch"
         aria-checked={checked}
         aria-label={ariaLabel}
         disabled={disabled}
         className={clsx(
            css.toggle,
            checked && css.toggle_checked,
            className
         )}
         onClick={() => onChange(!checked)}
      >
         <span className={css.toggle_thumb} />
      </button>
   );
};