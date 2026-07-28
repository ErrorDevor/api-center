export type PaymentRegionId =
   "all" | "global" | "europe" | "asia" | "middleEast" | "latinAmerica" | "africa" | "cis";

export type PaymentGroupId = "quickSelect" | "cards";

export type PaymentMethodId =
   | "anyCrypto"
   | "anyCard"
   | "anyWallet"
   | "bankTransfer"
   | "visa"
   | "mastercard"
   | "unionPay"
   | "americanExpress"
   | "wechat"
   | "alipay"
   | "usdt"
   | "uoi";

export interface PaymentRegion {
   id: PaymentRegionId;
   translationKey: PaymentRegionId;
   flexGrow?: number;
}

export interface PaymentMethod {
   id: PaymentMethodId;
   translationKey: PaymentMethodId;
   group: PaymentGroupId;
   regions: Exclude<PaymentRegionId, "all">[];
   price: number;
   emphasized?: boolean;
}

export const paymentRegions: PaymentRegion[] = [
   {
      id: "all",
      translationKey: "all",
   },
   {
      id: "global",
      translationKey: "global",
   },
   {
      id: "europe",
      translationKey: "europe",
   },
   {
      id: "asia",
      translationKey: "asia",
   },
   {
      id: "middleEast",
      translationKey: "middleEast",
   },
   {
      id: "latinAmerica",
      translationKey: "latinAmerica",
   },
   {
      id: "africa",
      translationKey: "africa",
   },
   {
      id: "cis",
      translationKey: "cis",
   },
];

export const paymentMethods: PaymentMethod[] = [
   {
      id: "anyCrypto",
      translationKey: "anyCrypto",
      group: "quickSelect",
      regions: ["global"],
      price: 40,
      emphasized: true,
   },
   {
      id: "anyCard",
      translationKey: "anyCard",
      group: "quickSelect",
      regions: ["global"],
      price: 40,
      emphasized: true,
   },
   {
      id: "anyWallet",
      translationKey: "anyWallet",
      group: "quickSelect",
      regions: ["global"],
      price: 40,
      emphasized: true,
   },
   {
      id: "bankTransfer",
      translationKey: "bankTransfer",
      group: "quickSelect",
      regions: ["global", "europe", "asia", "middleEast", "latinAmerica", "africa", "cis"],
      price: 40,
      emphasized: true,
   },
   {
      id: "visa",
      translationKey: "visa",
      group: "cards",
      regions: ["global", "europe", "asia", "middleEast", "latinAmerica", "africa", "cis"],
      price: 40,
   },
   {
      id: "mastercard",
      translationKey: "mastercard",
      group: "cards",
      regions: ["global", "europe", "asia", "middleEast", "latinAmerica", "africa", "cis"],
      price: 40,
   },
   {
      id: "unionPay",
      translationKey: "unionPay",
      group: "cards",
      regions: ["global", "asia", "cis"],
      price: 40,
   },
   {
      id: "americanExpress",
      translationKey: "americanExpress",
      group: "cards",
      regions: ["global", "europe", "latinAmerica"],
      price: 40,
   },
   {
      id: "wechat",
      translationKey: "wechat",
      group: "cards",
      regions: ["asia"],
      price: 40,
   },
   {
      id: "alipay",
      translationKey: "alipay",
      group: "cards",
      regions: ["asia"],
      price: 40,
   },
   {
      id: "usdt",
      translationKey: "usdt",
      group: "cards",
      regions: ["global", "asia", "cis"],
      price: 40,
   },
   {
      id: "uoi",
      translationKey: "uoi",
      group: "cards",
      regions: ["global"],
      price: 40,
   },
];
