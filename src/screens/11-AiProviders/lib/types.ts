export type SortKey = "name" | "status";

export interface SortState {
   key: SortKey;
   direction: SortDirection;
}

export type SortDirection = "asc" | "desc";

export type ProviderStatusFilter = "all" | "working" | "not-working";

export type MobileSortValue = "default" | "working" | "not-working";