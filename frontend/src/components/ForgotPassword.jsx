"use client"

import { useState } from "react"
import { useRequestPasswordReset } from "../hooks/Admin/adminUserhook"
import { useToast } from "../contexts/ToastContext"
import { Paper, TextField, Button, Typography, Alert } from "@mui/material"
import { FiMail, FiArrowLeft } from "react-icons/fi"
import { Link } from "react-router-dom"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const toast = useToast()

  const { mutate: requestReset, isLoading } = useRequestPasswordReset()

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    requestReset(email, {
      onSuccess: (data) => {
        setMessage(data.message || "If the email exists, a reset link has been sent.")
        toast.success("Password reset link sent to your email")
      },
      onError: (err) => {
        setError(err.message || "Error sending reset email.")
        toast.error("Failed to send reset email")
      },
    })
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
            <FiMail size={32} className="text-white" />
            <Typography variant="h4" sx={{ color: WHITE, fontWeight: "bold" }}>
              Forgot Password
            </Typography>
          </div>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>
            Enter your email to receive a password reset link
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
          {/* Alerts */}
          {message && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${PURPLE}15` }}
              >
                <FiMail size={24} style={{ color: PURPLE }} />
              </div>
              <Typography variant="h6" sx={{ color: PURPLE, fontWeight: "bold", mb: 1 }}>
                Reset Your Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We'll send you a secure link to reset your password
              </Typography>
            </div>

            <TextField
              type="email"
              label="Email Address"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
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
              {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>

            <div className="text-center pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                style={{ color: PURPLE }}
              >
                <FiArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  )
}
