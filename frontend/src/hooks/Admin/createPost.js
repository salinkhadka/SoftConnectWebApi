import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostService } from "../../services/Admin/postService";
import { toast } from "react-toastify";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostService,
    mutationKey: ["create_post"],
    onSuccess: () => {
      toast.success("Post created!");
      // Invalidate and refetch posts
      queryClient.invalidateQueries(["all_posts"]);
    },
    onError: (err) => {
      toast.error(err?.message || "Could not create post");
    },
  });
};
