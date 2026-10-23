import { getVendorId } from "shared/lib/providers/vendors";

const isShortNumber = (segment: string): boolean => /^\d{1,2}$/.test(segment);

// "glm-5", "k2", "v4", "gpt-4" -> a segment that ends in a short version
// component, i.e. something a following "-3" can be the minor part of.
const endsWithShortNumber = (segment: string): boolean => /^[a-z]*\d{1,2}$/i.test(segment);

const isYear = (segment: string | undefined): boolean => /^(19|20)\d{2}$/.test(segment ?? "");

// The feed spells one model several ways: "glm-5-3" / "glm-5.3",
// "gemini-2-5-flash" / "gemini-2.5-flash", "moonshot/..." / "moonshotai/...".
// Each spelling used to become its own sidebar entry and table group. This
// folds them into a single id: vendor aliases are resolved and a version
// written with a hyphen ("5-3") is rewritten with a dot ("5.3"). Dates
// ("2024-08-06", "20250514") and longer numbers are left alone.
export const normalizeCanonicalModelId = (canonicalModelId: string): string => {
   const slashIndex = canonicalModelId.indexOf("/");

   if (slashIndex === -1) {
      return canonicalModelId;
   }

   const vendorId = getVendorId(canonicalModelId);
   const segments = canonicalModelId.slice(slashIndex + 1).split("-");
   let slug = segments[0] ?? "";

   for (let index = 1; index < segments.length; index += 1) {
      const segment = segments[index];
      const previous = segments[index - 1];
      const isMinorVersion =
         isShortNumber(segment) &&
         endsWithShortNumber(previous) &&
         !isYear(segments[index - 2]) &&
         !isYear(previous);

      slug += (isMinorVersion ? "." : "-") + segment;
   }

   return `${vendorId}/${slug}`;
};

const KNOWN_ACRONYMS = new Set(["gpt", "glm", "tts"]);
const BRAND_NAMES: Record<string, string> = { deepseek: "DeepSeek" };

const capitalizeSegment = (segment: string): string => {
   if (KNOWN_ACRONYMS.has(segment.toLowerCase())) {
      return segment.toUpperCase();
   }

   const brandName = BRAND_NAMES[segment.toLowerCase()];

   if (brandName) {
      return brandName;
   }

   return segment ? segment[0].toUpperCase() + segment.slice(1) : segment;
};

// "anthropic/claude-opus-5.5" -> "Claude Opus 5.5", "zhipu/glm-5.3-flash" ->
// "GLM 5.3 Flash". Used where the models.json catalog has no display name.
// Trailing snapshot dates ("-20251001", "-260215") are dropped.
export const formatModelName = (canonicalModelId: string): string => {
   const slug = canonicalModelId.split("/").slice(1).join("/") || canonicalModelId;

   return slug
      .split("-")
      .filter((segment, index) => index === 0 || !/^\d{6,8}$/.test(segment))
      .map(capitalizeSegment)
      .join(" ");
};
