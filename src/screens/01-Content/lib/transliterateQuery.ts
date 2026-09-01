// The catalog's text (model names, canonical ids, vendor + reseller names)
// is entirely Latin, so a query typed in Russian — "клод", "гпт", "джемини"
// — never matches. This module expands a Cyrillic query token into the Latin
// spellings it could mean, so the search still works.
//
// Two layers:
//  1. A curated alias map for brand/model words whose Russian spelling is
//     phonetic rather than a straight transliteration ("клод" → "claude",
//     "дипсик" → "deepseek", "квен" → "qwen").
//  2. A generic phonetic transliteration as a fallback for everything else —
//     it already covers a fair few on its own ("грок" → "grok", "гемини" →
//     "gemini", "опус" → "opus", "хайку" → "haiku").

// Keyed by a lower-cased Cyrillic token. Values are Latin substrings to try
// against the row text — keep them to fragments that actually appear in the
// catalog (canonical ids, model/vendor names).
const QUERY_ALIASES: Record<string, string[]> = {
   // Vendors / labs
   антропик: ["anthropic"],
   опенай: ["openai", "gpt"],
   опенэйай: ["openai"],
   гугл: ["google", "gemini"],
   дипсик: ["deepseek"],
   дипсек: ["deepseek"],
   минимакс: ["minimax"],
   муншот: ["moonshot", "kimi"],
   алибаба: ["alibaba", "qwen"],
   алибабе: ["alibaba", "qwen"],
   зипу: ["zhipu", "glm"],
   квайшоу: ["kuaishou", "kling"],
   байтданс: ["bytedance", "seedance"],
   перплексити: ["perplexity", "sonar"],
   иксэйай: ["xai", "grok"],

   // Model families
   клод: ["claude"],
   клауд: ["claude"],
   клауде: ["claude"],
   соннет: ["sonnet"],
   сонет: ["sonnet"],
   опус: ["opus"],
   хайку: ["haiku"],
   гпт: ["gpt"],
   чатгпт: ["gpt", "chatgpt"],
   джипити: ["gpt"],
   гемини: ["gemini"],
   джемини: ["gemini"],
   джемани: ["gemini"],
   квен: ["qwen"],
   кими: ["kimi"],
   грок: ["grok"],
   глм: ["glm"],
   лама: ["llama"],
   ллама: ["llama"],
   мистраль: ["mistral"],
   флакс: ["flux"],
   флукс: ["flux"],
   флюкс: ["flux"],
   клинг: ["kling"],
   сидэнс: ["seedance"],
   сиднс: ["seedance"],
   мидджорни: ["midjourney"],
   миджорни: ["midjourney"],
   вео: ["veo"],
   сора: ["sora"],
   имаджен: ["imagen"],
   далли: ["dall-e", "dalle"],
   виспер: ["whisper"],
   сонар: ["sonar"],
};

// Phonetic-ish, lower-cased. "й"/"и" → "i" and "х" → "h" are the choices that
// make the fallback land on the English spellings people actually search for
// (haiku, gemini) rather than a strict GOST rendering.
const TRANSLIT_MAP: Record<string, string> = {
   а: "a",
   б: "b",
   в: "v",
   г: "g",
   д: "d",
   е: "e",
   ё: "e",
   ж: "zh",
   з: "z",
   и: "i",
   й: "i",
   к: "k",
   л: "l",
   м: "m",
   н: "n",
   о: "o",
   п: "p",
   р: "r",
   с: "s",
   т: "t",
   у: "u",
   ф: "f",
   х: "h",
   ц: "ts",
   ч: "ch",
   ш: "sh",
   щ: "sch",
   ъ: "",
   ы: "y",
   ь: "",
   э: "e",
   ю: "yu",
   я: "ya",
};

const CYRILLIC = /[а-яё]/;

const transliterate = (token: string): string =>
   token.replace(/[а-яё]/g, (char) => TRANSLIT_MAP[char] ?? char);

/**
 * A query token plus every Latin spelling it might stand for. A pure-Latin
 * token comes back unchanged (as a single-element list); a Cyrillic one gains
 * its curated alias(es) and/or a transliteration. The caller matches a row if
 * ANY returned variant is found in it.
 */
export const expandQueryToken = (token: string): string[] => {
   const variants = new Set<string>([token]);

   const aliases = QUERY_ALIASES[token];

   if (aliases) {
      for (const alias of aliases) {
         variants.add(alias);
      }
   }

   // Skip 1-char Cyrillic tokens — a bare "о" → "o" would match every row.
   if (token.length > 1 && CYRILLIC.test(token)) {
      variants.add(transliterate(token));
   }

   return [...variants];
};
