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
      console.log("Loading cart data...");
      const [cartData, ordersData, counterData] = await Promise.all([
        AsyncStorage.getItem(CART_KEY),
        AsyncStorage.getItem(ORDERS_KEY),
        AsyncStorage.getItem(ORDER_COUNTER_KEY),
      ]);
      
      console.log("Cart data raw:", cartData ? cartData.substring(0, 50) : "null");
      console.log("Orders data raw:", ordersData ? ordersData.substring(0, 50) : "null");
      console.log("Counter data raw:", counterData);
      
      if (cartData && cartData !== "undefined" && cartData !== "null" && cartData.length > 0) {
        try {
          if (cartData.startsWith('[') || cartData.startsWith('{')) {
            const parsed = JSON.parse(cartData);
            if (Array.isArray(parsed)) {
              console.log("Cart loaded successfully:", parsed.length, "items");
              setCart(parsed);
            } else {
              console.log("Invalid cart data format, clearing");
              await AsyncStorage.removeItem(CART_KEY);
              setCart([]);
            }
          } else {
            console.log("Cart data doesn't look like JSON, clearing");
            await AsyncStorage.removeItem(CART_KEY);
            setCart([]);
          }
        } catch (e) {
          console.error("Failed to parse cart data:", e, "\nData:", cartData.substring(0, 100));
          await AsyncStorage.removeItem(CART_KEY);
          setCart([]);
        }
      } else {
        console.log("No valid cart data found");
        setCart([]);
      }
      
      if (ordersData && ordersData !== "undefined" && ordersData !== "null" && ordersData.length > 0) {
        try {
          if (ordersData.startsWith('[') || ordersData.startsWith('{')) {
            const parsed = JSON.parse(ordersData);
            if (Array.isArray(parsed)) {
              console.log("Orders loaded successfully:", parsed.length, "orders");
              setOrders(parsed);
            } else {
              console.log("Invalid orders data format, clearing");
              await AsyncStorage.removeItem(ORDERS_KEY);
              setOrders([]);
            }
          } else {
            console.log("Orders data doesn't look like JSON, clearing");
            await AsyncStorage.removeItem(ORDERS_KEY);
            setOrders([]);
          }
        } catch (e) {
          console.error("Failed to parse orders data:", e, "\nData:", ordersData.substring(0, 100));
          await AsyncStorage.removeItem(ORDERS_KEY);
          setOrders([]);
        }
      } else {
        console.log("No valid orders data found");
        setOrders([]);
      }
      
      if (counterData && counterData !== "undefined" && counterData !== "null" && counterData.length > 0) {
        try {
          const parsed = JSON.parse(counterData);
          if (typeof parsed === 'number') {
            console.log("Counter loaded successfully:", parsed);
            setOrderCounter(parsed);
          } else {
            console.log("Invalid counter data type, clearing");
            await AsyncStorage.removeItem(ORDER_COUNTER_KEY);
            setOrderCounter(0);
          }
        } catch (e) {
          console.error("Failed to parse counter data:", e, "\nData:", counterData);
          await AsyncStorage.removeItem(ORDER_COUNTER_KEY);
          setOrderCounter(0);
        }
      } else {
        console.log("No valid counter data found");
        setOrderCounter(0);
      }
      
      console.log("Cart data loaded successfully");
      setIsLoaded(true);
    } catch (error) {
      console.error("Critical error loading cart data:", error);
      try {
        console.log("Clearing all storage due to error");
        await AsyncStorage.multiRemove([CART_KEY, ORDERS_KEY, ORDER_COUNTER_KEY]);
        console.log("Storage cleared successfully");
      } catch (clearError) {
        console.error("Failed to clear storage:", clearError);
      }
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
      console.log("Saving cart:", newCart.length, "items");
      const serialized = JSON.stringify(newCart);
      console.log("Cart serialized successfully, length:", serialized.length);
      await AsyncStorage.setItem(CART_KEY, serialized);
      console.log("Cart saved to storage");
      setCart(newCart);
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, []);

  const saveOrders = useCallback(async (newOrders: Order[]) => {
    try {
      console.log("Saving orders:", newOrders.length, "orders");
      const serialized = JSON.stringify(newOrders);
      console.log("Orders serialized successfully, length:", serialized.length);
      await AsyncStorage.setItem(ORDERS_KEY, serialized);
      console.log("Orders saved to storage");
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

  const deleteOrder = useCallback(async (orderId: string) => {
    const newOrders = orders.filter(order => order.id !== orderId);
    await saveOrders(newOrders);
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
    deleteOrder,
    tipPercentage,
    setTipPercentage,
  }), [cart, orders, isLoaded, addToCart, removeFromCart, updateQuantity, clearCart, getCartSubtotal, getCartTax, getCartTip, getCartTotal, getCartItemCount, placeOrder, updateOrderStatus, deleteOrder, tipPercentage]);
});
