import React, { startTransition } from "react";
import "../styles/EventCard.css"
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Card to display the name, date, location, and required for role of a single event given an event object
export default function eventCard({event, onDelete}) {
  if (!event) return null;
  const { user } = useAuth();
  const navigate = useNavigate();

const handleCardClick = (e) => {
  if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
    return;
  }
  navigate(`/events/${event.id}`);
}

return (
<div className="event-card" onClick={handleCardClick}>
  <div className="event-header">
    <h3 className="event-name">{event.name}</h3>
    {user?.role === "Officer" && (
      <button className="event-delete" 
        onClick={(e) => {e.stopPropagation();
          onDelete();
        }}>
      </button>
    )}
  </div>

  <div className="event-details">
    <p className="event-date">
      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
    </p>
    <p className="event-location">
      <strong>Location:</strong> {event.location}
    </p>
    {event.requiredRole && (
      <p className="event-role">
        <strong>Required Role:</strong> {event.requiredRole}
      </p>
    )}
  </div>
</div>

  );
}

