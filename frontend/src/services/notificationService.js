import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  deleteNotification,
} from "../api/notificationApi";


export const getNotificationsService = async (userId) => {
  try {
    const response = await getNotifications(userId);
    return response.data.data; // assuming backend wraps notifications in data.data
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch notifications" };
  }
};


export const createNotificationService = async ({ recipient, type, message, relatedId }) => {
  try {
    const response = await createNotification({ recipient, type, message, relatedId });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to create notification" };
  }
};


export const markNotificationAsReadService = async (notificationId) => {
  try {
    const response = await markNotificationAsRead(notificationId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to mark notification as read" };
  }
};

export const deleteNotificationService = async (notificationId) => {
  try {
    const response = await deleteNotification(notificationId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to delete notification" };
  }
};
