import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResetPassword } from "../hooks/Admin/adminUserhook";

const base64urlDecode = (str) => {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  try {
    return atob(str);
  } catch {
    return null; // invalid token
  }
};

export default function ResetPassword() {
  const { token } = useParams();
  const decodedToken = base64urlDecode(token);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  const { mutate, isLoading, isError, error, isSuccess, data } = useResetPassword();

  useEffect(() => {
    if (isSuccess) {
      // Navigate after success with delay
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  if (!decodedToken) {
    return <div>Invalid or malformed reset token.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    // Call the mutation with token and password
    mutate({ token: decodedToken, newPassword: password });
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Reset Password</h2>

      {isSuccess && data?.message && <p style={{ color: "green" }}>{data.message}</p>}

      {(localError || isError) && (
        <p style={{ color: "red" }}>
          {localError || error?.message || "Failed to reset password. Try again."}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            disabled={isLoading}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#37225C",
            color: "#fff",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
