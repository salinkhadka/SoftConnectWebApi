const Notification = require('../Model/NotificationModel');
const User = require('../Model/UserModel'); // Import User to get FCM token
const admin = require('../Config/firebase'); // Your initialized admin SDK

// Helper function to send FCM notification with error handling
const sendFCMNotification = async (fcmToken, payload, userId) => {
  try {
    const response = await admin.messaging().send({
      ...payload,
      token: fcmToken,
    });
    console.log("Successfully sent FCM notification:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Error sending FCM notification:", error);
    
    // Handle invalid token error
    if (error.code === 'messaging/registration-token-not-registered') {
      console.log(`Invalid FCM token for user ${userId}, removing from database`);
      
      // Remove the invalid token from user record
      try {
        await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
        console.log(`Successfully removed invalid FCM token for user ${userId}`);
      } catch (dbError) {
        console.error('Error removing invalid token from database:', dbError);
      }
      
      return { success: false, error: 'Token invalid and removed' };
    }
    
    // Handle other FCM errors
    return { success: false, error: error.message };
  }
};

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
    // Save notification in DB
    const notification = new Notification({
      recipient,
      sender,
      type,
      message,
      relatedId,
    });
    await notification.save();

    // Fetch recipient user to get their FCM token
    const recipientUser = await User.findById(recipient);

    if (recipientUser && recipientUser.fcmToken) {
      // Prepare message payload
      const payload = {
        notification: {
          title: "New Notification",
          body: message,
        },
        data: {
          type,
          relatedId: relatedId ? relatedId.toString() : '',
          notificationId: notification._id.toString(),
        },
        android: {
          priority: 'high',
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
        },
      };

      // Send push notification with proper error handling
      await sendFCMNotification(recipientUser.fcmToken, payload, recipient);
    } else {
      console.log(`No FCM token found for user ${recipient}`);
    }

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

// Additional utility function to validate FCM tokens in bulk
exports.validateUserTokens = async (req, res) => {
  try {
    const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
    const invalidTokens = [];
    const validTokens = [];

    for (const user of users) {
      try {
        // Test the token with a dry run
        await admin.messaging().send({
          token: user.fcmToken,
          data: { test: 'validation' }
        }, true); // dry run
        
        validTokens.push(user._id);
      } catch (error) {
        if (error.code === 'messaging/registration-token-not-registered') {
          invalidTokens.push(user._id);
          // Remove invalid token
          await User.findByIdAndUpdate(user._id, { $unset: { fcmToken: 1 } });
        }
      }
    }

    res.json({
      success: true,
      message: `Token validation complete. ${validTokens.length} valid, ${invalidTokens.length} invalid tokens removed.`,
      data: {
        validCount: validTokens.length,
        invalidCount: invalidTokens.length
      }
    });
  } catch (err) {
    console.error('Token Validation Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};