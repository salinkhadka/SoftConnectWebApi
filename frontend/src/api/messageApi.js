import axios from "./api"; // same axios instance you're using elsewhere

// Send a new message
export const sendMessage = (recipientId, content) => {
  const token = localStorage.getItem("token");
  return axios.post(
    "/message/send",
    { recipient: recipientId, content },
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};

// Get messages between two users
export const getMessages = (user1Id, user2Id) => {
  const token = localStorage.getItem("token");
  return axios.get(`/message/${user1Id}/${user2Id}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};


export const markMessagesAsRead = ({ otherUserId }) => {
  const token = localStorage.getItem("token");

  return axios.put(
    "http://localhost:2000/message/read",  // Use the port & path matching your backend
    { otherUserId }, 
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};


// Get inbox conversations
export const getConversationUsers = (userId, page = 1, limit = 20) => {
  const token = localStorage.getItem("token");
  return axios.get(`/message/msg/conversations/${userId}?page=${page}&limit=${limit}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
