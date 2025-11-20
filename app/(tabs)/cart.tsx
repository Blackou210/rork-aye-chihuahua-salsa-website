import Colors from "@/constants/colors";
import { useCart } from "@/context/cart";
import { CartItem as CartItemType, SalsaSize } from "@/types/order";
import { Image } from "expo-image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Linking,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { WebView } from "react-native-webview";

function PayPalWebCheckout({ cartSubtotal, cartTax, cartTip, cartTotal, tipPercentage, cart, onSuccess, onError, onCancel }: {
  cartSubtotal: number;
  cartTax: number;
  cartTip: number;
  cartTotal: number;
  tipPercentage: number;
  cart: CartItemType[];
  onSuccess: (data: any) => void;
  onError: () => void;
  onCancel: () => void;
}) {
  const containerRef = React.useRef<View>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadPayPalScript = () => {
      if (typeof window === 'undefined') return;

      const existingScript = document.getElementById('paypal-sdk');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = 'https://www.paypal.com/sdk/js?client-id=ASRb-19Dl8YmFwKRbIR0P2qQ4-_VBfUavytIdj-qdQU5RAh0cT7fgjPsjxvJjniLnYZ227OLQl01AYCV&currency=USD';
      script.async = true;
      script.onload = () => {
        setIsLoading(false);
        renderPayPalButtons();
      };
      script.onerror = () => {
        setIsLoading(false);
        onError();
      };
      document.body.appendChild(script);
    };

    const renderPayPalButtons = () => {
      if (typeof window === 'undefined' || !(window as any).paypal) return;

      const container = document.getElementById('paypal-button-container-web');
      if (!container) return;

      container.innerHTML = '';

      (window as any).paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: function(data: any, actions: any) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: cartTotal.toFixed(2),
                currency_code: 'USD',
                breakdown: {
                  item_total: { value: cartSubtotal.toFixed(2), currency_code: 'USD' },
                  tax_total: { value: (cartTax + cartTip).toFixed(2), currency_code: 'USD' }
                }
              },
              items: cart.map(item => ({
                name: `${item.name} (${item.size})`,
                unit_amount: { value: item.price.toFixed(2), currency_code: 'USD' },
                quantity: item.quantity.toString()
              }))
            }]
          });
        },
        onApprove: function(data: any, actions: any) {
          return actions.order.capture().then(function(details: any) {
            onSuccess({
              orderID: data.orderID,
              payerName: details.payer.name.given_name + ' ' + details.payer.name.surname,
              payerEmail: details.payer.email_address
            });
          });
        },
        onError: function(err: any) {
          console.error('PayPal error:', err);
          onError();
        },
        onCancel: function(data: any) {
          onCancel();
        }
      }).render('#paypal-button-container-web');
    };

    loadPayPalScript();

    return () => {
      const script = document.getElementById('paypal-sdk');
      if (script) {
        script.remove();
      }
    };
  }, [cartSubtotal, cartTax, cartTip, cartTotal, cart, onSuccess, onError, onCancel]);

  return (
    <ScrollView style={styles.webview} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.orderSummaryWeb}>
        <Text style={styles.orderSummaryTitle}>Order Summary</Text>
        <View style={styles.summaryRowWeb}>
          <Text style={styles.summaryLabelWeb}>Subtotal:</Text>
          <Text style={styles.summaryValueWeb}>${cartSubtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRowWeb}>
          <Text style={styles.summaryLabelWeb}>Tax (8.25%):</Text>
          <Text style={styles.summaryValueWeb}>${cartTax.toFixed(2)}</Text>
        </View>
        {tipPercentage > 0 && (
          <View style={styles.summaryRowWeb}>
            <Text style={styles.summaryLabelWeb}>Tip ({tipPercentage}%):</Text>
            <Text style={styles.summaryValueWeb}>${cartTip.toFixed(2)}</Text>
          </View>
        )}
        <View style={[styles.summaryRowWeb, styles.summaryRowTotal]}>
          <Text style={styles.summaryLabelTotal}>Total:</Text>
          <Text style={styles.summaryValueTotal}>${cartTotal.toFixed(2)}</Text>
        </View>
      </View>
      <View 
        ref={containerRef}
        style={styles.paypalButtonContainerWeb}
        nativeID="paypal-button-container-web"
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading PayPal...</Text>
        </View>
      )}
    </ScrollView>
  );
}

