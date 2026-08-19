// Server-only: talks to the real sub2api backend. Never import this from a
// "use client" file — it's only ever called from Route Handlers under
// src/app/api/auth/* and src/app/api/providers|comments/*, which proxy it
// behind same-origin, httpOnly-cookie sessions (see AuthProvider /
// session-cookies.ts). Browser JS never sees AUTH_API_BASE_URL or the
// tokens this returns.
import {
   clearSessionCookies,
   getRefreshToken,
   setSessionCookies,
} from "./session-cookies";
import { parseAuthTokens } from "./types";
import type { AuthTokens } from "./types";

// nginx already proxies bestaiprice.com/gateway/* to the sub2api gateway in
// production (see nginx/conf.d/default.conf's /gateway/ location) — the
// same public URL doubles as the local-dev default. Override via
// AUTH_API_BASE_URL if a different backend instance is needed.
export const AUTH_API_BASE_URL =
   process.env.AUTH_API_BASE_URL || "https://bestaiprice.com/gateway/api/v1";

export type Sub2ApiResult<T> =
   | { ok: true; data: T }
   | { ok: false; status: number; message: string };

interface Sub2ApiEnvelope {
   code: number;
   data: unknown;
   message: string;
}

const isEnvelope = (payload: unknown): payload is Sub2ApiEnvelope =>
   typeof payload === "object" &&
   payload !== null &&
   typeof (payload as Record<string, unknown>).code === "number";

/**
 * Calls one sub2api endpoint and unwraps its `{code, data, message}`
 * envelope. Never throws — network failures, non-JSON responses, and
 * `code !== 0` all come back as `{ok: false}` instead, so every Route
 * Handler can handle failures uniformly.
 */
export const callSub2Api = async <T>(
   path: string,
   init?: RequestInit & { accessToken?: string }
): Promise<Sub2ApiResult<T>> => {
   const { accessToken, headers, ...rest } = init ?? {};

   let response: Response;

   try {
      response = await fetch(`${AUTH_API_BASE_URL}${path}`, {
         ...rest,
         cache: "no-store",
         headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...headers,
         },
      });
   } catch {
      return { ok: false, status: 502, message: "Failed to reach the auth server" };
   }

   let payload: unknown;

   try {
      payload = await response.json();
   } catch {
      return { ok: false, status: 502, message: "Unexpected response from the auth server" };
   }

   if (!isEnvelope(payload)) {
      return { ok: false, status: 502, message: "Unexpected response from the auth server" };
   }

   if (payload.code !== 0) {
      return {
         ok: false,
         status: response.ok ? 400 : response.status,
         message: payload.message || "Auth request failed",
      };
   }

   return { ok: true, data: payload.data as T };
};

/**
 * Exchanges a refresh token for a new token pair. Shared by
 * /api/auth/refresh and /api/auth/profile's implicit retry-on-401.
 */
export const refreshTokens = async (refreshToken: string): Promise<Sub2ApiResult<AuthTokens>> => {
   const result = await callSub2Api<Record<string, unknown>>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
   });

   if (!result.ok) {
      return result;
   }

   const tokens = parseAuthTokens(result.data);

   if (!tokens) {
      return { ok: false, status: 502, message: "Unexpected response from the auth server" };
   }

   return { ok: true, data: tokens };
};

/**
 * Same as callSub2Api, but for endpoints that require a signed-in user: on a
 * 401 it silently refreshes the access token (via the refresh_token cookie)
 * and retries once, exactly like GET /api/auth/profile does today. On
 * success the new cookies are written before returning; on an unrecoverable
 * refresh failure the session cookies are cleared and the original 401 is
 * returned to the caller. Callers still need to check for a missing
 * accessToken themselves (this only handles an access token that has
 * *expired mid-session*, not a logged-out request).
 */
export const callSub2ApiWithAuth = async <T>(
   path: string,
   accessToken: string,
   init?: RequestInit
): Promise<Sub2ApiResult<T>> => {
   let result = await callSub2Api<T>(path, { ...init, accessToken });

   if (result.ok || result.status !== 401) {
      return result;
   }

   const refreshToken = await getRefreshToken();

   if (!refreshToken) {
      await clearSessionCookies();

      return result;
   }

   const refreshed = await refreshTokens(refreshToken);

   if (!refreshed.ok) {
      await clearSessionCookies();

      return result;
   }

   await setSessionCookies(refreshed.data);

   result = await callSub2Api<T>(path, { ...init, accessToken: refreshed.data.accessToken });

   if (!result.ok && result.status === 401) {
      await clearSessionCookies();
   }

   return result;
};
