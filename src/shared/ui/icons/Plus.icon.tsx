import React, { SVGProps } from "react";

const PlusIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
   return (
      <svg {...props} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M8 12V4M4 8H12" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
   );
};

export default PlusIcon;
