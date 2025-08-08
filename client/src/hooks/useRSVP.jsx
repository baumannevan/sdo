// src/hooks/useRSVP.js
import { useState, useCallback } from "react";
import axios from "axios";


const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // needed for cookie auth
});


export function useRSVP() {
  const [rsvpList, setRsvpList] = useState([]);
  const [userRsvp, setUserRsvp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRSVPs = useCallback(async (eventId) => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${eventId}/rsvps`);
      setRsvpList(res.data);

      // If it's just the user's RSVP, store it separately
      if (res.data.length === 1) {
        setUserRsvp(res.data[0]);
      } else {
        setUserRsvp(null); // officer view
      }

      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch RSVPs");
      setRsvpList([]);
    } finally {
      setLoading(false);
    }
  }, []);

const createRSVP = useCallback(async (eventId, response) => {
  setLoading(true);
  try {
    const res = await api.post(`/events/${eventId}/rsvp`, { response });
    setUserRsvp(res.data); // Save the RSVP response
    setError(null);
  } catch (err) {
    console.error("RSVP creation error:", err);
    setError(err.response?.data?.error || "RSVP failed");
  } finally {
    setLoading(false);
  }
}, [])

  return {
    rsvpList,
    userRsvp,
    loading,
    error,
    fetchRSVPs,
    createRSVP,
  };
}
