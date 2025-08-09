import React from "react";
import useAttendance from "../hooks/useAttendance.jsx";
import { useAuth } from "../context/AuthContext";
import "../styles/attendanceList.css";

export default function AttendanceList({ eventId }) {
  const { attendanceRecords, loading, error, updateAttendance } = useAttendance(eventId);
  const { user } = useAuth(); // get current user from auth context

  const handleToggle = async (record) => {
    try {
      await updateAttendance({
        eventId: record.eventId,
        userId: record.userId,
        attended: !record.attended,
      });
    } catch (err) {
      console.error("Failed to update attendance:", err);
      alert(err?.response?.data?.error || err?.message || "Failed to update attendance");
    }
  };

  if (loading) return <div className="loading">Loading attendance...</div>;
  if (error) return <div className="error">Error loading attendance: {error}</div>;

  if (!attendanceRecords || attendanceRecords.length === 0) {
    return null;
  }

  return (
    <div className="attendance-page">
      <h2 className="attendance-title">Attendance List</h2>
      <div className="attendance-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Attendance Status</th>
              {user?.role === "Officer" && <th>Present</th>}
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => {
              const userRecord = record.User || { firstName: "Unknown", lastName: "" };
              return (
                <tr key={record.attendanceId || `${record.eventId}-${record.userId}`}>
                  <td>{`${userRecord.firstName} ${userRecord.lastName}`}</td>
                  <td>{record.attended ? "Present" : "Absent"}</td>
                  {user?.role === "Officer" && (
                    <td>
                      <input
                        type="checkbox"
                        checked={!!record.attended}
                        onChange={() => handleToggle(record)}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
