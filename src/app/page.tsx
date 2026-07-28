import { redirect } from "next/navigation";

import { isOnboardingCompleted } from "shared/lib/onboarding/onboarding-server";

export default async function RootPage() {
   const onboardingCompleted = await isOnboardingCompleted();

   redirect(onboardingCompleted ? "/home" : "/start");
}