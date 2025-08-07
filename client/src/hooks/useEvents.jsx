import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Axios instance with credentials so cookies are sent automatically
const api = axios.create({
  baseURL: "/api/",
  withCredentials: true, // ensures cookie-based auth is sent
});

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET /events - fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/events/");
      setEvents(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // GET /events/:id - fetch single event details
  const fetchEventById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`events/${id}`)
      setSelectedEvent(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST /events - create new event (officer only)
  const createEvent = useCallback(async (newEvent) => {
    try {
      const res = await api.post("events/", newEvent);
      setEvents((prev) => [...prev, res.data]); // update local state
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, []);

  // PUT /events/:id - update event (officer only)
  const updateEvent = useCallback(async (id, updatedData) => {
    try {
      const res = await api.put(`events/${id}`, updatedData);
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? res.data : event))
      );
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, []);

  // DELETE /events/:id - delete event (officer only)
  const deleteEvent = useCallback(async (id) => {
    try {
      await api.delete(`events/${id}`);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, []);

  // Auto-fetch events when hook mounts
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    selectedEvent,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
