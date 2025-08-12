import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useRSVP } from "../hooks/useRSVP";
import { useAuth } from "../context/AuthContext";
import "../styles/EventDetails.css";
import TopNav from "../components/topNav";
import EditEventModal from "../components/editEvent.jsx";
import AttendanceList from "../components/AttendanceList.jsx";

export default function EventDetails() {
  const { id } = useParams(); // get :id from URL
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editingRSVP, setEditingRSVP] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("attendance"); // "attendance" or "rsvp"

  const {
    selectedEvent,
    fetchEventById,
    loading,
    error,
    deleteEvent,
    updateEvent,
    setSelectedEvent,
  } = useEvents();

  const {
    rsvpList,
    userRsvp,
    loading: rsvpLoading,
    error: rsvpError,
    fetchRSVPs,
    createRSVP,
  } = useRSVP();

  useEffect(() => {
    fetchEventById(id);
    fetchRSVPs(id);
  }, [id, fetchEventById, fetchRSVPs]);

  const handleRSVP = async (response) => {
    await createRSVP(id, response);
    fetchRSVPs(id);
    setEditingRSVP(false);
  };

  if (loading || rsvpLoading || userRsvp == null) {
    return <p>Loading event details...</p>;
  }
  if (error) return <p>Error: {error}</p>;
  if (!selectedEvent) return <p>No event found.</p>;

  return (
    <div>
      <TopNav />
      <div className="back-btn-container">
        <button onClick={() => navigate("/home")} className="back-btn"></button>
      </div>

      <div className="event-page">
        <h1>{selectedEvent.name}</h1>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(selectedEvent.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Location:</strong> {selectedEvent.location}
        </p>
        <p>
          <strong>Description:</strong> {selectedEvent.description}
        </p>
        <p>
          <strong>Required Roles:</strong>{" "}
          {selectedEvent.requiredRoles && selectedEvent.requiredRoles.length > 0
            ? selectedEvent.requiredRoles.map((r) => r.role || r).join(", ")
            : "None"}
        </p>

        {/* RSVP Section */}
        {selectedEvent.rsvp_required && (
          <div className="rsvp-section">
            <hr />
            <h2>RSVP</h2>

            {userRsvp.response === "No Response" || editingRSVP ? (
              <>
                <p>Will you be attending this event?</p>
                <div className="rsvp-buttons">
                  <button
                    className="rsvp-btn"
                    onClick={() => handleRSVP("Yes")}
                    type="button"
                  >
                    Yes
                  </button>
                  <button
                    className="maybe-rsvp-btn"
                    onClick={() => handleRSVP("Maybe")}
                    type="button"
                  >
                    Maybe
                  </button>
                  <button
                    className="cancel-rsvp-btn"
                    onClick={() => handleRSVP("No")}
                    type="button"
                  >
                    No
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p>
                  You have RSVP’d: <strong>{userRsvp.response}</strong>
                </p>
                <button
                  className="rsvp-btn"
                  onClick={() => setEditingRSVP(true)}
                  type="button"
                >
                  Change RSVP
                </button>
              </div>
            )}
          </div>
        )}

        {/* Officer Section */}
        {user?.role === "Officer" && (
          <>
            <hr />
            <h2 className="officer-title">Officer Options</h2>
            <div className="event-actions">
              <button
                className="delete-btn"
                onClick={async () => {
                  await deleteEvent(selectedEvent.id);
                  navigate("/home");
                }}
                type="button"
              >
                Delete Event
              </button>
              <button
                className="edit-btn"
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                Edit Event
              </button>
            </div>

            {/* View Mode Toggle Buttons */}
           <div className="toggle-buttons">
              {selectedEvent.requiredRoles[0] && (
                <button
                className={`edit-btn ${viewMode === "attendance" ? "active" : ""}`}
                onClick={() => setViewMode("attendance")}
                type="button"
                >
                  Attendance
                </button>
              )}
              
              {selectedEvent.rsvp_required && (
                <button
                  className={`edit-btn ${viewMode === "rsvp" ? "active" : ""}`}
                  onClick={() => setViewMode("rsvp")}
                  type="button"
                >
                  RSVP Responses
                </button>
              )}
            </div>

            {/* Conditionally show Attendance or RSVP */}
            {viewMode === "attendance" && <AttendanceList eventId={id} />}

            {viewMode === "rsvp" && selectedEvent.rsvp_required && (
              <>
                <h2 className="rsvp-list-title">RSVP Responses</h2>
                <table className="rsvp-table">
                  <thead>
                    <tr>
                      <th className="rsvp-th">Name</th>
                      <th className="rsvp-th">Email</th>
                      <th className="rsvp-th">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvpList.map((rsvp) => (
                      <tr key={rsvp.rsvpID} className="rsvp-tr">
                        <td className="rsvp-td">
                          {rsvp.User
                            ? `${rsvp.User.firstName} ${rsvp.User.lastName}`
                            : "Unknown User"}
                        </td>
                        <td className="rsvp-td">{rsvp.User?.email || "N/A"}</td>
                        <td className="rsvp-td response-cell">{rsvp.response}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}

        <EditEventModal
          isOpen={isModalOpen}
          eventToEdit={selectedEvent}
          updateEvent={updateEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={async (eventId, updatedData) => {
            setSelectedEvent(updatedData);
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
