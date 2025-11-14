import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CartItem, Order, OrderStatus, SalsaSize } from "../types/order";
import { SALES_TAX_RATE } from "@/constants/products";

const CART_KEY = "@aye_chihuahua_cart";
const ORDERS_KEY = "@aye_chihuahua_orders";
const ORDER_COUNTER_KEY = "@aye_chihuahua_order_counter";

export const [CartProvider, useCart] = createContextHook(() => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderCounter, setOrderCounter] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tipPercentage, setTipPercentage] = useState<number>(0);

  const loadData = useCallback(async () => {
    try {
      const [cartData, ordersData, counterData] = await Promise.all([
        AsyncStorage.getItem(CART_KEY),
        AsyncStorage.getItem(ORDERS_KEY),
        AsyncStorage.getItem(ORDER_COUNTER_KEY),
      ]);
      
      if (cartData) {
        try {
          const parsed = JSON.parse(cartData);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          } else {
            console.log("Invalid cart data, clearing");
            await AsyncStorage.removeItem(CART_KEY);
            setCart([]);
          }
        } catch (e) {
          console.error("Failed to parse cart data, clearing:", e);
          await AsyncStorage.removeItem(CART_KEY);
          setCart([]);
        }
      }
      
      if (ordersData) {
        try {
          const parsed = JSON.parse(ordersData);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          } else {
            console.log("Invalid orders data, clearing");
            await AsyncStorage.removeItem(ORDERS_KEY);
            setOrders([]);
          }
        } catch (e) {
          console.error("Failed to parse orders data, clearing:", e);
          await AsyncStorage.removeItem(ORDERS_KEY);
          setOrders([]);
        }
      }
      
      if (counterData) {
        try {
          const parsed = JSON.parse(counterData);
          if (typeof parsed === 'number') {
            setOrderCounter(parsed);
          } else {
            console.log("Invalid counter data, clearing");
            await AsyncStorage.removeItem(ORDER_COUNTER_KEY);
            setOrderCounter(0);
          }
        } catch (e) {
          console.error("Failed to parse counter data, clearing:", e);
          await AsyncStorage.removeItem(ORDER_COUNTER_KEY);
          setOrderCounter(0);
        }
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load cart data:", error);
      await AsyncStorage.multiRemove([CART_KEY, ORDERS_KEY, ORDER_COUNTER_KEY]);
      setCart([]);
      setOrders([]);
      setOrderCounter(0);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveCart = useCallback(async (newCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
      setCart(newCart);
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, []);

  const saveOrders = useCallback(async (newOrders: Order[]) => {
    try {
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
      setOrders(newOrders);
    } catch (error) {
      console.error("Failed to save orders:", error);
    }
  }, []);

  const addToCart = useCallback((productId: string, name: string, size: SalsaSize, price: number, image: string) => {
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
      const newCart = cart.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(newCart);
    } else {
      const newItem: CartItem = {
        id: productId,
        name,
        size,
        price,
        quantity: 1,
        image,
      };
      saveCart([...cart, newItem]);
    }
  }, [cart, saveCart]);

  const removeFromCart = useCallback((productId: string, size: SalsaSize) => {
    const newCart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart(newCart);
  }, [cart, saveCart]);

  const updateQuantity = useCallback((productId: string, size: SalsaSize, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === productId && item.size === size
        ? { ...item, quantity }
        : item
    );
    saveCart(newCart);
  }, [cart, removeFromCart, saveCart]);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  const getCartSubtotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const getCartTax = useCallback(() => {
    return getCartSubtotal() * SALES_TAX_RATE;
  }, [getCartSubtotal]);

  const getCartTip = useCallback(() => {
    return getCartSubtotal() * (tipPercentage / 100);
  }, [getCartSubtotal, tipPercentage]);

  const getCartTotal = useCallback(() => {
    return getCartSubtotal() + getCartTax() + getCartTip();
  }, [getCartSubtotal, getCartTax, getCartTip]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    const newOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    );
    saveOrders(newOrders);
  }, [orders, saveOrders]);

  const placeOrder = useCallback(async (customerName: string, customerEmail: string, customerPhone: string, notes?: string) => {
    const newCounter = orderCounter + 1;
    const orderNumber = String(newCounter).padStart(3, '0');
    
    const order: Order = {
      id: orderNumber,
      items: [...cart],
      total: getCartTotal(),
      status: "pending",
      customerName,
      customerEmail,
      customerPhone,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newOrders = [order, ...orders];
    await AsyncStorage.setItem(ORDER_COUNTER_KEY, JSON.stringify(newCounter));
    setOrderCounter(newCounter);
    saveOrders(newOrders);
    clearCart();

    setTimeout(() => {
      updateOrderStatus(order.id, "confirmed");
    }, 2000);

    return order;
  }, [cart, orders, orderCounter, getCartTotal, clearCart, saveOrders, updateOrderStatus]);

  return useMemo(() => ({
    cart,
    orders,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSubtotal,
    getCartTax,
    getCartTip,
    getCartTotal,
    getCartItemCount,
    placeOrder,
    updateOrderStatus,
    tipPercentage,
    setTipPercentage,
  }), [cart, orders, isLoaded, addToCart, removeFromCart, updateQuantity, clearCart, getCartSubtotal, getCartTax, getCartTip, getCartTotal, getCartItemCount, placeOrder, updateOrderStatus, tipPercentage]);
});
