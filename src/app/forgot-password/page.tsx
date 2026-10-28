import type { Metadata } from "next";

import { MainScreen } from "screens/00-Onboarding/ui/Main";

import { buildPageMetadata } from "shared/lib/seo/pageMetadata";

export const generateMetadata = (): Metadata =>
   buildPageMetadata({
      title: "Forgot password – BEST AI PRICE",
      description: "Restore access to your BEST AI PRICE account: we will email you a password reset link.",
      path: "/forgot-password",
   });

export default function ForgotPasswordPage() {
   return <MainScreen mode="forgot" />;
}
