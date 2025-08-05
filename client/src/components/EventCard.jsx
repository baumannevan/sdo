import React, { startTransition } from "react";
import "../styles/EventCard.css"

// Card to display the name, date, location, and required for role of a single event given an event object
export default function eventCard({event}) {
    if (!event) return null;


return (
    <div className="event-card">
      <h3 className="event-name">{event.name}</h3>
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