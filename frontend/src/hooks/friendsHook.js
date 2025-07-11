"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../contexts/ToastContext"
import {
  followUserService,
  unfollowUserService,
  getFollowersService,
  getFollowingService,
} from "../services/friendsService"

export const useFollowers = (userId) =>
  useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowersService(userId),
    enabled: !!userId,
  })

export const useFollowing = (userId) =>
  useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowingService(userId),
    enabled: !!userId,
  })

export const useFollowUser = (currentUserId) => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (followeeId) => followUserService(followeeId),
    mutationKey: ["follow_user"],
    onSuccess: (_, followeeId) => {
      toast.success("User followed!")
      queryClient.invalidateQueries(["followers", followeeId])
      queryClient.invalidateQueries(["following", currentUserId])
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to follow user")
    },
  })
}

export const useUnfollowUser = (currentUserId) => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (followeeId) => unfollowUserService(followeeId),
    mutationKey: ["unfollow_user"],
    onSuccess: (_, followeeId) => {
      toast.success("User unfollowed!")
      queryClient.invalidateQueries(["followers", followeeId])
      queryClient.invalidateQueries(["following", currentUserId])
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to unfollow user")
    },
  })
}
