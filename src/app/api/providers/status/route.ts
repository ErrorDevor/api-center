import { parseProviderPriceRecords } from "shared/lib/providers/types";
import type { ProviderProbeStatus, ProviderProbeStatuses } from "shared/lib/providerStatus/types";
import { SITE_URL } from "shared/lib/seo/siteUrl";

// GET /api/providers/status — live availability of every reseller in
// providers.json: a trial request to its site, the HTTP code it answered
// with and when it last answered fine. Only URLs from that feed are ever
// requested, never anything the caller sends.

// Same feed (and same site-relative resolution) as app/sitemap.ts.
const PROVIDERS_JSON_URL = new URL(
   process.env.NEXT_PUBLIC_PROVIDERS_JSON_URL || "/gateway/data/providers.json",
   SITE_URL
).toString();

const CACHE_TTL_MS = 15 * 60 * 1000;
const PROBE_TIMEOUT_MS = 8000;
const PROBE_CONCURRENCY = 8;

// Answers that still prove the site is alive: 401/403/429 is what resellers
// behind bot protection send to a server-side request.
const ALIVE_CLIENT_CODES = new Set([401, 403, 429]);

const isAlive = (code: number) => code < 400 || ALIVE_CLIENT_CODES.has(code);

// Process memory: the last result per domain (it also carries lastOkAt across
// refreshes) and the run in flight, so concurrent requests share one round of
// probes. Resets on restart — lastOkAt is then rebuilt from the next success.
let cache: { at: number; statuses: ProviderProbeStatuses } | null = null;
let running: Promise<ProviderProbeStatuses> | null = null;
const previous = new Map<string, ProviderProbeStatus>();

const loadTargets = async (): Promise<Map<string, string>> => {
   const response = await fetch(PROVIDERS_JSON_URL, { cache: "no-store" });

   if (!response.ok) {
      throw new Error(`providers.json: ${response.status}`);
   }

   const targets = new Map<string, string>();

   for (const record of parseProviderPriceRecords(await response.json())) {
      if (!targets.has(record.providerDomain) && /^https?:\/\//i.test(record.providerUrl)) {
         targets.set(record.providerDomain, record.providerUrl);
      }
   }

   return targets;
};

const probe = async (domain: string, url: string): Promise<ProviderProbeStatus> => {
   const checkedAt = new Date().toISOString();
   let code: number | null = null;

   try {
      const response = await fetch(url, {
         method: "GET",
         redirect: "follow",
         cache: "no-store",
         signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
         headers: { "user-agent": "APIcenter-status-check" },
      });

      code = response.status;
      // Only the status line matters, don't download the page.
      void response.body?.cancel();
   } catch {
      code = null;
   }

   const ok = code !== null && isAlive(code);

   return {
      ok,
      code,
      checkedAt,
      lastOkAt: ok ? checkedAt : (previous.get(domain)?.lastOkAt ?? null),
   };
};

const probeAll = async (): Promise<ProviderProbeStatuses> => {
   const queue = Array.from(await loadTargets());
   const statuses: ProviderProbeStatuses = {};

   const worker = async () => {
      for (let entry = queue.shift(); entry; entry = queue.shift()) {
         const [domain, url] = entry;
         const status = await probe(domain, url);

         previous.set(domain, status);
         statuses[domain] = status;
      }
   };

   await Promise.all(Array.from({ length: PROBE_CONCURRENCY }, worker));

   return statuses;
};

export async function GET(): Promise<Response> {
   if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
      return Response.json({ data: cache.statuses });
   }

   running ??= probeAll()
      .then((statuses) => {
         cache = { at: Date.now(), statuses };

         return statuses;
      })
      .finally(() => {
         running = null;
      });

   try {
      return Response.json({ data: await running });
   } catch {
      // Feed unreachable: serve the stale result if there is one.
      return cache
         ? Response.json({ data: cache.statuses })
         : Response.json({ message: "Status check unavailable" }, { status: 502 });
   }
}
