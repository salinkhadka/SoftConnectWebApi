const mongoose = require('mongoose');
const Message = require('../Model/MessageModel');


const getConversationId = (userId1, userId2) => {
  return [userId1.toString(), userId2.toString()].sort().join('_');
};


exports.sendMessage = async (req, res) => {
  try {
    const sender = req.user.id; // from auth middleware
    const { recipient, content } = req.body;

    if (!recipient || !content) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const conversationId = getConversationId(sender, recipient);

    const newMessage = await Message.create({
      sender,
      recipient,
      content,
      conversationId
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const conversationId = getConversationId(user1, user2);

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user
    const { otherUserId } = req.body; // ID of the other user in the conversation

    // 1. Get the most recent message between the two users
    const lastMessage = await Message.findOne({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    }).sort({ createdAt: -1 });

    if (!lastMessage) {
      return res.status(404).json({ message: "No messages found between users" });
    }

    // 2. Check if the last message was sent by `otherUserId` and received by the logged-in user
    if (lastMessage.sender.toString() === otherUserId && lastMessage.recipient.toString() === userId) {
      // 3. Mark all messages from `otherUserId` to `userId` as read
      await Message.updateMany(
        {
          sender: otherUserId,
          recipient: userId,
          isRead: false
        },
        { $set: { isRead: true } }
      );

      return res.json({ message: "Messages marked as read" });
    } else {
      return res.status(200).json({ message: "No unread messages to mark" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};







exports.getConversationUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const mongooseUserId = new mongoose.Types.ObjectId(userId);

    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const conversations = await Message.aggregate([
  {
    $match: {
      $or: [
        { sender: mongooseUserId },
        { recipient: mongooseUserId }
      ]
    }
  },
  {
    $sort: { createdAt: -1 }  // Sort first so $first gets the last message
  },
  {
    $project: {
      otherUser: {
        $cond: [
          { $eq: ['$sender', mongooseUserId] },
          '$recipient',
          '$sender'
        ]
      },
      content: 1,
      createdAt: 1,
      isRead: 1,
      sender: 1,  // Add sender for last message sender id
    }
  },
  {
    $group: {
      _id: '$otherUser',
      lastMessage: { $first: '$content' },
      lastMessageTime: { $first: '$createdAt' },
      lastMessageIsRead: { $first: '$isRead' },
      lastMessageSenderId: { $first: '$sender' }
    }
  },
  {
    $addFields: {
      userObjectId: { $toObjectId: { $toString: '$_id' } }
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'userObjectId',
      foreignField: '_id',
      as: 'userInfo'
    }
  },
  { $unwind: '$userInfo' },
  {
    $project: {
      _id: '$userInfo._id',
      username: '$userInfo.username',
      email: '$userInfo.email',
      profilePhoto: '$userInfo.profilePhoto',
      lastMessage: 1,
      lastMessageTime: 1,
      lastMessageIsRead: 1,
      lastMessageSenderId: 1
    }
  },
  { $sort: { lastMessageTime: -1 } },
  { $skip: skip },
  { $limit: limit }
]);




    console.log('Conversations with idType:', conversations);

    res.json({
      page,
      limit,
      conversations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch conversation users' });
  }
};



exports.debugMessagesCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Received userId:', userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const mongooseUserId = new mongoose.Types.ObjectId(userId);

    const count = await Message.countDocuments({
      $or: [
        { sender: mongooseUserId },
        { recipient: mongooseUserId }
      ]
    });

    console.log(`Message count for user ${userId}:`, count);

    res.json({ userId, messageCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.debugSimpleAggregation = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const mongooseUserId = new mongoose.Types.ObjectId(userId);

    const result = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: mongooseUserId },
            { recipient: mongooseUserId }
          ]
        }
      },
      {
        $project: {
          otherUser: {
            $cond: [
              { $eq: ['$sender', mongooseUserId] },
              '$recipient',
              '$sender'
            ]
          },
          content: 1,
          createdAt: 1
        }
      },
      { $limit: 10 }
    ]);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete a specific message
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user.id; // From auth middleware

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only sender should be allowed to delete the message
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this message' });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

