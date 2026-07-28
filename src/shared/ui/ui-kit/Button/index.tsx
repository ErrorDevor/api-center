"use client";

import React from "react";

import clsx from "clsx";

import { NextLink, NextLinkProps } from "shared/ui/base/NextLink";

import css from "./Button.module.scss";

interface Prop {
   variant: "blue" | "black" | "grey" | "white";
   className?: string;
   classNameContent?: string;
   disabled?: boolean;
   active?: boolean;
}

type ButtonComponent = {
   as?: "button";
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type AnchorComponent = {
   as?: "a";
} & NextLinkProps;

type ButtonProps = Prop & (ButtonComponent | AnchorComponent);

export const Button: React.FC<ButtonProps> = ({
   className,
   classNameContent,
   variant = "blue",
   disabled,
   active,
   children,
   as = "button",
   ...props
}) => {
   const buttonClassName = clsx(
      css.button,
      className,
      disabled && css["button--disabled"],
      variant && css["button--" + variant],
      active && css["button--active"]
   );

   const content = <span className={clsx(css.button_content, classNameContent)}>{children}</span>;

   if (as === "a") {
      return (
         <NextLink {...(props as any)} className={buttonClassName}>
            {content}
         </NextLink>
      );
   }

   return (
      <button
         className={buttonClassName}
         {...(props as any)}
         disabled={disabled}
         type={(props as any).type || "button"}
      >
         {content}
      </button>
   );
};
