import type { OnboardingRoleDataMap } from "./onboarding.types";

export const ONBOARDING_ROLE_DATA: OnboardingRoleDataMap = {
   distribution: {
      id: "distribution",
      translationKey: "createGroupBuy",

      slides: [
         {
            id: "add-account",
            translationKey: "addAccount",
         },
         {
            id: "set-limits",
            translationKey: "setLimits",
         },
         {
            id: "security-isolation",
            translationKey: "securityIsolation",
         },
      ],
   },

   recipient: {
      id: "recipient",
      translationKey: "joinExisting",

      slides: [
         {
            id: "single-device",
            translationKey: "singleDevice",
         },
         {
            id: "your-software",
            translationKey: "yourSoftware",
         },
         {
            id: "privacy",
            translationKey: "privacy",
         },
      ],
   },
};
