import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostService } from "../../services/Admin/postService";
import { useToast } from "../../contexts/ToastContext"

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const toast=useToast();

  return useMutation({
    mutationFn: deletePostService,
    mutationKey: ["delete_post"],
    onSuccess: () => {
      toast.success("Post deleted!");
      queryClient.invalidateQueries(["all_posts"]);
    },
    onError: (err) => {
      toast.error(err?.message || "Could not delete post");
    },
  });
};
