import React from "react";

import { redirect } from "next/navigation";

import { isOnboardingCompleted } from "shared/lib/onboarding/onboarding-server";

interface Props {
   children: React.ReactNode;
}

export default async function OnboardingLayout({ children }: Props) {
   const onboardingCompleted = await isOnboardingCompleted();

   if (onboardingCompleted) {
      redirect("/home");
   }

   return children;
}