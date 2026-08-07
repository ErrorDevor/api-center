"use client";

import React from "react";

import type { SidebarMode } from "./lib/sidebar.types";
import { SidebarContent } from "./ui/SidebarContent";
import clsx from "clsx";

import css from "./Sidebar.module.scss";

interface Props {
   mode: SidebarMode;
   collapsed: boolean;
   onToggleCollapsed: () => void;
   className?: string;
}

export const Sidebar: React.FC<Props> = ({ className, mode, collapsed, onToggleCollapsed }) => {
   return (
      <aside className={clsx(css.sidebar, collapsed && css.sidebar_collapsed, className)}>
         {!collapsed && <SidebarContent />}

         {/* Пока скрываем переключатель сворачивания сайдбара */}
         {/* <button
            type="button"
            className={clsx(
               css.sidebar_toggle,
               collapsed && css.sidebar_toggle_collapsed
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggleCollapsed}
         >
            <DropdownArrowIcon />
         </button> */}
      </aside>
   );
};
