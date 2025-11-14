import Colors from "@/constants/colors";
import { Image } from "expo-image";
import { ChefHat } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View, ImageBackground } from "react-native";

interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  servings: string;
}

const RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Chihuahua Salsa Nachos",
    description: "Loaded nachos with our signature salsa",
    image: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=800&q=80",
    ingredients: [
      "Tortilla chips",
      "¡Ay, Chihuahua! Salsa (4oz)",
      "Shredded cheese",
      "Sour cream",
      "Jalapeños",
      "Black olives"
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Layer tortilla chips on a baking sheet",
      "Sprinkle cheese over chips",
      "Bake for 8-10 minutes until cheese melts",
      "Top with ¡Ay, Chihuahua! Salsa",
      "Add sour cream, jalapeños, and olives",
      "Serve immediately"
    ],
    prepTime: "15 mins",
    servings: "4-6"
  },
  {
    id: "2",
    name: "Salsa Chicken Tacos",
    description: "Juicy chicken tacos marinated in our salsa",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    ingredients: [
      "Chicken breast (2 lbs)",
      "¡Ay, Chihuahua! Salsa (8oz)",
      "Tortillas",
      "Lettuce",
      "Tomatoes",
      "Avocado",
      "Lime"
    ],
    instructions: [
      "Marinate chicken in salsa for 2 hours",
      "Grill chicken until fully cooked",
      "Slice chicken into strips",
      "Warm tortillas on the grill",
      "Fill tortillas with chicken",
      "Top with lettuce, tomatoes, and avocado",
      "Squeeze lime and add extra salsa to taste"
    ],
    prepTime: "2 hrs 20 mins",
    servings: "4"
  },
  {
    id: "4",
    name: "Spicy Salsa Dip",
    description: "Creamy dip perfect for parties",
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&q=80",
    ingredients: [
      "Cream cheese (8oz)",
      "¡Ay, Chihuahua! Salsa (8oz)",
      "Shredded cheddar cheese",
      "Green onions",
      "Cilantro",
      "Tortilla chips for serving"
    ],
    instructions: [
      "Soften cream cheese to room temperature",
      "Mix cream cheese with salsa",
      "Spread in a serving dish",
      "Top with shredded cheese",
      "Garnish with green onions and cilantro",
      "Refrigerate for 30 minutes",
      "Serve with tortilla chips"
    ],
    prepTime: "40 mins",
    servings: "8-10"
  },
  {
    id: "5",
    name: "Chicken Tortilla Soup",
    description: "Hearty soup with chicken, cheese, and tortilla chips",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    ingredients: [
      "Chicken broth (4 cups)",
      "Shredded chicken (2 cups)",
      "Mexican cheese blend (2 cups)",
      "Tortilla chips (2 cups)",
      "¡Ay, Chihuahua! Salsa (8oz)",
      "Diced tomatoes (1 can)",
      "Onion (1, diced)",
      "Garlic (3 cloves, minced)",
      "Cumin (1 tsp)",
      "Avocado (1-2, diced)",
      "Cilantro for garnish",
      "Lime wedges"
    ],
    instructions: [
      "In a large pot, sauté onion and garlic until fragrant",
      "Add chicken broth and bring to a boil",
      "Stir in diced tomatoes, salsa, and cumin",
      "Add shredded chicken and simmer for 10 minutes",
      "Gradually stir in Mexican cheese until melted",
      "Crush tortilla chips and add half to the soup",
      "Let simmer for 5 more minutes until thickened",
      "Serve hot, topped with remaining tortilla chips",
      "Garnish with cilantro and lime wedges"
    ],
    prepTime: "30 mins",
    servings: "6"
  }
];

export default function RecipesScreen() {
  return (
    <ImageBackground 
      source={{ uri: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800&q=80" }}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ChefHat size={32} color={Colors.light.primary} />
          <Text style={styles.headerTitle}>Recipe Ideas</Text>
          <Text style={styles.headerSubtitle}>
            Delicious ways to enjoy our salsa
          </Text>
        </View>

        {RECIPES.map((recipe) => (
          <View key={recipe.id} style={styles.recipeCard}>
            <Image
              source={{ uri: recipe.image }}
              style={styles.recipeImage}
              contentFit="cover"
            />
            <View style={styles.recipeContent}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
              
              <View style={styles.recipeInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Prep Time:</Text>
                  <Text style={styles.infoValue}>{recipe.prepTime}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Servings:</Text>
                  <Text style={styles.infoValue}>{recipe.servings}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredients:</Text>
                {recipe.ingredients.map((ingredient, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {ingredient}
                  </Text>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instructions:</Text>
                {recipe.instructions.map((instruction, index) => (
                  <Text key={index} style={styles.instructionItem}>
                    {index + 1}. {instruction}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ))}
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
    opacity: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: "center" as const,
    marginBottom: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  recipeCard: {
    backgroundColor: Colors.light.cardBg,
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeImage: {
    width: "100%",
    height: 200,
  },
  recipeContent: {
    padding: 16,
  },
  recipeName: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  recipeDescription: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  recipeInfo: {
    flexDirection: "row" as const,
    gap: 24,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  infoItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 24,
    paddingLeft: 8,
  },
  instructionItem: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 6,
  },
});
