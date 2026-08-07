"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { LoginForm } from "screens/00-Onboarding/ui/LoginForm";

import css from "./LogIn.module.scss";

export const LogIn: React.FC = () => {
   const router = useRouter();

   const handleComplete = () => {
      router.replace("/home");
   };

   return (
      <div className={css.login}>
         <div className={css.login_card}>
            <LoginForm
               onBack={handleComplete}
               onSubmit={handleComplete}
               onClose={handleComplete}
            />
         </div>
      </div>
   );
};
