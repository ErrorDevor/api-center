// Sidebar's "Model Type" filter buckets (see widgets/Sidebar's
// modelTypeTitle). providers.json carries no content-type taxonomy of its
// own, so there's nothing to read off a record directly — this classifies
// canonical_model_id ("vendor/model-slug") by known naming patterns instead.
// It's a heuristic reading of the catalog as it exists today, not backend
// truth, and will misclassify a model whose name doesn't match any pattern
// here.
export type ModelContentType = "images" | "search" | "audioVideo" | "text" | "chat" | "coding";

// Every ModelContentType as a runtime list — lets callers that get an
// untrusted string (e.g. the /home `?type=` query param) check it's a real
// bucket before using it.
export const MODEL_CONTENT_TYPES: readonly ModelContentType[] = [
   "images",
   "search",
   "audioVideo",
   "text",
   "chat",
   "coding",
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
const SEARCH_ONLY_PATTERN = /\bsearch\b|sonar|grounding/;

// Non-conversational text utility models (as opposed to the general chat
// assistants covered by the "general-purpose" fallback below).
const TEXT_ONLY_PATTERN = /embed|rerank|moderation|completion|\bbase\b/;

// Code-specialised models ("qwen3-coder", "gpt-5.1-codex", "devstral",
// "codestral", "kimi-k2.7-code") that no catalog files under programming
// yet. The main signal is OpenRouter's own "programming" category (hints.coding);
// this only backfills by name. Descriptions are deliberately not used — they
// call general models "great at coding" too.
const CODING_PATTERN = /code|coder|codex|codestral|devstral|\bswe\b|-build\b/;

// What a public catalog (see modelCapabilities.action) knows about a model.
// Optional: models it doesn't list fall back to the name patterns alone.
interface ModelCapabilityHints {
   out: string[];
   search: boolean;
   coding: boolean;
}

export const getModelContentTypes = (
   canonicalModelId: string,
   hints?: ModelCapabilityHints
): ModelContentType[] => {
   const slug = canonicalModelId.toLowerCase();

   if (hints?.out.includes("image") || IMAGE_ONLY_PATTERN.test(slug)) {
      return ["images"];
   }

   if (
      hints?.out.some((modality) => modality === "video" || modality === "audio") ||
      AUDIO_VIDEO_PATTERN.test(slug)
   ) {
      return ["audioVideo"];
   }

   if (SEARCH_ONLY_PATTERN.test(slug)) {
      return ["search"];
   }

   if (TEXT_ONLY_PATTERN.test(slug) || hints?.out.includes("embeddings")) {
      return ["text"];
   }

   // A general-purpose LLM: Chat and Text, plus Search when it has built-in
   // web search and Coding when it is a code-specialised model. Reading
   // images is input, not a generated type, so it no longer tags "images".
   const types: ModelContentType[] = ["chat", "text"];

   if (hints?.search) {
      types.push("search");
   }

   if (hints?.coding || CODING_PATTERN.test(slug)) {
      types.push("coding");
   }

   return types;
};

export const modelMatchesContentType = (
   canonicalModelId: string,
   contentType: ModelContentType,
   hints?: ModelCapabilityHints
): boolean => getModelContentTypes(canonicalModelId, hints).includes(contentType);
