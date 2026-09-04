import "shared/styles/index.scss";

import { Metadata } from "next";
import { Inter_Tight } from "next/font/google";

import { GoogleAnalytics } from "@next/third-parties/google";

import { Providers } from "./providers";

const GA_MEASUREMENT_ID = "G-DS3V7S0NC9";

const interTight = Inter_Tight({
   subsets: ["cyrillic", "latin"],
   variable: "--font-inter-tight",
   display: "swap",
   preload: true,
});

export const metadata: Metadata = {
   title: "APIcenter",
   description: "APIcenter",
   icons: {
      icon: [{ url: "/favicon.png", type: "image/svg+xml" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" className={interTight.variable}>
         <body>
            <Providers>{children}</Providers>
         </body>
         <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </html>
   );
}
