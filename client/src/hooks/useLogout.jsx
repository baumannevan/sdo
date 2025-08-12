import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // important to send cookies
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }

      navigate("/login");
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
}
