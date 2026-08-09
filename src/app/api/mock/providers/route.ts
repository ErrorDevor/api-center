import { readFile } from "node:fs/promises";
import path from "node:path";

// Serves mock/providers.json for local development — point
// NEXT_PUBLIC_PROVIDERS_JSON_URL at this route (see .env.example) instead
// of shipping a fixture under public/, which would otherwise sit at the
// exact same path (/data/providers.json) production expects the real
// parser output to occupy.
export async function GET() {
   const filePath = path.join(process.cwd(), "mock", "providers.json");
   const contents = await readFile(filePath, "utf-8");

   return new Response(contents, {
      headers: { "Content-Type": "application/json" },
   });
}
