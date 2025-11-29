import { Image } from "expo-image";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function SplashScreenView() {
  return (
    <View style={styles.container}>
      <Image
        source="https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/emncfej0ssxgi39t4etin"
        style={styles.logo}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "80%",
    height: "80%",
    maxWidth: 500,
    maxHeight: 500,
  },
});
