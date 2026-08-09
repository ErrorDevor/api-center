import type { ListData } from "./sidebar.types";

export type SidebarMode = "api" | "group-buys";

export type ModelBadge = "new" | "top";

// The provider/model list itself now comes from real data — see
// `toSidebarProviders` in `providers-to-sidebar.ts`. `modelType` has no
// real-data equivalent (no content-type taxonomy in providers.json) and
// stays a static mock for now.
export const modelType: ListData[] = [
   { id: "1", nameKey: "allTypes", count: 455 },
   { id: "2", nameKey: "images", count: 158 },
   { id: "3", nameKey: "search", count: 86 },
   { id: "4", nameKey: "audioVideo", count: 75 },
   { id: "5", nameKey: "text", count: 68 },
   { id: "6", nameKey: "chat", count: 68 },
];
