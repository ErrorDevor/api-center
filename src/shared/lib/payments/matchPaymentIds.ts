import type { PaymentMethodId } from "shared/ui/components/PaymentMethodsModal/lib/paymentMethods.data";

// The payment picker's ids vs the free-form strings providers.json writes in
// payment_methods ("WeChat Pay", "USDT", "Stripe", "Alipay", ...). Matched
// case-insensitively; "any*" ids cover the whole family.
const PAYMENT_METHOD_PATTERNS: Record<PaymentMethodId, RegExp> = {
   anyCrypto: /crypto|usdt|usdc|btc|bitcoin|ethereum|\beth\b|\bton\b/i,
   anyCard: /card|visa|master|union\s?pay|amex|american express|stripe/i,
   anyWallet: /wallet|paypal|alipay|wechat|apple pay|google pay/i,
   bankTransfer: /bank|wire|transfer|ach|sepa|swift/i,
   visa: /visa/i,
   mastercard: /master\s?card/i,
   unionPay: /union\s?pay/i,
   americanExpress: /amex|american express/i,
   wechat: /wechat/i,
   alipay: /alipay/i,
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
