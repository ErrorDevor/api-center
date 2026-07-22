import React, { SVGProps } from "react";

const TableIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
   return (
      <svg {...props} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path
            d="M6.00016 4H13.3335M6.00016 8H13.3335M6.00016 12H13.3335M3.3335 4V4.00667M3.3335 8V8.00667M3.3335 12V12.0067"
            stroke="#212121"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
};

export default TableIcon;
