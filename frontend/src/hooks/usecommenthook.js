import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getPostCommentsService,
  createCommentService,
  deleteCommentService,
} from "../services/commentService";

// Fetch comments of a post
export const usePostComments = (postId) =>
  useQuery({
    queryKey: ["post_comments", postId],
    queryFn: () => getPostCommentsService(postId),
    enabled: !!postId,
    onError: (err) => {
      toast.error(err?.message || "Failed to load comments");
    },
  });

// Add a new comment to a post
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentData) => createCommentService(commentData),
    mutationKey: ["create_comment"],
    onSuccess: (_, variables) => {
      toast.success("Comment added!");
      // Invalidate query for comments of the specific post to refresh comment list
      if (variables?.postId) {
        queryClient.invalidateQueries(["post_comments", variables.postId]);
      }
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to add comment");
    },
  });
};

// Delete a comment by ID
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => deleteCommentService(commentId),
    mutationKey: ["delete_comment"],
    onSuccess: (_, commentId) => {
      toast.success("Comment deleted!");
      // Invalidate all post_comments queries to refresh comments (better to be more specific if possible)
      queryClient.invalidateQueries({ queryKey: ["post_comments"] });
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete comment");
    },
  });
};
