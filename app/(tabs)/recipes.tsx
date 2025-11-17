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
    name: "Verde Bravo Enchiladas Verdes",
    description: "Classic chicken enchiladas smothered in tangy VERDE BRAVO salsa",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&q=80",
    ingredients: [
      "VERDE BRAVO Salsa (8oz)",
      "Shredded chicken (3 cups)",
      "Corn tortillas (12)",
      "Mexican cheese blend (2 cups)",
      "Sour cream (1 cup)",
      "White onion (1, diced)",
      "Cilantro for garnish",
      "Mexican crema for drizzling"
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Mix shredded chicken with half of the VERDE BRAVO salsa",
      "Warm tortillas to make them pliable",
      "Fill each tortilla with chicken mixture and roll tightly",
      "Place seam-side down in a baking dish",
      "Pour remaining VERDE BRAVO salsa over enchiladas",
      "Sprinkle generously with cheese",
      "Bake for 20-25 minutes until bubbly",
      "Top with sour cream, cilantro, and diced onions",
      "Drizzle with Mexican crema before serving"
    ],
    prepTime: "45 mins",
    servings: "4-6"
  },
  {
    id: "2",
    name: "Verde Bravo Grilled Fish Tacos",
    description: "Fresh grilled fish topped with zesty VERDE BRAVO salsa",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80",
    ingredients: [
      "White fish fillets (1.5 lbs, like mahi-mahi or tilapia)",
      "VERDE BRAVO Salsa (8oz)",
      "Corn tortillas (8-10)",
      "Red cabbage (2 cups, shredded)",
      "Lime (2, juiced)",
      "Cilantro (1/2 cup, chopped)",
      "Avocado (2, sliced)",
      "Olive oil (2 tbsp)",
      "Cumin (1 tsp)",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Marinate fish in 4oz VERDE BRAVO salsa for 30 minutes",
      "Season fish with cumin, salt, and pepper",
      "Brush grill with olive oil and heat to medium-high",
      "Grill fish 4-5 minutes per side until cooked through",
      "Break fish into chunks",
      "Mix cabbage with lime juice and cilantro",
      "Warm tortillas on the grill",
      "Layer tortillas with cabbage slaw and fish",
      "Top generously with remaining VERDE BRAVO salsa",
      "Add avocado slices and serve with lime wedges"
    ],
    prepTime: "50 mins",
    servings: "4"
  },
  {
    id: "3",
    name: "Verde Bravo Huevos Rancheros",
    description: "Traditional Mexican breakfast with VERDE BRAVO kick",
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80",
    ingredients: [
      "VERDE BRAVO Salsa (8oz)",
      "Eggs (4)",
      "Corn tortillas (4)",
      "Refried beans (1 can)",
      "Queso fresco (1/2 cup, crumbled)",
      "Avocado (1, sliced)",
      "Cilantro for garnish",
      "Olive oil for frying",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Warm refried beans in a small pot",
      "Heat olive oil in a skillet over medium heat",
      "Fry tortillas briefly until slightly crispy",
      "Spread warm refried beans on each tortilla",
      "Fry eggs sunny-side up or over-easy",
      "Place one egg on each tortilla",
      "Generously spoon VERDE BRAVO salsa over eggs",
      "Top with crumbled queso fresco",
      "Add avocado slices and fresh cilantro",
      "Serve immediately with extra salsa on the side"
    ],
    prepTime: "20 mins",
    servings: "2-4"
  },
  {
    id: "4",
    name: "Verde Bravo Chilaquiles",
    description: "Crispy tortilla chips bathed in tangy green salsa",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80",
    ingredients: [
      "VERDE BRAVO Salsa (12oz)",
      "Tortilla chips (6 cups)",
      "Rotisserie chicken (2 cups, shredded) - optional",
      "Mexican crema (1/2 cup)",
      "Queso fresco (3/4 cup, crumbled)",
      "Red onion (1/4 cup, thinly sliced)",
      "Fresh cilantro (1/2 cup)",
      "Fried eggs (2-4) - optional",
      "Lime wedges for serving"
    ],
    instructions: [
      "Heat VERDE BRAVO salsa in a large skillet over medium heat",
      "Add tortilla chips and toss to coat evenly",
      "Cook for 2-3 minutes until chips soften slightly but still have texture",
      "If using chicken, fold it in at this stage",
      "Transfer to serving plates",
      "Drizzle generously with Mexican crema",
      "Sprinkle with queso fresco and red onion",
      "Top with fresh cilantro",
      "Add fried eggs if desired",
      "Serve immediately with lime wedges"
    ],
    prepTime: "15 mins",
    servings: "4"
  },
  {
    id: "5",
    name: "Verde Bravo Pozole Verde",
    description: "Traditional Mexican hominy soup with VERDE BRAVO twist",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    ingredients: [
      "Pork shoulder (2 lbs, cubed)",
      "VERDE BRAVO Salsa (12oz)",
      "White hominy (2 cans, 29oz each, drained)",
      "Chicken broth (4 cups)",
      "Garlic (4 cloves, minced)",
      "Onion (1 large, diced)",
      "Oregano (2 tsp)",
      "Cumin (1 tsp)",
      "Bay leaves (2)",
      "Radishes (sliced, for serving)",
      "Cabbage (shredded, for serving)",
      "Lime wedges",
      "Tostadas for serving"
    ],
    instructions: [
      "Season pork with salt and pepper",
      "Brown pork cubes in a large pot over medium-high heat",
      "Add onion and garlic, sauté until fragrant",
      "Pour in chicken broth and bring to a boil",
      "Add bay leaves, oregano, and cumin",
      "Reduce heat and simmer for 1.5 hours until pork is tender",
      "Stir in VERDE BRAVO salsa and hominy",
      "Simmer for another 20 minutes",
      "Remove bay leaves before serving",
      "Serve in bowls with radishes, cabbage, lime, and tostadas"
    ],
    prepTime: "2 hrs 15 mins",
    servings: "6-8"
  },
  {
    id: "6",
    name: "Verde Bravo Guacamole",
    description: "Elevated guacamole with a brave green kick",
    image: "https://images.unsplash.com/photo-1623961990059-e5c0f211d49c?w=800&q=80",
    ingredients: [
      "Avocados (4 ripe)",
      "VERDE BRAVO Salsa (4oz)",
      "Red onion (1/4 cup, finely diced)",
      "Tomato (1 medium, diced)",
      "Fresh cilantro (1/4 cup, chopped)",
      "Lime juice (2 tbsp)",
      "Salt to taste",
      "Tortilla chips for serving"
    ],
    instructions: [
      "Cut avocados in half and remove pits",
      "Scoop avocado flesh into a bowl",
      "Mash avocados to desired consistency",
      "Fold in VERDE BRAVO salsa",
      "Add red onion, tomato, and cilantro",
      "Squeeze in fresh lime juice",
      "Season with salt to taste",
      "Mix gently to combine",
      "Serve immediately with tortilla chips",
      "Garnish with extra cilantro and a drizzle of salsa"
    ],
    prepTime: "10 mins",
    servings: "4-6"
  },
  {
    id: "7",
    name: "Verde Bravo Carnitas Bowl",
    description: "Loaded bowl with crispy pork and VERDE BRAVO salsa",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    ingredients: [
      "Pork shoulder carnitas (2 lbs)",
      "VERDE BRAVO Salsa (8oz)",
      "Cilantro lime rice (3 cups, cooked)",
      "Black beans (1 can, drained)",
      "Corn (1 cup, roasted)",
      "Pico de gallo (1 cup)",
      "Shredded cheese (1 cup)",
      "Sour cream (1/2 cup)",
      "Fresh cilantro",
      "Lime wedges"
    ],
    instructions: [
      "Prepare or warm pre-cooked carnitas",
      "Crisp the carnitas in a hot skillet",
      "Warm cilantro lime rice",
      "Heat black beans with spices",
      "Assemble bowls with rice as the base",
      "Add carnitas, black beans, and roasted corn",
      "Top with generous portions of VERDE BRAVO salsa",
      "Add pico de gallo and shredded cheese",
      "Finish with sour cream and fresh cilantro",
      "Serve with lime wedges on the side"
    ],
    prepTime: "25 mins",
    servings: "4"
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
