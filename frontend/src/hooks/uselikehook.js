import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  likePostService,
  unlikePostService,
  getPostLikesService,
} from "../services/likeService";


// 🔁 Get likes of a specific post
export const usePostLikes = (postId) =>
  useQuery({
    queryKey: ["post_likes", postId],
    queryFn: () => getPostLikesService(postId),
    enabled: !!postId,
    onError: (err) => {
      toast.error(err?.message || "Failed to load post likes");
    },
  });

// 👍 Like a post
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => likePostService(postId),
    mutationKey: ["like_post"],
    onSuccess: (_, postId) => {
      // toast.success("Post liked!");
      queryClient.invalidateQueries(["post_likes", postId]);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to like post");
    },
  });
};

// 👎 Unlike a post
export const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => unlikePostService(postId),
    mutationKey: ["unlike_post"],
    onSuccess: (_, postId) => {
      // toast.success("Post unliked!");
      queryClient.invalidateQueries(["post_likes", postId]);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to unlike post");
    },
  });
};
