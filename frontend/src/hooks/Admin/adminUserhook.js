import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider"; // Uncomment this!
import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../../services/authService";

// Get all users (admin only)
export const useAllUsers = () =>
  useQuery({
    queryKey: ["all_users"],
    queryFn: getAllUsersService,
    onError: (err) => {
      toast.error(err?.message || "Failed to load users");
    },
  });

// Get one user
export const useUser = (id) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserByIdService(id),
    enabled: !!id,
    onError: (err) => {
      toast.error(err?.message || "Failed to load user");
    },
  });

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
