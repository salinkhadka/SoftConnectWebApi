import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider"; // Uncomment this!
import axios from "axios";
import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,resetPasswordService,requestPasswordResetService
} from "../../services/authService";
import { useEffect } from 'react';




export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email) => requestPasswordResetService(email),
    mutationKey: ["request_password_reset"],
    onSuccess: (data) => {
      toast.success(data.message || "Reset link sent. Check your email.");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to request password reset");
    },
  });
};

// Reset password hook
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }) => resetPasswordService(token, newPassword),
    mutationKey: ["reset_password"],
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successful");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to reset password");
    },
  });
};

export const useGetUsers = ({ search }) => {
  return useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => getAllUsersService({ page: 1, limit: 10, search }),
    enabled: search.trim().length > 0, // don't fetch if search is empty
    keepPreviousData: true,
  });
};

export const useUser = (id) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserByIdService(id),
    enabled: !!id,
    onError: (err) => {
      toast.error(err?.message || "Failed to load user");
    },
  });


export const useGetUsersAdmin = ({ search = "" }) => {
  return useQuery({
    queryKey: ["usersAdmin", search],
    queryFn: async () => {
      const response = await axios.get("http://localhost:2000/user/getAll", {
        params: { search },
      });
      return response.data.data; // adjust if needed
    },
    keepPreviousData: true,
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { user: currentUser, login } = useContext(AuthContext); // Get current user from context

  return useMutation({
    mutationFn: ({ id, formData }) => updateUserService(id, formData),
    mutationKey: ["update_user"],
    onSuccess: (data) => {
      toast.success("User updated!");
      // Only update context if updating self
      if (data?.data && login && currentUser?._id === data.data._id) {
        login(data.data, localStorage.getItem("token"));
      }
      queryClient.invalidateQueries(["all_users"]);
      queryClient.invalidateQueries(["user", data?.data?._id]);
      // navigate("/somepage", { replace: true }); // Uncomment if you want to redirect after update
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update user");
    },
  });
};

// Delete user (admin only)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteUserService(id),
    mutationKey: ["delete_user"],
    onSuccess: () => {
      toast.success("User deleted!");
      queryClient.invalidateQueries(["all_users"]);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete user");
    },
  });
};
