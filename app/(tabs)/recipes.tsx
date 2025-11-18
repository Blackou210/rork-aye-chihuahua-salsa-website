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
    name: "VERDE BRAVA Guacamole",
    description: "Quick and easy elevated guacamole with a brave green kick",
    image: "https://images.unsplash.com/photo-1623961990059-e5c0f211d49c?w=800&q=80",
    ingredients: [
      "Avocados (3 ripe)",
      "VERDE BRAVA Salsa (4oz)",
      "Lime juice (1 tbsp)",
      "Salt to taste",
      "Tortilla chips for serving"
    ],
    instructions: [
      "Mash avocados in a bowl",
      "Fold in VERDE BRAVA salsa",
      "Add lime juice and salt",
      "Mix well and serve with chips"
    ],
    prepTime: "5 mins",
    servings: "4"
  },
  {
    id: "2",
    name: "ROJA LOCA Wings",
    description: "Crispy buffalo wings with a crazy red sauce glaze",
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80",
    ingredients: [
      "Chicken wings (2 lbs)",
      "ROJA LOCA Salsa (8oz)",
      "Butter (3 tbsp, melted)",
      "Garlic powder (1 tsp)",
      "Salt and pepper to taste",
      "Ranch or blue cheese for dipping"
    ],
    instructions: [
      "Bake wings at 425°F for 40-45 minutes until crispy",
      "Mix ROJA LOCA salsa with melted butter and garlic powder",
      "Toss wings in the sauce mixture",
      "Serve hot with ranch or blue cheese dressing"
    ],
    prepTime: "50 mins",
    servings: "4"
  },
  {
    id: "3",
    name: "VERDE BRAVA Quesadilla",
    description: "Simple cheesy quesadilla with green salsa kick",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&q=80",
    ingredients: [
      "Flour tortillas (2 large)",
      "VERDE BRAVA Salsa (4oz)",
      "Mexican cheese blend (2 cups)",
      "Butter for cooking",
      "Sour cream for serving"
    ],
    instructions: [
      "Spread VERDE BRAVA salsa on one tortilla",
      "Top with cheese and place another tortilla on top",
      "Cook in buttered skillet 2-3 minutes per side until golden",
      "Cut into wedges and serve with sour cream"
    ],
    prepTime: "10 mins",
    servings: "2"
  },
  {
    id: "4",
    name: "ROJA LOCA Nachos Supreme",
    description: "Loaded nachos with crazy red salsa heat",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80",
    ingredients: [
      "Tortilla chips (1 large bag)",
      "ROJA LOCA Salsa (8oz)",
      "Ground beef (1 lb, cooked)",
      "Nacho cheese (2 cups)",
      "Jalapeños (sliced)",
      "Sour cream",
      "Green onions (chopped)"
    ],
    instructions: [
      "Layer chips on a large platter",
      "Top with cooked ground beef",
      "Drizzle with nacho cheese and ROJA LOCA salsa",
      "Add jalapeños, sour cream, and green onions",
      "Serve immediately"
    ],
    prepTime: "15 mins",
    servings: "4-6"
  },
  {
    id: "5",
    name: "VERDE BRAVA Fish Tacos",
    description: "Fresh grilled fish with zesty green salsa",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80",
    ingredients: [
      "White fish fillets (1.5 lbs)",
      "VERDE BRAVA Salsa (8oz)",
      "Corn tortillas (8)",
      "Red cabbage (2 cups, shredded)",
      "Lime (2)",
      "Cilantro",
      "Avocado (2, sliced)"
    ],
    instructions: [
      "Marinate fish in half the VERDE BRAVA salsa for 20 minutes",
      "Grill fish 4-5 minutes per side",
      "Break into chunks",
      "Fill warm tortillas with fish, cabbage, and remaining salsa",
      "Top with avocado, cilantro, and lime"
    ],
    prepTime: "35 mins",
    servings: "4"
  },
  {
    id: "6",
    name: "ROJA LOCA Loaded Fries",
    description: "Crispy fries topped with spicy red salsa goodness",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800&q=80",
    ingredients: [
      "French fries (frozen bag or homemade)",
      "ROJA LOCA Salsa (6oz)",
      "Shredded cheese (2 cups)",
      "Ground beef (1/2 lb, cooked)",
      "Sour cream",
      "Green onions",
      "Jalapeños"
    ],
    instructions: [
      "Cook fries until crispy",
      "Layer on a baking sheet and top with cheese",
      "Broil until cheese melts",
      "Add cooked ground beef and drizzle with ROJA LOCA salsa",
      "Top with sour cream, green onions, and jalapeños"
    ],
    prepTime: "25 mins",
    servings: "3-4"
  },
  {
    id: "7",
    name: "VERDE BRAVA Enchiladas Verdes",
    description: "Classic chicken enchiladas smothered in tangy green salsa",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&q=80",
    ingredients: [
      "VERDE BRAVA Salsa (12oz)",
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
      "Mix chicken with half the VERDE BRAVA salsa",
      "Warm tortillas and fill with chicken mixture",
      "Roll tightly and place in baking dish",
      "Pour remaining salsa over enchiladas",
      "Top with cheese and bake 20-25 minutes",
      "Garnish with sour cream, cilantro, and crema"
    ],
    prepTime: "45 mins",
    servings: "4-6"
  },
  {
    id: "8",
    name: "ROJA LOCA Pozole Rojo",
    description: "Traditional Mexican red hominy soup with crazy heat",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    ingredients: [
      "Pork shoulder (2 lbs, cubed)",
      "ROJA LOCA Salsa (12oz)",
      "White hominy (2 cans, 29oz each)",
      "Chicken broth (6 cups)",
      "Garlic (5 cloves, minced)",
      "Onion (1 large, diced)",
      "Dried ancho chiles (3, rehydrated)",
      "Oregano (2 tsp)",
      "Cumin (1 tsp)",
      "Bay leaves (2)",
      "Radishes, cabbage, lime for serving"
    ],
    instructions: [
      "Brown pork in a large pot",
      "Add onion and garlic, sauté 3 minutes",
      "Pour in broth, bay leaves, oregano, and cumin",
      "Simmer 1.5 hours until pork is tender",
      "Blend rehydrated chiles with 1 cup broth",
      "Add chile mixture and ROJA LOCA salsa to pot",
      "Stir in hominy and simmer 20 minutes",
      "Remove bay leaves and serve with toppings"
    ],
    prepTime: "2 hrs 15 mins",
    servings: "6-8"
  },
  {
    id: "9",
    name: "VERDE BRAVA Tortilla Soup",
    description: "Hearty Mexican soup with brave green salsa base",
    image: "https://images.unsplash.com/photo-1613844237701-8f3664fc2eff?w=800&q=80",
    ingredients: [
      "VERDE BRAVA Salsa (8oz)",
      "Chicken breast (2 lbs)",
      "Chicken broth (6 cups)",
      "Diced tomatoes (1 can)",
      "Black beans (1 can)",
      "Corn (1 cup)",
      "Garlic (3 cloves, minced)",
      "Cumin (1 tsp)",
      "Tortilla strips",
      "Avocado, cheese, cilantro for topping"
    ],
    instructions: [
      "Boil chicken in broth for 20 minutes, then shred",
      "In same pot, add garlic and sauté briefly",
      "Add VERDE BRAVA salsa, tomatoes, beans, corn, and cumin",
      "Return shredded chicken to pot",
      "Simmer 15 minutes",
      "Serve in bowls topped with crispy tortilla strips",
      "Add avocado, cheese, and cilantro"
    ],
    prepTime: "45 mins",
    servings: "6"
  },
  {
    id: "10",
    name: "ROJA LOCA Stuffed Peppers",
    description: "Bell peppers filled with spicy red salsa rice",
    image: "https://images.unsplash.com/photo-1601001815894-4bb6c81416d7?w=800&q=80",
    ingredients: [
      "Bell peppers (6, tops removed)",
      "ROJA LOCA Salsa (8oz)",
      "Ground beef (1 lb, cooked)",
      "Cooked rice (2 cups)",
      "Black beans (1 can)",
      "Corn (1 cup)",
      "Mexican cheese (2 cups)",
      "Cumin (1 tsp)",
      "Garlic powder (1 tsp)"
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Mix cooked beef, rice, beans, corn, half the cheese, and ROJA LOCA salsa",
      "Add cumin and garlic powder",
      "Stuff peppers with mixture",
      "Place in baking dish with 1/2 cup water",
      "Cover with foil and bake 30 minutes",
      "Remove foil, top with remaining cheese, bake 10 more minutes"
    ],
    prepTime: "55 mins",
    servings: "6"
  },
  {
    id: "11",
    name: "VERDE BRAVA Deviled Eggs",
    description: "Classic deviled eggs with a brave green twist",
    image: "https://images.unsplash.com/photo-1635274343801-7dd429a420b4?w=800&q=80",
    ingredients: [
      "Hard boiled eggs (12)",
      "VERDE BRAVA Salsa (3oz)",
      "Mayonnaise (1/4 cup)",
      "Dijon mustard (1 tsp)",
      "Paprika for garnish",
      "Cilantro for garnish"
    ],
    instructions: [
      "Slice eggs in half and remove yolks",
      "Mash yolks with mayo, mustard, and VERDE BRAVA salsa",
      "Spoon or pipe mixture back into egg whites",
      "Garnish with paprika and cilantro"
    ],
    prepTime: "20 mins",
    servings: "6"
  },
  {
    id: "12",
    name: "ROJA LOCA Chicken Fajitas",
    description: "Sizzling chicken fajitas with crazy red salsa marinade",
    image: "https://images.unsplash.com/photo-1599974789516-16f8db7e8f7c?w=800&q=80",
    ingredients: [
      "Chicken breast (2 lbs, sliced)",
      "ROJA LOCA Salsa (8oz)",
      "Bell peppers (3, sliced)",
      "Onion (1 large, sliced)",
      "Olive oil (2 tbsp)",
      "Lime juice (2 tbsp)",
      "Cumin (1 tsp)",
      "Flour tortillas",
      "Sour cream, guacamole for serving"
    ],
    instructions: [
      "Marinate chicken in ROJA LOCA salsa, lime juice, and cumin for 30 minutes",
      "Heat oil in large skillet over high heat",
      "Cook chicken 5-7 minutes until done, remove",
      "Sauté peppers and onions until tender",
      "Return chicken to pan and toss everything",
      "Serve with warm tortillas and toppings"
    ],
    prepTime: "45 mins",
    servings: "4"
  },
  {
    id: "13",
    name: "VERDE BRAVA Elote (Mexican Street Corn)",
    description: "Grilled corn slathered with green salsa mayo",
    image: "https://images.unsplash.com/photo-1557296387-5358ad7997bb?w=800&q=80",
    ingredients: [
      "Corn on the cob (6 ears)",
      "VERDE BRAVA Salsa (4oz)",
      "Mayonnaise (1/2 cup)",
      "Cotija cheese (1/2 cup, crumbled)",
      "Lime (2)",
      "Chili powder",
      "Cilantro"
    ],
    instructions: [
      "Grill corn until charred all around",
      "Mix mayo with VERDE BRAVA salsa",
      "Slather corn with green salsa mayo",
      "Sprinkle with cotija cheese and chili powder",
      "Squeeze lime over top and garnish with cilantro"
    ],
    prepTime: "20 mins",
    servings: "6"
  },
  {
    id: "14",
    name: "ROJA LOCA Shakshuka",
    description: "Middle Eastern eggs poached in crazy red salsa",
    image: "https://images.unsplash.com/photo-1587126716739-1b6d5c075f62?w=800&q=80",
    ingredients: [
      "ROJA LOCA Salsa (12oz)",
      "Eggs (6)",
      "Diced tomatoes (1 can)",
      "Onion (1, diced)",
      "Bell pepper (1, diced)",
      "Garlic (3 cloves, minced)",
      "Cumin (1 tsp)",
      "Paprika (1 tsp)",
      "Feta cheese (crumbled)",
      "Fresh parsley",
      "Crusty bread for serving"
    ],
    instructions: [
      "Sauté onion, pepper, and garlic in olive oil",
      "Add diced tomatoes, ROJA LOCA salsa, cumin, and paprika",
      "Simmer 10 minutes until thickened",
      "Create 6 wells in the sauce",
      "Crack an egg into each well",
      "Cover and cook until eggs are set (6-8 minutes)",
      "Top with feta and parsley, serve with bread"
    ],
    prepTime: "30 mins",
    servings: "3-4"
  },
  {
    id: "15",
    name: "VERDE BRAVA Ceviche",
    description: "Fresh seafood marinated in brave green salsa",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80",
    ingredients: [
      "Raw shrimp or white fish (1 lb, diced)",
      "VERDE BRAVA Salsa (6oz)",
      "Lime juice (1 cup)",
      "Tomato (1, diced)",
      "Red onion (1/2, diced)",
      "Cucumber (1, diced)",
      "Avocado (1, diced)",
      "Cilantro (1/2 cup)",
      "Tostadas for serving"
    ],
    instructions: [
      "Marinate seafood in lime juice 30-45 minutes until opaque",
      "Drain excess lime juice",
      "Mix in VERDE BRAVA salsa, tomato, onion, and cucumber",
      "Refrigerate 30 minutes",
      "Before serving, fold in avocado and cilantro",
      "Serve cold with tostadas"
    ],
    prepTime: "1 hr 30 mins",
    servings: "4-6"
  },
  {
    id: "16",
    name: "ROJA LOCA Albondigas Soup",
    description: "Mexican meatball soup in crazy red salsa broth",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    ingredients: [
      "Ground beef (1 lb)",
      "Cooked rice (1/2 cup)",
      "Egg (1)",
      "ROJA LOCA Salsa (10oz)",
      "Beef broth (6 cups)",
      "Diced tomatoes (1 can)",
      "Carrots (2, diced)",
      "Potatoes (2, diced)",
      "Zucchini (1, diced)",
      "Garlic (3 cloves, minced)",
      "Cumin (1 tsp)",
      "Oregano (1 tsp)",
      "Fresh cilantro"
    ],
    instructions: [
      "Mix beef, rice, egg, and 2oz ROJA LOCA salsa, form into meatballs",
      "In large pot, combine broth, remaining salsa, tomatoes, and spices",
      "Bring to boil, add vegetables",
      "Gently drop in meatballs",
      "Reduce heat and simmer 25-30 minutes",
      "Garnish with fresh cilantro before serving"
    ],
    prepTime: "50 mins",
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
            Delicious ways to enjoy our salsas
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
