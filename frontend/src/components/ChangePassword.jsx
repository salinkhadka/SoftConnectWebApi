"use client"

import { useState, useContext } from "react"
import axios from "axios"
import { AuthContext } from "../auth/AuthProvider"
import { useToast } from "../contexts/ToastContext"
import { Paper, TextField, Button, Typography, Stepper, Step, StepLabel } from "@mui/material"
import { FiLock, FiShield, FiCheck } from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const ChangePassword = () => {
  const { user } = useContext(AuthContext)
  const toast = useToast()
  const [currentPassword, setCurrentPassword] = useState("")
  const [verified, setVerified] = useState(false)
  const [token, setToken] = useState(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isResetting, setIsResetting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerifyCurrentPassword = async () => {
    if (!user || !user._id) {
      toast.error("User not logged in.")
      return
    }
    if (!currentPassword) {
      toast.error("Please enter your current password.")
      return
    }

    setIsVerifying(true)
    try {
      const response = await axios.post("http://localhost:2000/user/verify-password", {
        userId: user._id,
        currentPassword,
      })

      if (response.data.success) {
        toast.success("Current password verified! Please enter new password.")
        setVerified(true)
        setToken(response.data.token)
      } else {
        toast.error(response.data.message || "Incorrect current password.")
      }
    } catch (error) {
      console.error("Error verifying password:", error)
      toast.error("Something went wrong during verification.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }
    if (!token) {
      toast.error("Reset token missing. Please verify current password again.")
      setVerified(false)
      return
    }

    setIsResetting(true)
    try {
      const response = await axios.post(`http://localhost:2000/user/reset-password/${token}`, {
        password: newPassword,
      })

      if (response.data.success) {
        toast.success("Password updated successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setVerified(false)
        setToken(null)
      } else {
        toast.error(response.data.message || "Failed to update password.")
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      toast.error("Invalid or expired token. Please verify current password again.")
      setVerified(false)
      setToken(null)
    } finally {
      setIsResetting(false)
    }
  }

  const steps = ["Verify Current Password", "Set New Password", "Complete"]
  const activeStep = verified ? 1 : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-8 p-8 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiShield size={32} className="text-white" />
            <Typography variant="h4" sx={{ color: WHITE, fontWeight: "bold" }}>
              Change Password
            </Typography>
          </div>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>
            Keep your account secure with a strong password
          </Typography>
        </div>

        {/* Progress Stepper */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            boxShadow: `0 8px 32px ${PURPLE}15`,
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      color: index <= activeStep ? PURPLE : "#9ca3af",
                      fontWeight: index <= activeStep ? "600" : "400",
                    },
                    "& .MuiStepIcon-root": {
                      color: index <= activeStep ? PURPLE : "#e5e7eb",
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Main Form */}
        <Paper
          sx={{
            p: 6,
            borderRadius: 3,
            boxShadow: `0 8px 32px ${PURPLE}15`,
            border: `1px solid ${LAVENDER}30`,
          }}
        >
          {!verified ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${PURPLE}15` }}
                >
                  <FiLock size={24} style={{ color: PURPLE }} />
                </div>
                <Typography variant="h6" sx={{ color: PURPLE, fontWeight: "bold", mb: 1 }}>
                  Verify Your Current Password
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please enter your current password to continue
                </Typography>
              </div>

              <TextField
                type="password"
                label="Current Password"
                fullWidth
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isVerifying}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: LAVENDER,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: PURPLE,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: PURPLE,
                  },
                }}
              />

              <Button
                onClick={handleVerifyCurrentPassword}
                disabled={isVerifying || !currentPassword}
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                  color: WHITE,
                  boxShadow: `0 4px 15px ${PURPLE}40`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${LAVENDER} 0%, ${PURPLE} 100%)`,
                    boxShadow: `0 6px 20px ${PURPLE}50`,
                  },
                  "&:disabled": {
                    background: "#e5e7eb",
                    color: "#9ca3af",
                  },
                }}
              >
                {isVerifying ? "Verifying..." : "Verify Password"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${PURPLE}15` }}
                >
                  <FiCheck size={24} style={{ color: PURPLE }} />
                </div>
                <Typography variant="h6" sx={{ color: PURPLE, fontWeight: "bold", mb: 1 }}>
                  Set Your New Password
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose a strong password to keep your account secure
                </Typography>
              </div>

              <TextField
                type="password"
                label="New Password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isResetting}
                helperText="Password must be at least 6 characters long"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: LAVENDER,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: PURPLE,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: PURPLE,
                  },
                }}
              />

              <TextField
                type="password"
                label="Confirm New Password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isResetting}
                error={confirmPassword && newPassword !== confirmPassword}
                helperText={confirmPassword && newPassword !== confirmPassword ? "Passwords do not match" : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: LAVENDER,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: PURPLE,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: PURPLE,
                  },
                }}
              />

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setVerified(false)
                    setToken(null)
                    setNewPassword("")
                    setConfirmPassword("")
                  }}
                  variant="outlined"
                  size="large"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "600",
                    borderColor: "#e5e7eb",
                    color: "#6b7280",
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleResetPassword}
                  disabled={isResetting || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  size="large"
                  sx={{
                    flex: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                    color: WHITE,
                    boxShadow: `0 4px 15px ${PURPLE}40`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${LAVENDER} 0%, ${PURPLE} 100%)`,
                      boxShadow: `0 6px 20px ${PURPLE}50`,
                    },
                    "&:disabled": {
                      background: "#e5e7eb",
                      color: "#9ca3af",
                    },
                  }}
                >
                  {isResetting ? "Changing Password..." : "Change Password"}
                </Button>
              </div>
            </div>
          )}
        </Paper>
      </div>
    </div>
  )
}

export default ChangePassword
