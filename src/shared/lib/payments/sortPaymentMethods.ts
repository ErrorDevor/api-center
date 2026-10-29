// Entries the feed lists that aren't useful to show.
const HIDDEN_METHODS = new Set(["CNY"]);

// Present in the feed's records but never shown in payment-method cells and
// panels. The Chinese rails (Alipay, WeChat Pay) are not offered here, so they
// must not surface next to crypto/card/bank — and they have no picker id, so no
// filter can bring a provider back through them either.
const DISPLAY_HIDDEN_PATTERN = /^(alipay|wechat|wechat\s?pay)$/i;

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
