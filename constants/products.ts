import { Product } from "@/types/order";

export const SALES_TAX_RATE = 0.0825;

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "ROJA LOCA",
    description: "The sauce that bites back! Premium handcrafted salsa with bold flavor",
    image: "https://rork.app/pa/4x3iuxp19b3m8jwboe8y1/attachment_1737230473",
    prices: {
      "4oz": 5.00,
      "8oz": 8.00,
      "12oz": 12.00,
      "1gal": 100.00,
    },
    available: true,
  },
  {
    id: "2",
    name: "VERDE BRAVA",
    description: "Bold green salsa with a brave kick! Handcrafted with fresh ingredients",
    image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/rs5aswwfrdb0ee1tay95f",
    prices: {
      "4oz": 5.00,
      "8oz": 8.00,
      "12oz": 12.00,
      "1gal": 100.00,
    },
    available: true,
  },
];
