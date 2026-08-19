export const ACCESS_TOKEN_COOKIE_NAME = "apicenter-access-token";
export const REFRESH_TOKEN_COOKIE_NAME = "apicenter-refresh-token";

// The guide's /auth/refresh response doesn't document a refresh_token
// expiry (unlike access_token's `expires_in`) — 30 days is our own
// assumption for how long a signed-out browser can stay silently
// refreshable before needing a real login again.
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
