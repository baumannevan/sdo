import React from "react";
import "../styles/login.css";

export default function Login() {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form">
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            required
          />
        </div>
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
