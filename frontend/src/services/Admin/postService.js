import {
  createPostApi,
  getAllPostsApi,
  getOnePostApi,
  getUserPostsApi,
  updatePostApi,
  deletePostApi,
} from "../../api/Admin/postapi";

// Create a new post
export const createPostService = async (formData) => {
  try {
    const response = await createPostApi(formData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to create post" };
  }
};

// Get all posts
export const getAllPostsService = async () => {
  try {
    const response = await getAllPostsApi();
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch posts" };
  }
};

// Get a single post by ID
export const getOnePostService = async (postId) => {
  try {
    const response = await getOnePostApi(postId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch post" };
  }
};

// Get posts by user
export const getUserPostsService = async (userId) => {
  try {
    const response = await getUserPostsApi(userId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch user posts" };
  }
};

// Update a post
export const updatePostService = async (postId, formData) => {
  try {
    const response = await updatePostApi(postId, formData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to update post" };
  }
};

// Delete a post
export const deletePostService = async (postId) => {
  try {
    const response = await deletePostApi(postId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to delete post" };
  }
};
