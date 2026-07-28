import React from "react";

import type { OnboardingRole, OnboardingSlide } from "../../lib/onboarding.types";
import { AddAccountStep } from "./steps/distribution/AddAccountStep";
import { SecurityIsolationStep } from "./steps/distribution/SecurityIsolationStep";
import { SetLimitsStep } from "./steps/distribution/SetLimitsStep";
import { PrivacyStep } from "./steps/recipient/PrivacyStep";
import { SingleDeviceStep } from "./steps/recipient/SingleDeviceStep";
import { YourSoftwareStep } from "./steps/recipient/YourSoftwareStep";

import { useTranslation } from "shared/lib/i18n";
import Image from "shared/ui/base/Image";

import { Navigation } from "../Navigation";
import { Pagination } from "../Pagination";

import css from "./IntroSlide.module.scss";

interface Props {
   role: OnboardingRole;
   slide: OnboardingSlide;
   currentIndex: number;
   slidesCount: number;
   onPrevious: () => void;
   onNext: () => void;
   onClose: () => void;
}

const renderStepContent = (slide: OnboardingSlide) => {
   switch (slide.id) {
      case "add-account":
         return <AddAccountStep />;

      case "set-limits":
         return <SetLimitsStep />;

      case "security-isolation":
         return <SecurityIsolationStep />;

      case "single-device":
         return <SingleDeviceStep />;

      case "your-software":
         return <YourSoftwareStep />;

      case "privacy":
         return <PrivacyStep />;
   }
};

export const IntroSlide: React.FC<Props> = ({
   role,
   slide,
   currentIndex,
   slidesCount,
   onPrevious,
   onNext,
   onClose,
}) => {
   const { t } = useTranslation();

   const translation = (() => {
      switch (slide.id) {
         case "add-account":
            return t.onboarding.distribution[slide.translationKey];

         case "set-limits":
            return t.onboarding.distribution[slide.translationKey];

         case "security-isolation":
            return t.onboarding.distribution[slide.translationKey];

         case "single-device":
            return t.onboarding.recipient[slide.translationKey];

         case "your-software":
            return t.onboarding.recipient[slide.translationKey];

         case "privacy":
            return t.onboarding.recipient[slide.translationKey];
      }
   })();

   return (
      <div className={css.intro_slide} data-role={role} data-step={slide.id}>
         <div className={css.intro_slide_visual}>{renderStepContent(slide)}</div>

         <button
            type="button"
            className={css.intro_slide_close}
            onClick={onClose}
            aria-label={t.onboarding.common.close}
         >
            <Image.Default src="/icons/close.svg" alt="" />
         </button>

         <div className={css.intro_slide_body}>
            <div className={css.intro_slide_content}>
               <Pagination currentIndex={currentIndex} count={slidesCount} />

               <div className={css.intro_slide_text}>
                  <h2 className={css.intro_slide_title}>{translation.title}</h2>

                  <p className={css.intro_slide_description}>{translation.description}</p>
               </div>
            </div>

            <Navigation onPrevious={onPrevious} onNext={onNext} />
         </div>
      </div>
   );
};
