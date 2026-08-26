/**
 * canonical_model_id looks like "anthropic/claude-sonnet-5" — the part
 * before the slash is the model vendor (the company that makes the model),
 * as opposed to provider_name/provider_domain which is the reseller.
 */
export const getVendorId = (canonicalModelId: string): string => {
   const [vendorId] = canonicalModelId.split("/");

   return vendorId || canonicalModelId;
};

// Fixed sidebar order — matches the original design's vendor list, kept
// stable regardless of which vendors currently have records in
// providers.json (a vendor with no data yet still shows up with count 0).
export const KNOWN_VENDOR_IDS: string[] = [
   "google",
   "openai",
   "deepseek",
   "minimax",
   "anthropic",
   "xai",
   "chatglm",
   "grok",
];

export const VENDOR_DISPLAY_NAMES: Record<string, string> = {
   google: "Google",
   openai: "OpenAI",
   deepseek: "DeepSeek",
   minimax: "Minimax",
   anthropic: "Anthropic",
   xai: "xAI",
   chatglm: "ChatGLM",
   grok: "Grok",
   // Shown as the model brand rather than the parent company (Zhipu makes
   // GLM, Moonshot makes Kimi, Kuaishou makes Kling, Bytedance makes
   // Seedance) — that's the name users actually recognize in this list.
   zhipu: "GLM",
   moonshot: "Kimi",
   alibaba: "Alibaba",
   kuaishou: "Kling",
   bytedance: "Seedance",
};

// Vendor ids without a display name that also lack an icon file yet.
const VENDORS_WITHOUT_ICONS = new Set(["alibaba"]);

// Every id here must have a matching /public/icons/providers/<id>.svg file.
const VENDORS_WITH_ICONS = new Set(
   Object.keys(VENDOR_DISPLAY_NAMES).filter((id) => !VENDORS_WITHOUT_ICONS.has(id))
);

export const getVendorDisplayName = (vendorId: string): string =>
   VENDOR_DISPLAY_NAMES[vendorId] ?? vendorId;

// Falls back to `undefined` for a vendor we don't have an icon for yet, so
// callers can decide how to render a missing icon instead of pointing at a
// 404'ing file.
export const getVendorIcon = (vendorId: string): string | undefined =>
   VENDORS_WITH_ICONS.has(vendorId) ? `/icons/providers/${vendorId}.svg` : undefined;
