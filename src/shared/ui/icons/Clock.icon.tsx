import React, { SVGProps } from "react";

const ClockIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
   return (
      <svg {...props} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
         <g clipPath="url(#clip0_134_3870)">
            <circle cx="7.00033" cy="6.99996" r="5.83333" stroke="#797A79" strokeWidth="1.2" />
            <path
               d="M7 4.66663V6.99996L8.45833 8.45829"
               stroke="#797A79"
               strokeWidth="1.2"
               strokeLinecap="round"
               strokeLinejoin="round"
            />
         </g>
         <defs>
            <clipPath id="clip0_134_3870">
               <rect width="14" height="14" fill="white" />
            </clipPath>
         </defs>
      </svg>
   );
};

export default ClockIcon;
