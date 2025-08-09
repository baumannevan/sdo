import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Axios instance with credentials so cookies are sent automatically
const api = axios.create({
  baseURL: "/api/", // matches your backend mount
  withCredentials: true,
});

export default function useAttendance(eventId) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch attendance records for an event
  const fetchAttendance = useCallback(async () => {
    if (!eventId) {
      setAttendanceRecords([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log(`[useAttendance] GET /api/attendance/${eventId}`);
      const res = await api.get(`attendance/${eventId}`);
      // ensure array
      const data = Array.isArray(res.data) ? res.data : [res.data];
      console.log("[useAttendance] response:", data);
      setAttendanceRecords(data);
    } catch (err) {
      console.error("[useAttendance] fetch error:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  // Create attendance record (officer only)
  const createAttendance = useCallback(
    async ({ eventId: evId, userId, attended }) => {
      setError(null);
      try {
        console.log("[useAttendance] POST /api/attendance", { evId, userId, attended });
        const res = await api.post("attendance", { eventId: evId, userId, attended });
        await fetchAttendance();
        return res.data;
      } catch (err) {
        console.error("[useAttendance] create error:", err);
        setError(err.response?.data?.error || err.message);
        throw err;
      }
    },
    [fetchAttendance]
  );

  // Update attendance record (officer only)
  const updateAttendance = useCallback(
    async ({ eventId: evId, userId, attended }) => {
      setError(null);
      try {
        console.log("[useAttendance] PUT /api/attendance", { evId, userId, attended });
        const res = await api.put("attendance", { eventId: evId, userId, attended });
        await fetchAttendance();
        return res.data;
      } catch (err) {
        console.error("[useAttendance] update error:", err);
        setError(err.response?.data?.error || err.message);
        throw err;
      }
    },
    [fetchAttendance]
  );

  // Auto fetch when eventId changes
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return {
    attendanceRecords,
    isLoading,
    isError: !!error,
    error,
    fetchAttendance,
    createAttendance,
    updateAttendance,
  };
}
