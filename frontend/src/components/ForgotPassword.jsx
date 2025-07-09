import React, { useState } from "react";
import { useRequestPasswordReset } from "../hooks/Admin/adminUserhook";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { mutate: requestReset, isLoading } = useRequestPasswordReset();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    requestReset(email, {
      onSuccess: (data) => {
        setMessage(data.message || "If the email exists, a reset link has been sent.");
      },
      onError: (err) => {
        setError(err.message || "Error sending reset email.");
      },
    });
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
