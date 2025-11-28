import Colors from "@/constants/colors";
import { Heart } from "lucide-react-native";
import React from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";

export default function AboutScreen() {
  return (
    <ImageBackground 
      source={{ uri: "https://images.unsplash.com/photo-1583073527523-7d5b9a652e30?w=800&q=80" }}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Heart size={48} color={Colors.light.primary} fill={Colors.light.primary} />
          </View>
          <Text style={styles.heroTitle}>About Us</Text>
          <Text style={styles.heroSubtitle}>Ay Chihuahua Salsa</Text>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.paragraph}>
            Our story begins in the kitchens of my grandmas—the soul of our family. One was always stirring a pot, the other always seasoning something to perfection. My grandma in Laredo never served a meal without her homemade salsa, and Grandma Lois brought comfort through every dish she touched.
          </Text>

          <Text style={styles.paragraph}>
            My mom learned from both of them. Working long hours to raise me and my sisters, Lauren and Ashleigh, she still brought those flavors and that love home. Even when I wasn&apos;t the easiest kid, the kitchen was where everything came together. Food healed us. Salsa connected us. Family strengthened us.
          </Text>

          <Text style={styles.paragraph}>
            Today, that legacy lives on in Aye Chihuahua Salsa. Every batch carries memories of my grandmas&apos; kitchens, my mom&apos;s strength, and the traditions that shaped us. Those moments, that love, that heritage—they&apos;re all in every bottle of salsa we share with the world.
          </Text>

          <Text style={styles.signatureText}>
            From our family to yours, thank you for being part of the journey.
          </Text>

          <TouchableOpacity 
            style={styles.donateButton}
            onPress={() => Linking.openURL('https://cash.app/$YourCashtag')}
          >
            <Text style={styles.donateText}>Donate via Cash App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  backgroundImage: {
    opacity: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center" as const,
  },
  heroSection: {
    alignItems: "center" as const,
    marginTop: 24,
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: "center" as const,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 18,
    color: Colors.light.primary,
    textAlign: "center" as const,
    fontWeight: "600" as const,
  },
  contentCard: {
    backgroundColor: Colors.light.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 26,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    marginTop: 12,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.light.primary,
    marginVertical: 24,
    opacity: 0.3,
  },
  closingText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 26,
    marginBottom: 20,
    fontStyle: "italic" as const,
  },
  signatureText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.primary,
    textAlign: "center" as const,
    lineHeight: 28,
    marginTop: 8,
  },
  donateButton: {
    backgroundColor: '#00d54b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 24,
    alignSelf: "center" as const,
  },
  donateText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: "600" as const,
  },
});
