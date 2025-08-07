import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useAuth } from "../context/AuthContext";
import "../styles/EventDetails.css";
import TopNav from "../components/topNav";
import { useNavigate } from "react-router-dom";



export default function EventDetails() {
  const { id } = useParams(); // get :id from URL
  const { selectedEvent, fetchEventById, loading, error, deleteEvent } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventById(id); // fetch event when page loads
  }, [id, fetchEventById]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!selectedEvent) return <p>No event found.</p>;

  return (
    <div>
      <TopNav/>
      <button onClick={()=>navigate("home")}className="back-btn"></button>
      <div className="event-page">
        <h1>{selectedEvent.name}</h1>
        <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {selectedEvent.location}</p>
        <p><strong>Description:</strong> {selectedEvent.description}</p>
        {selectedEvent.requiredRole && (
          <p><strong>Required Role:</strong> {selectedEvent.requiredRole}</p>
        )}
        {selectedEvent.RSVP && (
          <p><strong>RSVP Status:</strong> {selectedEvent.RSVPStatus}</p>
        )}
        <hr></hr>
        {/* RSVP Section */}
        <div className="rsvp-section">
          <h2>RSVP</h2>
          {/* If an RSVP has not been made*/}
          <p>Will you be attending this event?</p>
          <div className="rsvp-buttons">
            <button className="rsvp-btn">Yes</button>
            <button className="cancel-rsvp-btn">No</button>
          </div>
          {/* If an RSVP has been made*/}
          <div>
            <button className="rsvp-btn">Change RSVP</button>
          {/* onClick will change to the other model and call update endpoint*/}
          </div>
        </div>
      

        {/* Officer Section */}
        {user?.role === "Officer" && (
          <>
          <hr /> 
          <h2>Officer Options</h2>
          <div className="event-actions">
                           
            <button className="delete-btn" onClick={() => deleteEvent(selectedEvent.id)}>
              Delete Event
            </button>
            <button className="edit-btn">Edit Event</button>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
