// src/hooks/useRSVP.js
import { useState, useCallback, useEffect } from "react";
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
      setRsvpList(res.data.allRsvps);
      setUserRsvp(res.data.userRsvp);    

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

// Auto-fetch RSVPs when hook mounts
  useEffect(() => {
    fetchRSVPs();
  }, [fetchRSVPs]);
  
    return {
    rsvpList,
    userRsvp,
    loading,
    error,
    fetchRSVPs,
    createRSVP,
  };
}
