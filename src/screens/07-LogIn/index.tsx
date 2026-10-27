"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { LoginForm } from "screens/00-Onboarding/ui/LoginForm";

import { DASHBOARD_URL } from "shared/lib/gatewayPricing/cabinet";

import css from "./LogIn.module.scss";

export const LogIn: React.FC = () => {
   const router = useRouter();

   const handleComplete = () => {
      router.replace("/home");
   };

   // Signing in continues straight to the gateway dashboard (outside this
   // Next app, hence the full navigation).
   const handleLoggedIn = () => {
      window.location.assign(DASHBOARD_URL);
   };

   return (
      <div className={css.login}>
         <div className={css.login_card}>
            <LoginForm
               onBack={handleComplete}
               onSuccess={handleLoggedIn}
               onClose={handleComplete}
            />
         </div>
      </div>
   );
};
