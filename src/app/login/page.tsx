import type { Metadata } from "next";

import { MainScreen } from "screens/00-Onboarding/ui/Main";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

export const generateMetadata = (): Metadata =>
   buildPageMetadata({
      title: "Log in – BEST AI PRICE",
      description: "Log in to BEST AI PRICE to compare AI API prices, track providers and join group buys.",
      path: "/login",
   });

interface Props {
   searchParams: Promise<{ model?: string }>;
}

export default async function LogInPage({ searchParams }: Props) {
   const { model } = await searchParams;

   return <MainScreen mode="login" modelParam={model} />;
}
