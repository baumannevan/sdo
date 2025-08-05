import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/home" /> : children;
}
