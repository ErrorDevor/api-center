import { cookies } from "next/headers";

import {
   ONBOARDING_COOKIE_ENABLED,
   ONBOARDING_COOKIE_NAME,
   ONBOARDING_COOKIE_VALUE,
} from "./onboarding.constants";

export const isOnboardingCompleted = async (): Promise<boolean> => {
   if (!ONBOARDING_COOKIE_ENABLED) {
      return false;
   }

   const cookieStore = await cookies();
   const onboardingCookie = cookieStore.get(ONBOARDING_COOKIE_NAME);

   return onboardingCookie?.value === ONBOARDING_COOKIE_VALUE;
};
