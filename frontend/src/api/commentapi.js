import axios from "../api";

// Get comments for a post
export const getPostComments = (postId) => axios.get(`comment/${postId}`);

// Add a new comment
export const createComment = (postId, comment) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `comment/${postId}`,
    { comment },
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};

// Delete a comment
export const deleteComment = (commentId) => {
  const token = localStorage.getItem("token");
  return axios.delete(`comment/${commentId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
