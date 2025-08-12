import React from "react";
import { useAuth } from "../context/AuthContext";  // adjust path if needed
import { useLogout } from "../hooks/useLogout";     // import the logout hook
import TopNav from "../components/topNav";
import "../styles/profile.css";

export default function ProfilePage() {
  const { user } = useAuth();
  const { logout, loading, error } = useLogout();

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
          <button onClick={logout} disabled={loading} style={{ marginTop: "20px", padding: "10px 20px" }}>
            {loading ? "Logging out..." : "Logout"}
          </button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>Error: {error}</p>}
        </div>
      </div>
    </div>
  );
}
