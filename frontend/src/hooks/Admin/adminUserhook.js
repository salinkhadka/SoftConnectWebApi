"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../../contexts/ToastContext"
import { useContext } from "react"
import { AuthContext } from "../../auth/AuthProvider"
import axios from "axios"
import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  resetPasswordService,
  requestPasswordResetService,
} from "../../services/authService"

export const useRequestPasswordReset = () => {
  const toast = useToast()

  return useMutation({
    mutationFn: (email) => requestPasswordResetService(email),
    mutationKey: ["request_password_reset"],
    onSuccess: (data) => {
      // Don't show toast here as it's handled in the component
    },
    onError: (err) => {
      // Don't show toast here as it's handled in the component
    },
  })
}

export const useResetPassword = () => {
  const toast = useToast()

  return useMutation({
    mutationFn: ({ token, newPassword }) => resetPasswordService(token, newPassword),
    mutationKey: ["reset_password"],
    onSuccess: (data) => {
      // Don't show toast here as it's handled in the component
    },
    onError: (error) => {
      // Don't show toast here as it's handled in the component
    },
  })
}

export const useGetUsers = ({ search }) => {
  return useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => getAllUsersService({ page: 1, limit: 10, search }),
    enabled: search.trim().length > 0,
    keepPreviousData: true,
  })
}

export const useUser = (id) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserByIdService(id),
    enabled: !!id,
  })

export const useGetUsersAdmin = ({ search = "" }) => {
  return useQuery({
    queryKey: ["usersAdmin", search],
    queryFn: async () => {
      const response = await axios.get("http://localhost:2000/user/getAll", {
        params: { search },
      })
      return response.data.data
    },
    keepPreviousData: true,
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const { user: currentUser, login } = useContext(AuthContext)
  const toast = useToast()

  return useMutation({
    mutationFn: ({ id, formData }) => updateUserService(id, formData),
    mutationKey: ["update_user"],
    onSuccess: (data) => {
      toast.success("User updated successfully!")
      if (data?.data && login && currentUser?._id === data.data._id) {
        login(data.data, localStorage.getItem("token"))
      }
      queryClient.invalidateQueries(["all_users"])
      queryClient.invalidateQueries(["user", data?.data?._id])
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update user")
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (id) => deleteUserService(id),
    mutationKey: ["delete_user"],
    onSuccess: () => {
      toast.success("User deleted successfully!")
      queryClient.invalidateQueries(["all_users"])
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete user")
    },
  })
}
