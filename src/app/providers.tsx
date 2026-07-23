"use client";

import React from "react";

import { I18nProvider } from "shared/lib/i18n";

interface Props {
   children: React.ReactNode;
}

export const Providers: React.FC<Props> = ({ children }) => {
   return <I18nProvider>{children}</I18nProvider>;
};
