import { CartProvider } from "@/context/cart";
import { EventsProvider } from "@/context/events";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
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
        
        await playChihuahuaBark();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    };
    
    initializeApp();
  }, []);

  const playChihuahuaBark = async () => {
    try {
      console.log('Playing Chihuahua bark sound...');
      
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
      }
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/dog/sounds/dog-bark-1.mp3' },
        { shouldPlay: true, volume: 0.7 }
      );
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Failed to play bark sound:', error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <EventsProvider>
        <CartProvider>
          <GestureHandlerRootView style={styles.container}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </CartProvider>
      </EventsProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
