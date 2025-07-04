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

// Add a new comment
export const createCommentService = async (postId, comment) => {
  try {
    const response = await createComment(postId, comment);
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
