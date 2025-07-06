const Notification = require('../Model/NotificationModel');

// Create a notification
exports.createNotification = async (req, res) => {
  const { recipient, sender, type, message, relatedId } = req.body;

  if (!recipient || !type || !message) {
    return res.status(400).json({ success: false, message: 'recipient, type, and message are required' });
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

    res.status(201).json({ success: true, message: 'Notification created', data: notification });
  } catch (err) {
    console.error('Create Notification Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get notifications for a user (sorted newest first)
exports.getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'username profilePhoto'); // populate sender info if exists

    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error('Get Notifications Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (err) {
    console.error('Mark As Read Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Optional: Delete a notification
exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete Notification Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
