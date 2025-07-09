// NotificationRoute.js
const express = require('express');
const router = express.Router();
const NotificationController = require('../Controller/NotificationController');
const { authenticateUser } = require("../Middleware/AuthMiddleware");

// All routes protected by authentication middleware
router.post('/', authenticateUser, NotificationController.createNotification);
router.get('/:userId', authenticateUser, NotificationController.getNotifications);
router.put('/read/:notificationId', authenticateUser, NotificationController.markAsRead);
router.delete('/:notificationId', authenticateUser, NotificationController.deleteNotification);

module.exports = router;
