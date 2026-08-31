// Sidebar's "Model Type" filter buckets (see widgets/Sidebar's
// modelTypeTitle). providers.json carries no content-type taxonomy of its
// own, so there's nothing to read off a record directly — this classifies
// canonical_model_id ("vendor/model-slug") by known naming patterns instead.
// It's a heuristic reading of the catalog as it exists today, not backend
// truth, and will misclassify a model whose name doesn't match any pattern
// here.
export type ModelContentType = "images" | "search" | "audioVideo" | "text" | "chat";

// Every ModelContentType as a runtime list — lets callers that get an
// untrusted string (e.g. the /home `?type=` query param) check it's a real
// bucket before using it.
export const MODEL_CONTENT_TYPES: readonly ModelContentType[] = [
   "images",
   "search",
   "audioVideo",
   "text",
   "chat",
];

export const isModelContentType = (value: string | null | undefined): value is ModelContentType =>
   value != null && (MODEL_CONTENT_TYPES as readonly string[]).includes(value);

// A model can match more than one bucket — a general-purpose LLM (Claude,
// GPT, Gemini, Kimi, ...) is a Chat model that also reads images and takes
// a Text/Search request, so it tags all four "general" buckets rather than
// just one. Narrow, single-purpose models (a dedicated image/video
// generator, an ASR model, an embedding model) only tag the one bucket
// their name actually points at.

// Checked before AUDIO_VIDEO_PATTERN so a model like "kling-image-o1" (an
// image model on an otherwise video-only vendor brand) lands on "images"
// rather than being swept up by the "kling" keyword below.
const IMAGE_ONLY_PATTERN =
   /image|\bimg\b|dall-?e|midjourney|stable-diffusion|\bsdxl\b|\bsd3\b|\bflux\b|imagen|kolors|seedream|ideogram|cogview|playground|photon|wanx/;

// Vendor brand names (kling, seedance) count as a match here since, today,
// every listing on those brands is a video model.
const AUDIO_VIDEO_PATTERN =
   /video|kling|seedance|\bveo\b|\bsora\b|runway|\bpika\b|\bluma\b|hailuo|cogvideo|music|\bsuno\b|\budio\b|elevenlabs|speech|voice|\btts\b|\basr\b|whisper|audio/;

// A model explicitly branded as a search product (e.g. Perplexity's
// "sonar" line) rather than a general chat model that merely has a search
// tool available.
const SEARCH_ONLY_PATTERN = /search|sonar|grounding/;

// Non-conversational text utility models (as opposed to the general chat
// assistants covered by the "general-purpose" fallback below).
const TEXT_ONLY_PATTERN = /embed|rerank|moderation|completion|\bbase\b/;

// Every general-purpose LLM's tag set — see the note above.
const GENERAL_PURPOSE_TYPES: ModelContentType[] = ["chat", "text", "search", "images"];

export const getModelContentTypes = (canonicalModelId: string): ModelContentType[] => {
   const slug = canonicalModelId.toLowerCase();

   if (IMAGE_ONLY_PATTERN.test(slug)) {
      return ["images"];
   }

   if (AUDIO_VIDEO_PATTERN.test(slug)) {
      return ["audioVideo"];
   }

   if (SEARCH_ONLY_PATTERN.test(slug)) {
      return ["search"];
   }

   if (TEXT_ONLY_PATTERN.test(slug)) {
      return ["text"];
   }

   return GENERAL_PURPOSE_TYPES;
};

export const modelMatchesContentType = (
   canonicalModelId: string,
   contentType: ModelContentType
): boolean => getModelContentTypes(canonicalModelId).includes(contentType);
