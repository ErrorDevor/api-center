"use client";

import React from "react";

import clsx from "clsx";

import css from "./Checkbox.module.scss";

export type CheckboxVariant = "checkbox" | "radio";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
   variant?: CheckboxVariant;
   label?: React.ReactNode;
   className?: string;
   controlClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, Props>(
   ({ variant = "checkbox", label, className, controlClassName, disabled, id, ...props }, ref) => {
      const generatedId = React.useId();
      const inputId = id ?? generatedId;

      return (
         <label
            htmlFor={inputId}
            className={clsx(css.checkbox, disabled && css.checkbox_disabled, className)}
         >
            <input
               ref={ref}
               id={inputId}
               type={variant === "radio" ? "radio" : "checkbox"}
               disabled={disabled}
               className={css.checkbox_input}
               {...props}
            />

            <span
               className={clsx(
                  css.checkbox_control,
                  css[`checkbox_control_${variant}`],
                  controlClassName
               )}
               aria-hidden="true"
            >
               {variant === "checkbox" && (
                  <svg
                     viewBox="0 0 16 16"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                     className={css.checkbox_check}
                  >
                     <path
                        d="M4 8.2L6.7 10.7L12 5.4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                  </svg>
               )}

               {variant === "radio" && <span className={css.checkbox_dot} />}
            </span>

            {label && <span className={css.checkbox_label}>{label}</span>}
         </label>
      );
   }
);

Checkbox.displayName = "Checkbox";
