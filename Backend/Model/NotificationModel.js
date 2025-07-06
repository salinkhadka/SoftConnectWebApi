const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  recipient: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // who receives the notification

  sender: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }, // who triggered it, optional for system notifications

  type: { 
    type: String, 
    required: true,
    enum: ['friend_request', 'follow', 'comment', 'like', 'message', 'system'] // you can expand this list
  }, // type of notification

  message: { 
    type: String, 
    required: true 
  }, // notification text to display

  relatedId: { 
    type: Schema.Types.ObjectId 
  }, // ID of the related entity (friend request, comment, etc.)

  isRead: { 
    type: Boolean, 
    default: false 
  } // whether the user has seen this notification
}, { 
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Notification', notificationSchema);
