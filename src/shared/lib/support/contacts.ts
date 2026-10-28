// Public support channels, set per environment (see .env.example). A channel
// that isn't configured is simply not rendered.
export const SUPPORT_TELEGRAM_URL = process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM_URL || "";
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";