function CartItemRow({ item, index, removeFromCart, updateQuantity }: {
  item: CartItemType;
  index: number;
  removeFromCart: (id: string, size: SalsaSize) => void;
  updateQuantity: (id: string, size: SalsaSize, quantity: number) => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(-100, gestureState.dx));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.spring(translateX, {
            toValue: -100,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleDelete = () => {
    removeFromCart(item.id, item.size);
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.cartItemWrapper}>
      <View style={styles.deleteBackground}>
        <Trash2 size={32} color="#fff" />
      </View>
      <Animated.View
        style={[
          styles.cartItem,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.itemNumber}>
          <Text style={styles.itemNumberText}>{index + 1}</Text>
        </View>
        <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSize}>{item.size}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
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
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
          hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
          testID={`delete-button-${item.id}-${item.size}`}
        >
          <Trash2 size={24} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function CartScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { cart, removeFromCart, updateQuantity, getCartSubtotal, getCartTax, getCartTip, getCartTotal, placeOrder, tipPercentage, setTipPercentage } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [agreedToWarning, setAgreedToWarning] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isCashAppLoading, setIsCashAppLoading] = useState(false);
  const [showPayPalModal, setShowPayPalModal] = useState(false);

  const handleCheckout = async () => {
    console.log("handleCheckout called");
    console.log("name:", name);
    console.log("email:", email);
    console.log("phone:", phone);
    console.log("agreedToWarning:", agreedToWarning);
    
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

    console.log("All validation passed, placing order...");
    setIsPlacingOrder(true);
    
    try {
      console.log("Calling placeOrder...");
      const order = await placeOrder(name.trim(), email.trim(), phone.trim(), notes.trim());
      console.log("Order placed:", order);
      
      try {
        const itemsList = cart.map(item => 
          `${item.name} (${item.size}) - Quantity: ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');

        const orderSubtotal = getCartSubtotal();
        const orderTax = getCartTax();
        const orderTip = getCartTip();
        const orderTotal = getCartTotal();
        
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
          (notes.trim() ? `Notes: ${notes.trim()}\n\n` : '') +
          `Thank you for your order!\n` +
          `We will contact you shortly to confirm your order and arrange payment.\n\n` +
          `If we do not reach out to you within 24hr please call (210)396-0722\n\n` +
          `Please note: Local delivery is currently available only within or near the New Braunfels and San Antonio, Texas area.`;

        const mailtoUrl = `mailto:orders@aychihuahuasalsa.com?subject=${encodeURIComponent(`New Order #${order.id}`)}&body=${encodeURIComponent(emailBody)}`;
        
        console.log("Opening email client...");
        const canOpen = await Linking.canOpenURL(mailtoUrl);
        console.log("Can open mailto URL:", canOpen);
        
        if (canOpen) {
          await Linking.openURL(mailtoUrl);
        } else {
          console.log("Cannot open email client, but order was still placed");
        }
      } catch (error) {
        console.error("Could not open email client:", error);
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
        `Your order #${order.id} has been placed successfully! We'll contact you shortly to confirm your order and arrange payment. Thank you!`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "There was a problem placing your order. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  const renderCartItem = ({ item, index }: { item: CartItemType; index: number }) => (
    <CartItemRow
      item={item}
      index={index}
      removeFromCart={removeFromCart}
      updateQuantity={updateQuantity}
    />
  );

  const cartSubtotal = getCartSubtotal();
  const cartTax = getCartTax();
  const cartTip = getCartTip();
  const cartTotal = getCartTotal();

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

                <View style={styles.checkoutSummary}>
                  <View style={styles.checkoutSummaryRow}>
                    <Text style={styles.checkoutSummaryLabel}>Subtotal</Text>
                    <Text style={styles.checkoutSummaryValue}>${cartSubtotal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.checkoutSummaryRow}>
                    <Text style={styles.checkoutSummaryLabel}>Tax (8.25%)</Text>
                    <Text style={styles.checkoutSummaryValue}>${cartTax.toFixed(2)}</Text>
                  </View>
                  {tipPercentage > 0 && (
                    <View style={styles.checkoutSummaryRow}>
                      <Text style={styles.checkoutSummaryLabel}>Tip ({tipPercentage}%)</Text>
                      <Text style={styles.checkoutSummaryValue}>${cartTip.toFixed(2)}</Text>
                    </View>
                  )}
                  <View style={styles.checkoutGrandTotal}>
                    <Text style={styles.checkoutGrandTotalLabel}>Grand Total</Text>
                    <Text style={styles.checkoutGrandTotalAmount}>${cartTotal.toFixed(2)}</Text>
                  </View>
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
                    <Text style={styles.stepText}>Review your order summary</Text>
                  </View>
                  <View style={styles.instructionStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <Text style={styles.stepText}>Click Place Order - we&apos;ll contact you to arrange payment</Text>
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

                <View style={styles.paymentButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.paypalButton, (!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder) && styles.paypalButtonDisabled]} 
                    onPress={() => {
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
                      setShowPayPalModal(true);
                    }}
                    disabled={!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder}
                  >
                    <Text style={[styles.paypalButtonText, (!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder) && styles.paypalButtonTextDisabled]}>
                      💳 Pay with PayPal
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.cashAppButton, (!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder) && styles.cashAppButtonDisabled]} 
                    onPress={async () => {
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
                      
                      setIsCashAppLoading(true);
                      try {
                        const order = await placeOrder(name.trim(), email.trim(), phone.trim(), `Cash App Payment\n${notes.trim()}`);
                        
                        const itemsList = cart.map(item => 
                          `${item.name} (${item.size}) x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`
                        ).join('\n');

                        const emailBody = `New Cash App Order #${order.id}\n\n` +
                          `Payment Method: Cash App\n` +
                          `Payment Status: PENDING\n\n` +
                          `Customer: ${name.trim()}\n` +
                          `Phone: ${phone.trim()}\n` +
                          `Email: ${email.trim()}\n\n` +
                          `Items:\n${itemsList}\n\n` +
                          `Subtotal: ${cartSubtotal.toFixed(2)}\n` +
                          `Tax (8.25%): ${cartTax.toFixed(2)}\n` +
                          (tipPercentage > 0 ? `Tip (${tipPercentage}%): ${cartTip.toFixed(2)}\n` : '') +
                          `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `   💰 TOTAL: ${cartTotal.toFixed(2)}\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                          (notes.trim() ? `Notes: ${notes.trim()}\n\n` : '') +
                          `Opening Cash App for payment...\n\n` +
                          `Please note: Local delivery is currently available only within or near the New Braunfels and San Antonio, Texas area.`;

                        const mailtoUrl = `mailto:orders@aychihuahuasalsa.com?subject=${encodeURIComponent(`Cash App Order #${order.id}`)}&body=${encodeURIComponent(emailBody)}`;
                        
                        const canOpen = await Linking.canOpenURL(mailtoUrl);
                        if (canOpen) {
                          await Linking.openURL(mailtoUrl);
                        }
                        
                        const cashAppUrl = `https://cash.app/$ayechihuahuasalsa/${cartTotal.toFixed(2)}?note=${encodeURIComponent(`Order ${order.id} - ${name.trim()}`)}`;
                        const canOpenCashApp = await Linking.canOpenURL(cashAppUrl);
                        if (canOpenCashApp) {
                          await Linking.openURL(cashAppUrl);
                        }
                        
                        setShowCheckout(false);
                        setName("");
                        setEmail("");
                        setPhone("");
                        setNotes("");
                        setAgreedToWarning(false);
                        setIsCashAppLoading(false);

                        Alert.alert(
                          "Opening Cash App",
                          `Your order #${order.id} has been placed! Cash App should open now to complete payment. Please send ${cartTotal.toFixed(2)} to $ayechihuahuasalsa. Thank you!`,
                          [{ text: "OK" }]
                        );
                      } catch (error) {
                        console.error("Error processing Cash App payment:", error);
                        Alert.alert("Error", "There was a problem placing your order. Please try again.");
                        setIsCashAppLoading(false);
                      }
                    }}
                    disabled={!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder || isCashAppLoading}
                  >
                    <Text style={[styles.cashAppButtonText, (!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder || isCashAppLoading) && styles.cashAppButtonTextDisabled]}>
                      {isCashAppLoading ? "Opening Cash App..." : "💵 Pay with Cash App"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.placeOrderButton, (!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder) && styles.placeOrderButtonDisabled]} 
                    onPress={handleCheckout}
                    disabled={!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder}
                  >
                    <Text style={[styles.placeOrderButtonText, (!agreedToWarning || !name.trim() || !email.trim() || !phone.trim() || isPlacingOrder) && styles.placeOrderButtonTextDisabled]}>
                      {isPlacingOrder ? "Placing Order..." : "📧 Place Order (Pay Later)"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPayPalModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPayPalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paypalModalContent}>
            <View style={styles.paypalModalHeader}>
              <Text style={styles.modalTitle}>PayPal Checkout</Text>
              <TouchableOpacity onPress={() => setShowPayPalModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            {Platform.OS === 'web' ? (
              <PayPalWebCheckout
                cartSubtotal={cartSubtotal}
                cartTax={cartTax}
                cartTip={cartTip}
                cartTotal={cartTotal}
                tipPercentage={tipPercentage}
                cart={cart}
                onSuccess={async (data: any) => {
                  setShowPayPalModal(false);
                  setIsPlacingOrder(true);
                  
                  try {
                    const order = await placeOrder(name.trim(), email.trim(), phone.trim(), `PayPal Order ID: ${data.orderID}\n${notes.trim()}`);
                    
                    try {
                      const itemsList = cart.map(item => 
                        `${item.name} (${item.size}) - Quantity: ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`
                      ).join('\n');

                      const emailBody = `New PAID Order #${order.id}\n\n` +
                        `Payment Status: PAID via PayPal\n` +
                        `PayPal Order ID: ${data.orderID}\n\n` +
                        `Customer: ${name.trim()}\n` +
                        `Phone: ${phone.trim()}\n` +
                        `Email: ${email.trim()}\n\n` +
                        `Items:\n${itemsList}\n\n` +
                        `Subtotal: ${cartSubtotal.toFixed(2)}\n` +
                        `Tax (New Braunfels 8.25%): ${cartTax.toFixed(2)}\n` +
                        (tipPercentage > 0 ? `Tip (${tipPercentage}%): ${cartTip.toFixed(2)}\n` : '') +
                        `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                        `   💰 TOTAL PAID: ${cartTotal.toFixed(2)}\n` +
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        (notes.trim() ? `Notes: ${notes.trim()}\n\n` : '') +
                        `Thank you for your payment!\n` +
                        `We will prepare your order and contact you for delivery details.\n\n` +
                        `Please note: Local delivery is currently available only within or near the New Braunfels and San Antonio, Texas area.`;

                      const mailtoUrl = `mailto:orders@aychihuahuasalsa.com?subject=${encodeURIComponent(`PAID Order #${order.id}`)}&body=${encodeURIComponent(emailBody)}`;
                      
                      const canOpen = await Linking.canOpenURL(mailtoUrl);
                      if (canOpen) {
                        await Linking.openURL(mailtoUrl);
                      }
                    } catch (error) {
                      console.error("Could not open email client:", error);
                    }
                    
                    setShowCheckout(false);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setNotes("");
                    setAgreedToWarning(false);
                    setIsPlacingOrder(false);

                    Alert.alert(
                      "Payment Successful!",
                      `Your payment has been processed successfully! Order #${order.id} has been placed. We'll contact you shortly for delivery details. Thank you!`,
                      [{ text: "OK" }]
                    );
                  } catch (error) {
                    console.error("Error placing order:", error);
                    Alert.alert("Error", "Payment was successful but there was a problem saving your order. Please contact us.");
                    setIsPlacingOrder(false);
                  }
                }}
                onError={() => {
                  setShowPayPalModal(false);
                  Alert.alert("Payment Error", "There was an error processing your payment. Please try again.");
                }}
                onCancel={() => {
                  setShowPayPalModal(false);
                }}
              />
            ) : (
              <WebView
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <script src="https://www.paypal.com/sdk/js?client-id=ASRb-19Dl8YmFwKRbIR0P2qQ4-_VBfUavytIdj-qdQU5RAh0cT7fgjPsjxvJjniLnYZ227OLQl01AYCV&currency=USD"></script>
                      <style>
                        body { 
                          margin: 0; 
                          padding: 20px; 
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                          background: #f5f5f5;
                        }
                        #paypal-button-container { 
                          max-width: 500px; 
                          margin: 0 auto;
                        }
                        .order-summary {
                          background: white;
                          padding: 20px;
                          border-radius: 12px;
                          margin-bottom: 20px;
                          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        .order-summary h3 {
                          margin: 0 0 15px 0;
                          color: #333;
                        }
                        .summary-row {
                          display: flex;
                          justify-content: space-between;
                          margin-bottom: 8px;
                          color: #666;
                        }
                        .summary-row.total {
                          font-size: 18px;
                          font-weight: bold;
                          color: #333;
                          padding-top: 12px;
                          border-top: 2px solid #eee;
                          margin-top: 12px;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="order-summary">
                        <h3>Order Summary</h3>
                        <div class="summary-row">
                          <span>Subtotal:</span>
                          <span>${cartSubtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                          <span>Tax (8.25%):</span>
                          <span>${cartTax.toFixed(2)}</span>
                        </div>
                        ${tipPercentage > 0 ? `
                        <div class="summary-row">
                          <span>Tip (${tipPercentage}%):</span>
                          <span>${cartTip.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="summary-row total">
                          <span>Total:</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                      <div id="paypal-button-container"></div>
                      <script>
                        paypal.Buttons({
                          style: {
                            layout: 'vertical',
                            color: 'gold',
                            shape: 'rect',
                            label: 'paypal'
                          },
                          createOrder: function(data, actions) {
                            return actions.order.create({
                              purchase_units: [{
                                amount: {
                                  value: '${cartTotal.toFixed(2)}',
                                  currency_code: 'USD',
                                  breakdown: {
                                    item_total: { value: '${cartSubtotal.toFixed(2)}', currency_code: 'USD' },
                                    tax_total: { value: '${(cartTax + cartTip).toFixed(2)}', currency_code: 'USD' }
                                  }
                                },
                                items: ${JSON.stringify(cart.map(item => ({
                                  name: `${item.name} (${item.size})`,
                                  unit_amount: { value: item.price.toFixed(2), currency_code: 'USD' },
                                  quantity: item.quantity.toString()
                                })))}
                              }]
                            });
                          },
                          onApprove: function(data, actions) {
                            return actions.order.capture().then(function(details) {
                              window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'PAYMENT_SUCCESS',
                                orderID: data.orderID,
                                payerName: details.payer.name.given_name + ' ' + details.payer.name.surname,
                                payerEmail: details.payer.email_address
                              }));
                            });
                          },
                          onError: function(err) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'PAYMENT_ERROR',
                              error: err.toString()
                            }));
                          },
                          onCancel: function(data) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'PAYMENT_CANCELLED'
                            }));
                          }
                        }).render('#paypal-button-container');
                      </script>
                    </body>
                    </html>
                  `,
                }}
                onMessage={async (event) => {
                  try {
                    const data = JSON.parse(event.nativeEvent.data);
                    console.log("PayPal message received:", data);
                    
                    if (data.type === 'PAYMENT_SUCCESS') {
                      setShowPayPalModal(false);
                      setIsPlacingOrder(true);
                      
                      try {
                        const order = await placeOrder(name.trim(), email.trim(), phone.trim(), `PayPal Order ID: ${data.orderID}\n${notes.trim()}`);
                        
                        try {
                          const itemsList = cart.map(item => 
                            `${item.name} (${item.size}) - Quantity: ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`
                          ).join('\n');

                          const emailBody = `New PAID Order #${order.id}\n\n` +
                            `Payment Status: PAID via PayPal\n` +
                            `PayPal Order ID: ${data.orderID}\n\n` +
                            `Customer: ${name.trim()}\n` +
                            `Phone: ${phone.trim()}\n` +
                            `Email: ${email.trim()}\n\n` +
                            `Items:\n${itemsList}\n\n` +
                            `Subtotal: ${cartSubtotal.toFixed(2)}\n` +
                            `Tax (New Braunfels 8.25%): ${cartTax.toFixed(2)}\n` +
                            (tipPercentage > 0 ? `Tip (${tipPercentage}%): ${cartTip.toFixed(2)}\n` : '') +
                            `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `   💰 TOTAL PAID: ${cartTotal.toFixed(2)}\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                            (notes.trim() ? `Notes: ${notes.trim()}\n\n` : '') +
                            `Thank you for your payment!\n` +
                            `We will prepare your order and contact you for delivery details.\n\n` +
                            `Please note: Local delivery is currently available only within or near the New Braunfels and San Antonio, Texas area.`;

                          const mailtoUrl = `mailto:orders@aychihuahuasalsa.com?subject=${encodeURIComponent(`PAID Order #${order.id}`)}&body=${encodeURIComponent(emailBody)}`;
                          
                          const canOpen = await Linking.canOpenURL(mailtoUrl);
                          if (canOpen) {
                            await Linking.openURL(mailtoUrl);
                          }
                        } catch (error) {
                          console.error("Could not open email client:", error);
                        }
                        
                        setShowCheckout(false);
                        setName("");
                        setEmail("");
                        setPhone("");
                        setNotes("");
                        setAgreedToWarning(false);
                        setIsPlacingOrder(false);

                        Alert.alert(
                          "Payment Successful!",
                          `Your payment has been processed successfully! Order #${order.id} has been placed. We'll contact you shortly for delivery details. Thank you!`,
                          [{ text: "OK" }]
                        );
                      } catch (error) {
                        console.error("Error placing order:", error);
                        Alert.alert("Error", "Payment was successful but there was a problem saving your order. Please contact us.");
                        setIsPlacingOrder(false);
                      }
                    } else if (data.type === 'PAYMENT_ERROR') {
                      setShowPayPalModal(false);
                      Alert.alert("Payment Error", "There was an error processing your payment. Please try again.");
                    } else if (data.type === 'PAYMENT_CANCELLED') {
                      setShowPayPalModal(false);
                    }
                  } catch (error) {
                    console.error("Error processing PayPal message:", error);
                  }
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                style={styles.webview}
              />
            )}
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
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center" as const,
  },
  cartItemWrapper: {
    marginBottom: 12,
    position: "relative" as const,
    overflow: "hidden" as const,
    borderRadius: 16,
  },
  deleteBackground: {
    position: "absolute" as const,
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: "#EF4444",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderRadius: 16,
  },
  cartItem: {
    flexDirection: "row" as const,
    backgroundColor: Colors.light.cardBg,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
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
    gap: 8,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EF4444",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    marginLeft: 12,
    alignSelf: "center" as const,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.light.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center" as const,
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
    padding: 18,
    borderRadius: 16,
    alignItems: "center" as const,
    marginBottom: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
    letterSpacing: 0.5,
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
    maxWidth: 700,
    width: "100%",
    alignSelf: "center" as const,
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
    padding: 18,
    borderRadius: 16,
    alignItems: "center" as const,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  placeOrderButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#fff",
    letterSpacing: 0.3,
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
  checkoutSummary: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  checkoutSummaryRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  checkoutSummaryLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  checkoutSummaryValue: {
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: "600" as const,
  },
  checkoutGrandTotal: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: Colors.light.primary,
  },
  checkoutGrandTotalLabel: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  checkoutGrandTotalAmount: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.light.primary,
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
  paymentButtonsContainer: {
    gap: 12,
  },
  paypalButton: {
    backgroundColor: "#0070BA",
    padding: 18,
    borderRadius: 16,
    alignItems: "center" as const,
    shadowColor: "#0070BA",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  paypalButtonDisabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.6,
  },
  paypalButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#fff",
    letterSpacing: 0.3,
  },
  paypalButtonTextDisabled: {
    color: Colors.light.textSecondary,
  },
  cashAppButton: {
    backgroundColor: "#00D64B",
    padding: 18,
    borderRadius: 16,
    alignItems: "center" as const,
    shadowColor: "#00D64B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  cashAppButtonDisabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.6,
  },
  cashAppButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#fff",
    letterSpacing: 0.3,
  },
  cashAppButtonTextDisabled: {
    color: Colors.light.textSecondary,
  },
  paypalModalContent: {
    backgroundColor: Colors.light.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "90%",
    maxWidth: 700,
    width: "100%",
    alignSelf: "center" as const,
    overflow: "hidden" as const,
  },
  paypalModalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  webview: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  orderSummaryWeb: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#333",
    marginBottom: 15,
  },
  summaryRowWeb: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 8,
  },
  summaryLabelWeb: {
    fontSize: 14,
    color: "#666",
  },
  summaryValueWeb: {
    fontSize: 14,
    color: "#666",
  },
  summaryRowTotal: {
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#eee",
    marginTop: 12,
  },
  summaryLabelTotal: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#333",
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#333",
  },
  paypalButtonContainerWeb: {
    minHeight: 200,
    maxWidth: 500,
    alignSelf: "center" as const,
    width: "100%",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center" as const,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
});
