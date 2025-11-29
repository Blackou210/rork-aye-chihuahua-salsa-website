import { CartProvider } from "@/context/cart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc, trpcClient } from "@/lib/trpc";

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

function NavigationController({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

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
          } catch {
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
        await AsyncStorage.clear();
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (showSplash) {
      router.replace('/splash');
    }
  }, [isReady, showSplash, router]);

  useEffect(() => {
    if (showSplash && isReady) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        router.replace('/(tabs)');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSplash, isReady, router]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout() {

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <GestureHandlerRootView style={styles.container}>
            <NavigationController>
              <RootLayoutNav />
            </NavigationController>
          </GestureHandlerRootView>
        </CartProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
