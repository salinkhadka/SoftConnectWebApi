import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePostService } from "../../services/Admin/postService";
import { toast } from "react-toastify";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, formData }) => updatePostService(postId, formData),
    mutationKey: ["update_post"],
    onSuccess: () => {
      toast.success("Post updated!");
      queryClient.invalidateQueries(["all_posts"]);
    },
    onError: (err) => {
      toast.error(err?.message || "Could not update post");
    },
  });
};
