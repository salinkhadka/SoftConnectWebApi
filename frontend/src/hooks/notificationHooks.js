"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../contexts/ToastContext"
import {
  getNotificationsService,
  createNotificationService,
  markNotificationAsReadService,
  deleteNotificationService,
} from "../services/notificationService"

export const useNotifications = (userId) =>
  useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotificationsService(userId),
    enabled: !!userId,
    refetchInterval: 10000,
  })

export const useCreateNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ recipient, type, message, relatedId }) =>
      createNotificationService({ recipient, type, message, relatedId }),
    mutationKey: ["create_notification"],
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"])
    },
  })
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (notificationId) => markNotificationAsReadService(notificationId),
    mutationKey: ["mark_notification_as_read"],
    onSuccess: () => {
      toast.success("Notification marked as read")
      queryClient.invalidateQueries(["notifications"])
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to mark notification as read")
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (notificationId) => deleteNotificationService(notificationId),
    mutationKey: ["delete_notification"],
    onSuccess: () => {
      toast.success("Notification deleted")
      queryClient.invalidateQueries(["notifications"])
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete notification")
    },
  })
}
