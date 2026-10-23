// "claude-opus-4.5:free" / "gpt-5-4-20260305" -> "claude-opus-4-5" /
// "gpt-5-4" — the key shape used by modelCapabilities. Kept out of the
// "use server" action file, which may only export async functions.
export const capabilitySlug = (slug: string): string =>
   slug
      .toLowerCase()
      .split(":")[0]
      .replace(/\./g, "-")
      .replace(/-(20)?\d{6}$/, "");
