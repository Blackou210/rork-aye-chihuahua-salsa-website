import Colors from "@/constants/colors";
import { useCart } from "@/context/cart";
import { CartItem as CartItemType } from "@/types/order";
import { Image } from "expo-image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, getCartSubtotal, getCartTax, getCartTip, getCartTotal, placeOrder, tipPercentage, setTipPercentage } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [customTip, setCustomTip] = useState<number>(0);
  const [isCustomTipActive, setIsCustomTipActive] = useState(false);
  const sliderWidth = useRef<number>(250);
  const [agreedToWarning, setAgreedToWarning] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isCashAppLoading, setIsCashAppLoading] = useState(false);

  const handleCheckout = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    if (!agreedToWarning) {
      Alert.alert("Confirmation Required", "Please confirm you understand the storage warning");
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      const order = await placeOrder(name.trim(), email.trim(), phone.trim(), notes.trim());
    
      const amount = cartTotal.toFixed(2);
      const cashAppUrl = `https://cash.app/$aychihuahuasalsa/${amount}`;
      
      try {
        const itemsList = cart.map(item => 
          `${item.name} (${item.size}) - Quantity: ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');

        const orderSubtotal = getCartSubtotal();
        const orderTax = getCartTax();
        const orderTip = getCartTip();
        const orderTotal = getCartTotal();
        const cashAppPaymentLink = `https://cash.app/$aychihuahuasalsa/${orderTotal.toFixed(2)}`;
        
        const emailBody = `New Order #${order.id}\n\n` +
          `Customer: ${name.trim()}\n` +
          `Phone: ${phone.trim()}\n` +
          `Email: ${email.trim()}\n\n` +
          `Items:\n${itemsList}\n\n` +
          `Subtotal: ${orderSubtotal.toFixed(2)}\n` +
          `Tax (New Braunfels 8.25%): ${orderTax.toFixed(2)}\n` +
          (tipPercentage > 0 ? `Tip (${tipPercentage}%): ${orderTip.toFixed(2)}\n` : '') +
          `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `   💰 TOTAL: ${orderTotal.toFixed(2)}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━━\n` +
          `💵 COMPLETE YOUR PAYMENT\n` +
          `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `Click the link below to pay ${orderTotal.toFixed(2)} with Cash App:\n` +
          `${cashAppPaymentLink}\n\n` +
          `Or send ${orderTotal.toFixed(2)} to: $aychihuahuasalsa\n\n` +
          (notes.trim() ? `Notes: ${notes.trim()}\n\n` : '') +
          `Thank you for your business!\n` +
          `We sincerely appreciate your order and your support for ¡Ay, Chihuahua! Salsa.\n\n` +
          `A member of our team will be reaching out shortly to provide a verbal confirmation of your order details and delivery preferences.\n\n` +
          `If we do not reach out to you within 24hr please call (210)396-0722\n\n` +
          `Please note: Local delivery is currently available only within or near the New Braunfels and San Antonio, Texas area.`;

        const mailtoUrl = `mailto:orders@aychihuahuasalsa.com?subject=${encodeURIComponent(`New Order #${order.id}`)}&body=${encodeURIComponent(emailBody)}`;
        
        await Linking.openURL(mailtoUrl);
      } catch (error) {
        console.log("Could not open email client:", error);
      }
      
      setShowCheckout(false);
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setAgreedToWarning(false);
      setIsPlacingOrder(false);

      Alert.alert(
        "Order Placed!",
        `Your order #${order.id} has been placed successfully. Now complete your payment via Cash App.`,
        [
          { text: "OK", onPress: async () => {
            try {
              await Linking.openURL(cashAppUrl);
            } catch (error) {
              console.error("Could not open Cash App:", error);
              Alert.alert(
                "Payment Link",
                `Please send ${amount} to $aychihuahuasalsa on Cash App to complete your order.`
              );
            }
          }}
        ]
      );
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "There was a problem placing your order. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  const renderCartItem = ({ item, index }: { item: CartItemType; index: number }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemNumber}>
        <Text style={styles.itemNumberText}>{index + 1}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSize}>{item.size}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.size, item.quantity - 1)}
          >
            <Minus size={16} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.size, item.quantity + 1)}
          >
            <Plus size={16} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeFromCart(item.id, item.size)}
        >
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const cartSubtotal = getCartSubtotal();
  const cartTax = getCartTax();
  const cartTip = getCartTip();
  const cartTotal = getCartTotal();

  const TIP_OPTIONS = [15, 18, 20] as const;

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
        <View style={styles.emptyState}>
          <ShoppingBag size={64} color={Colors.light.textSecondary} />
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptyText}>Add some delicious salsa to get started!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => `${item.id}-${item.size}`}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.cartSummary}>
              <Text style={styles.cartSummaryTitle}>Cart Items ({cart.length})</Text>
              <ScrollView 
                style={styles.cartItemsList} 
                horizontal 
                showsHorizontalScrollIndicator={false}
              >
                {cart.map((item, index) => (
                  <View key={`${item.id}-${item.size}-${index}`} style={styles.miniCartItem}>
                    <Image source={{ uri: item.image }} style={styles.miniItemImage} contentFit="cover" />
                    <View style={styles.miniItemBadge}>
                      <Text style={styles.miniItemBadgeText}>{item.quantity}</Text>
                    </View>
                    <Text style={styles.miniItemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.miniItemSize}>{item.size}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${cartSubtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (New Braunfels 8.25%)</Text>
              <Text style={styles.summaryValue}>${cartTax.toFixed(2)}</Text>
            </View>
            
            <View style={styles.tipSection}>
              <Text style={styles.tipLabel}>Add a tip</Text>
              <View style={styles.tipOptions}>
                {TIP_OPTIONS.map((tip) => (
                  <TouchableOpacity
                    key={tip}
                    style={[
                      styles.tipButton,
                      tipPercentage === tip && styles.tipButtonActive,
                    ]}
                    onPress={() => setTipPercentage(tip)}
                  >
                    <Text
                      style={[
                        styles.tipButtonText,
                        tipPercentage === tip && styles.tipButtonTextActive,
                      ]}
                    >
                      {tip}%
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.tipButton,
                    tipPercentage === 0 && styles.tipButtonActive,
                  ]}
                  onPress={() => setTipPercentage(0)}
                >
                  <Text
                    style={[
                      styles.tipButtonText,
                      tipPercentage === 0 && styles.tipButtonTextActive,
                    ]}
                  >
                    None
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.customTipContainer}>
                <View style={styles.customTipHeader}>
                  <Text style={styles.customTipLabel}>Custom Tip: {isCustomTipActive ? customTip : tipPercentage}%</Text>
                  <Text style={styles.customTipAmount}>
                    ${(getCartSubtotal() * ((isCustomTipActive ? customTip : tipPercentage) / 100)).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>0%</Text>
                  <View 
                    style={styles.sliderTrack}
                    onStartShouldSetResponder={() => true}
                    onResponderMove={(e) => {
                      const locationX = e.nativeEvent.locationX;
                      const percentage = Math.max(0, Math.min(30, Math.round((locationX / sliderWidth.current) * 30)));
                      setCustomTip(percentage);
                      setIsCustomTipActive(true);
                      setTipPercentage(percentage);
                    }}
                    onResponderRelease={(e) => {
                      const locationX = e.nativeEvent.locationX;
                      const percentage = Math.max(0, Math.min(30, Math.round((locationX / sliderWidth.current) * 30)));
                      setCustomTip(percentage);
                      setIsCustomTipActive(true);
                      setTipPercentage(percentage);
                    }}
                    onLayout={(e) => {
                      sliderWidth.current = e.nativeEvent.layout.width;
                    }}
                  >
                    <View style={styles.sliderFill} />
                    <View 
                      style={[
                        styles.sliderFillActive,
                        { width: `${((isCustomTipActive ? customTip : tipPercentage) / 30) * 100}%` }
                      ]} 
                    />
                    <View 
                      style={[
                        styles.sliderThumb,
                        { left: `${((isCustomTipActive ? customTip : tipPercentage) / 30) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.sliderLabel}>30%</Text>
                </View>
              </View>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${cartTotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>⚠️ ALL SALSA MUST BE REFRIGERATED AND THROWN AWAY AFTER TWO WEEKS RECEIVED - HAS NO PRESERVATIVES</Text>
            </View>
            
            <TouchableOpacity style={styles.checkoutButton} onPress={() => setShowCheckout(true)}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal
        visible={showCheckout}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCheckout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Checkout</Text>
                <TouchableOpacity onPress={() => setShowCheckout(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter full name"
                    placeholderTextColor={Colors.light.textSecondary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email *</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your@email.com"
                    placeholderTextColor={Colors.light.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone *</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="(555) 123-4567"
                    placeholderTextColor={Colors.light.textSecondary}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Special Instructions (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Any special requests?"
                    placeholderTextColor={Colors.light.textSecondary}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.paymentSection}>
                  <Text style={styles.paymentLabel}>Payment Method</Text>
                  
                  <TouchableOpacity 
                    style={[styles.cashAppButton, isCashAppLoading && styles.cashAppButtonLoading]}
                    onPress={async () => {
                      if (!name.trim() || !email.trim() || !phone.trim()) {
                        Alert.alert("Missing Information", "Please fill in all required fields before proceeding to payment");
                        return;
                      }
                      if (!agreedToWarning) {
                        Alert.alert("Confirmation Required", "Please confirm you understand the storage warning before proceeding to payment");
                        return;
                      }
                      
                      setIsCashAppLoading(true);
                      try {
                        const cashAppUrl = `https://cash.app/$aychihuahuasalsa/${cartTotal.toFixed(2)}`;
                        await Linking.openURL(cashAppUrl);
                      } catch (error) {
                        console.error("Could not open Cash App:", error);
                        Alert.alert(
                          "Payment Link",
                          `Please send ${cartTotal.toFixed(2)} to $aychihuahuasalsa on Cash App to complete your order.`
                        );
                      } finally {
                        setIsCashAppLoading(false);
                      }
                    }}
                    disabled={!name.trim() || !email.trim() || !phone.trim() || !agreedToWarning || isCashAppLoading}
                  >
                    <View style={styles.cashAppIcon}>
                      <Text style={styles.cashAppIconText}>$</Text>
                    </View>
                    <View style={styles.cashAppContent}>
                      <Text style={styles.cashAppTitle}>Pay with Cash App</Text>
                      <Text style={styles.cashAppHandle}>$aychihuahuasalsa • ${cartTotal.toFixed(2)}</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <Text style={styles.paymentNote}>
                    After you tap 'Pay with Cash App', please complete the payment and include your <Text style={{ fontWeight: '700' as const }}>name and order details</Text> in the Cash App note. We will confirm your order by text.
                  </Text>
                </View>

                <View style={styles.orderInstructions}>
                  <View style={styles.instructionStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <Text style={styles.stepText}>Fill in your contact information above</Text>
                  </View>
                  <View style={styles.instructionStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <Text style={styles.stepText}>Tap "Pay with Cash App" to complete payment</Text>
                  </View>
                  <View style={styles.instructionStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <Text style={styles.stepText}>Click "Place Order" to finalize your order</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.warningBoxCheckbox}
                  onPress={() => setAgreedToWarning(!agreedToWarning)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, agreedToWarning && styles.checkboxChecked]}>
                    {agreedToWarning && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.warningTextCheckbox}>
                    ⚠️ I understand that ALL SALSA MUST BE REFRIGERATED AND THROWN AWAY AFTER TWO WEEKS RECEIVED - HAS NO PRESERVATIVES
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.placeOrderButton, (!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder) && styles.placeOrderButtonDisabled]} 
                  onPress={handleCheckout}
                  disabled={!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder}
                >
                  <Text style={[styles.placeOrderButtonText, (!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder) && styles.placeOrderButtonTextDisabled]}>
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row" as const,
    backgroundColor: Colors.light.cardBg,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center" as const,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  itemActions: {
    justifyContent: "space-between" as const,
    alignItems: "flex-end" as const,
  },
  quantityControl: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    minWidth: 24,
    textAlign: "center" as const,
  },
  deleteButton: {
    padding: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.light.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  cartSummary: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  cartSummaryTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  cartItemsList: {
    flexDirection: "row" as const,
  },
  miniCartItem: {
    width: 80,
    marginRight: 12,
    alignItems: "center" as const,
  },
  miniItemImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginBottom: 6,
  },
  miniItemBadge: {
    position: "absolute" as const,
    top: -4,
    right: 8,
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: Colors.light.cardBg,
  },
  miniItemBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#fff",
  },
  miniItemName: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.text,
    textAlign: "center" as const,
    marginBottom: 2,
  },
  miniItemSize: {
    fontSize: 9,
    color: Colors.light.textSecondary,
    textAlign: "center" as const,
  },
  summaryRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  totalContainer: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginTop: 8,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 8,
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
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 24,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.light.textSecondary,
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  textArea: {
    height: 100,
  },

  placeOrderButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center" as const,
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  tipSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  tipOptions: {
    flexDirection: "row" as const,
    gap: 8,
  },
  tipButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.light.background,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    alignItems: "center" as const,
  },
  tipButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  tipButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  tipButtonTextActive: {
    color: "#fff",
  },
  tipAmount: {
    marginTop: 8,
    alignItems: "flex-end" as const,
  },
  tipAmountText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  customTipContainer: {
    marginTop: 16,
  },
  customTipHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  customTipLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  customTipAmount: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  sliderContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    minWidth: 30,
  },
  sliderTrack: {
    flex: 1,
    height: 40,
    justifyContent: "center" as const,
    position: "relative" as const,
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.background,
    width: "100%",
  },
  sliderFillActive: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    position: "absolute" as const,
    left: 0,
  },
  sliderThumb: {
    position: "absolute" as const,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    borderWidth: 3,
    borderColor: "#fff",
    marginLeft: -12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  warningBox: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#DC2626",
    textAlign: "center" as const,
    lineHeight: 16,
  },
  warningBoxModal: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  warningTextModal: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#DC2626",
    textAlign: "center" as const,
    lineHeight: 16,
  },
  warningBoxCheckbox: {
    flexDirection: "row" as const,
    backgroundColor: "#FEE2E2",
    borderWidth: 2,
    borderColor: "#EF4444",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center" as const,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#DC2626",
    backgroundColor: "#fff",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  checkboxChecked: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  warningTextCheckbox: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#DC2626",
    lineHeight: 18,
  },
  placeOrderButtonDisabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.6,
  },
  placeOrderButtonTextDisabled: {
    color: Colors.light.textSecondary,
  },
  paymentSection: {
    marginBottom: 16,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  cashAppButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#00D64F",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cashAppButtonLoading: {
    opacity: 0.5,
  },
  cashAppIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 12,
  },
  cashAppIconText: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#00D64F",
  },
  cashAppContent: {
    flex: 1,
  },
  cashAppTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 2,
  },
  cashAppHandle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  paymentNote: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: "center" as const,
    lineHeight: 18,
    paddingHorizontal: 8,
    marginBottom: 16,
  },

  orderInstructions: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  instructionStep: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#fff",
  },
  stepText: {
    fontSize: 13,
    color: Colors.light.text,
    lineHeight: 18,
  },
  stepTextContainer: {
    flex: 1,
    flexDirection: "column" as const,
  },
  emailText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    marginTop: 4,
  },
  itemNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 12,
  },
  itemNumberText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
  },
});
