import Colors from "@/constants/colors";
import { Event } from "@/constants/events";
import { useEvents } from "@/context/events";
import { Calendar, MapPin, Clock, Map } from "lucide-react-native";
import React from "react";
import { FlatList, ImageBackground, Linking, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

export default function EventsScreen() {
  const { events: EVENTS, isLoading } = useEvents();

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" as const, alignItems: "center" as const }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }
  const handleGetDirections = (address: string) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const handleViewAllOnMap = () => {
    const upcomingEvents = EVENTS.filter(event => isUpcoming(event.date));
    if (upcomingEvents.length === 0) {
      const url = `https://maps.google.com/`;
      Linking.openURL(url);
      return;
    }
    
    if (upcomingEvents.length === 1) {
      const url = `https://maps.google.com/?q=${encodeURIComponent(upcomingEvents[0].address)}`;
      Linking.openURL(url);
      return;
    }
    
    const addresses = upcomingEvents.map(e => e.address).join(' | ');
    const url = `https://maps.google.com/?q=${encodeURIComponent(addresses)}`;
    Linking.openURL(url);
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: "long", 
      month: "long", 
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    };
    return date.toLocaleDateString("en-US", options);
  };

  const isUpcoming = (dateString: string): boolean => {
    const [year, month, day] = dateString.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day, 12, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  const renderEventCard = ({ item }: { item: Event }) => {
    const upcoming = isUpcoming(item.date);
    
    return (
      <View style={[styles.eventCard, !upcoming && styles.eventCardPast]}>
        <View style={styles.eventHeader}>
          <View style={[styles.dateTag, !upcoming && styles.dateTagPast]}>
            <Calendar size={16} color="#fff" />
            <Text style={styles.dateTagText}>{formatDate(item.date)}</Text>
          </View>
          {!upcoming && (
            <View style={styles.pastBadge}>
              <Text style={styles.pastBadgeText}>Past Event</Text>
            </View>
          )}
        </View>

        <Text style={styles.eventTitle}>{item.title}</Text>
        
        <View style={styles.eventDetail}>
          <MapPin size={18} color={Colors.light.textSecondary} />
          <View style={styles.eventDetailText}>
            <Text style={styles.eventLocation}>{item.location}</Text>
            <Text style={styles.eventAddress}>{item.address}</Text>
          </View>
        </View>

        <View style={styles.eventDetail}>
          <Clock size={18} color={Colors.light.textSecondary} />
          <Text style={styles.eventTime}>
            {item.startTime} - {item.endTime}
          </Text>
        </View>

        {item.description && (
          <Text style={styles.eventDescription}>{item.description}</Text>
        )}

        {upcoming && (
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => handleGetDirections(item.address)}
            activeOpacity={0.7}
          >
            <MapPin size={20} color="#fff" />
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const upcomingEvents = EVENTS.filter(event => isUpcoming(event.date)).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const pastEvents = EVENTS.filter(event => !isUpcoming(event.date)).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const sortedEvents = [...upcomingEvents, ...pastEvents];

  return (
    <ImageBackground 
      source={{ uri: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80" }}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Find Us At</Text>
          <Text style={styles.headerSubtitle}>
            {upcomingEvents.length} upcoming {upcomingEvents.length === 1 ? 'event' : 'events'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={handleViewAllOnMap}
          activeOpacity={0.7}
        >
          <Map size={20} color="#fff" />
          <Text style={styles.mapButtonText}>Map</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Calendar size={64} color={Colors.light.textSecondary} />
            <Text style={styles.emptyText}>No events scheduled yet</Text>
            <Text style={styles.emptySubtext}>Check back soon for upcoming farmers markets!</Text>
          </View>
        }
      />
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
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  mapButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  eventList: {
    padding: 16,
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center" as const,
  },
  eventCard: {
    backgroundColor: Colors.light.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventCardPast: {
    opacity: 0.7,
  },
  eventHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  dateTag: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  dateTagPast: {
    backgroundColor: Colors.light.textSecondary,
  },
  dateTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  pastBadge: {
    backgroundColor: Colors.light.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pastBadgeText: {
    color: Colors.light.textSecondary,
    fontSize: 11,
    fontWeight: "600" as const,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  eventDetail: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 12,
    marginBottom: 12,
  },
  eventDetailText: {
    flex: 1,
  },
  eventLocation: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  eventAddress: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  eventTime: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "500" as const,
  },
  eventDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  directionsButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  directionsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as const,
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
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 8,
    textAlign: "center" as const,
  },
});
