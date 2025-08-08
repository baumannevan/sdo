import React, { useEffect, useState } from "react";
import TopNav from "../components/topNav";
import SidebarNav from "../components/SidebarNav";
import { useUsers } from "../hooks/useUsers";

import "../styles/people.css"; 

export default function UserList() {
  const { users, fetchUsers, updateUserRole } = useUsers();

  const [currentUser, setCurrentUser] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");

  // Fetch current user info to check role
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const user = await res.json();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to get current user");
      }
    };
    fetchCurrentUser();
  }, []);

  const roleOptions = ["Officer", "Intermediate Member", "Associate Member"];

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditedRole(user.role);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditedRole("");
  };

  const saveRole = async (userId) => {
    if (editedRole && editedRole !== users.find(u => u.id === userId).role) {
      await updateUserRole(userId, editedRole);
      fetchUsers();
    }
    cancelEditing();
  };

  return (
    <div className="people">
      <TopNav />
      <div className="container">
        <SidebarNav />
        <div className="user-list-container">
          <h1>Our Members</h1>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {currentUser?.role === "Officer" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>
                    {editingUserId === user.id ? (
                      <select
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                      >
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  {currentUser?.role === "Officer" && (
                    <td>
                      {editingUserId === user.id ? (
                        <>
                          <button onClick={() => saveRole(user.id)}>Save</button>
                        </>
                      ) : (
                        <button onClick={() => startEditing(user)}>Edit</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
