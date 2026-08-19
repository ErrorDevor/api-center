// Server-only: reads/writes the two httpOnly session cookies. Mirrors the
// onboarding-cookie.ts / onboarding-server.ts split, but there's no
// client-side half here — unlike the onboarding cookie, these must never
// be readable from `document.cookie`, so every operation goes through
// next/headers `cookies()` inside a Route Handler.
import { cookies } from "next/headers";

import {
   ACCESS_TOKEN_COOKIE_NAME,
   REFRESH_TOKEN_COOKIE_NAME,
   REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "./auth.constants";
import type { AuthTokens } from "./types";

const baseCookieOptions = {
   httpOnly: true,
   secure: process.env.NODE_ENV === "production",
   sameSite: "lax" as const,
   path: "/",
};

export const setSessionCookies = async (tokens: AuthTokens): Promise<void> => {
   const cookieStore = await cookies();

   cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
      ...baseCookieOptions,
      maxAge: tokens.expiresIn,
   });

   cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
      ...baseCookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
   });
};

export const clearSessionCookies = async (): Promise<void> => {
   const cookieStore = await cookies();

   cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
   cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
};

export const getAccessToken = async (): Promise<string | undefined> => {
   const cookieStore = await cookies();

   return cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
};

export const getRefreshToken = async (): Promise<string | undefined> => {
   const cookieStore = await cookies();

   return cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
};
