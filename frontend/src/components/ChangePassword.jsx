import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { user } = useContext(AuthContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Step 1: Verify current password
  const handleVerifyCurrentPassword = async () => {
    if (!user || !user._id) {
      toast.error("User not logged in.");
      return;
    }
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:2000/user/verify-password", {
        userId: user._id,
        currentPassword,
      });

      if (response.data.success) {
        toast.success("Current password verified! Please enter new password.");
        setVerified(true);
        setToken(response.data.token); // save token for resetting password
      } else {
        toast.error(response.data.message || "Incorrect current password.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      toast.error("Something went wrong during verification.");
    }
  };

  // Step 2: Reset password with token received
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!token) {
      toast.error("Reset token missing. Please verify current password again.");
      setVerified(false);
      return;
    }

    setIsResetting(true);

    try {
      const response = await axios.post(`http://localhost:2000/user/reset-password/${token}`, {
        password: newPassword,
      });

      if (response.data.success) {
        toast.success("Password updated successfully!");
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setVerified(false);
        setToken(null);
      } else {
        toast.error(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Invalid or expired token. Please verify current password again.");
      setVerified(false);
      setToken(null);
    }

    setIsResetting(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Change Password</h2>

      {!verified && (
        <>
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          />
          <button
            onClick={handleVerifyCurrentPassword}
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "#37225C",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Verify Current Password
          </button>
        </>
      )}

      {verified && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 12, marginTop: 20 }}
            disabled={isResetting}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
            disabled={isResetting}
          />
          <button
            onClick={handleResetPassword}
            disabled={isResetting}
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "#37225C",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: 6,
              cursor: isResetting ? "not-allowed" : "pointer",
            }}
          >
            {isResetting ? "Changing Password..." : "Change Password"}
          </button>
        </>
      )}
    </div>
  );
};

export default ChangePassword;
