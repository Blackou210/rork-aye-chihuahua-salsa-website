import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Event, EVENTS as DEFAULT_EVENTS } from "@/constants/events";

const STORAGE_KEY = "ayechihuahua_events";

export const [EventsProvider, useEvents] = createContextHook(() => {
  const [events, setEvents] = useState<Event[]>(DEFAULT_EVENTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedEvents = JSON.parse(stored);
          if (Array.isArray(parsedEvents) && parsedEvents.length > 0) {
            setEvents(parsedEvents);
            console.log('Loaded events from storage:', parsedEvents.length);
          } else {
            console.log('Invalid events data format, reinitializing');
            await AsyncStorage.removeItem(STORAGE_KEY);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
            setEvents(DEFAULT_EVENTS);
          }
        } catch (parseError) {
          console.error('Failed to parse events, clearing corrupted data:', parseError);
          await AsyncStorage.removeItem(STORAGE_KEY);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
          setEvents(DEFAULT_EVENTS);
        }
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
        setEvents(DEFAULT_EVENTS);
        console.log('Initialized events with defaults:', DEFAULT_EVENTS.length);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
      await AsyncStorage.removeItem(STORAGE_KEY);
      setEvents(DEFAULT_EVENTS);
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = useCallback(async (event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents((currentEvents) => {
      const updatedEvents = [...currentEvents, newEvent];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents)).catch((error) =>
        console.error("Failed to save events:", error)
      );
      console.log('Event added, new total:', updatedEvents.length);
      return updatedEvents;
    });
  }, []);

  const updateEvent = useCallback(async (id: string, updatedEvent: Omit<Event, "id">) => {
    setEvents((currentEvents) => {
      const updatedEvents = currentEvents.map((event) =>
        event.id === id ? { ...updatedEvent, id } : event
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents)).catch((error) =>
        console.error("Failed to save events:", error)
      );
      console.log('Event updated:', id);
      return updatedEvents;
    });
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    console.log('Deleting event with id:', id);
    try {
      setEvents((currentEvents) => {
        const updatedEvents = currentEvents.filter((event) => event.id !== id);
        console.log('Events before delete:', currentEvents.length);
        console.log('Events after delete:', updatedEvents.length);
        
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents))
          .then(() => {
            console.log('Event deleted successfully, new total:', updatedEvents.length);
          })
          .catch((error) => {
            console.error("Failed to save events after delete:", error);
          });
        
        return updatedEvents;
      });
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
  }), [events, isLoading, addEvent, updateEvent, deleteEvent]);
});
