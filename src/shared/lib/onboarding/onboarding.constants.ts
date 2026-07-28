export const ONBOARDING_COOKIE_NAME = "apicenter-onboarding-completed";
export const ONBOARDING_COOKIE_VALUE = "true";
export const ONBOARDING_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const ONBOARDING_COOKIE_ENABLED =
   process.env.NEXT_PUBLIC_ONBOARDING_COOKIE_ENABLED === "true";
