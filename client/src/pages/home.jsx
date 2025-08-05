import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import TopNav from "../components/topNav";
import EventCard from "../components/EventCard.jsx";


import { useEvents } from "../hooks/useEvents";

export default function Home(){
    const {events, loading, error} = useEvents();

    if (loading) return <p>Loading events...</p>;
    if (error) return <p>Error: {error}</p>;
    
    console.log("all events: ", events);

    
    return(
        <div className="home">
               
        <TopNav/>

        <div className="container">
            <div className="Sidebar">
                <h1>SIDEBAR</h1>
                {/*filters maybe pages go here*/}
            </div>       
        
            <div className="Events">
                <h1>Events</h1>
                {events.length > 0 ? (
                    events.map((event) => <EventCard key={event.id} event={event} />)
                ) : (
                    <p>No events found.</p>
                )}
            </div>       
        </div>
        

        </div>
        
    );
}