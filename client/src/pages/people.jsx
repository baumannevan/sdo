import React, { useState } from "react";
import TopNav from "../components/topNav";
import SidebarNav from "../components/SidebarNav";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../context/AuthContext";

import "../styles/people.css";

export default function UserList() {
  const { users, fetchUsers, updateUserRole } = useUsers();
  const { user: currentUser } = useAuth(); 
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");

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
      await fetchUsers();
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
              {users.map(u => (
                <tr key={u.id}>
                  <td>{`${u.firstName} ${u.lastName}`}</td>
                  <td>{u.email}</td>
                  <td>
                    {editingUserId === u.id ? (
                      <select
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                      >
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  {currentUser?.role === "Officer" && (
                    <td>
                      {editingUserId === u.id ? (
                        <button onClick={() => saveRole(u.id)}>Save</button>
                      ) : (
                        <button onClick={() => startEditing(u)}>Edit</button>
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
