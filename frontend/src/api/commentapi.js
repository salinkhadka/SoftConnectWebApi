import axios from "./api";

// Get comments for a specific post
export const getPostComments = (postId) => {
  return axios.get(`/comment/comments/${postId}`);
};

// Create a new comment or reply
// commentData: { userId, postId, content, parentCommentId (optional) }
export const createComment = (commentData) => {
  const token = localStorage.getItem("token");
  return axios.post(`/comment/createComment`, commentData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Delete a comment by ID
export const deleteComment = (commentId) => {
  const token = localStorage.getItem("token");
  return axios.delete(`/comment/delete/${commentId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
