import type React from "react";

// Plain left click keeps the in-app handler; modified clicks fall through to
// the browser so "open in new tab" works on the real href.
export const handlePlainClick =
   (onClick: () => void) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (
         event.button !== 0 ||
         event.metaKey ||
         event.ctrlKey ||
         event.shiftKey ||
         event.altKey
      ) {
         return;
      }

      event.preventDefault();
      onClick();
   };
