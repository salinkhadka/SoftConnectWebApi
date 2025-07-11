"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useResetPassword } from "../hooks/Admin/adminUserhook"
import { useToast } from "../contexts/ToastContext"
import { Paper, TextField, Button, Typography, Alert } from "@mui/material"
import { FiLock, FiCheck } from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const base64urlDecode = (str) => {
  str = str.replace(/-/g, "+").replace(/_/g, "/")
  while (str.length % 4) {
    str += "="
  }
  try {
    return atob(str)
  } catch {
    return null
  }
}

export default function ResetPassword() {
  const { token } = useParams()
  const decodedToken = base64urlDecode(token)
  const navigate = useNavigate()
  const toast = useToast()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState(null)

  const { mutate, isLoading, isError, error, isSuccess, data } = useResetPassword()

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password reset successfully! Redirecting to login...")
      const timer = setTimeout(() => {
        navigate("/login")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate, toast])

  if (!decodedToken) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Paper sx={{ p: 6, borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Invalid or malformed reset token.
          </Typography>
        </Paper>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError(null)

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters")
      return
    }

    mutate({ token: decodedToken, newPassword: password })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div
          className="text-center mb-8 p-8 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiLock size={32} className="text-white" />
            <Typography variant="h4" sx={{ color: WHITE, fontWeight: "bold" }}>
              Reset Password
            </Typography>
          </div>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>
            Create a new secure password for your account
          </Typography>
        </div>

        <Paper
          sx={{
            p: 6,
            borderRadius: 3,
            boxShadow: `0 8px 32px ${PURPLE}15`,
            border: `1px solid ${LAVENDER}30`,
          }}
        >
          {/* Success Message */}
          {isSuccess && data?.message && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} icon={<FiCheck />}>
              <div>
                <Typography variant="body1" fontWeight="bold">
                  {data.message}
                </Typography>
                <Typography variant="body2">Redirecting to login page in 3 seconds...</Typography>
              </div>
            </Alert>
          )}

          {/* Error Messages */}
          {(localError || isError) && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {localError || error?.message || "Failed to reset password. Try again."}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${PURPLE}15` }}
              >
                <FiLock size={24} style={{ color: PURPLE }} />
              </div>
              <Typography variant="h6" sx={{ color: PURPLE, fontWeight: "bold", mb: 1 }}>
                Create New Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a strong password to secure your account
              </Typography>
            </div>

            <TextField
              type="password"
              label="New Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
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
              label="Confirm Password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              error={confirmPassword && password !== confirmPassword}
              helperText={confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""}
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
              type="submit"
              disabled={isLoading}
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
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  )
}
