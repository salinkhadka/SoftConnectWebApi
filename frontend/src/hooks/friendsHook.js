import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  followUserService,
  unfollowUserService,
  getFollowersService,
  getFollowingService,
} from "../services/friendsService";

// ✅ Fetch followers of a user
export const useFollowers = (userId) =>
  useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowersService(userId),
    enabled: !!userId,
    onError: (err) => {
      toast.error(err?.message || "Failed to load followers");
    },
  });

// ✅ Fetch users the user is following
export const useFollowing = (userId) =>
  useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowingService(userId),
    enabled: !!userId,
    onError: (err) => {
      toast.error(err?.message || "Failed to load following");
    },
  });

// ✅ Follow a user
export const useFollowUser = (currentUserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followeeId) => followUserService(followeeId),
    mutationKey: ["follow_user"],
    onSuccess: (_, followeeId) => {
      toast.success("User followed!");
      // Invalidate followers of followee (because their followers changed)
      queryClient.invalidateQueries(["followers", followeeId]);
      // Invalidate following of current user (because they are now following more)
      queryClient.invalidateQueries(["following", currentUserId]);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to follow user");
    },
  });
};

// ✅ Unfollow a user
export const useUnfollowUser = (currentUserId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followeeId) => unfollowUserService(followeeId),
    mutationKey: ["unfollow_user"],
    onSuccess: (_, followeeId) => {
      toast.success("User unfollowed!");
      // Invalidate followers of followee (because their followers changed)
      queryClient.invalidateQueries(["followers", followeeId]);
      // Invalidate following of current user (because they are now following less)
      queryClient.invalidateQueries(["following", currentUserId]);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to unfollow user");
    },
  });
};
