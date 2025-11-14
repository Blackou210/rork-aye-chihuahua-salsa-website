import Colors from "@/constants/colors";
import { Event } from "@/constants/events";
import { useEvents } from "@/context/events";
import { useCart } from "@/context/cart";
import { Order, OrderStatus } from "@/types/order";
import { Plus, Edit, Trash2, X, Save, Mail, MessageCircle, Clock, Check, PackageCheck, Lock, Phone, ChevronRight } from "lucide-react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from "react-native";
type EventFormData = Omit<Event, "id">;

const ORDER_STATUS_CONFIG = {
  pending: { label: "Pending", color: Colors.light.warning, icon: Clock },
  confirmed: { label: "Confirmed", color: Colors.light.success, icon: Check },
  preparing: { label: "Preparing", color: Colors.light.secondary, icon: Clock },
  ready: { label: "Ready", color: Colors.light.success, icon: PackageCheck },
  completed: { label: "Completed", color: Colors.light.textSecondary, icon: Check },
  cancelled: { label: "Cancelled", color: "#EF4444", icon: Clock },
};

const ADMIN_PIN = "0722";

export default function AdminScreen() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { orders, updateOrderStatus, deleteOrder } = useCart();

  console.log('\n=== ADMIN PANEL DEBUG ===');
  console.log('📅 Total Events:', events.length);
  console.log('Events:', JSON.stringify(events, null, 2));
  console.log('📦 Total Orders:', orders.length);
  console.log('Orders:', JSON.stringify(orders, null, 2));
  console.log('=== END ADMIN DEBUG ===\n');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [activeTab, setActiveTab] = useState<'events' | 'orders'>('events');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    location: "",
    address: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const resetAuth = useCallback(() => {
    setIsAuthenticated(false);
    setPinInput("");
  }, []);

  useFocusEffect(resetAuth);

  const handleLogin = () => {
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinInput("");
    } else {
      Alert.alert("Invalid PIN", "Please enter the correct 4-digit PIN code");
      setPinInput("");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      address: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    setEditingEvent(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (event: Event) => {
    const [year, month, day] = event.date.split('-');
    const displayDate = `${day}-${month}-${year}`;
    
    setEditingEvent(event);
    setFormData({
      title: event.title,
      location: event.location,
      address: event.address,
      date: displayDate,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description || "",
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.location || !formData.address || !formData.date || !formData.startTime || !formData.endTime) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = formData.date.match(datePattern);
    
    if (!match) {
      Alert.alert("Error", "Please enter date in DD-MM-YYYY format (e.g., 17-01-2025)");
      return;
    }

    const [, day, month, year] = match;
    const isoDate = `${year}-${month}-${day}`;

    console.log('\n=== SAVING EVENT ===');
    console.log('User input date:', formData.date);
    console.log('Converted to ISO:', isoDate);
    console.log('Event data:', { ...formData, date: isoDate });

    try {
      const eventToSave = { ...formData, date: isoDate };
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventToSave);
        console.log('✅ Event updated successfully');
      } else {
        await addEvent(eventToSave);
        console.log('✅ Event added successfully');
      }
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('❌ Save error:', error);
      Alert.alert("Error", "Failed to save event: " + (error instanceof Error ? error.message : String(error)));
    }
    console.log('=== END SAVING EVENT ===\n');
  };

  const handleDelete = (event: Event) => {
    console.log('\n=== handleDelete called ===');
    console.log('Event to delete:', { id: event.id, title: event.title, idType: typeof event.id });

    const performDelete = async () => {
      console.log('\n=== Delete confirmed ===');
      console.log('Calling deleteEvent with id:', event.id);
      try {
        await deleteEvent(event.id);
        console.log('\u2705 deleteEvent completed successfully');
      } catch (error) {
        console.error('\u274c Delete error:', error);
        Alert.alert("Error", "Failed to delete event: " + (error instanceof Error ? error.message : String(error)));
      }
    };

    if (Platform.OS === "web") {
      const confirmMessage = `Are you sure you want to delete "${event.title}"?`;
      if (typeof window !== "undefined") {
        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) {
          console.log('Delete cancelled via web confirm dialog');
          return;
        }
      }
      void performDelete();
      return;
    }

    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log('Delete cancelled'),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void performDelete();
          },
        },
      ]
    );
  };


  const handleSendText = (order: Order) => {
    const itemsList = order.items.map(item => 
      `${item.name} (${item.size}) x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `Order #${order.id}\n\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nEmail: ${order.customerEmail}\n\nItems:\n${itemsList}\n\nTotal: ${order.total.toFixed(2)}${order.notes ? `\n\nNotes: ${order.notes}` : ''}`;

    const smsUrl = `sms:${order.customerPhone}?body=${encodeURIComponent(message)}`;
    Linking.openURL(smsUrl);
  };

  const handleSendEmail = (order: Order) => {
    const itemsList = order.items.map(item => 
      `${item.name} (${item.size}) - Quantity: ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const emailBody = `Order #${order.id}\n\n` +
      `Customer: ${order.customerName}\n` +
      `Phone: ${order.customerPhone}\n` +
      `Email: ${order.customerEmail}\n\n` +
      `Items:\n${itemsList}\n\n` +
      `Total: ${order.total.toFixed(2)}` +
      (order.notes ? `\n\nNotes: ${order.notes}` : '');

    const mailtoUrl = `mailto:${order.customerEmail}?subject=${encodeURIComponent(`Order Confirmation #${order.id}`)}&body=${encodeURIComponent(emailBody)}`;
    Linking.openURL(mailtoUrl);
  };

  const handleCall = (order: Order) => {
    const phoneNumber = order.customerPhone.replace(/[^0-9]/g, '');
    const telUrl = `tel:${phoneNumber}`;
    Linking.openURL(telUrl);
  };

  const handleDeleteOrder = (order: Order) => {
    Alert.alert(
      "Delete Order",
      `Are you sure you want to delete order #${order.id}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteOrder(order.id);
            } catch (error) {
              Alert.alert("Error", "Failed to delete order");
              console.error("Delete order error:", error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  const handleChangeStatus = (order: Order, newStatus: OrderStatus) => {
    Alert.alert(
      "Change Order Status",
      `Change order #${order.id} from "${ORDER_STATUS_CONFIG[order.status].label}" to "${ORDER_STATUS_CONFIG[newStatus].label}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Change",
          onPress: () => updateOrderStatus(order.id, newStatus),
        },
      ]
    );
  };

  const getAvailableStatusChanges = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case "pending":
        return ["confirmed", "cancelled"];
      case "confirmed":
        return ["preparing", "cancelled"];
      case "preparing":
        return ["ready", "cancelled"];
      case "ready":
        return ["completed", "cancelled"];
      case "completed":
        return [];
      case "cancelled":
        return ["pending"];
      default:
        return [];
    }
  };

  const renderOrderCard = ({ item }: { item: Order }) => {
    const statusConfig = ORDER_STATUS_CONFIG[item.status];
    const Icon = statusConfig.icon;
    const orderDate = new Date(item.createdAt);
    const availableStatuses = getAvailableStatusChanges(item.status);

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderTitle}>Order #{item.id}</Text>
            <Text style={styles.orderDate}>
              {orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} {orderDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
            <Icon size={16} color="#fff" />
            <Text style={styles.statusText}>{statusConfig.label}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {item.items.map((cartItem, idx) => (
            <View key={`${cartItem.id}-${cartItem.size}-${idx}`} style={styles.orderItem}>
              <Text style={styles.itemName}>
                {cartItem.name} ({cartItem.size})
              </Text>
              <Text style={styles.itemQuantity}>x{cartItem.quantity}</Text>
              <Text style={styles.itemPrice}>${(cartItem.price * cartItem.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.customerInfo}>
            {item.customerName} • {item.customerPhone}
          </Text>
          <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleCall(item)}
          >
            <Phone size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSendText(item)}
          >
            <MessageCircle size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSendEmail(item)}
          >
            <Mail size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteOrderButton}
            onPress={() => handleDeleteOrder(item)}
          >
            <Trash2 size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusChangeContainer}>
          <Text style={styles.statusChangeLabel}>Actions:</Text>
          <View style={styles.statusChangeButtons}>
            {availableStatuses.map((status) => {
              const config = ORDER_STATUS_CONFIG[status];
              const StatusIcon = config.icon;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusChangeButton, { backgroundColor: config.color }]}
                  onPress={() => handleChangeStatus(item, status)}
                >
                  <StatusIcon size={16} color="#fff" />
                  <Text style={styles.statusChangeButtonText}>{config.label}</Text>
                  <ChevronRight size={16} color="#fff" />
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.statusChangeButton, styles.deleteStatusButton]}
              onPress={() => handleDeleteOrder(item)}
            >
              <Trash2 size={16} color="#fff" />
              <Text style={styles.statusChangeButtonText}>Delete Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventItemContent}>
        <Text style={styles.eventItemTitle}>{item.title}</Text>
        <Text style={styles.eventItemDate}>{formatDate(item.date)}</Text>
        <Text style={styles.eventItemLocation}>{item.location}</Text>
      </View>
      <View style={styles.eventItemActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
          activeOpacity={0.7}
        >
          <Edit size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
          activeOpacity={0.7}
          testID={`delete-event-${item.id}`}
        >
          <Trash2 size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <View style={styles.loginCard}>
          <Lock size={48} color={Colors.light.primary} />
          <Text style={styles.loginTitle}>Admin Login</Text>
          <Text style={styles.loginSubtitle}>Enter 4-digit PIN code</Text>
          
          <TextInput
            style={styles.pinInput}
            value={pinInput}
            onChangeText={setPinInput}
            placeholder="Enter PIN"
            placeholderTextColor={Colors.light.textSecondary}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={4}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleLogin}
          />
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        {activeTab === 'events' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddModal}
            activeOpacity={0.7}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.tabActive]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>
            Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.tabActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
            Orders ({orders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'events' ? (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No events yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button to add your first event</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders yet</Text>
              <Text style={styles.emptySubtext}>Orders will appear here when customers place them</Text>
            </View>
          }
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
              style={styles.modalCloseButton}
            >
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingEvent ? "Edit Event" : "Add Event"}
            </Text>
            <TouchableOpacity onPress={handleSave} style={styles.modalSaveButton}>
              <Save size={24} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="e.g. New Braunfels Farmers Market"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="e.g. Downtown New Braunfels"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Address *</Text>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="e.g. 390 S Seguin Ave, New Braunfels, TX 78130"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date (DD-MM-YYYY) *</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="e.g. 17-01-2025"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>Start Time *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.startTime}
                  onChangeText={(text) => setFormData({ ...formData, startTime: text })}
                  placeholder="e.g. 9:00 AM"
                  placeholderTextColor={Colors.light.textSecondary}
                />
              </View>

              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>End Time *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.endTime}
                  onChangeText={(text) => setFormData({ ...formData, endTime: text })}
                  placeholder="e.g. 1:00 PM"
                  placeholderTextColor={Colors.light.textSecondary}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Additional details about the event..."
                placeholderTextColor={Colors.light.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
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
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  eventList: {
    padding: 16,
  },
  eventItem: {
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventItemContent: {
    flex: 1,
  },
  eventItemTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  eventItemDate: {
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: 2,
  },
  eventItemLocation: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  eventItemActions: {
    flexDirection: "row" as const,
    gap: 8,
  },
  editButton: {
    backgroundColor: Colors.light.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  tabContainer: {
    flexDirection: "row" as const,
    backgroundColor: Colors.light.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center" as const,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.primary,
  },
  orderCard: {
    backgroundColor: Colors.light.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#fff",
  },
  orderItems: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 12,
    gap: 8,
  },
  orderItem: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  itemQuantity: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    minWidth: 60,
    textAlign: "right" as const,
  },
  orderFooter: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginTop: 12,
  },
  customerInfo: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  notesContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row" as const,
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  deleteOrderButton: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#fff",
  },
  emptyContainer: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 8,
    textAlign: "center" as const,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalCloseButton: {
    width: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  modalSaveButton: {
    width: 40,
    alignItems: "flex-end" as const,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: "row" as const,
    gap: 12,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.cardBg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  centerContent: {
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 24,
  },

  loginCard: {
    backgroundColor: Colors.light.cardBg,
    borderRadius: 24,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    textAlign: "center" as const,
  },
  pinInput: {
    width: "100%",
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: "center" as const,
    letterSpacing: 8,
  },
  loginButton: {
    width: "100%",
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center" as const,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  statusChangeContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  statusChangeLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  statusChangeButtons: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  statusChangeButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusChangeButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#fff",
  },
  deleteStatusButton: {
    backgroundColor: "#EF4444",
  },
});
