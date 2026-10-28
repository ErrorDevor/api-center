import type { Metadata } from "next";

import { MainScreen } from "screens/00-Onboarding/ui/Main";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

interface Props {
   searchParams: Promise<{ email?: string; token?: string }>;
}

export const generateMetadata = (): Metadata => ({
   ...buildPageMetadata({
      title: "Set a new password – BEST AI PRICE",
      description: "Choose a new password for your BEST AI PRICE account.",
      path: "/reset-password",
   }),
   robots: { index: false, follow: false },
});

export default async function ResetPasswordPage({ searchParams }: Props) {
   const { email, token } = await searchParams;

   return <MainScreen mode="reset" resetEmail={email} resetToken={token} />;
}
