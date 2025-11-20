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
            My story starts in a small border town in Laredo, Texas, where I grew up with the unforgettable taste of my mother&apos;s homemade salsa.
          </Text>

          <Text style={styles.paragraph}>
            Growing up, I never imagined I&apos;d create a salsa brand of my own. But I always remembered the way my mom&apos;s salsa brought our family together. The smell of roasted chiles, garlic, and spices drifting through the house wasn&apos;t just food — it was love, tradition, and home. It was comfort during hard days and celebration during good ones. Her salsa was the first spark of what would eventually become Ay Chihuahua Salsa… even if I didn&apos;t know it at the time.
          </Text>

          <Text style={styles.paragraph}>
            Years later, inspired by those memories, I started making my own batch here in New Braunfels. One batch turned into many. My family tasted it. Friends asked for more. Before long, what started in my kitchen grew into something real — a Texas-made family business built from faith, gratitude, and tradition.
          </Text>

          <Text style={styles.sectionTitle}>My Thanks</Text>

          <Text style={styles.paragraph}>
            None of this would have happened without the people who believed in me.
          </Text>

          <Text style={styles.paragraph}>
            I give my deepest thanks to my family — Lauren, Ashleigh, and most of all, my mom, whose love, strength, and unforgettable salsa inspired everything Ay Chihuahua Salsa stands for. Her influence lives in every jar, every recipe, and every step of this journey.
          </Text>

          <Text style={styles.paragraph}>
            To our customers: thank you for welcoming my salsa into your homes and helping a small Texas dream grow bigger every day.
          </Text>

          <Text style={styles.paragraph}>
            And to God: thank you for guiding every step, every blessing, every moment of this journey.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.closingText}>
            Ay Chihuahua Salsa will always stay true to its roots — family-crafted, Texas-proud, and made with the same heart that started it all. My life started at the border, and this business was born in New Braunfels — it&apos;s a story of tradition, faith, and gratitude.
          </Text>

          <Text style={styles.signatureText}>
            From my family to yours — thank you for being part of my story.
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
    paddingBottom: 32,
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
