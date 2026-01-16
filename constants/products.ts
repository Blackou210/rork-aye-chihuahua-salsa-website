import { Product } from "@/types/order";

export const SALES_TAX_RATE = 0.0825;

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "ROJA LOCA",
    description: "The sauce that bites back! Premium handcrafted salsa with bold flavor",
    image: "https://r2-pub.rork.com/generated-images/cb56cef7-c426-4d9f-a05a-639daf44b4c7.png",
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
    image: "https://r2-pub.rork.com/generated-images/73187333-da3e-4fde-b1f4-3f8dc6a80bc6.png",
    prices: {
      "4oz": 5.00,
      "8oz": 8.00,
      "12oz": 12.00,
      "1gal": 100.00,
    },
    available: true,
  },
];
