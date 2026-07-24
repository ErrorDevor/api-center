import React, { SVGProps } from "react";

const ReplyIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
   return (
      <svg {...props} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path
            d="M7.5 13.125C10.6066 13.125 13.125 10.6066 13.125 7.5C13.125 4.3934 10.6066 1.875 7.5 1.875C4.3934 1.875 1.875 4.3934 1.875 7.5C1.875 8.39982 2.08628 9.25029 2.46195 10.0045C2.56178 10.2049 2.59501 10.434 2.53713 10.6503L2.2021 11.9025C2.05666 12.4461 2.55395 12.9433 3.09751 12.7979L4.34965 12.4629C4.56596 12.405 4.79505 12.4382 4.99548 12.5381C5.74971 12.9137 6.60018 13.125 7.5 13.125Z"
            stroke="#797A79"
            strokeWidth="1.2"
         />
      </svg>
   );
};

export default ReplyIcon;
