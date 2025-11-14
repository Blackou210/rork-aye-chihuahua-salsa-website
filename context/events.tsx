import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Event, EVENTS as DEFAULT_EVENTS } from "../constants/events";

const STORAGE_KEY = "ayechihuahua_events";
const EMPTY_EVENTS_JSON = "[]";
const DEFAULT_EVENT_IDS = new Set(DEFAULT_EVENTS.map((event) => event.id));

const isValidEvent = (value: unknown): value is Event => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<Event>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.location === "string" &&
    typeof candidate.address === "string" &&
    typeof candidate.date === "string" &&
    typeof candidate.startTime === "string" &&
    typeof candidate.endTime === "string" &&
    (typeof candidate.description === "undefined" || typeof candidate.description === "string")
  );
};

const sanitizeEvents = (raw: unknown): Event[] => {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter((item) => isValidEvent(item) && !DEFAULT_EVENT_IDS.has(item.id));
};

export const [EventsProvider, useEvents] = createContextHook(() => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadEvents = async () => {
      console.log("Loading events from storage");
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) {
          console.log("Storage empty, initializing with no events");
          if (isActive) {
            setEvents([]);
          }
          await AsyncStorage.setItem(STORAGE_KEY, EMPTY_EVENTS_JSON);
          return;
        }

        const parsed = JSON.parse(stored) as unknown;
        const sanitized = sanitizeEvents(parsed);

        if (!Array.isArray(parsed)) {
          console.log("Stored events were not an array, resetting storage");
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        } else if (sanitized.length !== parsed.length) {
          console.log("Removed invalid or default events:", parsed.length - sanitized.length);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        }

        if (isActive) {
          setEvents(sanitized);
          console.log("Events in memory:", sanitized.length);
        }
      } catch (error) {
        console.error("Failed to load events:", error);
        await AsyncStorage.removeItem(STORAGE_KEY);
        if (isActive) {
          setEvents([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      isActive = false;
    };
  }, []);

  const persistEvents = useCallback(async (eventsToPersist: Event[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(eventsToPersist));
      console.log("Persisted events:", eventsToPersist.length);
    } catch (error) {
      console.error("Failed to persist events:", error);
      throw error;
    }
  }, []);

  const addEvent = useCallback((event: Omit<Event, "id">) => {
    return new Promise<void>((resolve, reject) => {
      const newEvent: Event = {
        ...event,
        id: Date.now().toString(),
      };
      console.log("Adding new event:", newEvent);

      setEvents((currentEvents) => {
        const updatedEvents = [...currentEvents, newEvent];
        persistEvents(updatedEvents)
          .then(() => {
            console.log("Event added. Total events:", updatedEvents.length);
            resolve();
          })
          .catch((error) => {
            console.error("Failed to save events after add:", error);
            reject(error);
          });
        return updatedEvents;
      });
    });
  }, [persistEvents]);

  const updateEvent = useCallback((id: string, updatedEvent: Omit<Event, "id">) => {
    return new Promise<void>((resolve, reject) => {
      console.log("Updating event:", id);
      setEvents((currentEvents) => {
        const updatedEvents = currentEvents.map((event) =>
          event.id === id ? { ...updatedEvent, id } : event
        );
        persistEvents(updatedEvents)
          .then(() => {
            console.log("Event updated:", id);
            resolve();
          })
          .catch((error) => {
            console.error("Failed to save events after update:", error);
            reject(error);
          });
        return updatedEvents;
      });
    });
  }, [persistEvents]);

  const deleteEvent = useCallback((id: string) => {
    console.log("Deleting event:", id);
    return new Promise<void>((resolve, reject) => {
      setEvents((currentEvents) => {
        const updatedEvents = currentEvents.filter((event) => event.id !== id);
        persistEvents(updatedEvents)
          .then(() => {
            console.log("Event deleted. Remaining events:", updatedEvents.length);
            resolve();
          })
          .catch((error) => {
            console.error("Failed to save events after delete:", error);
            reject(error);
          });
        return updatedEvents;
      });
    });
  }, [persistEvents]);

  return useMemo(
    () => ({
      events,
      isLoading,
      addEvent,
      updateEvent,
      deleteEvent,
    }),
    [events, isLoading, addEvent, updateEvent, deleteEvent]
  );
});
