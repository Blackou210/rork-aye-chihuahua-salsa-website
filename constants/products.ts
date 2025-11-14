import { Product } from "@/types/order";

export const SALES_TAX_RATE = 0.0825;

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Roja loca 🌶️",
    description: "Handcrafted, made-to-order salsa with fresh ingredients",
    image: "https://www.maricruzavalos.com/wp-content/uploads/2021/12/chile_guajillo_sauce.webp",
    prices: {
      "4oz": 5.00,
      "8oz": 8.00,
      "12oz": 12.00,
      "1gal": 100.00,
    },
    available: true,
  },
];
