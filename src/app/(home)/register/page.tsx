import type { Metadata } from "next";

import { MainScreen } from "screens/00-Onboarding/ui/Main";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

export const generateMetadata = (): Metadata =>
   buildPageMetadata({
      title: "Sign up – BEST AI PRICE",
      description: "Create a BEST AI PRICE account to compare AI API prices, track providers and join group buys.",
      path: "/register",
   });

interface Props {
   searchParams: Promise<{ model?: string }>;
}

export default async function Page({ searchParams }: Props) {
   const { model } = await searchParams;

   return <MainScreen modelParam={model} />;
}
