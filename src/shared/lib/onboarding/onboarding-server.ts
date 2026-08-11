import { cookies } from "next/headers";

import {
   ONBOARDING_NEW_USER_COOKIE_NAME,
   ONBOARDING_NEW_USER_COOKIE_VALUE,
} from "./onboarding.constants";

export const shouldShowOnboarding = async (): Promise<boolean> => {
   const cookieStore = await cookies();
   const onboardingCookie = cookieStore.get(ONBOARDING_NEW_USER_COOKIE_NAME);

   return onboardingCookie?.value === ONBOARDING_NEW_USER_COOKIE_VALUE;
};