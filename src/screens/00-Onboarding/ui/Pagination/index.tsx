import React from "react";

import clsx from "clsx";

import css from "./Pagination.module.scss";

interface Props {
   currentIndex: number;
   count: number;
}

export const Pagination: React.FC<Props> = ({ currentIndex, count }) => {
   return (
      <div
         className={css.pagination}
         role="status"
         aria-label={`Step ${currentIndex + 1} of ${count}`}
      >
         {Array.from({ length: count }, (_, index) => (
            <span
               key={index}
               className={clsx(
                  css.pagination_dot,
                  index === currentIndex && css.pagination_dot_active
               )}
               aria-hidden="true"
            />
         ))}
      </div>
   );
};
