import React from "react";

import { redirect } from "next/navigation";

import { shouldShowOnboarding } from "shared/lib/onboarding/onboarding-server";

interface Props {
   children: React.ReactNode;
}

export default async function OnboardingLayout({ children }: Props) {
   const shouldShow = await shouldShowOnboarding();

   if (!shouldShow) {
      redirect("/home");
   }

   return children;
}