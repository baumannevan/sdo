import React from "react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "../styles/login.css";
import {useNavigate} from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email:"",
    password:"",
  });

    const navigate = useNavigate();
  
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] =  useState("");

    const handleChange = (e) => {
        setForm({...form, [e.target.name] : e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch("/api/auth/login", {
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login Failed");
            setForm({
                email:"",
                password:"",
            });
            navigate("/home")
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
  
    return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit" disabled={loading}>
            {loading ? "Loging-in" : "Login"}
        </button>
       <button>
         <Link to="/register" className="register-link">
          Sign-Up
        </Link>
       </button>
        
      </form>
    </div>
  );
}
