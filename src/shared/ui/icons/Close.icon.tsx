import React, { SVGProps } from "react";

const CloseIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
   return (
      <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path
            d="M7.75684 16.2428L16.2428 7.75684M16.2428 16.2428L7.75684 7.75684"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
};

export default CloseIcon;
