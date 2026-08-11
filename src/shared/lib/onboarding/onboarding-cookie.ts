import {
   ONBOARDING_NEW_USER_COOKIE_NAME,
   ONBOARDING_NEW_USER_COOKIE_VALUE,
} from "./onboarding.constants";

export const markUserAsNew = (): void => {
   if (typeof document === "undefined") {
      return;
   }

   const cookieParts = [
      `${ONBOARDING_NEW_USER_COOKIE_NAME}=${ONBOARDING_NEW_USER_COOKIE_VALUE}`,
      "Path=/",
      "SameSite=Lax",
   ];

   if (process.env.NODE_ENV === "production") {
      cookieParts.push("Secure");
   }

   document.cookie = cookieParts.join("; ");
};

export const completeOnboarding = (): void => {
   if (typeof document === "undefined") {
      return;
   }

   const cookieParts = [
      `${ONBOARDING_NEW_USER_COOKIE_NAME}=`,
      "Path=/",
      "Max-Age=0",
      "SameSite=Lax",
   ];

   if (process.env.NODE_ENV === "production") {
      cookieParts.push("Secure");
   }

   document.cookie = cookieParts.join("; ");
};
