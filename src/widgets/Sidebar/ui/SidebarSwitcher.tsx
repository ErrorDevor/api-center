import React from "react";

import type { SidebarMode } from "../lib/sidebar.data";
import clsx from "clsx";

import css from "../Sidebar.module.scss";

interface Props {
   value: SidebarMode;
   onChange: (value: SidebarMode) => void;
}

export const SidebarSwitcher: React.FC<Props> = ({ value, onChange }) => {
   return (
      <div className={css.mode_switcher}>
         <button
            type="button"
            className={clsx(css.mode_button, value === "api" && css.mode_button_active)}
            onClick={() => onChange("api")}
         >
            API
         </button>

         <button
            type="button"
            className={clsx(css.mode_button, value === "group-buys" && css.mode_button_active)}
            onClick={() => onChange("group-buys")}
         >
            Group Buys
         </button>
      </div>
   );
};
