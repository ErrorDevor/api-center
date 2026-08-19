// sub2api's user object, per AUTH_API_GUIDE.md — one superset shape covers
// both the register/login response's `user` (no `balance`) and GET
// /user/profile's fuller object (has `balance`), since the two otherwise
// match field-for-field.
export interface AuthUser {
   id: number;
   email: string;
   role: string;
   status: string;
   createdAt: string | null;
   balance: number | null;
}

export interface AuthTokens {
   accessToken: string;
   refreshToken: string;
   expiresIn: number;
}

const isNonEmptyString = (value: unknown): value is string =>
   typeof value === "string" && value.length > 0;

const isFiniteNumber = (value: unknown): value is number =>
   typeof value === "number" && Number.isFinite(value);

/**
 * Defensively parses a sub2api `user` object (from register/login/profile
 * responses) — same spirit as providers/types.ts's parsers: malformed
 * input returns null instead of throwing, since a broken/unexpected
 * backend payload shouldn't crash the page.
 */
export const parseAuthUser = (payload: unknown): AuthUser | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const id = raw.id;
   const email = raw.email;
   const role = raw.role;
   const status = raw.status;

   if (!isFiniteNumber(id) || !isNonEmptyString(email) || !isNonEmptyString(role) || !isNonEmptyString(status)) {
      return null;
   }

   return {
      id,
      email,
      role,
      status,
      createdAt: isNonEmptyString(raw.created_at) ? raw.created_at : null,
      balance: isFiniteNumber(raw.balance) ? raw.balance : null,
   };
};

/**
 * Defensively parses the token quadruple present on register/login/2fa/
 * refresh responses.
 */
export const parseAuthTokens = (payload: unknown): AuthTokens | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const raw = payload as Record<string, unknown>;

   const accessToken = raw.access_token;
   const refreshToken = raw.refresh_token;
   const expiresIn = raw.expires_in;

   if (!isNonEmptyString(accessToken) || !isNonEmptyString(refreshToken) || !isFiniteNumber(expiresIn)) {
      return null;
   }

   return { accessToken, refreshToken, expiresIn };
};
