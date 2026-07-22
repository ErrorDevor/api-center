"use client";

import React, { forwardRef } from "react";

import clsx from "clsx";

import css from "./AppLayout.module.scss";

interface Props {
   children: React.ReactNode;
   header?: React.ReactNode;
   sidebar?: React.ReactNode;
   isSidebarCollapsed?: boolean;
   className?: string;
}

export const AppLayout = forwardRef<HTMLDivElement, Props>(
   ({ className, header, sidebar, children, isSidebarCollapsed = false }, ref) => {
      return (
         <div
            ref={ref}
            className={clsx(css.app, isSidebarCollapsed && css.app_collapsed, className)}
         >
            {header}

            <div className={css.body}>
               {sidebar}

               <div className={clsx(css.center)}>
                  <div className={css.main_content}>{children}</div>
               </div>
            </div>
         </div>
      );
   }
);

AppLayout.displayName = "AppLayout";
