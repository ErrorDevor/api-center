"use client";

import React from "react";
import { useTranslation } from "shared/lib/i18n";
import clsx from "clsx";

import { ListData } from "widgets/Sidebar/lib/sidebar.types";

import css from "./SidebarList.module.scss";

interface Prop {
   className?: string;
   title: string;
   list: ListData[];
    activeId: string;
  onChange: (id: string) => void;
}

export const SidebarList: React.FC<Prop> = ({ className, title, list, onChange, activeId }) => {
    const { t } = useTranslation();

   return (
      <div className={clsx(css.sidebar_list, className)}>
         <h6>{title}</h6>

         <ul className={css.sidebar_list_data}>
            {list.map((item) => (
               <li key={item.id}>
                  <button
                     className={clsx(css.sidebar_list_button, activeId === item.id && css.active)}
                     onClick={() => onChange(item.id)}
                  >
                     {t.sidebar.modelTypes[item.nameKey]}

                     <span className={css.sidebar_list_count}>{item.count}</span>
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );
};
