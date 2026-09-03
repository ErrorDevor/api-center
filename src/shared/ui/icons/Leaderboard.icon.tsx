import React, { SVGProps } from "react";

const LeaderboardIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
   return (
      <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path
            d="M17.5 17.5H2.5"
            strokeWidth="1.5"
            strokeLinecap="round"
         />
         <path
            d="M16.6667 17.4999V11.9444C16.6667 11.3307 16.2003 10.8333 15.625 10.8333H13.5417C12.9664 10.8333 12.5 11.3307 12.5 11.9444V17.4999"
            strokeWidth="1.5"
         />
         <path
            d="M12.5 17.5V4.75C12.5 3.68934 12.5 3.15901 12.1339 2.8295C11.7678 2.5 11.1785 2.5 10 2.5C8.82149 2.5 8.23223 2.5 7.86612 2.8295C7.5 3.15901 7.5 3.68934 7.5 4.75V17.5"
            strokeWidth="1.5"
         />
         <path
            d="M7.49967 17.5001V7.82746C7.49967 7.18642 7.0333 6.66675 6.45801 6.66675H4.37467C3.79938 6.66675 3.33301 7.18642 3.33301 7.82746V17.5001"
            strokeWidth="1.5"
         />
      </svg>
   );
};

export default LeaderboardIcon;
