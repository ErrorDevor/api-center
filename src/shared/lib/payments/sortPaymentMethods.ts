// Entries the feed lists that aren't useful to show.
const HIDDEN_METHODS = new Set(["CNY"]);

// Kept in the records (the payment filter still matches on them) but never
// shown in payment-method cells and panels.
const DISPLAY_HIDDEN_PATTERN = /^alipay$/i;

const CRYPTO_PATTERN = /crypto|usdt|usdc|btc|bitcoin|ethereum|\beth\b|\btrx\b|\bton\b/i;
const BANK_PATTERN = /bank|wire|transfer|\bach\b|sepa|swift/i;

// Crypto first, bank last, everything else in between — each group keeps
// the feed's own order, with a bare "Crypto" leading the crypto group.
const rank = (method: string): number => {
   if (CRYPTO_PATTERN.test(method)) {
      return method.toLowerCase() === "crypto" ? 0 : 1;
   }

   return BANK_PATTERN.test(method) ? 3 : 2;
};

export const sortPaymentMethods = (methods: string[]): string[] =>
   methods
      .filter((method) => !HIDDEN_METHODS.has(method))
      .map((method, index) => ({ method, index }))
      .sort(
         (first, second) => rank(first.method) - rank(second.method) || first.index - second.index
      )
      .map(({ method }) => method);

export const displayPaymentMethods = (methods: string[]): string[] =>
   sortPaymentMethods(methods).filter((method) => !DISPLAY_HIDDEN_PATTERN.test(method));
