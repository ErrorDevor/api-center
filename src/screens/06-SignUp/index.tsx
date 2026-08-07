"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { RegistrationForm } from "screens/00-Onboarding/ui/RegistrationForm";

import css from "./SignUp.module.scss";

export const SignUp: React.FC = () => {
   const router = useRouter();

   const handleComplete = () => {
      router.replace("/home");
   };

   return (
      <div className={css.signup}>
         <div className={css.signup_card}>
            <RegistrationForm
               onBack={handleComplete}
               onSubmit={handleComplete}
               onClose={handleComplete}
            />
         </div>
      </div>
   );
};
