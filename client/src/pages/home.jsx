import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import TopNav from "../components/topNav";
import EventCard from "../components/EventCard";
import CreateEventModal from "../components/CreateEventModal";
import { useEvents } from "../hooks/useEvents";
import { useAuth } from "../context/AuthContext";
import SidebarNav from "../components/SidebarNav";

export default function Home() {
    const { events, loading, error, fetchEvents, deleteEvent, createEvent} = useEvents(); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {user} = useAuth();
    
    if (loading) return <p>Loading events...</p>;
    if (error) return <p>Error: {error}</p>;
    
    return (
        <div className="home">
            <TopNav />

            <div className="container">

                <SidebarNav /> 

                <div className="Events-container">
                    <div className="Events-header">
                        <h1 className="events-title">Events</h1>
                        <div className="Event-add-wrapper">
                            {user?.role === "Officer" && (
                                <button 
                                    className="Event-add" 
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    + Add Event
                                </button>
                            )}                          
                        </div>
                    </div>
                    {events.length > 0 ? (
                        events.map((event) => <EventCard key={event.id} event={event} onDelete={() => deleteEvent(event.id)}/>)
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>       
            </div>
            
            <CreateEventModal 
                isOpen={isModalOpen} 
                createEvent={createEvent}
                onClose={() => {
                    setIsModalOpen(false);
                }} 
            />
        </div>
    );
}
