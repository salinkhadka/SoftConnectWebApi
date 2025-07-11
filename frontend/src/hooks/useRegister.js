"use client"

import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { registerUserService } from "../services/authService"
import { useToast } from "../contexts/ToastContext"

export const useRegisterUser = () => {
  const navigate = useNavigate()
  const toast = useToast()

  return useMutation({
    mutationFn: registerUserService,
    mutationKey: ["register"],
    onSuccess: (data) => {
      toast.success(data?.message || "Account created successfully!")
      navigate("/login", { replace: true })
    },
    onError: (err) => {
      toast.error(err?.message || "Registration failed")
    },
  })
}
