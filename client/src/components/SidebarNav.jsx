import React from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css"; // Optional: separate sidebar styles

export default function SidebarNav() {
  return (
    <div className="sidebar">
      <h2>Events</h2>
      <h2>Required For Me</h2>
      <h2>Compliance</h2>
      <Link to="/people" style={{ textDecoration: "none", color: "inherit" }}>
        <h2>People</h2>
      </Link>
    </div>
  );
}
