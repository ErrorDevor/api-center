"use client";

import React from "react";

import { AuthProvider } from "shared/lib/auth";
import { I18nProvider } from "shared/lib/i18n";

interface Props {
   children: React.ReactNode;
}

export const Providers: React.FC<Props> = ({ children }) => {
   return (
      <I18nProvider>
         <AuthProvider>{children}</AuthProvider>
      </I18nProvider>
   );
};
