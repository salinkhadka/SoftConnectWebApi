import axios from "../api";

// Create a new post (with file upload support)
export const createPostApi = (data) => {
  const token = localStorage.getItem("token");
  return axios.post("post/createPost", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Get all posts
export const getAllPostsApi = () => axios.get("post");

// Get a single post by postId
export const getOnePostApi = (postId) => axios.get(`post/${postId}`);

// Get posts by a specific user
export const getUserPostsApi = (userId) => axios.get(`post/user/${userId}`);

// Update a post (with file upload support)
export const updatePostApi = (postId, data) => {
  const token = localStorage.getItem("token");
  return axios.put(`post/${postId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Delete a post
export const deletePostApi = (postId) => {
  const token = localStorage.getItem("token");
  return axios.delete(`post/${postId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
