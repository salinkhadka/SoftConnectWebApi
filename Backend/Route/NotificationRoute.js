const express = require('express');
const router = express.Router();

const NotificationController = require('../controller/NotificationController');

// Create a new notification
router.post('/', NotificationController.createNotification);

// Get all notifications for a user
router.get('/:userId', NotificationController.getNotifications);

// Mark a notification as read
router.put('/read/:notificationId', NotificationController.markAsRead);

// Optional: Delete a notification
router.delete('/:notificationId', NotificationController.deleteNotification);

module.exports = router;
