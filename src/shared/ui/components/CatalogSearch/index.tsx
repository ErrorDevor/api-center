"use client";

import React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Search } from "shared/ui/components/Search";

// How long typing settles before the `?q=` param (and the table) updates.
const DEBOUNCE_MS = 250;

// The header / mobile-sidebar search box, wired to the catalog. All state
// lives in the URL (`/home?q=<term>`) — same philosophy as the `?type=`
// filter — so a search is shareable and survives a reload. The box is
// rendered by a global widget (Header) mounted on pages that don't wrap
// themselves in <Suspense>, so useSearchParams() has to sit behind this
// component's own boundary (see the Next.js missing-suspense-with-csr-bailout
// note the /home page cites).
const CatalogSearchInner: React.FC = () => {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const urlQuery = searchParams.get("q") ?? "";
   const [value, setValue] = React.useState(urlQuery);

   // Follow the URL when it changes underneath us: back/forward, a shared
   // `?q=` link, or the query being dropped when the user drills into a
   // vendor/model.
   React.useEffect(() => {
      setValue(urlQuery);
   }, [urlQuery]);

   const pushQuery = React.useCallback(
      (nextQuery: string) => {
         const params = new URLSearchParams();
         const type = searchParams.get("type");

         if (type) {
            params.set("type", type);
         }

         const trimmed = nextQuery.trim();

         if (trimmed) {
            params.set("q", trimmed);
         }

         const queryString = params.toString();
         const href = `/home${queryString ? `?${queryString}` : ""}`;

         // Already on the catalog — replace so a burst of keystrokes doesn't
         // fill the history stack. Coming from another page — push, it's a
         // real navigation into /home.
         if (pathname.startsWith("/home")) {
            router.replace(href);
         } else {
            router.push(href);
         }
      },
      [pathname, router, searchParams]
   );

   const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

   React.useEffect(() => () => clearTimeout(timerRef.current), []);

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;

      setValue(nextValue);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => pushQuery(nextValue), DEBOUNCE_MS);
   };

   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
         clearTimeout(timerRef.current);
         pushQuery(value);
      }
   };

   return <Search value={value} onChange={handleChange} onKeyDown={handleKeyDown} />;
};

export const CatalogSearch: React.FC = () => (
   <React.Suspense fallback={<Search disabled />}>
      <CatalogSearchInner />
   </React.Suspense>
);
