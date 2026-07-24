import React, { SVGProps } from "react";

const ShareIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
   return (
      <svg {...props} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path
            d="M9.16523 3.42459L11.6479 5.63142C12.6283 6.50288 13.1185 6.93861 13.1185 7.49994C13.1185 8.06127 12.6283 8.497 11.6479 9.36846L9.16523 11.5753C8.71772 11.9731 8.49396 12.172 8.30948 12.0891C8.125 12.0063 8.125 11.7069 8.125 11.1082V9.6428C5.875 9.6428 3.4375 10.7142 2.5 12.4999C2.5 6.78565 5.83333 5.35708 8.125 5.35708V3.89172C8.125 3.29297 8.125 2.9936 8.30948 2.91075C8.49396 2.82791 8.71772 3.0268 9.16523 3.42459Z"
            stroke="#797A79"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
};

export default ShareIcon;
