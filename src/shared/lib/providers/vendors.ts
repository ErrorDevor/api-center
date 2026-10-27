/**
 * canonical_model_id looks like "anthropic/claude-sonnet-5" — the part
 * before the slash is the model vendor (the company that makes the model),
 * as opposed to provider_name/provider_domain which is the reseller.
 */
// The feed spells some vendors in more than one way (moonshot / moonshotai);
// fold them into one id so the sidebar and rows show a single vendor.
const VENDOR_ID_ALIASES: Record<string, string> = {
   moonshotai: "moonshot",
};

export const getVendorId = (canonicalModelId: string): string => {
   const [rawVendorId] = canonicalModelId.split("/");
   const vendorId = rawVendorId || canonicalModelId;

   return VENDOR_ID_ALIASES[vendorId] ?? vendorId;
};

// Fixed sidebar order — matches the original design's vendor list, kept
// stable regardless of which vendors currently have records in
// providers.json (a vendor with no data yet still shows up with count 0).
export const KNOWN_VENDOR_IDS: string[] = [
   "anthropic",
   "openai",
   "google",
   "deepseek",
   "minimax",
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
   xai: "Grok",
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
   typesafe: "Jev",
};

// Vendor ids without a display name that also lack an icon file yet.
const VENDORS_WITHOUT_ICONS = new Set(["alibaba"]);

// Every id here must have a matching /public/icons/providers/<id>.svg file
// (or .png for the ids in PNG_ICON_VENDORS).
const PNG_ICON_VENDORS = new Set(["typesafe"]);

const VENDORS_WITH_ICONS = new Set(
   Object.keys(VENDOR_DISPLAY_NAMES).filter((id) => !VENDORS_WITHOUT_ICONS.has(id))
);

export const getVendorDisplayName = (vendorId: string): string =>
   VENDOR_DISPLAY_NAMES[vendorId] ?? vendorId;

// Falls back to `undefined` for a vendor we don't have an icon for yet, so
// callers can decide how to render a missing icon instead of pointing at a
// 404'ing file.
export const getVendorIcon = (vendorId: string): string | undefined =>
   VENDORS_WITH_ICONS.has(vendorId)
      ? `/icons/providers/${vendorId}.${PNG_ICON_VENDORS.has(vendorId) ? "png" : "svg"}`
      : undefined;
