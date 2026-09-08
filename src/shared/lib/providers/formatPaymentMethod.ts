// providers.json packs trial-offer info into payment_methods as a literal
// "Trial: Yes" / "Trial: No" entry alongside the real payment methods (see
// parseProviderPriceRecords, which already drops the noisy "Trial:
// Unconfirmed" variant so it never reaches here). Consumers that render the
// raw array — ModelRow's "Payment methods" column, CommentCardOptions'
// provider panel — run each entry through this instead of showing that
// internal marker verbatim. "Trial: No" is left as-is: there's no
// product-facing copy for "no trial" worth swapping it for.
export const formatPaymentMethod = (method: string, trialAvailableLabel: string): string =>
   method === "Trial: Yes" ? trialAvailableLabel : method;
