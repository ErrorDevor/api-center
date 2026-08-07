"use client";

import React from "react";

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = () => {
   const [isMobile, setIsMobile] = React.useState(false);

   React.useEffect(() => {
      const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

      const handleChange = () => {
         setIsMobile(media.matches);
      };

      handleChange();

      media.addEventListener("change", handleChange);

      return () => {
         media.removeEventListener("change", handleChange);
      };
   }, []);

   return isMobile;
};
