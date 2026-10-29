export interface ProviderProbeStatus {
   // True when the last probe got an answer that means "the site is up".
   ok: boolean;
   // HTTP status of the last probe; null when it never got a response
   // (timeout, DNS failure, refused connection).
   code: number | null;
   // ISO time of the last probe / of the last probe that succeeded.
   checkedAt: string;
   lastOkAt: string | null;
}

export type ProviderProbeStatuses = Record<string, ProviderProbeStatus>;

const isProbeStatus = (value: unknown): value is ProviderProbeStatus => {
   if (!value || typeof value !== "object") {
      return false;
   }

   const status = value as Record<string, unknown>;

   return (
      typeof status.ok === "boolean" &&
      (status.code === null || typeof status.code === "number") &&
      typeof status.checkedAt === "string" &&
      (status.lastOkAt === null || typeof status.lastOkAt === "string")
   );
};

export const parseProviderProbeStatuses = (value: unknown): ProviderProbeStatuses => {
   if (!value || typeof value !== "object") {
      return {};
   }

   return Object.fromEntries(Object.entries(value).filter(([, status]) => isProbeStatus(status)));
};
