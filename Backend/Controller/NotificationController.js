// NotificationController.js
const Notification = require('../Model/NotificationModel');

exports.createNotification = async (req, res) => {
  const sender = req.user.id;
  const { recipient, type, message, relatedId } = req.body;

  if (!recipient || !type || !message) {
    return res.status(400).json({
      success: false,
      message: 'recipient, type, and message are required',
    });
  }

  try {
    const notification = new Notification({
      recipient,
      sender,
      type,
      message,
      relatedId,
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification created',
      data: notification,
    });
  } catch (err) {
    console.error('Create Notification Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getNotifications = async (req, res) => {
  const { userId } = req.params;

  // Authorization check
  if (req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      message: "You're not authorized to view these notifications",
    });
  }

  try {
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'username profilePhoto');

    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error('Get Notifications Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not allowed to mark this notification' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (err) {
    console.error('Mark As Read Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this notification' });
    }

    await notification.deleteOne();

    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete Notification Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
