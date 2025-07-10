import {
  getPostComments,
  createComment,
  deleteComment,
} from "../api/commentapi";

// Get comments of a post
export const getPostCommentsService = async (postId) => {
  try {
    const response = await getPostComments(postId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch comments" };
  }
};

// Add a new comment or reply
// Expects a single object: { userId, postId, content, parentCommentId (optional) }
export const createCommentService = async (commentData) => {
  try {
    const response = await createComment(commentData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to add comment" };
  }
};

// Delete a comment
export const deleteCommentService = async (commentId) => {
  try {
    const response = await deleteComment(commentId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to delete comment" };
  }
};
