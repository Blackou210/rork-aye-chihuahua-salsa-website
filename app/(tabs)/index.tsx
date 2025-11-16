import Colors from "@/constants/colors";
import { PRODUCTS } from "@/constants/products";
import { useCart } from "@/context/cart";
import { Product, SalsaSize } from "@/types/order";
import { Image } from "expo-image";
import { ShoppingCart, Facebook, Instagram } from "lucide-react-native";
import React, { useState } from "react";
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import { router } from "expo-router";

const SIZES: SalsaSize[] = ["4oz", "8oz", "12oz", "1gal"];

export default function HomeScreen() {
  const { addToCart, getCartItemCount } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<SalsaSize>("4oz");
  const cartItemCount = getCartItemCount();



  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(
        selectedProduct.id,
        selectedProduct.name,
        selectedSize,
        selectedProduct.prices[selectedSize],
        selectedProduct.image
      );
      setSelectedProduct(null);
      setSelectedSize("4oz");
    }
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => setSelectedProduct(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.productCardImage}
        contentFit="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.productPrice}>ORDER NOW</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={{ uri: "https://images.unsplash.com/photo-1583073527523-7d5b9a652e30?w=800&q=80" }}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.header}>
        <View style={{ width: 20 }} />
        <View style={styles.headerTouchable}>
          <Image
            source={{ uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/eren432m7wn926dp6qvps" }}
            style={styles.logoImage}
            contentFit="contain"
          />
        </View>
        <TouchableOpacity 
          style={styles.cartBadgeContainer}
          onPress={() => router.push('/(tabs)/cart')}
          activeOpacity={0.7}
        >
          <ShoppingCart size={24} color={Colors.light.text} />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Our Products</Text>
        {PRODUCTS.map((item) => (
          <View key={item.id}>
            {renderProductCard({ item })}
          </View>
        ))}

        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => Linking.openURL('https://www.facebook.com/share/17dannTDbg/?mibextid=wwXIfr')}
              activeOpacity={0.7}
            >
              <Facebook size={28} color="#fff" fill="#fff" />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => Linking.openURL('https://instagram.com')}
              activeOpacity={0.7}
            >
              <Instagram size={28} color="#fff" fill="#fff" />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => Linking.openURL('https://tiktok.com')}
              activeOpacity={0.7}
            >
              <View style={styles.tiktokIcon}>
                <Text style={styles.tiktokIconText}>TikTok</Text>
              </View>
              <Text style={styles.socialText}>TikTok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={selectedProduct !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedProduct && (
                <>
                  <Image
                    source={{ uri: selectedProduct.image }}
                    style={styles.modalImage}
                    contentFit="cover"
                  />
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                    <Text style={styles.modalDescription}>{selectedProduct.description}</Text>

                    <Text style={styles.sizeLabel}>Select Size</Text>
                    <View style={styles.sizeContainer}>
                      {SIZES.map((size) => (
                        <TouchableOpacity
                          key={size}
                          style={[
                            styles.sizeButton,
                            selectedSize === size && styles.sizeButtonActive,
                          ]}
                          onPress={() => setSelectedSize(size)}
                        >
                          <Text
                            style={[
                              styles.sizeButtonText,
                              selectedSize === size && styles.sizeButtonTextActive,
                            ]}
                          >
                            {size}
                          </Text>
                          <Text
                            style={[
                              styles.sizePriceText,
                              selectedSize === size && styles.sizePriceTextActive,
                            ]}
                          >
                            ${selectedProduct.prices[size].toFixed(2)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={styles.modalActions}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setSelectedProduct(null)}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                        <Text style={styles.addButtonText}>Add to Cart</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  headerTouchable: {
    alignItems: "center" as const,
    flex: 1,
  },
  logoImage: {
    width: 120,
    height: 60,
  },
  cartBadgeContainer: {
    position: "relative" as const,
  },
  cartBadge: {
    position: "absolute" as const,
    top: -6,
    right: -6,
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700" as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  productCard: {
    backgroundColor: Colors.light.cardBg,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row" as const,
  },
  productCardImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "center" as const,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end" as const,
  },
  modalContent: {
    backgroundColor: Colors.light.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalImage: {
    width: "100%",
    height: 250,
  },
  modalInfo: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  sizeLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  sizeContainer: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 24,
  },
  sizeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: "center" as const,
  },
  sizeButtonActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  sizeButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  sizeButtonTextActive: {
    color: "#fff",
  },
  sizePriceText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  sizePriceTextActive: {
    color: "#fff",
  },
  modalActions: {
    flexDirection: "row" as const,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: "center" as const,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  addButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: "center" as const,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  socialSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  socialContainer: {
    flexDirection: "row" as const,
    gap: 12,
    justifyContent: "space-between" as const,
  },
  socialButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  socialText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600" as const,
    marginTop: 8,
  },
  tiktokIcon: {
    width: 28,
    height: 28,
    backgroundColor: "#fff",
    borderRadius: 6,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  tiktokIconText: {
    color: Colors.light.primary,
    fontSize: 10,
    fontWeight: "700" as const,
  },
});
