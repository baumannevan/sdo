import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, 
});

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users", { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single user by ID
  const fetchUserById = async (id) => {
    try {
      const res = await api.get(`/users/${id}`, { withCredentials: true });
      setSelectedUser(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch user");
    }
  };

  // Update user role (officer only)
  const updateUserRole = async (id, role) => {
    try {
      const res = await api.put(
        `/users/${id}/role`,
        { role },
        { withCredentials: true }
      );
      await fetchUsers(); // refresh list
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user role");
    }
  };

  // Get dues for a specific user
  const fetchUserDues = async (id) => {
    try {
      const res = await api.get(`/users/${id}/dues`, { withCredentials: true });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch dues");
    }
  };

  // Update dues (officer only)
  const updateUserDues = async (id, dues) => {
    try {
      const res = await api.put(
        `/users/${id}/dues`,
        { dues },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update dues");
    }
  };

  // Optional: fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    selectedUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    updateUserRole,
    fetchUserDues,
    updateUserDues,
  };
}
