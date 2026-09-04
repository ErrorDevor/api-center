// Model-maker ("vendor") icons for the /rating leaderboard.
//
// The llm_rankings.json feed carries no maker/organization field — only the
// model's display name — so the vendor is inferred from that name here. The
// slugs and the icon artwork are llm-stats.com's own provider set
// (https://llm-stats.com/logos/<slug>.<ext>), mirrored into
// /public/icons/rating/vendors so the table matches how llm-stats renders
// the same models.
//
// Keep NAME_TO_VENDOR_ID ordered most-specific-first: the first pattern that
// matches the model name wins.

const VENDOR_ICONS_BASE = "/icons/rating/vendors";

// Every vendor slug we have artwork for → its file (extension varies: some of
// llm-stats' logos are SVG, some PNG/WEBP/JPG). A slug with no entry here
// (e.g. sakana, sarvamai, upstage, thinking-machines — llm-stats ships no
// logo for them either) resolves to null and RatingRow draws its generic
// model glyph instead.
const VENDOR_ICON_FILE: Record<string, string> = {
   ai21: "ai21.jpg",
   alibaba: "alibaba.svg",
   amazon: "amazon.svg",
   anthropic: "anthropic.svg",
   baidu: "baidu.svg",
   "black-forest-labs": "black-forest-labs.webp",
   bytedance: "bytedance.webp",
   cartesia: "cartesia.png",
   cohere: "cohere.png",
   deepseek: "deepseek.svg",
   elevenlabs: "elevenlabs.svg",
   google: "google.svg",
   ibm: "ibm.svg",
   inception: "inception.svg",
   inworld: "inworld.jpg",
   kling: "kling.webp",
   lg: "lg.svg",
   lightricks: "lightricks.svg",
   liquid: "liquid.png",
   luma: "luma.webp",
   meituan: "meituan.svg",
   meta: "meta.svg",
   microsoft: "microsoft.svg",
   minimax: "minimax.webp",
   mistral: "mistral.svg",
   moonshotai: "moonshotai.svg",
   "nous-research": "nous-research.svg",
   nvidia: "nvidia.svg",
   openai: "openai.svg",
   openbmb: "openbmb.png",
   playai: "playai.svg",
   poolside: "poolside.svg",
   qwen: "qwen.png",
   recraft: "recraft.webp",
   reve: "reve.jpg",
   rime: "rime.jpg",
   sourceful: "sourceful.svg",
   stepfun: "stepfun.svg",
   tencent: "tencent.webp",
   unisound: "unisound.png",
   xai: "xai.svg",
   xiaomi: "xiaomi.svg",
   "zai-org": "zai-org.svg",
};

// Model-name → vendor slug. Patterns mirror how llm-stats.com attributes each
// model family to an organization.
const NAME_TO_VENDOR_ID: [RegExp, string][] = [
   [/\bclaude\b/i, "anthropic"],
   [/\b(chat)?gpt\b|\bcodex\b|^o[1-4](-|\b)/i, "openai"],
   [/\bgemini\b|gemma/i, "google"],
   [/\bgrok\b/i, "xai"],
   [/\bdeepseek\b/i, "deepseek"],
   [/\bkimi\b/i, "moonshotai"],
   [/\bglm\b/i, "zai-org"],
   [/\bqwen|\bqwq|\bqvq/i, "qwen"],
   [/\bnemotron\b/i, "nvidia"],
   [/\bhermes\b/i, "nous-research"],
   [/\bllama\b/i, "meta"],
   [/\bmuse (spark|glimmer|image)\b/i, "meta"],
   [
      /\b(mistral|ministral|codestral|devstral|magistral|pixtral|voxtral|shieldstral)\b|\bmin\s+istral\b/i,
      "mistral",
   ],
   [/\b(phi|mai)-?\b/i, "microsoft"],
   [/\bgranite\b/i, "ibm"],
   [/\bernie\b/i, "baidu"],
   [/\bjamba\b/i, "ai21"],
   [/^command \b|\bnorth \b|^parse$/i, "cohere"],
   [/\bnova\b/i, "amazon"],
   [/\blongcat\b/i, "meituan"],
   [/\bmimo\b/i, "xiaomi"],
   [/\bseed(ance|ream)?\b/i, "bytedance"],
   [/\bexaone\b/i, "lg"],
   [/\bstep-?\d|\bstep3\b/i, "stepfun"],
   [/\bhunyuan\b|^hy\d/i, "tencent"],
   [/\blfm\d/i, "liquid"],
   [/\bmercury\b/i, "inception"],
   [/\b(minimax|hailuo)\b/i, "minimax"],
   [/\bminicpm\b/i, "openbmb"],
   [/\blaguna\b/i, "poolside"],
   [/\bkling\b/i, "kling"],
   [/^u2$/i, "unisound"],
   // Image / video / speech makers (llm-stats' non-LLM leaderboards).
   [/\bsora\b|gpt image|\btts-1\b/i, "openai"],
   [/\bveo\b/i, "google"],
   [/\bflux\b/i, "black-forest-labs"],
   [/\bltx\b/i, "lightricks"],
   [/\briverflow\b/i, "sourceful"],
   [/\brecraft\b/i, "recraft"],
   [/^reve\b/i, "reve"],
   [/\bluma\b|\bray \d/i, "luma"],
   [/\bhappy horse\b/i, "alibaba"],
   [/\beleven\b|^multilingual v2$|^turbo v2$/i, "elevenlabs"],
   [/\b(sonic \d|sonic (english|multilingual)|ink-whisper)\b/i, "cartesia"],
   [/\binworld\b/i, "inworld"],
   [/\bplayai\b/i, "playai"],
   [/\barcana\b/i, "rime"],
   [/^speech \d|\bhailuo\b/i, "minimax"],
   // Makers llm-stats has no logo for — matched so the slug is still known,
   // but VENDOR_ICON_FILE has no file, so the row falls back to the glyph.
   [/\bsarvam\b/i, "sarvamai"],
   [/\b(sakana|namazu)\b/i, "sakana"],
   [/\binkling\b/i, "thinking-machines"],
   [/\bsolar pro\b/i, "upstage"],
];

export const vendorIdFromModelName = (modelName: string): string | null =>
   NAME_TO_VENDOR_ID.find(([pattern]) => pattern.test(modelName))?.[1] ?? null;

/**
 * Resolves a leaderboard model name to its maker's icon path, or null when
 * we can't place the maker or have no artwork for it (RatingRow then draws a
 * generic model glyph).
 */
export const getModelVendorIcon = (modelName: string): string | null => {
   const vendorId = vendorIdFromModelName(modelName);

   if (!vendorId) {
      return null;
   }

   const file = VENDOR_ICON_FILE[vendorId];

   return file ? `${VENDOR_ICONS_BASE}/${file}` : null;
};
