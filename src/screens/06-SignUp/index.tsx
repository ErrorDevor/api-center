"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { RegistrationForm } from "screens/00-Onboarding/ui/RegistrationForm";

import css from "./SignUp.module.scss";

// useSearchParams() opts the reading component out of static rendering
// unless wrapped in Suspense — see the home page route for the same
// pattern.
const SignUpView: React.FC = () => {
   const router = useRouter();
   const searchParams = useSearchParams();

   // Set by BestAiPriceRow's unauthenticated CTA (see
   // screens/01-Content/ui/BestAiPriceRow) so finishing registration lands
   // back on the model the visitor was looking at, not a generic /home.
   const selectedModelId = searchParams.get("model");

   const handleComplete = () => {
      router.replace(selectedModelId ? `/home/${selectedModelId}` : "/home");
   };

   return (
      <div className={css.signup}>
         <div className={css.signup_card}>
            <RegistrationForm
               onBack={handleComplete}
               onSuccess={handleComplete}
               onClose={handleComplete}
            />
         </div>
      </div>
   );
};

export const SignUp: React.FC = () => (
   <React.Suspense fallback={null}>
      <SignUpView />
   </React.Suspense>
);
