"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
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
  const toast = useToast()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState(null)
  const toastShown = useRef(false) // ✅ prevent multiple toasts

  const { mutate, isLoading, isError, error, isSuccess, data } = useResetPassword()

  useEffect(() => {
    if (isSuccess && !toastShown.current) {
      toastShown.current = true
      toast.success("Password reset successfully!")
      // Reset form after successful password reset
      setPassword("")
      setConfirmPassword("")
      setLocalError(null)
    }
  }, [isSuccess, toast])

  if (!decodedToken) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: 3, textAlign: "center", maxWidth: 400, width: "100%" }}>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div
          className="text-center mb-6 sm:mb-8 p-6 sm:p-8 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiLock size={28} className="text-white sm:text-[32px]" />
            <Typography 
              variant="h4" 
              sx={{ 
                color: WHITE, 
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", sm: "2.125rem" }
              }}
            >
              Reset Password
            </Typography>
          </div>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "rgba(255,255,255,0.9)",
              fontSize: { xs: "0.875rem", sm: "1rem" }
            }}
          >
            Create a new secure password for your account
          </Typography>
        </div>

        <Paper
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 3,
            boxShadow: `0 8px 32px ${PURPLE}15`,
            border: `1px solid ${LAVENDER}30`,
          }}
        >
          {/* Success Message */}
          {isSuccess && data?.message && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} icon={<FiCheck />}>
              <div>
                <Typography variant="body1" fontWeight="bold" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  {data.message}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  Your password has been successfully updated!
                </Typography>
              </div>
            </Alert>
          )}

          {/* Error Messages */}
          {(localError || isError) && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                {localError || error?.message || "Failed to reset password. Try again."}
              </Typography>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${PURPLE}15` }}
              >
                <FiLock size={20} className="sm:text-[24px]" style={{ color: PURPLE }} />
              </div>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: PURPLE, 
                  fontWeight: "bold", 
                  mb: 1,
                  fontSize: { xs: "1.125rem", sm: "1.25rem" }
                }}
              >
                Create New Password
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
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
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  "&:hover fieldset": {
                    borderColor: LAVENDER,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: PURPLE,
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  "&.Mui-focused": {
                    color: PURPLE,
                  },
                },
                "& .MuiFormHelperText-root": {
                  fontSize: { xs: "0.75rem", sm: "0.75rem" },
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
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  "&:hover fieldset": {
                    borderColor: LAVENDER,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: PURPLE,
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  "&.Mui-focused": {
                    color: PURPLE,
                  },
                },
                "& .MuiFormHelperText-root": {
                  fontSize: { xs: "0.75rem", sm: "0.75rem" },
                },
              }}
            />

            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
              size="large"
              sx={{
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "600",
                fontSize: { xs: "1rem", sm: "1.1rem" },
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