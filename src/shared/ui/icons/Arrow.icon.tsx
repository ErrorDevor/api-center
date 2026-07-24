import React, { SVGProps } from "react";

const ArrowIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
   return (
      <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path
            d="M20 12H4M10 18L4 12L10 6"
            stroke="#212121"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
};

export default ArrowIcon;
