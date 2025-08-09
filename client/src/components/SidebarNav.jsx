import React from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css"; // Optional: separate sidebar styles

export default function SidebarNav() {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
      <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
        <h2>Events</h2>
      </Link>
      <Link to="/RequiredForMe" style={{ textDecoration: "none", color: "inherit" }}>
        <h2>Required For Me</h2>
      </Link>
      <h2>Compliance</h2>
      <Link to="/people" style={{ textDecoration: "none", color: "inherit" }}>
        <h2>People</h2>
      </Link>
    </div>
    </div>
  );
}
