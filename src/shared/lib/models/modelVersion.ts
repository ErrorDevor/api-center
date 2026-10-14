// Pulls the ordered numeric version components out of a canonical model id
// ("anthropic/claude-sonnet-4-6" -> [4, 6], "openai/gpt-5.4-mini" -> [5, 4],
// "deepseek/deepseek-v3" -> [3]). providers.json carries no release date, so
// ranking a vendor's models by "newness" is really this naming heuristic:
// a model whose slug carries no version number (o3, kimi-k2, ...) gets an
// empty list and sorts below the versioned ones.
export const parseModelVersion = (canonicalModelId: string): number[] => {
   const [, modelSlug] = canonicalModelId.split("/");
   const source = modelSlug || canonicalModelId;

   return source
      .split(/[-_]/)
      .map((segment) => /^v?(\d+(?:\.\d+)?)/i.exec(segment)?.[1])
      .filter((match): match is string => match !== undefined)
      .flatMap((match) => match.split(".").map(Number));
};

// Orders two version lists newest-first. A missing component counts as -1,
// so "Sonnet 5" ([5]) ranks above "Sonnet 4-6" ([4, 6]) but below
// "Sonnet 5.1" ([5, 1]).
export const compareModelVersionDesc = (a: number[], b: number[]): number => {
   const length = Math.max(a.length, b.length);

   for (let index = 0; index < length; index += 1) {
      const diff = (b[index] ?? -1) - (a[index] ?? -1);

      if (diff !== 0) {
         return diff;
      }
   }

   return 0;
};
