import axios from "./api"; // your configured axios instance

// Fetch notifications for a user
export const getNotifications = (userId) => {
  const token = localStorage.getItem("token");
  return axios.get(`/notifications/${userId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Create a new notification
export const createNotification = ({ recipient, type, message, relatedId = null }) => {
  const token = localStorage.getItem("token");
  return axios.post(
    "/notifications",
    { recipient, type, message, relatedId },
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};

// Mark notification as read by notificationId
export const markNotificationAsRead = (notificationId) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `/notifications/read/${notificationId}`,
    {},
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};

// Delete a notification by notificationId
export const deleteNotification = (notificationId) => {
  const token = localStorage.getItem("token");
  return axios.delete(`/notifications/${notificationId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
