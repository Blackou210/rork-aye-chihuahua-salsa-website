import { CartProvider } from "@/context/cart";
import { EventsProvider } from "@/context/events";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Animated, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { trpc, trpcClient } from "@/lib/trpc";

const queryClient = new QueryClient();

const SPLASH_IMAGE = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ssxn5iq3yevbdnwz20mg6';

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  return (
    <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
      <Image
        source={{ uri: SPLASH_IMAGE }}
        style={styles.splashImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <EventsProvider>
          <CartProvider>
            <GestureHandlerRootView style={styles.container}>
              {showSplash ? (
                <SplashScreen onFinish={() => setShowSplash(false)} />
              ) : (
                <RootLayoutNav />
              )}
            </GestureHandlerRootView>
          </CartProvider>
        </EventsProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '80%',
    height: '80%',
  },
});
