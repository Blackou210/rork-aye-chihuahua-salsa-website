import { CartProvider } from "@/context/cart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const corruptedKeys: string[] = [];
        
        for (const key of allKeys) {
          try {
            const value = await AsyncStorage.getItem(key);
            if (value) {
              JSON.parse(value);
            }
          } catch (parseError) {
            console.error(`Corrupted storage found for key: ${key}, clearing...`);
            corruptedKeys.push(key);
          }
        }
        
        if (corruptedKeys.length > 0) {
          await AsyncStorage.multiRemove(corruptedKeys);
          console.log(`Cleared ${corruptedKeys.length} corrupted storage keys`);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    };
    
    initializeApp();
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <GestureHandlerRootView style={styles.container}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </CartProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
