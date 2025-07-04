import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getPostCommentsService,
  createCommentService,
  deleteCommentService,
} from "../services/commentService"; // adjust path if needed

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
    mutationFn: ({ postId, comment }) => createCommentService(postId, comment),
    mutationKey: ["create_comment"],
    onSuccess: (_, variables) => {
      toast.success("Comment added!");
      queryClient.invalidateQueries(["post_comments", variables.postId]);
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
      // If you want, you can invalidate all post comments or find the postId for targeted invalidation
      queryClient.invalidateQueries({ queryKey: ["post_comments"] });
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete comment");
    },
  });
};
