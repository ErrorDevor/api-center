const isFiniteNumber = (value: unknown): value is number =>
   typeof value === "number" && Number.isFinite(value);

export interface ProviderCommentSummary {
   totalComments: number;
   negativeCount: number;
}

/**
 * Pulls just the two counts the UI needs (total reviews, negative reviews)
 * out of a GET /providers/:provider/comments response — the full shape
 * (comments list, pagination, positiveCount/positiveRatio) lives in
 * screens/03-Reviews/lib/comments.type.ts, which this deliberately doesn't
 * import: screens stay isolated from each other in this codebase, and the
 * summary is requested with page_size=1 anyway, so there's no comment list
 * here worth parsing.
 */
export const parseProviderCommentSummary = (payload: unknown): ProviderCommentSummary | null => {
   if (typeof payload !== "object" || payload === null) {
      return null;
   }

   const summary = (payload as Record<string, unknown>).summary;

   if (typeof summary !== "object" || summary === null) {
      return null;
   }

   const raw = summary as Record<string, unknown>;
   const totalComments = raw.total_comments;
   const negativeCount = raw.negative_count;

   if (!isFiniteNumber(totalComments) || !isFiniteNumber(negativeCount)) {
      return null;
   }

   return { totalComments, negativeCount };
};
