import { Product } from "@/types/order";

export const SALES_TAX_RATE = 0.0825;

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Ay Chihuahua salsa\nROJO LOCA",
    description: "The sauce that bites back! Premium handcrafted salsa with bold flavor",
    image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0d5wse7balyg964zm1z5p",
    prices: {
      "4oz": 5.00,
      "8oz": 8.00,
      "12oz": 12.00,
      "1gal": 100.00,
    },
    available: true,
  },
];
