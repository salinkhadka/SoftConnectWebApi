import {
  likePost,
  unlikePost,
  getPostLikes,
} from "../api/likeapi";

export const likePostService = async (postId) => {
  try {
    const response = await likePost(postId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to like post" };
  }
};

// Unlike a post
export const unlikePostService = async (postId) => {
  try {
    const userId = JSON.parse(localStorage.getItem("user"))?._id;
    const response = await unlikePost({ userId, postId }); // ✅ send full payload
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to unlike post" };
  }
};


// Get likes of a post — RETURN ONLY the array inside data.data
export const getPostLikesService = async (postId) => {
  try {
    const response = await getPostLikes(postId);
    return response.data.data;  // <-- return only the array here
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to get likes" };
  }
};
