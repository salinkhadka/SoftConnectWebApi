import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getNotificationsService,
  createNotificationService,
  markNotificationAsReadService,
  deleteNotificationService,
} from "../services/notificationService";

// ✅ Fetch notifications for a user
export const useNotifications = (userId) =>
  useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotificationsService(userId),
    enabled: !!userId,
    refetchInterval: 10000, // Auto-refetch every 30 seconds
    onError: (err) => {
      toast.error(err?.message || "Failed to load notifications");
    },
  });

// ✅ Create a new notification
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipient, type, message, relatedId }) =>
      createNotificationService({ recipient, type, message, relatedId }),
    mutationKey: ["create_notification"],
    onSuccess: () => {
      toast.success("Notification created");
      // Invalidate all notifications queries, or you can fine-tune it if needed
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create notification");
    },
  });
};

// ✅ Mark a notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId) => markNotificationAsReadService(notificationId),
    mutationKey: ["mark_notification_as_read"],
    onSuccess: () => {
      toast.success("Notification marked as read");
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to mark notification as read");
    },
  });
};

// ✅ Delete a notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId) => deleteNotificationService(notificationId),
    mutationKey: ["delete_notification"],
    onSuccess: () => {
      toast.success("Notification deleted");
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete notification");
    },
  });
};
