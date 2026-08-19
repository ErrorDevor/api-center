"use client";

import React from "react";

import { useI18nContext } from "shared/lib/i18n";

import { parseAuthUser } from "./types";
import type { AuthUser } from "./types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthActionResult = { ok: true } | { ok: false; message: string };

interface AuthContextValue {
   user: AuthUser | null;
   status: AuthStatus;
   register: (email: string, password: string) => Promise<AuthActionResult>;
   login: (email: string, password: string) => Promise<AuthActionResult>;
   logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

interface Props {
   children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
   const { dictionary } = useI18nContext();

   const [user, setUser] = React.useState<AuthUser | null>(null);
   const [status, setStatus] = React.useState<AuthStatus>("loading");

   React.useEffect(() => {
      let cancelled = false;

      fetch("/api/auth/profile", { cache: "no-store" })
         .then((response) => response.json())
         .then((payload: { user?: unknown }) => {
            if (cancelled) {
               return;
            }

            const parsedUser = parseAuthUser(payload.user);

            setUser(parsedUser);
            setStatus(parsedUser ? "authenticated" : "unauthenticated");
         })
         .catch(() => {
            // Unreachable/unexpected — fail open to logged-out rather than
            // getting stuck on "loading" forever.
            if (!cancelled) {
               setUser(null);
               setStatus("unauthenticated");
            }
         });

      return () => {
         cancelled = true;
      };
   }, []);

   const runAuthAction = React.useCallback(
      async (endpoint: string, email: string, password: string): Promise<AuthActionResult> => {
         let response: Response;

         try {
            response = await fetch(endpoint, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ email, password }),
            });
         } catch {
            return { ok: false, message: dictionary.onboarding.common.networkError };
         }

         let payload: { user?: unknown; message?: string };

         try {
            payload = await response.json();
         } catch {
            payload = {};
         }

         if (!response.ok) {
            return { ok: false, message: payload.message || dictionary.onboarding.common.genericError };
         }

         const parsedUser = parseAuthUser(payload.user);

         if (!parsedUser) {
            return { ok: false, message: dictionary.onboarding.common.genericError };
         }

         setUser(parsedUser);
         setStatus("authenticated");

         return { ok: true };
      },
      [dictionary]
   );

   const register = React.useCallback(
      (email: string, password: string) => runAuthAction("/api/auth/register", email, password),
      [runAuthAction]
   );

   const login = React.useCallback(
      (email: string, password: string) => runAuthAction("/api/auth/login", email, password),
      [runAuthAction]
   );

   const logout = React.useCallback(async () => {
      try {
         await fetch("/api/auth/logout", { method: "POST" });
      } finally {
         // Logout is always treated as successful locally, even if the
         // backend call failed — matches the /api/auth/logout route's own
         // "always clear cookies" behavior.
         setUser(null);
         setStatus("unauthenticated");
      }
   }, []);

   const value = React.useMemo<AuthContextValue>(
      () => ({ user, status, register, login, logout }),
      [user, status, register, login, logout]
   );

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
   const context = React.useContext(AuthContext);

   if (!context) {
      throw new Error("useAuth must be used inside AuthProvider");
   }

   return context;
};
