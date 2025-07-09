import {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  getConversationUsers,
  deleteMessage
} from "../api/messageApi";

// ✅ Send a message
export const sendMessageService = async (recipientId, content) => {
  try {
    const response = await sendMessage(recipientId, content);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to send message" };
  }
};

// ✅ Get all messages between two users
export const getMessagesService = async (user1Id, user2Id) => {
  try {
    const response = await getMessages(user1Id, user2Id);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch messages" };
  }
};
// ✅ Delete a message by ID
export const deleteMessageService = async (messageId) => {
  try {
    const response = await deleteMessage(messageId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to delete message" };
  }
};


// ✅ Mark messages from a user as read service
export const markMessagesAsReadService = async (otherUserId) => {
  try {
    // Wrap the single id into an object as expected by the API function
    const response = await markMessagesAsRead({ otherUserId });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to mark messages as read" };
  }
};


// ✅ Get conversation users for inbox
export const getConversationsService = async (userId, page = 1, limit = 20) => {
  try {
    const response = await getConversationUsers(userId, page, limit);
    return response.data.conversations;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch conversations" };
  }
};
