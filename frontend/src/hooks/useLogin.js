"use client"

import { useMutation } from "@tanstack/react-query"
import { loginUserService } from "../services/authService"
import { useToast } from "../contexts/ToastContext"
import { AuthContext } from "../auth/AuthProvider"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

export const useLogin = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useToast()

  return useMutation({
    mutationFn: loginUserService,
    mutationKey: ["login_key"],
    onSuccess: (data) => {
      console.log("Login response:", data)

      const token = data?.token
      const user = data?.data

      if (token && user) {
        login(user, token)
        console.log("User role =", user.role)
      } else {
        toast.error("Invalid login response")
      }
    },
    onError: (err) => {
      // Don't show toast here as it's handled in the component
    },
  })
}
