import { Tabs, useRouter, useSegments } from "expo-router";
import { Home, ShoppingCart, ChefHat } from "lucide-react-native";
import React from "react";

import Colors from "@/constants/colors";

export default function TabLayout() {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (segments[0] === '(tabs)' && !segments[1]) {
      router.replace('/splash');
    }
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.light.cardBg,
        },
        headerTitleStyle: {
          fontWeight: "700" as const,
          color: Colors.light.text,
        },
        tabBarStyle: {
          backgroundColor: Colors.light.cardBg,
          borderTopColor: Colors.light.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <ShoppingCart color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => <ChefHat color={color} />,
        }}
      />

    </Tabs>
  );
}
