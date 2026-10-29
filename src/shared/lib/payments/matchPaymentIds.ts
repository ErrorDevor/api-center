import type { PaymentMethodId } from "shared/ui/components/PaymentMethodsModal/lib/paymentMethods.data";

// The payment picker's ids vs the free-form strings providers.json writes in
// payment_methods ("USDT", "Stripe", "Visa", ...). Matched case-insensitively;
// "any*" ids cover the whole family.
//
// The Chinese rails (WeChat Pay, Alipay) are not offered here, so they have no
// picker id — and they are excluded from the families too, otherwise a provider
// that only accepts Alipay would still be reachable through "Any wallet".
const PAYMENT_METHOD_PATTERNS: Record<PaymentMethodId, RegExp> = {
   anyCrypto: /crypto|usdt|usdc|btc|bitcoin|ethereum|\beth\b|\bton\b/i,
   anyCard: /card|visa|master|union\s?pay|amex|american express|stripe/i,
   anyWallet: /wallet|paypal|apple pay|google pay/i,
   bankTransfer: /bank|wire|transfer|ach|sepa|swift/i,
   visa: /visa/i,
   mastercard: /master\s?card/i,
   unionPay: /union\s?pay/i,
   americanExpress: /amex|american express/i,
   usdt: /usdt/i,
   uoi: /uoi/i,
};

export const matchesPaymentIds = (
   paymentMethods: string[],
   selectedIds: PaymentMethodId[]
): boolean =>
   selectedIds.some((id) =>
      paymentMethods.some((method) => PAYMENT_METHOD_PATTERNS[id].test(method))
   );
