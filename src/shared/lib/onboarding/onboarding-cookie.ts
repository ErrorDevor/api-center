import {
   ONBOARDING_COOKIE_ENABLED,
   ONBOARDING_COOKIE_MAX_AGE,
   ONBOARDING_COOKIE_NAME,
   ONBOARDING_COOKIE_VALUE,
} from "./onboarding.constants";

export const completeOnboarding = (): void => {
   if (!ONBOARDING_COOKIE_ENABLED || typeof document === "undefined") {
      return;
   }

   const cookieParts = [
      `${ONBOARDING_COOKIE_NAME}=${ONBOARDING_COOKIE_VALUE}`,
      "Path=/",
      `Max-Age=${ONBOARDING_COOKIE_MAX_AGE}`,
      "SameSite=Lax",
   ];

   if (process.env.NODE_ENV === "production") {
      cookieParts.push("Secure");
   }

   document.cookie = cookieParts.join("; ");
};

export const resetOnboarding = (): void => {
   if (typeof document === "undefined") {
      return;
   }

   const cookieParts = [`${ONBOARDING_COOKIE_NAME}=`, "Path=/", "Max-Age=0", "SameSite=Lax"];

   if (process.env.NODE_ENV === "production") {
      cookieParts.push("Secure");
   }

   document.cookie = cookieParts.join("; ");
};
