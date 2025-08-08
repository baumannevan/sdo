import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useRSVP } from "../hooks/useRSVP";
import { useAuth } from "../context/AuthContext";
import "../styles/EventDetails.css";
import TopNav from "../components/topNav";
import { useNavigate } from "react-router-dom";



export default function EventDetails() {
  const { id } = useParams(); // get :id from URL
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editingRSVP, setEditingRSVP] = useState(false);


  const { selectedEvent, fetchEventById, loading, error, deleteEvent } = useEvents();
  const {rsvpList,userRsvp,  loading: rsvpLoading, error: rsvpError, fetchRSVPs, createRSVP, cancelRSVP} = useRSVP();

  console.log(rsvpList)

  useEffect(() => {
    fetchEventById(id); // fetch event when page loads
    fetchRSVPs(id);
  }, [id, fetchEventById, fetchRSVPs]);

  const handleRSVP = async (response) => {
    await createRSVP(id, response);
    setEditingRSVP(false); // hide RSVP form again
  };

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

        {!userRsvp || editingRSVP  ? (
          <>
            <p>Will you be attending this event?</p>
            <div className="rsvp-buttons">
              <button className="rsvp-btn" onClick={() => handleRSVP("Yes")}>
                Yes
              </button>
              <button className="maybe-rsvp-btn" onClick={() => handleRSVP("Maybe")}>
                Maybe
              </button>
              <button className="cancel-rsvp-btn" onClick={() => handleRSVP("No")}>
                No
              </button>
            </div>
          </>
        ) : (
          <div>
            <p>You have RSVP’d: <strong>{userRsvp.response}</strong></p>
            <button className="rsvp-btn" onClick={() => setEditingRSVP(true)}>
              Change RSVP
            </button>
          </div>
        )}
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

            {/* RSVP List Table */}
            {rsvpList.length > 0 ? (
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
                        <td className="rsvp-td">{rsvp.User ? `${rsvp.User.firstName} ${rsvp.User.lastName}` : "Unknown User"}</td>
                        <td className="rsvp-td">{rsvp.User?.email || "N/A"}</td>
                        <td className="rsvp-td response-cell">{rsvp.response}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="no-rsvps">No RSVPs found.</p>
            )}
          </>
        )}

      </div>
    </div>
  );
}
