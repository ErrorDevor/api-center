"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { ONBOARDING_INITIAL_SLIDE_INDEX } from "./lib/onboarding.config";
import { ONBOARDING_ROLE_DATA } from "./lib/onboarding.data";
import type { OnboardingRole, OnboardingScreen } from "./lib/onboarding.types";
import { IntroSlide } from "./ui/IntroSlide";
import { RoleSelector } from "./ui/RoleSelector";

import { completeOnboarding } from "shared/lib/onboarding";

import css from "./Onboarding.module.scss";

export const Onboarding: React.FC = () => {
   const router = useRouter();

   const [screen, setScreen] = React.useState<OnboardingScreen>("role");
   const [selectedRole, setSelectedRole] = React.useState<OnboardingRole>("distribution");
   const [slideIndex, setSlideIndex] = React.useState(ONBOARDING_INITIAL_SLIDE_INDEX);

   const selectedRoleData = ONBOARDING_ROLE_DATA[selectedRole];
   const currentSlide = selectedRoleData.slides[slideIndex];

   const handleRoleChange = (role: OnboardingRole) => {
      setSelectedRole(role);
      setSlideIndex(ONBOARDING_INITIAL_SLIDE_INDEX);
   };

   const handleRoleSubmit = () => {
      setSlideIndex(ONBOARDING_INITIAL_SLIDE_INDEX);
      setScreen("intro");
   };

   const handlePrevious = () => {
      if (slideIndex > 0) {
         setSlideIndex((currentIndex) => currentIndex - 1);
         return;
      }

      setScreen("role");
   };

   const handleComplete = () => {
      completeOnboarding();
      router.replace("/home");
   };

   const handleNext = () => {
      const isLastSlide = slideIndex === selectedRoleData.slides.length - 1;

      if (!isLastSlide) {
         setSlideIndex((currentIndex) => currentIndex + 1);
         return;
      }

      handleComplete();
   };

   const handleClose = () => {
      completeOnboarding();
      router.replace("/home");
   };

   return (
      <section className={css.onboarding}>
         <div className={css.onboarding_card}>
            {screen === "role" && (
               <RoleSelector
                  selectedRole={selectedRole}
                  onRoleChange={handleRoleChange}
                  onSubmit={handleRoleSubmit}
                  onClose={handleClose}
               />
            )}

            {screen === "intro" && currentSlide && (
               <IntroSlide
                  role={selectedRole}
                  slide={currentSlide}
                  currentIndex={slideIndex}
                  slidesCount={selectedRoleData.slides.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onClose={handleClose}
               />
            )}
         </div>
      </section>
   );
};
