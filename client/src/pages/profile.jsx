import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // adjust path if needed
import TopNav from "../components/topNav";
import "../styles/profile.css";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
  <div>
      <TopNav />

    <div className="profile-container">
        <div className="profile-content">
          <h1>Your Profile</h1>
          <div className="profile-info">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        </div>
      </div>

  </div>
  );
}
