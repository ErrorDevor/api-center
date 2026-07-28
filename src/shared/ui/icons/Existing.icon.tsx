import React, { SVGProps } from "react";

const ExistingIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
   return (
      <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <circle cx="12" cy="6" r="4" strokeWidth="1.5" />
         <ellipse cx="12" cy="17" rx="7" ry="4" strokeWidth="1.5" />
      </svg>
   );
};

export default ExistingIcon;
//stroke="#797A79"
