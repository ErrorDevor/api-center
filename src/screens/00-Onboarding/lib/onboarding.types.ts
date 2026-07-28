export type OnboardingRole = "distribution" | "recipient";

export type OnboardingScreen = "role" | "intro" | "registration" | "login";

export type DistributionSlide =
   | {
        id: "add-account";
        translationKey: "addAccount";
     }
   | {
        id: "set-limits";
        translationKey: "setLimits";
     }
   | {
        id: "security-isolation";
        translationKey: "securityIsolation";
     };

export type RecipientSlide =
   | {
        id: "single-device";
        translationKey: "singleDevice";
     }
   | {
        id: "your-software";
        translationKey: "yourSoftware";
     }
   | {
        id: "privacy";
        translationKey: "privacy";
     };

export type OnboardingSlide = DistributionSlide | RecipientSlide;

export interface DistributionRoleData {
   id: "distribution";
   translationKey: "createGroupBuy";
   slides: DistributionSlide[];
}

export interface RecipientRoleData {
   id: "recipient";
   translationKey: "joinExisting";
   slides: RecipientSlide[];
}

export interface OnboardingRoleDataMap {
   distribution: DistributionRoleData;
   recipient: RecipientRoleData;
}

export type OnboardingRoleData = OnboardingRoleDataMap[OnboardingRole];
